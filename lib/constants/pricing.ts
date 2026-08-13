/**
 * Prijsmodel vanaf seizoen 2026/27.
 *
 * Geen abonnementen meer. Een opdracht plaatsen en reacties ontvangen is
 * gratis; een organisatie betaalt pas als er iemand daadwerkelijk geplaatst is.
 * Dat past bij een platform dat nog moet bewijzen dat het levert.
 */

/** Wat een organisatie betaalt per daadwerkelijk geplaatste instructeur. */
export const PLAATSINGSFEE = 195;

/** Wat een school NL/BE betaalt per schoolreis-project. */
export const SCHOOL_PROJECT_PRIJS = 79;

/** Lanceringsactie voor het eerste seizoen. */
export const LANCERINGSACTIE =
  "Eerste plaatsing van seizoen 2026/27 gratis.";

export type Doelgroep = "instructeur" | "organisatie" | "school";

export interface PrijsBlok {
  id: string;
  doelgroep: Doelgroep;
  naam: string;
  /** Groot getoonde prijs, al opgemaakt. */
  prijs: string;
  /** Kleine regel onder de prijs. */
  eenheid: string;
  samenvatting: string;
  features: string[];
  highlight?: boolean;
  ctaLabel: string;
  ctaHref: string;
}

export const PRIJSBLOKKEN: PrijsBlok[] = [
  {
    id: "instructeur",
    doelgroep: "instructeur",
    naam: "Instructeurs en aspiranten",
    prijs: "Gratis",
    eenheid: "altijd",
    samenvatting: "Je betaalt nooit iets. Niet voor je profiel, niet voor reageren.",
    features: [
      "Profiel aanmaken en beheren",
      "Alle opdrachten bekijken",
      "Onbeperkt reageren op opdrachten",
      "VOG en EHBO laten controleren",
      "Bericht bij een opdracht die bij je past",
    ],
    ctaLabel: "Maak een gratis profiel aan",
    ctaHref: "/register",
  },
  {
    id: "organisatie",
    doelgroep: "organisatie",
    naam: "Skischolen en reisorganisaties",
    prijs: `€ ${PLAATSINGSFEE}`,
    eenheid: "per geplaatste instructeur",
    samenvatting:
      "Plaatsen en reacties ontvangen is gratis. Je betaalt pas bij een bevestigde plaatsing.",
    highlight: true,
    features: [
      "Onbeperkt opdrachten plaatsen, gratis",
      "Alle reacties bekijken, gratis",
      "Geen abonnement en geen kosten vooraf",
      "VOG en EHBO handmatig gecontroleerd",
      "Betalen pas bij een bevestigde plaatsing",
    ],
    ctaLabel: "Plaats een opdracht",
    ctaHref: "/contact",
  },
  {
    id: "school",
    doelgroep: "school",
    naam: "Scholen in Nederland en België",
    prijs: `€ ${SCHOOL_PROJECT_PRIJS}`,
    eenheid: "per project",
    samenvatting:
      "Eén vast bedrag per schoolreis. Geen plaatsingsfee, geen abonnement.",
    features: [
      "Eén schoolreis-project plaatsen",
      "Onbeperkt reacties ontvangen",
      "Alleen instructeurs met gecontroleerde VOG",
      "Inclusief contracttemplate",
      "Inclusief ratio calculator",
    ],
    ctaLabel: "Plaats je schoolreis",
    ctaHref: "/contact",
  },
];

export const PRIJSBLOK_PER_DOELGROEP: Record<Doelgroep, PrijsBlok> = {
  instructeur: PRIJSBLOKKEN[0],
  organisatie: PRIJSBLOKKEN[1],
  school: PRIJSBLOKKEN[2],
};
