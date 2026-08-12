import { resolveMx } from "node:dns/promises";

/**
 * Controle op het e-mailadres bij registratie:
 *  1. vorm van het adres
 *  2. bekende wegwerp-/tijdelijke maildiensten
 *  3. bestaat het domein überhaupt (MX-record)
 *
 * De MX-check faalt bewust "open": bij een DNS-storing of trage resolver laten
 * we de registratie door. Liever een enkele bot erdoor dan echte klanten buiten.
 */

/** Bekende wegwerp-maildiensten. Aanvullen mag, dit dekt het gros. */
const DISPOSABLE_DOMAINS = new Set([
  "0-mail.com",
  "10minutemail.com",
  "20minutemail.com",
  "33mail.com",
  "anonbox.net",
  "byom.de",
  "dispostable.com",
  "dropmail.me",
  "emailondeck.com",
  "emailtemporanea.com",
  "fakeinbox.com",
  "fakemail.net",
  "getairmail.com",
  "getnada.com",
  "guerrillamail.biz",
  "guerrillamail.com",
  "guerrillamail.de",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamailblock.com",
  "harakirimail.com",
  "inboxbear.com",
  "inboxkitten.com",
  "jetable.org",
  "mail-temporaire.fr",
  "mail7.io",
  "mailcatch.com",
  "maildrop.cc",
  "mailinator.com",
  "mailnesia.com",
  "mailsac.com",
  "mailtemp.info",
  "mintemail.com",
  "moakt.com",
  "mohmal.com",
  "mytemp.email",
  "nowmymail.com",
  "onetimemail.org",
  "pokemail.net",
  "sharklasers.com",
  "spam4.me",
  "spambog.com",
  "spamgourmet.com",
  "temp-mail.io",
  "temp-mail.org",
  "tempail.com",
  "tempinbox.com",
  "tempm.com",
  "tempmail.com",
  "tempmail.net",
  "tempmailo.com",
  "tempr.email",
  "throwawaymail.com",
  "tmail.ws",
  "tmpmail.net",
  "trashmail.com",
  "trashmail.de",
  "trashmail.me",
  "wegwerpmail.net",
  "wegwerpmailadres.nl",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
]);

const EMAIL_SHAPE = /^[^\s@,;:<>()[\]\\"]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i;

export interface EmailVerdict {
  ok: boolean;
  reason?: string;
  message?: string;
}

function domainOf(email: string): string {
  return email.slice(email.lastIndexOf("@") + 1).toLowerCase();
}

/** Snelle controles zonder netwerk. */
export function checkEmailShape(email: string): EmailVerdict {
  if (!EMAIL_SHAPE.test(email)) {
    return {
      ok: false,
      reason: "vorm",
      message: "Vul een geldig e-mailadres in.",
    };
  }

  const domain = domainOf(email);

  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      ok: false,
      reason: "wegwerpmail",
      message:
        "Gebruik een normaal e-mailadres. Tijdelijke wegwerpadressen worden niet geaccepteerd.",
    };
  }

  return { ok: true };
}

/** Bestaat het maildomein echt? Faalt open bij DNS-problemen. */
export async function checkEmailDomainExists(email: string): Promise<EmailVerdict> {
  const domain = domainOf(email);
  try {
    const records = await Promise.race([
      resolveMx(domain),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 2_500)),
    ]);

    // null = timeout: niet blokkeren.
    if (records === null) return { ok: true };

    if (records.length === 0) {
      return {
        ok: false,
        reason: "geen-mx",
        message: "Dit e-maildomein kan geen e-mail ontvangen. Controleer je adres.",
      };
    }
    return { ok: true };
  } catch (e) {
    const code = (e as { code?: string }).code;
    // Domein bestaat niet / heeft geen mailrecords: blokkeren.
    if (code === "ENOTFOUND" || code === "ENODATA" || code === "NXDOMAIN") {
      return {
        ok: false,
        reason: "domein-bestaat-niet",
        message: "Dit e-maildomein bestaat niet. Controleer je adres.",
      };
    }
    // Alle overige DNS-fouten: doorlaten.
    return { ok: true };
  }
}
