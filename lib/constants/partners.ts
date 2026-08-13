/**
 * Externe partners (opleiding + verzekering).
 *
 * ⚠️ De gegevens hieronder zijn nog PLAATSHOUDERS met verzonnen URL's. Zolang
 * PARTNERS_ACTIEF op false staat wordt er nergens een partner getoond: liever
 * niets dan een partner die niet bestaat. Zet dit op true zodra de echte naam,
 * URL en voorwaarden bekend zijn.
 */
export const PARTNERS_ACTIEF = false;

export interface Partner {
  name: string;
  tagline: string;
  url: string;
  bullets: string[];
}

const REF = "?ref=skimeister";

export const TRAINING_PARTNER: Partner = {
  name: "Opleidingspartner",
  tagline: "Word gecertificeerd skileraar (Anwärter) via onze opleidingspartner.",
  url: `https://voorbeeld-opleidingspartner.nl${REF}`,
  bullets: [
    "Erkende opleiding tot ÖSV Anwärter",
    "Theorie + praktijk in de Alpen",
    "Begeleiding tot je examen",
  ],
};

export const INSURANCE_PARTNER: Partner = {
  name: "Verzekeringspartner",
  tagline: "Een aansprakelijkheidsverzekering speciaal voor skileraren.",
  url: `https://voorbeeld-verzekeringspartner.nl${REF}`,
  bullets: [
    "Dekking tijdens het lesgeven",
    "Voordelig tarief voor Skimeister-leden",
    "Snel geregeld, digitaal bewijs",
  ],
};
