"use server";

import { revalidatePath } from "next/cache";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";

export interface AspirantState {
  error?: string;
  message?: string;
}

/** Aspirant markeert zich als ingeschreven bij de opleiding. */
export async function markEnrolledAction(): Promise<void> {
  const user = await getSessionUser();
  if (!user || user.role !== "aspirant") return;
  const supabase = await createClient();
  await supabase
    .from("aspirants")
    .update({ status: "enrolled", partner_referral_date: new Date().toISOString().slice(0, 10) })
    .eq("user_id", user.id)
    .in("status", ["registered"]);
  revalidatePath("/dashboard");
  revalidatePath("/opleiding");
}

/** Aspirant uploadt het behaalde certificaat. */
export async function uploadCertificateAction(
  _prev: AspirantState,
  formData: FormData,
): Promise<AspirantState> {
  const user = await getSessionUser();
  if (!user || user.role !== "aspirant") return { error: "Geen toegang." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Kies een bestand." };
  }
  if (file.size > 10 * 1024 * 1024) return { error: "Maximaal 10 MB." };

  const supabase = await createClient();
  const ext = file.name.split(".").pop() || "pdf";
  const path = `${user.id}/certificate-${Date.now()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from("documents")
    .upload(path, file, { contentType: file.type });
  if (upErr) return { error: `Upload mislukt: ${upErr.message}` };

  const { error } = await supabase
    .from("aspirants")
    .update({ certificate_uploaded: true, certificate_url: path, status: "passed" })
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/opleiding");
  return { message: "Certificaat geüpload! De beheerder controleert het." };
}

/**
 * Admin keurt een aspirant goed en zet het account om naar instructeur:
 * rol wijzigen + instructeurprofiel aanmaken (service role; RLS blokkeert dit anders).
 */
export async function convertAspirantAction(formData: FormData): Promise<void> {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") return;

  const aspirantUserId = String(formData.get("user_id") ?? "");
  if (!aspirantUserId) return;

  const service = createServiceClient();

  // Aspirant-record bijwerken.
  const { data: asp } = await service
    .from("aspirants")
    .update({ approved_by_admin: true, status: "active" })
    .eq("user_id", aspirantUserId)
    .select("first_name, last_name")
    .single();

  // Rol omzetten naar instructeur.
  await service.from("users").update({ role: "instructor" }).eq("id", aspirantUserId);

  // Instructeurprofiel aanmaken als het nog niet bestaat.
  const { data: existing } = await service
    .from("instructor_profiles")
    .select("id")
    .eq("user_id", aspirantUserId)
    .maybeSingle();
  if (!existing) {
    await service.from("instructor_profiles").insert({
      user_id: aspirantUserId,
      first_name: asp?.first_name ?? null,
      last_name: asp?.last_name ?? null,
    });
  }

  revalidatePath("/admin/aspiranten");
}
