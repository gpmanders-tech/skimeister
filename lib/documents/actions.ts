"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { DOC_TYPES, type DocType } from "@/lib/constants/options";

export interface DocState {
  error?: string;
  message?: string;
}

const VALID_TYPES = new Set<string>(Object.values(DOC_TYPES));

export async function uploadDocumentAction(
  _prev: DocState,
  formData: FormData,
): Promise<DocState> {
  const user = await getSessionUser();
  if (!user) return { error: "Geen toegang." };

  const docType = String(formData.get("doc_type") ?? "");
  if (!VALID_TYPES.has(docType)) return { error: "Ongeldig documenttype." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Kies een bestand om te uploaden." };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { error: "Het bestand mag maximaal 10 MB zijn." };
  }

  const expiry = String(formData.get("expiry_date") ?? "") || null;

  const supabase = await createClient();
  const ext = file.name.split(".").pop() || "pdf";
  const path = `${user.id}/${docType}-${Date.now()}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from("documents")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (upErr) return { error: `Upload mislukt: ${upErr.message}` };

  const { error } = await supabase.from("documents").insert({
    user_id: user.id,
    doc_type: docType as DocType,
    file_url: path,
    expiry_date: expiry,
  });
  if (error) return { error: error.message };

  revalidatePath("/documenten");
  return { message: "Document geüpload." };
}

export async function deleteDocumentAction(formData: FormData): Promise<void> {
  const user = await getSessionUser();
  if (!user) return;

  const id = String(formData.get("id") ?? "");
  const path = String(formData.get("path") ?? "");
  if (!id) return;

  const supabase = await createClient();
  // Verwijder bestand (best effort) en de rij.
  if (path) await supabase.storage.from("documents").remove([path]);
  await supabase.from("documents").delete().eq("id", id).eq("user_id", user.id);

  revalidatePath("/documenten");
}
