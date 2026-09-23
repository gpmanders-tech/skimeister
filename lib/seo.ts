import type { Metadata } from "next";

/**
 * SEO-hulpjes.
 *
 * De canonical stond in de root-layout hardgecodeerd op "/", waardoor élke
 * pagina zonder eigen canonical aan Google vertelde dat hij een duplicaat van
 * de homepage was. Elke pagina zet 'm nu zelf via `canoniek()`.
 */

export const SITE = "https://www.skimeister.nl";

/**
 * Canonical voor één pagina. Pad begint met een slash.
 *
 * Zet hier bewust GEEN openGraph in: een openGraph op paginaniveau vervangt
 * die van de root-layout volledig in plaats van 'm aan te vullen. Doe je dat
 * wel, dan verliest de pagina og:image, og:site_name, og:type en og:locale.
 * Pagina's die zelf een openGraph nodig hebben, nemen OG_IMAGE expliciet mee.
 */
export function canoniek(pad: string): Metadata {
  return { alternates: { canonical: pad } };
}

/** Standaard deelafbeelding (1200x630). */
export const OG_IMAGE = {
  url: `${SITE}/og-skimeister.jpg`,
  width: 1200,
  height: 630,
  alt: "Skimeister.nl: opdrachten voor gecontroleerde skileraren",
};

/**
 * Welke certificeringen in een land gangbaar zijn. Feitelijk gegeven, geen
 * verzonnen marketingtekst: dit zijn de nationale opleidingsinstituten.
 */
export const CERT_PER_LAND: Record<string, { instituut: string; toelichting: string }> = {
  Oostenrijk: {
    instituut: "ÖSV",
    toelichting:
      "In Oostenrijk werkt vrijwel elke skischool met de ÖSV-niveaus: Anwärter als instapniveau, Landesschilehrer als gevorderd en Staatlich geprüfter Schilehrer als hoogste. Nederlandse NEVSKI-diploma's en de internationale ISIA-stamp worden daarnaast breed geaccepteerd.",
  },
  Zwitserland: {
    instituut: "Swiss Snowsports",
    toelichting:
      "Zwitserse skischolen werken met Swiss Snowsports: J+S als instapniveau, Leiter en Experte als hogere niveaus. Voor werken als buitenlandse instructeur is de ISIA-stamp vaak doorslaggevend.",
  },
  Frankrijk: {
    instituut: "ENSA / Diplôme d'État",
    toelichting:
      "Frankrijk stelt de zwaarste eisen van de Alpenlanden: voor betaald lesgeven is in de praktijk een Diplôme d'État of een gelijkwaardige erkenning met ISIA-stamp nodig.",
  },
};

/** Eén stap in een broodkruimelpad. Pad begint met een slash. */
export interface Kruimel {
  naam: string;
  pad: string;
}

/** BreadcrumbList voor structured data. De homepage staat er altijd vooraan. */
export function broodkruimelJsonLd(kruimels: Kruimel[], home = "Home") {
  const pad = [{ naam: home, pad: "/" }, ...kruimels];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: pad.map((k, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: k.naam,
      item: `${SITE}${k.pad === "/" ? "" : k.pad}`,
    })),
  };
}

/** Eén vraag met antwoord, zoals die zichtbaar op de pagina staat. */
export interface Vraag {
  v: string;
  a: string;
}

/**
 * FAQPage voor structured data. Gebruik alleen vragen die ook echt zichtbaar
 * op dezelfde pagina staan, anders negeert Google de markering.
 */
export function faqJsonLd(vragen: Vraag[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: vragen.map((q) => ({
      "@type": "Question",
      name: q.v,
      acceptedAnswer: { "@type": "Answer", text: q.a },
    })),
  };
}

/** WebPage (of een subtype) met verwijzing naar de site en de organisatie. */
export function webpaginaJsonLd({
  pad,
  naam,
  omschrijving,
  type = "WebPage",
  taal = "nl-NL",
}: {
  pad: string;
  naam: string;
  omschrijving: string;
  type?: "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage" | "FAQPage";
  taal?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${SITE}${pad}#pagina`,
    url: `${SITE}${pad}`,
    name: naam,
    description: omschrijving,
    inLanguage: taal,
    isPartOf: { "@id": `${SITE}/#website` },
    publisher: { "@id": `${SITE}/#organisatie` },
  };
}
