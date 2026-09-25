import nodemailer, { type Transporter } from "nodemailer";

/**
 * Alle mail van de site gaat via de eigen mailbox info@skimeister.nl bij
 * Hostnet (keuze Ger 25-9-2026, in plaats van Resend): smtp.hostnet.nl,
 * poort 587, STARTTLS. De SPF van skimeister.nl staat alleen Hostnet toe en
 * DMARC staat op reject, dus via een andere dienst versturen komt niet aan.
 *
 * Omgeving: SMTP_PASS (verplicht), SMTP_USER (standaard info@skimeister.nl),
 * SMTP_HOST, SMTP_PORT, MAIL_FROM.
 */
let cached: Transporter | null = null;

function transport(): Transporter | null {
  const pass = process.env.SMTP_PASS;
  if (!pass) return null;
  if (!cached) {
    cached = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? "smtp.hostnet.nl",
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false,
      requireTLS: true,
      auth: { user: process.env.SMTP_USER ?? "info@skimeister.nl", pass },
    });
  }
  return cached;
}

const FROM = process.env.MAIL_FROM ?? "Skimeister <info@skimeister.nl>";

/**
 * Verstuurt een e-mail. Doet niets (zonder fout) als SMTP niet is ingesteld,
 * zodat de app ook lokaal zonder wachtwoord werkt. Gooit nooit naar de caller:
 * een mail die mislukt mag een aanmelding of reactie niet laten mislukken.
 */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<void> {
  const t = transport();
  if (!t || !opts.to) {
    if (!t) console.warn("E-mail niet verstuurd: SMTP_PASS ontbreekt", opts.subject);
    return;
  }
  try {
    await t.sendMail({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo,
    });
  } catch (e) {
    console.error("E-mail versturen mislukt:", opts.subject, e);
  }
}
