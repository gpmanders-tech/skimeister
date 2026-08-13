import { createPublicClient } from "@/lib/supabase/server";

/**
 * Live cijfers voor de homepage. Bewust alleen dingen die echt te tellen zijn:
 * open opdrachten en instructeurs met een goedgekeurde VOG. Geen afgeleide of
 * opgeblazen getallen.
 */
export interface LiveCijfers {
  openOpdrachten: number;
  geverifieerdeInstructeurs: number;
  /** Pas tonen als beide getallen iets voorstellen. */
  toonbaar: boolean;
}

/** Onder deze drempel zegt een getal niets en verbergen we het blok. */
const DREMPEL = 5;

export async function getLiveCijfers(): Promise<LiveCijfers> {
  const supabase = createPublicClient();

  const [opdrachten, instructeurs] = await Promise.all([
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("status", "open"),
    supabase
      .from("instructor_profiles")
      .select("id", { count: "exact", head: true })
      .eq("vog_verified", true),
  ]);

  const openOpdrachten = opdrachten.count ?? 0;
  const geverifieerdeInstructeurs = instructeurs.count ?? 0;

  return {
    openOpdrachten,
    geverifieerdeInstructeurs,
    toonbaar: openOpdrachten >= DREMPEL && geverifieerdeInstructeurs >= DREMPEL,
  };
}
