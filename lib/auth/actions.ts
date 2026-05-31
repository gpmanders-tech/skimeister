"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { REGISTERABLE_ROLES, ROLE_LABELS, type Role } from "@/lib/constants/options";
import { notifyWelcome } from "@/lib/email/notify";

export interface AuthState {
  error?: string;
  message?: string;
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
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

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role },
      emailRedirectTo: `${siteUrl()}/dashboard`,
    },
  });

  if (error) {
    return { error: vertaalAuthFout(error.message) };
  }

  await notifyWelcome(email, ROLE_LABELS[role]);

  return {
    message:
      "Account aangemaakt! Check je e-mail om je adres te bevestigen, en log daarna in.",
  };
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
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Er bestaat al een account met dit e-mailadres.";
  if (m.includes("email not confirmed"))
    return "Bevestig eerst je e-mailadres via de link in je mailbox.";
  return message;
}
