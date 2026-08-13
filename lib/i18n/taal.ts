import type { Role } from "@/lib/constants/options";

/**
 * Taal van de interface.
 *
 * Skischolen in Oostenrijk en Duitsland zijn Duitstalig. De taal volgt daarom
 * de rol en niet de URL: een skischool logt in en ziet alles in het Duits,
 * inclusief e-mail. De rest van het platform (instructeurs, reisorganisaties,
 * NL/BE-scholen) blijft Nederlands.
 *
 * Wil je later een taalkeuze per gebruiker, dan hoeft alleen `taalVoorRol`
 * aangepast te worden: alle schermen halen hun taal hier vandaan.
 */
export type Taal = "nl" | "de";

export const STANDAARDTAAL: Taal = "nl";

export function taalVoorRol(role: Role | null | undefined): Taal {
  return role === "school_ski" ? "de" : STANDAARDTAAL;
}

/** HTML-lang-attribuut, bijv. voor een losse Duitse pagina. */
export const HTML_LANG: Record<Taal, string> = {
  nl: "nl-NL",
  de: "de-DE",
};

/** Kiest de juiste variant uit een tekstpaar. */
export function kies<T>(taal: Taal, varianten: Record<Taal, T>): T {
  return varianten[taal] ?? varianten[STANDAARDTAAL];
}
