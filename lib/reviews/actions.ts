"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { isOrgRole } from "@/lib/auth/roles";
import { currentSeason } from "@/lib/constants/options";

export interface ReviewState {
  error?: string;
  message?: string;
}

export async function submitReviewAction(
  _prev: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const user = await getSessionUser();
  if (!user || !isOrgRole(user.role)) return { error: "Geen toegang." };

  const instructorId = String(formData.get("instructor_id") ?? "");
  const rating = Number(formData.get("rating") ?? 0);
  const comment = String(formData.get("comment") ?? "").trim() || null;
  if (!instructorId) return { error: "Instructeur ontbreekt." };
  if (!(rating >= 1 && rating <= 5)) return { error: "Kies een score van 1 tot 5." };

  const supabase = await createClient();
  const { data: org } = await supabase
    .from("organizations")
    .select("id, org_type")
    .eq("user_id", user.id)
    .single();
  if (!org) return { error: "Organisatie niet gevonden." };

  const season = currentSeason(new Date());
  const { error } = await supabase.from("reviews").upsert(
    {
      organization_id: org.id,
      instructor_id: instructorId,
      rating,
      comment,
      season,
      org_type: org.org_type,
    },
    { onConflict: "organization_id,instructor_id,season" },
  );
  if (error) return { error: error.message };

  revalidatePath(`/instructeur/${instructorId}`);
  return { message: "Bedankt voor je review!" };
}
