import type { Taal } from "@/lib/i18n/taal";

/**
 * Schermteksten in het Nederlands en Duits.
 *
 * Alleen de schermen die een skischool te zien krijgt zijn tweetalig; de rest
 * van het platform is Nederlands. Zie lib/i18n/taal.ts voor hoe de taal wordt
 * gekozen. Gebruik in een server component:
 *
 *     const t = teksten(taalVoorRol(user.role));
 */
export interface Teksten {
  algemeen: {
    openen: string;
    snelNaar: string;
    opslaan: string;
    annuleren: string;
    verwijderen: string;
    bezig: string;
    geenToegang: string;
  };
  dashboard: {
    welkom: string;
    intro: string;
  };
  zoeken: {
    titel: string;
    subtitel: string;
    alleenOrganisaties: string;
    gevonden: (n: number) => string;
    geenResultaten: string;
  };
  contracten: {
    titel: string;
    subtitel: string;
    alleenOrganisaties: string;
  };
  instellingen: {
    titel: string;
    subtitel: string;
    email: string;
    accounttype: string;
    rolLabel: string;
  };
  kosten: {
    titel: string;
    subtitel: string;
    perPlaatsing: string;
    lancering: string;
    punten: string[];
    vragen: string;
    contactOp: string;
  };
}

const NL: Teksten = {
  algemeen: {
    openen: "Openen →",
    snelNaar: "Snel naar",
    opslaan: "Opslaan",
    annuleren: "Annuleren",
    verwijderen: "Verwijderen",
    bezig: "Bezig…",
    geenToegang: "Geen toegang.",
  },
  dashboard: {
    welkom: "Welkom",
    intro: "Zoek gecertificeerde instructeurs en bouw je seizoensteam op.",
  },
  zoeken: {
    titel: "Instructeurs zoeken",
    subtitel: "Filter op gebied, certificering, taal en meer.",
    alleenOrganisaties:
      "Zoeken is beschikbaar voor skischolen, reisorganisaties en scholen.",
    gevonden: (n) => `${n} instructeur${n === 1 ? "" : "s"} gevonden`,
    geenResultaten: "Geen instructeurs gevonden met deze filters.",
  },
  contracten: {
    titel: "Contracten",
    subtitel:
      "Genereer een standaardcontract met de skileraar en download het als PDF.",
    alleenOrganisaties: "Alleen voor organisaties.",
  },
  instellingen: {
    titel: "Instellingen",
    subtitel: "Je accountgegevens.",
    email: "E-mailadres",
    accounttype: "Accounttype",
    rolLabel: "Skischool",
  },
  kosten: {
    titel: "Kosten",
    subtitel: "Geen abonnement. Je betaalt pas als er iemand geplaatst is.",
    perPlaatsing: "per geplaatste instructeur",
    lancering: "Lanceringsactie",
    punten: [
      "Opdrachten plaatsen is gratis",
      "Reacties bekijken en gesprekken voeren is gratis",
      "Je betaalt pas bij een bevestigde plaatsing",
      "Geen abonnement, geen opzegtermijn",
      "Je ontvangt achteraf een factuur",
    ],
    vragen: "Vragen over een factuur of een plaatsing?",
    contactOp: "Neem contact op",
  },
};

const DE: Teksten = {
  algemeen: {
    openen: "Öffnen →",
    snelNaar: "Schnellzugriff",
    opslaan: "Speichern",
    annuleren: "Abbrechen",
    verwijderen: "Löschen",
    bezig: "Bitte warten…",
    geenToegang: "Kein Zugriff.",
  },
  dashboard: {
    welkom: "Willkommen",
    intro:
      "Suchen Sie geprüfte Skilehrerinnen und Skilehrer und stellen Sie Ihr Saisonteam zusammen.",
  },
  zoeken: {
    titel: "Skilehrer suchen",
    subtitel: "Filtern Sie nach Skigebiet, Qualifikation, Sprache und mehr.",
    alleenOrganisaties:
      "Die Suche steht Skischulen, Reiseveranstaltern und Schulen zur Verfügung.",
    gevonden: (n) => `${n} Skilehrer${n === 1 ? "" : ""} gefunden`,
    geenResultaten: "Mit diesen Filtern wurde niemand gefunden.",
  },
  contracten: {
    titel: "Verträge",
    subtitel:
      "Erstellen Sie einen Standardvertrag mit der Skilehrerin oder dem Skilehrer und laden Sie ihn als PDF herunter.",
    alleenOrganisaties: "Nur für Organisationen.",
  },
  instellingen: {
    titel: "Einstellungen",
    subtitel: "Ihre Kontodaten.",
    email: "E-Mail-Adresse",
    accounttype: "Kontotyp",
    rolLabel: "Skischule",
  },
  kosten: {
    titel: "Kosten",
    subtitel: "Kein Abonnement. Sie zahlen erst bei einer Vermittlung.",
    perPlaatsing: "je vermitteltem Skilehrer",
    lancering: "Einführungsaktion",
    punten: [
      "Aufträge ausschreiben ist kostenlos",
      "Rückmeldungen ansehen und Gespräche führen ist kostenlos",
      "Sie zahlen erst bei einer bestätigten Vermittlung",
      "Kein Abonnement, keine Kündigungsfrist",
      "Sie erhalten im Nachhinein eine Rechnung",
    ],
    vragen: "Fragen zu einer Rechnung oder einer Vermittlung?",
    contactOp: "Kontakt aufnehmen",
  },
};

export function teksten(taal: Taal): Teksten {
  return taal === "de" ? DE : NL;
}
