"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { isOrgRole } from "@/lib/auth/roles";

const FILTER_KEYS = [
  "resort", "language", "specialization", "age_group",
  "vog", "ehbo", "insurance", "isia", "school_group", "sort",
];

export async function saveSearchAction(formData: FormData): Promise<void> {
  const user = await getSessionUser();
  if (!user || !isOrgRole(user.role)) return;

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const params: Record<string, string> = {};
  for (const k of FILTER_KEYS) {
    const v = String(formData.get(k) ?? "").trim();
    if (v) params[k] = v;
  }

  const supabase = await createClient();
  await supabase.from("saved_searches").insert({ user_id: user.id, name, params });
  revalidatePath("/zoeken");
}

export async function deleteSearchAction(formData: FormData): Promise<void> {
  const user = await getSessionUser();
  if (!user) return;
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("saved_searches").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/zoeken");
}
