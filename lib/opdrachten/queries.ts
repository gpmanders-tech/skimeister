import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";

/**
 * Publieke opdrachten (het opdrachtenboard).
 *
 * Open opdrachten zijn zonder login leesbaar: de RLS-policy
 * "projects: open zichtbaar" toetst op `status = 'open'` en niet op auth.uid(),
 * dus de gewone anon-client volstaat. Er is bewust geen service-role nodig.
 */

/** Een opdracht zoals het board 'm toont. */
export interface Opdracht extends Project {
  /** Kost en inwoning inbegrepen. Optioneel: kolom komt uit migratie 0007. */
  board_lodging?: boolean | null;
}

export interface OpdrachtFilters {
  resort?: string;
  van?: string;
  tot?: string;
  cert?: string;
}

function schoon(v?: string): string | undefined {
  const s = v?.trim();
  return s ? s : undefined;
}

/**
 * Haalt open opdrachten op, eerst de opdrachten die het snelst beginnen.
 * `select("*")` is bewust: zo blijft dit werken vóór én na migratie 0007,
 * die de kolom board_lodging toevoegt.
 */
export async function getOpenOpdrachten(
  filters: OpdrachtFilters = {},
  limit = 60,
): Promise<Opdracht[]> {
  const supabase = createPublicClient();

  let query = supabase
    .from("projects")
    .select("*")
    .eq("status", "open")
    .order("start_date", { ascending: true, nullsFirst: false })
    .limit(limit);

  const resort = schoon(filters.resort);
  const cert = schoon(filters.cert);
  const van = schoon(filters.van);
  const tot = schoon(filters.tot);

  if (resort) query = query.eq("resort_id", resort);
  if (cert) query = query.eq("min_certification", cert);

  // Periodefilter: overlap met het opgegeven venster. Opdrachten zonder
  // datum vallen nooit af, die zijn simpelweg nog niet ingepland.
  if (van) query = query.or(`end_date.gte.${van},end_date.is.null`);
  if (tot) query = query.or(`start_date.lte.${tot},start_date.is.null`);

  const { data, error } = await query;
  if (error) {
    console.error("Opdrachten ophalen mislukt:", error.message);
    return [];
  }
  return (data ?? []) as Opdracht[];
}

/**
 * Eén opdracht voor de detailpagina. Geeft null als hij niet (meer) open is.
 * In React-cache verpakt: generateMetadata en de pagina zelf vragen dezelfde
 * opdracht op, dat mag één databasequery zijn.
 */
export const getOpdracht = cache(async function getOpdracht(
  id: string,
): Promise<Opdracht | null> {
  // Een ongeldige uuid geeft anders een databasefout in plaats van een 404.
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;

  const supabase = createPublicClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("status", "open")
    .maybeSingle();

  return (data as Opdracht) ?? null;
});

/** De eerstvolgende opdrachten, voor het blok op de homepage. */
export async function getRecenteOpdrachten(limit = 3): Promise<Opdracht[]> {
  return getOpenOpdrachten({}, limit);
}

/** Aantal open opdrachten. Voor de live cijfers op de homepage. */
export async function telOpenOpdrachten(): Promise<number> {
  const supabase = createPublicClient();
  const { count } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("status", "open");
  return count ?? 0;
}
