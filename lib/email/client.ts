import { Resend } from "resend";

let cached: Resend | null = null;

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!cached) cached = new Resend(key);
  return cached;
}

const FROM = process.env.RESEND_FROM_EMAIL ?? "Skimeister <no-reply@skimeister.nl>";

/**
 * Verstuurt een e-mail. No-op (zonder fout) als Resend niet is geconfigureerd,
 * zodat de app ook zonder e-mailkey werkt. Gooit nooit naar de caller.
 */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const resend = getResend();
  if (!resend || !opts.to) return;
  try {
    await resend.emails.send({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
  } catch (e) {
    console.error("E-mail versturen mislukt:", e);
  }
}
