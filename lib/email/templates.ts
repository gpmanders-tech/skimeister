const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://skimeister.nl";

function layout(title: string, body: string, cta?: { label: string; href: string }): string {
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
      <p style="margin-top:28px;font-size:12px;color:#7e8aa0">De verbinding tussen skileraren en de skipiste.</p>
    </div>
  </div>`;
}

export const emailTemplates = {
  welcome: (role: string) => ({
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
  }),

  newSignup: (roleLabel: string, email: string) => ({
    subject: `Nieuwe aanmelding: ${roleLabel}`,
    html: layout(
      "Nieuwe aanmelding op Skimeister",
      `Er heeft zich zojuist iemand geregistreerd:<br><br><strong>${roleLabel}</strong> — ${email}`,
      { label: "Bekijk in admin", href: `${SITE}/admin/gebruikers` },
    ),
  }),

  newApplication: (projectName: string) => ({
    subject: `Nieuwe aanmelding voor "${projectName}"`,
    html: layout(
      "Je hebt een nieuwe aanmelding",
      `Een instructeur heeft zich aangemeld voor je project <strong>${projectName}</strong>. Bekijk de aanmelding en motivatie in je dashboard.`,
      { label: "Bekijk aanmeldingen", href: `${SITE}/projecten` },
    ),
  }),

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

  newMessage: (fromName: string) => ({
    subject: `Nieuw bericht van ${fromName}`,
    html: layout(
      "Je hebt een nieuw bericht",
      `<strong>${fromName}</strong> heeft je een bericht gestuurd op Skimeister. Reageer via je inbox.`,
      { label: "Open berichten", href: `${SITE}/berichten` },
    ),
  }),

  paymentConfirmed: (description: string) => ({
    subject: "Betaling ontvangen — bedankt!",
    html: layout(
      "Je betaling is ontvangen",
      `We hebben je betaling voor <strong>${description}</strong> ontvangen. De factuur wordt je per e-mail toegestuurd.`,
      { label: "Naar dashboard", href: `${SITE}/dashboard` },
    ),
  }),

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
