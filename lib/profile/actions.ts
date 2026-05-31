"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { computeCompleteness } from "@/lib/profile/completeness";
import { CERTIFICATIONS } from "@/lib/constants/certifications";
import type { CertificationEntry } from "@/lib/types";

export interface ProfileState {
  error?: string;
  message?: string;
}

function num(v: FormDataEntryValue | null): number | null {
  if (v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function updateProfileAction(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const user = await getSessionUser();
  if (!user || user.role !== "instructor") {
    return { error: "Geen toegang." };
  }

  const supabase = await createClient();

  // ── Foto uploaden (optioneel) ──────────────────────────────────────────
  let photo_url: string | undefined;
  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    if (photo.size > 5 * 1024 * 1024) {
      return { error: "De foto mag maximaal 5 MB zijn." };
    }
    const ext = photo.name.split(".").pop() || "jpg";
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, photo, { upsert: true, contentType: photo.type });
    if (upErr) return { error: `Upload mislukt: ${upErr.message}` };
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    photo_url = data.publicUrl;
  }

  // ── Certificeringen samenstellen ───────────────────────────────────────
  const selectedCerts = formData.getAll("certifications").map(String);
  const validCertIds = new Set(CERTIFICATIONS.map((c) => c.id));
  const certifications: CertificationEntry[] = selectedCerts
    .filter((id) => validCertIds.has(id))
    .map((id) => {
      const year = num(formData.get(`year_${id}`));
      return year ? { cert_id: id, year_obtained: year } : { cert_id: id };
    });

  // ── Overige velden ─────────────────────────────────────────────────────
  const update = {
    first_name: (formData.get("first_name") as string)?.trim() || null,
    last_name: (formData.get("last_name") as string)?.trim() || null,
    bio: (formData.get("bio") as string)?.trim() || null,
    city: (formData.get("city") as string)?.trim() || null,
    nationality: (formData.get("nationality") as string)?.trim() || null,
    phone: (formData.get("phone") as string)?.trim() || null,
    years_experience: num(formData.get("years_experience")),
    hourly_rate: num(formData.get("hourly_rate")),
    daily_rate: num(formData.get("daily_rate")),
    weekly_rate: num(formData.get("weekly_rate")),
    has_own_transport: formData.get("has_own_transport") === "on",
    school_group_experience: formData.get("school_group_experience") === "on",
    pedagogical_background:
      (formData.get("pedagogical_background") as string)?.trim() || null,
    languages: formData.getAll("languages").map(String),
    specializations: formData.getAll("specializations").map(String),
    age_groups: formData.getAll("age_groups").map(String),
    preferred_resorts: formData.getAll("preferred_resorts").map(String),
    certifications,
    ...(photo_url ? { photo_url } : {}),
  };

  // Bestaande foto behouden voor de compleetheidsberekening als er geen
  // nieuwe is geüpload.
  const { data: current } = await supabase
    .from("instructor_profiles")
    .select("photo_url")
    .eq("user_id", user.id)
    .maybeSingle();

  const { score, canActivate } = computeCompleteness({
    ...update,
    photo_url: photo_url ?? current?.photo_url ?? undefined,
    certifications,
  } as never);

  const { error } = await supabase
    .from("instructor_profiles")
    .update({
      ...update,
      profile_completeness: score,
      is_active: canActivate,
    })
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/profiel/bewerken");
  revalidatePath("/dashboard");
  return { message: "Profiel opgeslagen." };
}
