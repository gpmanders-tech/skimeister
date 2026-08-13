/**
 * Eén bron van waarheid voor de verificatiestatus van een document.
 *
 * Regel: een badge verschijnt uitsluitend als de beheerder het document
 * handmatig heeft goedgekeurd én het niet verlopen is. Een upload alleen is
 * "ingediend", meer niet.
 */

export type DocStatus = "ingediend" | "goedgekeurd" | "verlopen";

export interface DocLike {
  verified: boolean;
  expiry_date: string | null;
}

function isVerlopen(expiry: string | null): boolean {
  if (!expiry) return false;
  const vandaag = new Date();
  vandaag.setHours(0, 0, 0, 0);
  return new Date(expiry) < vandaag;
}

export function documentStatus(d: DocLike): DocStatus {
  if (!d.verified) return "ingediend";
  return isVerlopen(d.expiry_date) ? "verlopen" : "goedgekeurd";
}

export const DOC_STATUS_LABELS: Record<DocStatus, string> = {
  ingediend: "Ingediend, wacht op controle",
  goedgekeurd: "Goedgekeurd",
  verlopen: "Verlopen",
};

export const DOC_STATUS_STIJL: Record<DocStatus, string> = {
  ingediend: "bg-amber-50 text-amber-700",
  goedgekeurd: "bg-green-50 text-green-700",
  verlopen: "bg-red-50 text-red-700",
};

/**
 * Mag de verificatiebadge op een profiel getoond worden?
 * Alleen bij een goedgekeurd én geldig document.
 */
export function badgeGeldig(verified: boolean, expiry: string | null): boolean {
  return verified && !isVerlopen(expiry);
}
