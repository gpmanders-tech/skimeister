"use server";

import { revalidatePath } from "next/cache";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { notifyProfileApproved } from "@/lib/email/notify";

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

/** Keurt een instructeurprofiel goed of trekt goedkeuring in. */
export async function setProfileApprovalAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;

  const id = String(formData.get("id") ?? "");
  const approve = String(formData.get("approve") ?? "") === "1";
  if (!id) return;

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("instructor_profiles")
    .update({ is_approved: approve })
    .eq("id", id)
    .select("user_id")
    .single();

  if (approve && profile?.user_id) {
    await notifyProfileApproved(profile.user_id);
  }
  revalidatePath("/admin/profielen");
}

/** Markeert een document als (on)geverifieerd. Werkt de profiel-badge bij. */
export async function setDocumentVerifiedAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;

  const id = String(formData.get("id") ?? "");
  const verified = String(formData.get("verified") ?? "") === "1";
  if (!id) return;

  // Service role: documenten van andere gebruikers vallen buiten RLS-update.
  const service = createServiceClient();
  const { data: doc } = await service
    .from("documents")
    .update({
      verified,
      verified_at: verified ? new Date().toISOString() : null,
      verified_by: verified ? admin.id : null,
    })
    .eq("id", id)
    .select("user_id, doc_type, expiry_date")
    .single();

  // Bijbehorende verified-badge op het instructeurprofiel bijwerken.
  if (doc && (doc.doc_type === "vog" || doc.doc_type === "ehbo" || doc.doc_type === "insurance")) {
    const col =
      doc.doc_type === "vog"
        ? { vog_verified: verified, vog_expiry: doc.expiry_date }
        : doc.doc_type === "ehbo"
          ? { ehbo_verified: verified, ehbo_expiry: doc.expiry_date }
          : { insurance_verified: verified, insurance_expiry: doc.expiry_date };
    await service.from("instructor_profiles").update(col).eq("user_id", doc.user_id);
  }

  revalidatePath("/admin/documenten");
}
