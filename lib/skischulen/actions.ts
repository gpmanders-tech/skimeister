"use server";

import { redirect } from "next/navigation";
import { sendEmail } from "@/lib/email/client";
import { adminCc } from "@/lib/email/notify";

/**
 * Antwoorden van skischolen op de kennismakingsmail (keuze Ger 6-10-2026).
 * De mail heeft een groene knop (ja, interessant) en een rode (nee). Elk antwoord
 * wordt een mail aan info@skimeister.nl met de code van de school in het onderwerp;
 * agents/sales/skimeister/skischulen_mail.py zet daarmee de status in de prospectlijst.
 * Er wordt niets in de database bewaard.
 */

const BEHEER = (process.env.ADMIN_EMAIL || "info@skimeister.nl").trim();

function veld(fd: FormData, naam: string, max = 300): string {
  return String(fd.get(naam) ?? "").trim().slice(0, max);
}

function code(fd: FormData): string {
  return veld(fd, "s", 16).replace(/[^a-zA-Z0-9]/g, "");
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function tabel(rijen: [string, string][]): string {
  return (
    '<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">' +
    rijen
      .map(([k, v]) => `<tr><td style="color:#555;vertical-align:top">${esc(k)}</td><td>${esc(v || "-").replace(/\n/g, "<br>")}</td></tr>`)
      .join("") +
    "</table>"
  );
}

export async function skischuleJaAction(fd: FormData): Promise<void> {
  if (veld(fd, "website")) redirect("/fuer-skischulen/antwort?t=danke"); // honeypot
  const s = code(fd);
  const schule = veld(fd, "schule", 120);
  const email = veld(fd, "email", 120);
  if (!schule || !email.includes("@")) redirect(`/fuer-skischulen/antwort?a=ja&s=${s}&fehler=1`);
  await sendEmail({
    to: BEHEER,
    cc: adminCc(),
    replyTo: email,
    subject: `[Skischule JA] ${schule} (${s || "ohne Code"})`,
    html:
      "<p>Een skischool heeft interesse en geeft een opdracht door.</p>" +
      tabel([
        ["Skischool", schule],
        ["Contactpersoon", veld(fd, "name", 120)],
        ["E-mail", email],
        ["Telefoon", veld(fd, "telefon", 60)],
        ["Periode", veld(fd, "zeitraum", 200)],
        ["Aantal skileraren", veld(fd, "anzahl", 20)],
        ["Discipline", veld(fd, "disziplin", 60)],
        ["Eisen / opmerkingen", veld(fd, "bemerkung", 2000)],
        ["Code", s],
      ]),
  });
  redirect("/fuer-skischulen/antwort?t=danke");
}

export async function skischuleSpaeterAction(fd: FormData): Promise<void> {
  const s = code(fd);
  await sendEmail({
    to: BEHEER,
    cc: adminCc(),
    subject: `[Skischule SPAETER] ${veld(fd, "schule", 120) || "onbekend"} (${s || "ohne Code"})`,
    html: "<p>Deze skischool heeft nu geen interesse, maar mag later (volgend seizoen) opnieuw benaderd worden.</p>",
  });
  redirect("/fuer-skischulen/antwort?t=spaeter");
}

export async function skischuleAbmeldenAction(fd: FormData): Promise<void> {
  const s = code(fd);
  await sendEmail({
    to: BEHEER,
    cc: adminCc(),
    subject: `[Skischule ABMELDEN] ${veld(fd, "schule", 120) || "onbekend"} (${s || "ohne Code"})`,
    html: "<p>Deze skischool wil niet meer benaderd worden. Niet meer mailen.</p>",
  });
  redirect("/fuer-skischulen/antwort?t=abgemeldet");
}
