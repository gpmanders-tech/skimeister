import { formatDate } from "@/lib/utils";
import { getResortById } from "@/lib/constants/resorts";
import { getCertById } from "@/lib/constants/certifications";
import { PROJECT_AGE_GROUPS } from "@/lib/constants/options";
import type { Opdracht } from "@/lib/opdrachten/queries";

/** Leesbare periode, bijv. "12 jan 2027 t/m 19 jan 2027" of "Nog te plannen". */
export function periodeLabel(o: Pick<Opdracht, "start_date" | "end_date">): string {
  if (o.start_date && o.end_date) {
    return `${formatDate(o.start_date)} t/m ${formatDate(o.end_date)}`;
  }
  if (o.start_date) return `Vanaf ${formatDate(o.start_date)}`;
  if (o.end_date) return `Tot ${formatDate(o.end_date)}`;
  return "Nog te plannen";
}

/** Korte periode voor in de SEO-titel, bijv. "januari 2027". */
export function periodeKort(o: Pick<Opdracht, "start_date" | "end_date">): string {
  const d = o.start_date ?? o.end_date;
  if (!d) return "seizoen 2026/27";
  return new Intl.DateTimeFormat("nl-NL", { month: "long", year: "numeric" }).format(
    new Date(d),
  );
}

export function skigebiedLabel(resortId: string | null): string {
  if (!resortId) return "Nader te bepalen";
  return getResortById(resortId)?.name ?? resortId;
}

export function certificeringLabel(certId: string | null): string | null {
  if (!certId) return null;
  return getCertById(certId)?.name ?? certId;
}

/** Doelgroep zoals de instructeur 'm leest: schoolgroep wint van leeftijdsgroep. */
export function doelgroepLabel(o: Pick<Opdracht, "age_group" | "school_group">): string {
  if (o.school_group) return "Schoolgroep";
  const match = PROJECT_AGE_GROUPS.find((g) => g.id === o.age_group);
  return match?.label ?? "Gemengd";
}

export function instructeursLabel(aantal: number | null): string {
  if (!aantal || aantal < 1) return "Aantal in overleg";
  return aantal === 1 ? "1 instructeur gevraagd" : `${aantal} instructeurs gevraagd`;
}

/** Titel voor de detailpagina en de SEO-title. */
export function opdrachtTitel(o: Opdracht): string {
  return `Skileraar gezocht — ${skigebiedLabel(o.resort_id)}, ${periodeKort(o)}`;
}
