import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/client";
import { emailTemplates } from "@/lib/email/templates";

/** Zoekt het e-mailadres bij een user-id (service role; omzeilt RLS). */
async function emailFor(userId: string): Promise<string | null> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const service = createServiceClient();
  const { data } = await service
    .from("users")
    .select("email")
    .eq("id", userId)
    .maybeSingle();
  return data?.email ?? null;
}

export async function notifyWelcome(email: string, roleLabel: string) {
  const t = emailTemplates.welcome(roleLabel);
  await sendEmail({ to: email, ...t });
}

/** Seintje naar de beheerder bij elke nieuwe registratie. */
export async function notifyAdminNewSignup(roleLabel: string, newEmail: string) {
  // Valt terug op het vaste beheeradres als ADMIN_EMAIL niet (goed) is gezet,
  // zodat de melding altijd verstuurd wordt.
  const to = (process.env.ADMIN_EMAIL || "gpmanders@gmail.com").trim();
  if (!to) return;
  await sendEmail({ to, ...emailTemplates.newSignup(roleLabel, newEmail) });
}

export async function notifyNewMessage(receiverId: string, senderName: string) {
  const to = await emailFor(receiverId);
  if (!to) return;
  await sendEmail({ to, ...emailTemplates.newMessage(senderName) });
}

export async function notifyNewApplication(orgUserId: string, projectName: string) {
  const to = await emailFor(orgUserId);
  if (!to) return;
  await sendEmail({ to, ...emailTemplates.newApplication(projectName) });
}

export async function notifyDecision(
  instructorUserId: string,
  projectName: string,
  decision: "selected" | "rejected",
) {
  const to = await emailFor(instructorUserId);
  if (!to) return;
  const t =
    decision === "selected"
      ? emailTemplates.selected(projectName)
      : emailTemplates.rejected(projectName);
  await sendEmail({ to, ...t });
}

export async function notifyProfileApproved(instructorUserId: string) {
  const to = await emailFor(instructorUserId);
  if (!to) return;
  await sendEmail({ to, ...emailTemplates.profileApproved() });
}

export async function notifyPaymentConfirmed(email: string, description: string) {
  await sendEmail({ to: email, ...emailTemplates.paymentConfirmed(description) });
}

/**
 * Mailt instructeurs van wie het voorkeursgebied matcht met een nieuw
 * gepubliceerd project. Service role: nodig om e-mailadressen op te halen.
 */
export async function notifyMatchingInstructors(
  resortId: string | null,
  projectName: string,
  resortName: string,
) {
  if (!resortId || !process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  const service = createServiceClient();

  const { data } = await service
    .from("instructor_profiles")
    .select("user:users(email)")
    .contains("preferred_resorts", [resortId])
    .eq("is_approved", true)
    .eq("is_active", true)
    .limit(200);

  const t = emailTemplates.newRelevantProject(projectName, resortName);
  for (const row of data ?? []) {
    const email = (row.user as { email?: string } | null)?.email;
    if (email) await sendEmail({ to: email, ...t });
  }
}
