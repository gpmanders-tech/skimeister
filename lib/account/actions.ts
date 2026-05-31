"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";

export interface AccountState {
  error?: string;
  message?: string;
}

/** Wachtwoord wijzigen via Supabase Auth. */
export async function changePasswordAction(
  _prev: AccountState,
  formData: FormData,
): Promise<AccountState> {
  const user = await getSessionUser();
  if (!user) return { error: "Geen toegang." };

  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 8) return { error: "Minimaal 8 tekens." };
  if (password !== confirm) return { error: "De wachtwoorden komen niet overeen." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  return { message: "Je wachtwoord is gewijzigd." };
}

/**
 * Account + alle gekoppelde data verwijderen (GDPR).
 * Verwijdert de auth-user via service role; de public-tabellen cascaden mee.
 */
export async function deleteAccountAction(formData: FormData): Promise<void> {
  const user = await getSessionUser();
  if (!user) return;

  const confirm = String(formData.get("confirm") ?? "");
  if (confirm !== "VERWIJDER") return;

  const supabase = await createClient();
  await supabase.auth.signOut();

  const service = createServiceClient();
  await service.auth.admin.deleteUser(user.id);

  revalidatePath("/", "layout");
  redirect("/?verwijderd=1");
}
