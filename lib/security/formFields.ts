/**
 * Veldnamen die het formulier (client) en de controle (server) delen.
 *
 * Bewust een apart bestand zonder Node-imports: `formGuard.ts` gebruikt
 * `node:crypto` en mag daarom nooit in de browser-bundle belanden.
 */

/** Verborgen honeypot-veld. Klinkt plausibel genoeg om door bots ingevuld te worden. */
export const HONEYPOT_FIELD = "website";

/** Veld met het ondertekende tijdstempel. */
export const TOKEN_FIELD = "_ts";
