"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { isOrgRole } from "@/lib/auth/roles";
import { currentSeason } from "@/lib/constants/options";
import type { ContactStatus } from "@/lib/types";

export async function saveContactAction(formData: FormData): Promise<void> {
  const user = await getSessionUser();
  if (!user || !isOrgRole(user.role)) return;

  const instructorId = String(formData.get("instructor_id") ?? "");
  if (!instructorId) return;

  const supabase = await createClient();
  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!org) return;

  const season = currentSeason(new Date());

  // Upsert op (organization_id, instructor_id, season).
  await supabase.from("school_contacts").upsert(
    {
      organization_id: org.id,
      instructor_id: instructorId,
      status: "saved" as ContactStatus,
      season,
    },
    { onConflict: "organization_id,instructor_id,season" },
  );

  revalidatePath("/contacten");
  revalidatePath(`/instructeur/${instructorId}`);
}

export async function updateContactStatusAction(formData: FormData): Promise<void> {
  const user = await getSessionUser();
  if (!user || !isOrgRole(user.role)) return;

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as ContactStatus;
  const valid: ContactStatus[] = [
    "saved",
    "contacted",
    "in_gesprek",
    "aangenomen",
    "afgewezen",
  ];
  if (!id || !valid.includes(status)) return;

  const supabase = await createClient();
  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!org) return;

  await supabase
    .from("school_contacts")
    .update({ status })
    .eq("id", id)
    .eq("organization_id", org.id);

  revalidatePath("/contacten");
}
