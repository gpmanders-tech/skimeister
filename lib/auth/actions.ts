"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { REGISTERABLE_ROLES, ROLE_LABELS, type Role } from "@/lib/constants/options";
import { notifyWelcome } from "@/lib/email/notify";

export interface AuthState {
  error?: string;
  message?: string;
}

/** Registratie: maakt een Supabase-account aan met de gekozen rol in de metadata. */
export async function signUpAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "") as Role;

  if (!email || !password) {
    return { error: "Vul je e-mailadres en wachtwoord in." };
  }
  if (password.length < 8) {
    return { error: "Kies een wachtwoord van minimaal 8 tekens." };
  }
  if (!REGISTERABLE_ROLES.includes(role as Exclude<Role, "admin">)) {
    return { error: "Kies een geldig accounttype." };
  }

  try {
    // We maken de gebruiker direct bevestigd aan via de service-role (admin),
    // zodat Supabase GEEN bevestigingsmail stuurt (omzeilt de mail-limiet).
    // Zodra Resend/SMTP is gekoppeld, kan dit terug naar e-mailverificatie.
    const service = createServiceClient();
    const { error } = await service.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role },
    });

    if (error) {
      return { error: vertaalAuthFout(error.message) };
    }

    // De welkomstmail mag de registratie nooit laten crashen.
    try {
      await notifyWelcome(email, ROLE_LABELS[role]);
    } catch (e) {
      console.error("Welkomstmail mislukt (genegeerd):", e);
    }

    return {
      message:
        "Account aangemaakt! Je kunt nu inloggen.",
    };
  } catch (e) {
    console.error("Registratie-fout:", e);
    return {
      error:
        "Er ging iets mis bij het aanmaken van je account. Probeer het opnieuw of neem contact op.",
    };
  }
}

/** Inloggen met e-mail + wachtwoord. */
export async function signInAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "/dashboard");

  if (!email || !password) {
    return { error: "Vul je e-mailadres en wachtwoord in." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: vertaalAuthFout(error.message) };
  }

  revalidatePath("/", "layout");
  redirect(redirectTo.startsWith("/") ? redirectTo : "/dashboard");
}

/** Uitloggen. */
export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

function vertaalAuthFout(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "Onjuist e-mailadres of wachtwoord.";
  if (
    m.includes("already registered") ||
    m.includes("already been registered") ||
    m.includes("already exists") ||
    m.includes("email_exists")
  )
    return "Er bestaat al een account met dit e-mailadres.";
  if (m.includes("email not confirmed"))
    return "Bevestig eerst je e-mailadres via de link in je mailbox.";
  return message;
}
