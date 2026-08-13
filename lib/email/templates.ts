import type { Taal } from "@/lib/i18n/taal";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://skimeister.nl";

/** Afsluitregel onder elke mail, in de taal van de ontvanger. */
const SLOGAN: Record<Taal, string> = {
  nl: "De verbinding tussen skileraren en de skipiste.",
  de: "Die Verbindung zwischen Skilehrern und der Piste.",
};

function layout(
  title: string,
  body: string,
  cta?: { label: string; href: string },
  taal: Taal = "nl",
): string {
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0b1930">
    <div style="background:#1b3a6b;padding:24px 28px;border-radius:16px 16px 0 0">
      <span style="color:#fff;font-size:20px;font-weight:800">Skimeister<span style="color:#ff6b35">.nl</span></span>
    </div>
    <div style="border:1px solid #eef1f6;border-top:0;border-radius:0 0 16px 16px;padding:28px">
      <h1 style="font-size:20px;margin:0 0 12px">${title}</h1>
      <div style="font-size:15px;line-height:1.6;color:#163057">${body}</div>
      ${
        cta
          ? `<div style="margin-top:24px"><a href="${cta.href}" style="display:inline-block;background:#ff6b35;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:600">${cta.label}</a></div>`
          : ""
      }
      <p style="margin-top:28px;font-size:12px;color:#7e8aa0">${SLOGAN[taal]}</p>
    </div>
  </div>`;
}

/** Eén regel in een label/waarde-tabel. */
function row(label: string, value: string): string {
  return (
    `<tr><td style="padding:8px 12px 8px 0;border-bottom:1px solid #eef1f6;color:#7e8aa0;white-space:nowrap;vertical-align:top">${label}</td>` +
    `<td style="padding:8px 0;border-bottom:1px solid #eef1f6"><strong>${value}</strong></td></tr>`
  );
}

export const emailTemplates = {
  welcome: (role: string, taal: Taal = "nl") =>
    taal === "de"
      ? {
          subject: "Willkommen bei Skimeister.nl 🎿",
          html: layout(
            "Willkommen bei Skimeister!",
            `Ihr Konto wurde als <strong>Skischule</strong> angelegt. Schreiben Sie Ihren ersten Auftrag aus und erreichen Sie damit gezielt qualifizierte Skilehrerinnen und Skilehrer. Ausschreiben und Rückmeldungen erhalten ist kostenlos.`,
            { label: "Zum Dashboard", href: `${SITE}/dashboard` },
            "de",
          ),
        }
      : {
          subject: "Welkom bij Skimeister.nl 🎿",
          html: layout(
            "Welkom bij Skimeister!",
            `Je account is aangemaakt als <strong>${role}</strong>. Log in en zet de eerste stappen — ${
              role === "Instructeur"
                ? "maak je profiel compleet om gevonden te worden."
                : "ontdek wat het platform voor je kan doen."
            }`,
            { label: "Naar mijn dashboard", href: `${SITE}/dashboard` },
          ),
        },

  /** Kopie van de volledige aanmelding naar de beheerder. */
  signupCopy: (c: {
    roleLabel: string;
    email: string;
    phone: string;
    naam: string;
    ip?: string;
  }) => ({
    subject: `Aanmelding Skimeister: ${c.roleLabel} — ${c.naam}`,
    html: layout(
      "Kopie van de aanmelding",
      `<table style="width:100%;border-collapse:collapse;font-size:15px">` +
        row("Accounttype", c.roleLabel) +
        row("Naam", c.naam) +
        row("E-mailadres", `<a href="mailto:${c.email}">${c.email}</a>`) +
        row("Telefoonnummer", `<a href="tel:${c.phone}">${c.phone}</a>`) +
        (c.ip ? row("IP-adres", c.ip) : "") +
        `</table>`,
      { label: "Bekijk in admin", href: `${SITE}/admin/gebruikers` },
    ),
  }),

  /** Seintje naar de beheerder bij elke reactie op een opdracht. */
  adminNieuweReactie: (c: {
    opdrachtNaam: string;
    opdrachtId: string;
    instructeur: string;
    bericht: string | null;
  }) => ({
    subject: `Nieuwe reactie: ${c.instructeur} op "${c.opdrachtNaam}"`,
    html: layout(
      "Nieuwe reactie op een opdracht",
      `<table style="width:100%;border-collapse:collapse;font-size:15px">` +
        row("Opdracht", c.opdrachtNaam) +
        row("Instructeur", c.instructeur) +
        `</table>` +
        (c.bericht
          ? `<blockquote style="margin:16px 0 0;padding-left:14px;border-left:2px solid #dfe5ee;color:#163057;font-style:italic">${c.bericht}</blockquote>`
          : ""),
      { label: "Bekijk de reactie", href: `${SITE}/admin/opdrachten/${c.opdrachtId}` },
    ),
  }),

  newApplication: (projectName: string, taal: Taal = "nl") =>
    taal === "de"
      ? {
          subject: `Neue Rückmeldung auf "${projectName}"`,
          html: layout(
            "Sie haben eine neue Rückmeldung",
            `Eine Skilehrerin oder ein Skilehrer hat sich auf Ihren Auftrag <strong>${projectName}</strong> gemeldet. Qualifikation, Erfahrung und geprüfte Nachweise sehen Sie in Ihrem Dashboard.`,
            { label: "Rückmeldungen ansehen", href: `${SITE}/projecten` },
            "de",
          ),
        }
      : {
          subject: `Nieuwe aanmelding voor "${projectName}"`,
          html: layout(
            "Je hebt een nieuwe aanmelding",
            `Een instructeur heeft zich aangemeld voor je project <strong>${projectName}</strong>. Bekijk de aanmelding en motivatie in je dashboard.`,
            { label: "Bekijk aanmeldingen", href: `${SITE}/projecten` },
          ),
        },

  selected: (projectName: string) => ({
    subject: `Je bent geselecteerd voor "${projectName}" 🎉`,
    html: layout(
      "Goed nieuws!",
      `Je bent geselecteerd voor het project <strong>${projectName}</strong>. Neem contact op via je berichten om de details te regelen.`,
      { label: "Naar mijn aanmeldingen", href: `${SITE}/mijn-aanmeldingen` },
    ),
  }),

  rejected: (projectName: string) => ({
    subject: `Update over je aanmelding voor "${projectName}"`,
    html: layout(
      "Helaas geen match deze keer",
      `Je bent niet geselecteerd voor <strong>${projectName}</strong>. Houd moed — er staan vast andere projecten open die bij je passen.`,
      { label: "Bekijk open projecten", href: `${SITE}/projecten` },
    ),
  }),

  newMessage: (fromName: string, taal: Taal = "nl") =>
    taal === "de"
      ? {
          subject: `Neue Nachricht von ${fromName}`,
          html: layout(
            "Sie haben eine neue Nachricht",
            `<strong>${fromName}</strong> hat Ihnen über Skimeister geschrieben. Antworten Sie direkt in Ihrem Postfach.`,
            { label: "Nachrichten öffnen", href: `${SITE}/berichten` },
            "de",
          ),
        }
      : {
          subject: `Nieuw bericht van ${fromName}`,
          html: layout(
            "Je hebt een nieuw bericht",
            `<strong>${fromName}</strong> heeft je een bericht gestuurd op Skimeister. Reageer via je inbox.`,
            { label: "Open berichten", href: `${SITE}/berichten` },
          ),
        },

  paymentConfirmed: (description: string, taal: Taal = "nl") =>
    taal === "de"
      ? {
          subject: "Zahlung erhalten — vielen Dank!",
          html: layout(
            "Ihre Zahlung ist eingegangen",
            `Wir haben Ihre Zahlung für <strong>${description}</strong> erhalten. Die Rechnung erhalten Sie per E-Mail.`,
            { label: "Zum Dashboard", href: `${SITE}/dashboard` },
            "de",
          ),
        }
      : {
          subject: "Betaling ontvangen — bedankt!",
          html: layout(
            "Je betaling is ontvangen",
            `We hebben je betaling voor <strong>${description}</strong> ontvangen. De factuur wordt je per e-mail toegestuurd.`,
            { label: "Naar dashboard", href: `${SITE}/dashboard` },
          ),
        },

  profileApproved: () => ({
    subject: "Je profiel is goedgekeurd ✅",
    html: layout(
      "Je profiel staat live",
      `Goed nieuws! Je instructeurprofiel is goedgekeurd en is nu zichtbaar voor skischolen, reisorganisaties en scholen.`,
      { label: "Bekijk mijn profiel", href: `${SITE}/profiel/bewerken` },
    ),
  }),

  newRelevantProject: (projectName: string, resortName: string) => ({
    subject: `Nieuw project in ${resortName}`,
    html: layout(
      "Er is een nieuw project in jouw gebied",
      `Er staat een nieuw project open: <strong>${projectName}</strong> in <strong>${resortName}</strong> — een van jouw voorkeursgebieden. Bekijk het en meld je aan.`,
      { label: "Bekijk het project", href: `${SITE}/projecten` },
    ),
  }),

  documentExpiring: (docLabel: string, days: number) => ({
    subject:
      days <= 7
        ? `Urgent: je ${docLabel} verloopt over ${days} dagen`
        : `Je ${docLabel} verloopt over ${days} dagen`,
    html: layout(
      "Document verloopt binnenkort",
      `Je <strong>${docLabel}</strong> verloopt over ${days} dagen. Upload op tijd een nieuw bewijs zodat je verified-badge zichtbaar blijft voor skischolen.`,
      { label: "Document bijwerken", href: `${SITE}/documenten` },
    ),
  }),

  documentExpired: (docLabel: string) => ({
    subject: `Je ${docLabel} is verlopen`,
    html: layout(
      "Document verlopen",
      `Je <strong>${docLabel}</strong> is verlopen en de verified-badge is van je profiel verwijderd. Upload een nieuw bewijs om hem te herstellen.`,
      { label: "Nieuw document uploaden", href: `${SITE}/documenten` },
    ),
  }),
};
