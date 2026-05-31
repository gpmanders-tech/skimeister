"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { resolveUserNames } from "@/lib/messages/names";
import { notifyNewMessage } from "@/lib/email/notify";

export interface MessageState {
  error?: string;
}

export async function sendMessageAction(
  _prev: MessageState,
  formData: FormData,
): Promise<MessageState> {
  const user = await getSessionUser();
  if (!user) return { error: "Geen toegang." };

  const receiverId = String(formData.get("receiver_id") ?? "");
  const content = String(formData.get("content") ?? "").trim();
  const contextType = String(formData.get("context_type") ?? "school_contact");
  const contextId = String(formData.get("context_id") ?? "") || null;

  if (!receiverId || !content) return { error: "Bericht mag niet leeg zijn." };
  if (receiverId === user.id) return { error: "Je kunt jezelf geen bericht sturen." };

  const supabase = await createClient();
  const { error } = await supabase.from("messages").insert({
    sender_id: user.id,
    receiver_id: receiverId,
    context_type: contextType === "project" ? "project" : "school_contact",
    context_id: contextId,
    content,
  });
  if (error) return { error: error.message };

  // E-mailnotificatie naar de ontvanger.
  const names = await resolveUserNames(supabase, [user.id]);
  await notifyNewMessage(receiverId, names.get(user.id) ?? "Een gebruiker");

  revalidatePath(`/berichten/${receiverId}`);
  revalidatePath("/berichten");
  return {};
}

/** Markeert alle binnenkomende berichten van een gebruiker als gelezen. */
export async function markConversationRead(otherUserId: string): Promise<void> {
  const user = await getSessionUser();
  if (!user) return;
  const supabase = await createClient();
  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("receiver_id", user.id)
    .eq("sender_id", otherUserId)
    .eq("is_read", false);
}
