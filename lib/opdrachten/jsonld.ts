import { SITE } from "@/lib/seo";
import { getResortById } from "@/lib/constants/resorts";
import { getCertById } from "@/lib/constants/certifications";
import type { Opdracht } from "@/lib/opdrachten/queries";
import { doelgroepLabel, instructeursLabel, periodeLabel } from "@/lib/opdrachten/presentatie";

const LANDCODE: Record<string, string> = {
  Oostenrijk: "AT",
  Zwitserland: "CH",
  Frankrijk: "FR",
};

/**
 * Probeert een bedrag uit de vrije vergoedingstekst te halen, bijv.
 * "€ 950 per week" of "950 euro p/w". Geeft null als er niets betrouwbaars in
 * staat: liever geen baseSalary dan een verzonnen bedrag in structured data.
 */
function leesVergoeding(
  tekst: string | null,
): { waarde: number; eenheid: "HOUR" | "DAY" | "WEEK" | "MONTH" } | null {
  if (!tekst) return null;

  const match = tekst.replace(/\./g, "").match(/(\d+(?:,\d+)?)/);
  if (!match) return null;
  const waarde = Number(match[1].replace(",", "."));
  if (!Number.isFinite(waarde) || waarde <= 0) return null;

  const t = tekst.toLowerCase();
  if (/uur|stunde|hour|p\/u/.test(t)) return { waarde, eenheid: "HOUR" };
  if (/dag|tag|day|p\/d/.test(t)) return { waarde, eenheid: "DAY" };
  if (/maand|monat|month/.test(t)) return { waarde, eenheid: "MONTH" };
  if (/week|woche|p\/w/.test(t)) return { waarde, eenheid: "WEEK" };
  return null;
}

/** Leesbare omschrijving voor in de structured data. */
function omschrijving(o: Opdracht): string {
  const regels = [
    o.description?.trim(),
    `Skigebied: ${getResortById(o.resort_id ?? "")?.name ?? "nader te bepalen"}.`,
    `Periode: ${periodeLabel(o)}.`,
    `Gevraagd: ${instructeursLabel(o.instructors_needed)}.`,
    `Doelgroep: ${doelgroepLabel(o)}.`,
    o.min_certification
      ? `Minimale certificering: ${getCertById(o.min_certification)?.name ?? o.min_certification}.`
      : null,
    o.board_lodging ? "Kost en inwoning inbegrepen." : null,
    o.vog_required ? "Een geldige VOG is vereist en wordt door Skimeister gecontroleerd." : null,
    o.ehbo_required ? "Een EHBO-certificaat is vereist." : null,
  ].filter(Boolean);

  return regels.join(" ");
}

/**
 * JobPosting volgens schema.org, voor opname in Google for Jobs.
 * Velden die we niet betrouwbaar kunnen vullen laten we weg; Google straft
 * ontbrekende optionele velden niet af, onjuiste wel.
 */
export function jobPostingJsonLd(o: Opdracht) {
  const resort = getResortById(o.resort_id ?? "");
  const vergoeding = leesVergoeding(o.compensation);
  const geldigTot = o.deadline ?? o.end_date ?? null;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: o.name,
    description: omschrijving(o),
    datePosted: o.created_at,
    employmentType: "TEMPORARY",
    industry: "Wintersport",
    directApply: true,
    url: `${SITE}/opdrachten/${o.id}`,
    hiringOrganization: {
      "@type": "Organization",
      name: "Skimeister.nl",
      sameAs: SITE,
      logo: `${SITE}/og-skimeister.jpg`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: resort?.name ?? "Alpen",
        addressCountry: LANDCODE[resort?.country ?? ""] ?? "AT",
      },
    },
  };

  if (geldigTot) data.validThrough = new Date(geldigTot).toISOString();

  if (vergoeding) {
    data.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "EUR",
      value: {
        "@type": "QuantitativeValue",
        value: vergoeding.waarde,
        unitText: vergoeding.eenheid,
      },
    };
  }

  if (o.instructors_needed && o.instructors_needed > 0) {
    data.totalJobOpenings = o.instructors_needed;
  }

  return data;
}
