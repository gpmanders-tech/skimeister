/**
 * Keuzelijsten die door het hele platform gedeeld worden:
 * rollen, specialisaties, talen, leeftijdsgroepen, niveaus, het seizoen.
 */

// ── Gebruikersrollen ────────────────────────────────────────────────────────
export const ROLES = {
  instructor: "instructor",
  aspirant: "aspirant",
  school_ski: "school_ski",
  travel_org: "travel_org",
  school_nl: "school_nl",
  admin: "admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  instructor: "Instructeur",
  aspirant: "Aspirant",
  school_ski: "Skischool",
  travel_org: "Reisorganisatie",
  school_nl: "School",
  admin: "Admin",
};

export const ROLE_TAGLINES: Record<Exclude<Role, "admin">, string> = {
  instructor: "Vind werk als skileraar",
  aspirant: "Start jouw carrière op de piste",
  school_ski: "Vind en werf de beste instructeurs",
  travel_org: "Plan je hele seizoen op één plek",
  school_nl: "Gegarandeerd de juiste skileraar voor jouw schoolreis",
};

/** Welke rollen kun je zelf kiezen bij registratie (admin niet). */
export const REGISTERABLE_ROLES: Exclude<Role, "admin">[] = [
  "instructor",
  "aspirant",
  "school_ski",
  "travel_org",
  "school_nl",
];

// ── Specialisaties ──────────────────────────────────────────────────────────
export const SPECIALIZATIONS = [
  { id: "kids", label: "Kinderen" },
  { id: "adults", label: "Volwassenen" },
  { id: "freestyle", label: "Freestyle" },
  { id: "off-piste", label: "Off-piste" },
  { id: "snowboard", label: "Snowboard" },
  { id: "beginner", label: "Beginners" },
  { id: "racing", label: "Racing" },
] as const;
export type SpecializationId = (typeof SPECIALIZATIONS)[number]["id"];

// ── Talen ───────────────────────────────────────────────────────────────────
export const LANGUAGES = [
  { id: "nl", label: "Nederlands" },
  { id: "de", label: "Duits" },
  { id: "en", label: "Engels" },
  { id: "fr", label: "Frans" },
  { id: "other", label: "Anders" },
] as const;
export type LanguageId = (typeof LANGUAGES)[number]["id"];

// ── Leeftijdsgroepen (instructeur kan lesgeven aan) ─────────────────────────
export const AGE_GROUPS = [
  { id: "basisschool", label: "Basisschool" },
  { id: "middelbaar", label: "Middelbaar" },
  { id: "volwassenen", label: "Volwassenen" },
  { id: "senioren", label: "Senioren" },
] as const;
export type AgeGroupId = (typeof AGE_GROUPS)[number]["id"];

// ── Project: leeftijdsgroep & niveau ────────────────────────────────────────
export const PROJECT_AGE_GROUPS = [
  { id: "kids", label: "Kinderen" },
  { id: "teens", label: "Tieners" },
  { id: "adults", label: "Volwassenen" },
  { id: "mixed", label: "Gemengd" },
] as const;

export const PARTICIPANT_LEVELS = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Gevorderd" },
  { id: "advanced", label: "Vergevorderd" },
  { id: "mixed", label: "Gemengd" },
] as const;

// ── Documenttypes ───────────────────────────────────────────────────────────
export const DOC_TYPES = {
  vog: "vog",
  ehbo: "ehbo",
  insurance: "insurance",
  certificate: "certificate",
} as const;
export type DocType = (typeof DOC_TYPES)[keyof typeof DOC_TYPES];

export const DOC_TYPE_LABELS: Record<DocType, string> = {
  vog: "VOG (Verklaring Omtrent Gedrag)",
  ehbo: "EHBO-certificaat",
  insurance: "Aansprakelijkheidsverzekering",
  certificate: "Diploma / certificaat",
};

// ── Seizoen ─────────────────────────────────────────────────────────────────
/** Skiseizoen loopt van oktober t/m april. */
export const SEASON_MONTHS = [10, 11, 12, 1, 2, 3, 4];

/** Geeft het huidige seizoenlabel, bijv. "2025-2026". Maand >= aug => seizoen start dit jaar. */
export function currentSeason(now: Date): string {
  const y = now.getFullYear();
  const startYear = now.getMonth() + 1 >= 8 ? y : y - 1;
  return `${startYear}-${startYear + 1}`;
}
