import { createHmac, timingSafeEqual } from "node:crypto";
import { HONEYPOT_FIELD, TOKEN_FIELD } from "@/lib/security/formFields";

/**
 * Bot-afweer voor publieke formulieren, zonder externe dienst.
 *
 * Twee signalen:
 *  1. Honeypot: een verborgen veld dat een mens nooit ziet. Bots vullen alles in.
 *  2. Ondertekend tijdstempel: de server geeft bij het renderen een getekend
 *     token mee. Bij verzenden weten we hoe lang het formulier openstond.
 *     Bots posten binnen milliseconden, of hergebruiken een oud/verzonnen token.
 */

/** Sneller dan dit invullen is geen mens. */
const MIN_FILL_MS = 2_000;

/** Ouder dan dit: pagina te lang open blijven staan, opnieuw laden. */
const MAX_AGE_MS = 3 * 60 * 60 * 1000;

function secret(): string {
  return (
    process.env.FORM_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.CRON_SECRET ||
    "skimeister-form-guard"
  );
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

/** Server-side aan te roepen bij het renderen van het formulier. */
export function issueFormToken(): string {
  const issued = String(Date.now());
  return `${issued}.${sign(issued)}`;
}

export type GuardVerdict =
  | { ok: true }
  | { ok: false; bot: boolean; reason: string; message: string };

/**
 * Controleert honeypot + tijdstempel. `bot: true` betekent: vrijwel zeker
 * geautomatiseerd, geef de bezoeker geen bruikbare feedback.
 */
export function checkFormGuards(formData: FormData): GuardVerdict {
  // 1. Honeypot ingevuld = bot.
  if (String(formData.get(HONEYPOT_FIELD) ?? "").trim() !== "") {
    return {
      ok: false,
      bot: true,
      reason: "honeypot",
      message: "Er ging iets mis. Probeer het opnieuw.",
    };
  }

  // 2. Tijdstempel moet aanwezig, geldig ondertekend en van deze server zijn.
  const raw = String(formData.get(TOKEN_FIELD) ?? "");
  const [issued, signature] = raw.split(".");
  if (!issued || !signature || !/^\d+$/.test(issued)) {
    return {
      ok: false,
      bot: true,
      reason: "token-ontbreekt",
      message: "Er ging iets mis. Probeer het opnieuw.",
    };
  }

  const expected = Buffer.from(sign(issued), "hex");
  const given = Buffer.from(signature, "hex");
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return {
      ok: false,
      bot: true,
      reason: "token-ongeldig",
      message: "Er ging iets mis. Probeer het opnieuw.",
    };
  }

  const age = Date.now() - Number(issued);

  if (age < MIN_FILL_MS) {
    // Kan in theorie een supersnelle autofill zijn: vriendelijke tekst,
    // opnieuw verzenden lukt vanzelf omdat de tijd dan verstreken is.
    return {
      ok: false,
      bot: true,
      reason: "te-snel",
      message: "Dat ging wel erg snel. Klik nog een keer op verzenden.",
    };
  }

  if (age > MAX_AGE_MS) {
    return {
      ok: false,
      bot: false,
      reason: "verlopen",
      message: "Deze pagina stond te lang open. Ververs de pagina en probeer opnieuw.",
    };
  }

  return { ok: true };
}
