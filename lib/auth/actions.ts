"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { REGISTERABLE_ROLES, ROLE_LABELS, type Role } from "@/lib/constants/options";
import { notifyWelcome, notifyAdminSignupCopy } from "@/lib/email/notify";
import { computeCompleteness } from "@/lib/profile/completeness";
import { getCertById } from "@/lib/constants/certifications";
import { checkFormGuards } from "@/lib/security/formGuard";
import { checkEmailShape, checkEmailDomainExists } from "@/lib/security/emailCheck";
import { clientIp, rateLimit } from "@/lib/security/rateLimit";

export interface AuthState {
  error?: string;
  message?: string;
}

/** Registraties per IP: max 5 per uur en 15 per dag. */
const SIGNUP_PER_HOUR = 5;
const SIGNUP_PER_DAY = 15;

function logGeblokkeerd(reason: string, email: string, ip: string): void {
  // Zichtbaar in de Vercel-logs; zo zie je of de filters werk verzetten.
  console.warn(`[registratie geblokkeerd] ${reason} | ${email || "(leeg)"} | ip ${ip}`);
}

/**
 * Normaliseert een NL/BE-telefoonnummer naar alleen cijfers en een eventuele +.
 * Geeft null bij een onbruikbaar nummer.
 */
function normaliseerTelefoon(raw: string): string | null {
  const compact = raw.replace(/[\s.\-()/]/g, "");
  if (!/^(\+|00)?\d{9,15}$/.test(compact)) return null;
  return compact;
}

/** Registratie: maakt een Supabase-account aan met de gekozen rol in de metadata. */
export async function signUpAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "") as Role;
  const phoneRaw = String(formData.get("phone") ?? "").trim();
  const ip = await clientIp();

  // Waar de bezoeker na aanmelden heen gaat. Standaard het opdrachtenboard;
  // kwam iemand via een specifieke opdracht binnen, dan terug naar die opdracht.
  const gevraagd = String(formData.get("next") ?? "");
  const bestemming = gevraagd.startsWith("/") ? gevraagd : "/opdrachten";

  // ── Bot-afweer: honeypot + ondertekend tijdstempel ───────────────────────
  const guard = checkFormGuards(formData);
  if (!guard.ok) {
    logGeblokkeerd(guard.reason, email, ip);
    return { error: guard.message };
  }

  // ── Rate limit per IP ────────────────────────────────────────────────────
  // Bij een onbekend IP (ontbrekende proxy-header) ruimer, zodat echte
  // bezoekers nooit collectief buitengesloten worden.
  const factor = ip === "onbekend" ? 10 : 1;
  const perHour = rateLimit(`signup:h:${ip}`, SIGNUP_PER_HOUR * factor, 60 * 60 * 1000);
  const perDay = rateLimit(`signup:d:${ip}`, SIGNUP_PER_DAY * factor, 24 * 60 * 60 * 1000);
  if (!perHour.ok || !perDay.ok) {
    const wacht = !perHour.ok ? perHour.retryAfterMinutes : perDay.retryAfterMinutes;
    logGeblokkeerd("rate-limit", email, ip);
    return {
      error: `Er zijn te veel accounts aangemaakt vanaf deze verbinding. Probeer het over ${wacht} minuten opnieuw.`,
    };
  }

  if (!email || !password) {
    return { error: "Vul je e-mailadres en wachtwoord in." };
  }
  if (password.length < 8) {
    return { error: "Kies een wachtwoord van minimaal 8 tekens." };
  }
  if (!REGISTERABLE_ROLES.includes(role as Exclude<Role, "admin">)) {
    return { error: "Kies een geldig accounttype." };
  }

  // ── Telefoonnummer ───────────────────────────────────────────────────────
  const phone = normaliseerTelefoon(phoneRaw);
  if (!phone) {
    return { error: "Vul een geldig telefoonnummer in, bijvoorbeeld 06 12345678." };
  }

  // ── Stap 1 voor instructeurs en aspiranten ───────────────────────────────
  // Bewust minimaal: dit moet op een telefoon binnen drie minuten te doen zijn.
  // Foto, gebieden, beschikbaarheid en documenten volgen in stap 2.
  const isInstructeur = role === "instructor" || role === "aspirant";
  const voornaam = String(formData.get("first_name") ?? "").trim();
  const achternaam = String(formData.get("last_name") ?? "").trim();
  const certificering = String(formData.get("certification") ?? "").trim();
  const ervaring = Number(formData.get("years_experience") ?? "");
  const talen = formData.getAll("languages").map(String).filter(Boolean);

  if (isInstructeur) {
    if (voornaam.length < 2 || achternaam.length < 2) {
      return { error: "Vul je voor- en achternaam in." };
    }
    if (!getCertById(certificering)) {
      return { error: "Kies je certificeringsniveau." };
    }
    if (!Number.isFinite(ervaring) || ervaring < 0 || ervaring > 60) {
      return { error: "Vul in hoeveel jaar ervaring je hebt." };
    }
    if (talen.length === 0) {
      return { error: "Kies minimaal één taal waarin je lesgeeft." };
    }
  }

  // ── E-mailadres: vorm, wegwerpdiensten, bestaat het domein ───────────────
  const shape = checkEmailShape(email);
  if (!shape.ok) {
    logGeblokkeerd(shape.reason!, email, ip);
    return { error: shape.message };
  }

  const domain = await checkEmailDomainExists(email);
  if (!domain.ok) {
    logGeblokkeerd(domain.reason!, email, ip);
    return { error: domain.message };
  }

  // Let op: redirect() gooit een speciale fout die NIET in een try/catch mag
  // belanden. Daarom staat het aanmaken in een blok en de redirect erbuiten.
  try {
    // We maken de gebruiker direct bevestigd aan via de service-role (admin),
    // zodat Supabase GEEN bevestigingsmail stuurt (omzeilt de mail-limiet).
    // Zodra Resend/SMTP is gekoppeld, kan dit terug naar e-mailverificatie.
    const service = createServiceClient();
    const { data, error } = await service.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role, phone, voornaam, achternaam },
    });

    if (error) {
      return { error: vertaalAuthFout(error.message) };
    }

    const userId = data?.user?.id;

    // ── Stap 1 meteen in het profiel zetten ────────────────────────────────
    if (userId && isInstructeur) {
      const basis = {
        user_id: userId,
        first_name: voornaam,
        last_name: achternaam,
        phone,
      };

      if (role === "instructor") {
        const certificaten = [{ cert_id: certificering }];
        const { score } = computeCompleteness({
          first_name: voornaam,
          last_name: achternaam,
          years_experience: ervaring,
          languages: talen,
          certifications: certificaten,
        });

        const { error: profielFout } = await service.from("instructor_profiles").insert({
          ...basis,
          years_experience: ervaring,
          languages: talen,
          certifications: certificaten,
          profile_completeness: score,
          // Zichtbaar in de zoekresultaten pas na foto, bio en goedkeuring.
          is_active: false,
        });
        if (profielFout) {
          console.error("Profiel aanmaken bij registratie mislukt:", profielFout.message);
        }
      } else {
        const { error: aspirantFout } = await service.from("aspirants").insert(basis);
        if (aspirantFout) {
          console.error("Aspirant aanmaken bij registratie mislukt:", aspirantFout.message);
        }
      }
    }

    // E-mails mogen de registratie nooit laten crashen.
    try {
      await notifyWelcome(email, ROLE_LABELS[role]);
      await notifyAdminSignupCopy({
        roleLabel: ROLE_LABELS[role],
        email,
        phone,
        naam: [voornaam, achternaam].filter(Boolean).join(" ") || "Niet opgegeven",
        ip,
      });
    } catch (e) {
      console.error("Registratie-mail mislukt (genegeerd):", e);
    }

    // Direct inloggen, zodat niemand opnieuw hoeft in te typen.
    const supabase = await createClient();
    const { error: loginFout } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (loginFout) {
      // Account bestaat wel; laat de bezoeker gewoon zelf inloggen.
      return { message: "Je account is aangemaakt. Log in om verder te gaan." };
    }
  } catch (e) {
    console.error("Registratie-fout:", e);
    return {
      error:
        "Er ging iets mis bij het aanmaken van je account. Probeer het opnieuw of neem contact op.",
    };
  }

  revalidatePath("/", "layout");
  // Meteen naar het werk, niet naar een leeg dashboard.
  redirect(bestemming);
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
