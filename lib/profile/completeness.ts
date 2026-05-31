import type { InstructorProfile } from "@/lib/types";

export interface CompletenessResult {
  score: number; // 0-100
  missing: string[];
  /** Voldoet aan de minimumeisen om het profiel te activeren. */
  canActivate: boolean;
}

/**
 * Berekent de compleetheid van een instructeurprofiel.
 * Verplichte velden voor activering: foto, bio, minimaal 1 certificaat,
 * minimaal 1 preferred resort. (Beschikbaarheid wordt los gecontroleerd.)
 */
export function computeCompleteness(
  p: Partial<InstructorProfile>,
): CompletenessResult {
  const checks: { ok: boolean; label: string; required?: boolean }[] = [
    { ok: !!p.first_name && !!p.last_name, label: "Naam" },
    { ok: !!p.photo_url, label: "Profielfoto", required: true },
    { ok: !!p.bio && p.bio.trim().length >= 20, label: "Bio (min. 20 tekens)", required: true },
    { ok: !!p.city, label: "Woonplaats" },
    { ok: (p.years_experience ?? 0) > 0, label: "Jaren ervaring" },
    {
      ok: Array.isArray(p.certifications) && p.certifications.length > 0,
      label: "Minimaal 1 certificaat",
      required: true,
    },
    { ok: (p.languages?.length ?? 0) > 0, label: "Talen" },
    { ok: (p.specializations?.length ?? 0) > 0, label: "Specialisaties" },
    {
      ok: (p.preferred_resorts?.length ?? 0) > 0,
      label: "Minimaal 1 voorkeursgebied",
      required: true,
    },
    {
      ok: !!p.hourly_rate || !!p.daily_rate || !!p.weekly_rate,
      label: "Een tarief",
    },
  ];

  const total = checks.length;
  const done = checks.filter((c) => c.ok).length;
  const score = Math.round((done / total) * 100);
  const missing = checks.filter((c) => !c.ok).map((c) => c.label);
  const canActivate = checks.filter((c) => c.required).every((c) => c.ok);

  return { score, missing, canActivate };
}
