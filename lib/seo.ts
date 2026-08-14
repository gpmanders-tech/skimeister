import type { Metadata } from "next";

/**
 * SEO-hulpjes.
 *
 * De canonical stond in de root-layout hardgecodeerd op "/", waardoor élke
 * pagina zonder eigen canonical aan Google vertelde dat hij een duplicaat van
 * de homepage was. Elke pagina zet 'm nu zelf via `canoniek()`.
 */

export const SITE = "https://www.skimeister.nl";

/** Canonical + og:url voor één pagina. Pad begint met een slash. */
export function canoniek(pad: string): Metadata {
  const url = pad === "/" ? SITE : `${SITE}${pad}`;
  return {
    alternates: { canonical: pad },
    openGraph: { url },
  };
}

/** Standaard deelafbeelding (1200x630). */
export const OG_IMAGE = {
  url: `${SITE}/og-skimeister.jpg`,
  width: 1200,
  height: 630,
  alt: "Skimeister.nl — opdrachten voor gecontroleerde skileraren",
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
