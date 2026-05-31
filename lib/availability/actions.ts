"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { seasonWeeks } from "@/lib/availability/weeks";

export interface AvailabilityState {
  error?: string;
  message?: string;
}

/**
 * Slaat de beschikbare weken op voor een seizoen.
 * Vervangt de bestaande beschikbaarheid van dat seizoen volledig.
 */
export async function saveAvailabilityAction(
  _prev: AvailabilityState,
  formData: FormData,
): Promise<AvailabilityState> {
  const user = await getSessionUser();
  if (!user || user.role !== "instructor") return { error: "Geen toegang." };

  const season = String(formData.get("season") ?? "");
  if (!season) return { error: "Seizoen ontbreekt." };

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("instructor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!profile) return { error: "Profiel niet gevonden." };

  const validStarts = new Set(seasonWeeks(season).map((w) => w.start));
  const selected = formData
    .getAll("weeks")
    .map(String)
    .filter((s) => validStarts.has(s));

  // Bestaande beschikbaarheid voor dit seizoen wissen en opnieuw zetten.
  await supabase
    .from("availability")
    .delete()
    .eq("instructor_id", profile.id)
    .eq("season", season);

  if (selected.length > 0) {
    const weekMap = new Map(seasonWeeks(season).map((w) => [w.start, w.end]));
    const rows = selected.map((start) => ({
      instructor_id: profile.id,
      season,
      week_start: start,
      week_end: weekMap.get(start)!,
      is_available: true,
    }));
    const { error } = await supabase.from("availability").insert(rows);
    if (error) return { error: error.message };
  }

  revalidatePath("/beschikbaarheid");
  return { message: `${selected.length} weken opgeslagen voor seizoen ${season}.` };
}
