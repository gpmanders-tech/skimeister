import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/client";
import { emailTemplates } from "@/lib/email/templates";
import { ROLE_LABELS, type Role } from "@/lib/constants/options";

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

export interface SignupCopy {
  roleLabel: string;
  email: string;
  phone: string;
  naam: string;
  ip?: string;
}

/**
 * Stuurt de beheerder een kopie van de volledige aanmelding: alles wat de
 * bezoeker heeft ingevuld, niet alleen een seintje dat er iemand was.
 * Valt terug op het vaste beheeradres als ADMIN_EMAIL niet (goed) is gezet.
 */
export async function notifyAdminSignupCopy(copy: SignupCopy): Promise<void> {
  const to = (process.env.ADMIN_EMAIL || "gpmanders@gmail.com").trim();
  if (!to) return;
  await sendEmail({ to, ...emailTemplates.signupCopy(copy) });
}

/**
 * Beheerder krijgt bericht bij élke reactie op een opdracht, ongeacht wie de
 * opdracht heeft geplaatst. Tijdens de pilot wil je dit zelf volgen.
 */
export async function notifyAdminNewReaction(c: {
  opdrachtNaam: string;
  opdrachtId: string;
  instructeur: string;
  bericht: string | null;
}) {
  const to = (process.env.ADMIN_EMAIL || "gpmanders@gmail.com").trim();
  if (!to) return;
  await sendEmail({ to, ...emailTemplates.adminNieuweReactie(c) });
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

export interface OpdrachtMatch {
  name: string;
  resortName: string;
  resort_id: string | null;
  start_date: string | null;
  end_date: string | null;
}

/**
 * Mailt instructeurs bij een nieuwe opdracht die past. Een match is:
 *   - het skigebied staat in hun voorkeursgebieden, OF
 *   - ze hebben zich beschikbaar gemeld in een week die overlapt.
 *
 * Bewust géén filter op goedgekeurd of actief: goedkeuring bepaalt of je
 * publiek zichtbaar bent, niet of je van passend werk mag horen. Anders
 * krijgt een net aangemelde instructeur nooit iets te zien.
 */
export async function notifyMatchingInstructors(opdracht: OpdrachtMatch) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  const service = createServiceClient();
  const adressen = new Set<string>();

  // ── Match op skigebied ───────────────────────────────────────────────────
  if (opdracht.resort_id) {
    const { data } = await service
      .from("instructor_profiles")
      .select("user:users(email)")
      .contains("preferred_resorts", [opdracht.resort_id])
      .limit(500);

    for (const row of data ?? []) {
      const email = (row.user as { email?: string } | null)?.email;
      if (email) adressen.add(email);
    }
  }

  // ── Match op periode ─────────────────────────────────────────────────────
  if (opdracht.start_date && opdracht.end_date) {
    const { data: weken } = await service
      .from("availability")
      .select("instructor_id")
      .eq("is_available", true)
      .lte("week_start", opdracht.end_date)
      .gte("week_end", opdracht.start_date)
      .limit(1000);

    const rijen = (weken ?? []) as { instructor_id: string }[];
    const ids = [...new Set(rijen.map((w) => w.instructor_id))];
    if (ids.length > 0) {
      const { data } = await service
        .from("instructor_profiles")
        .select("user:users(email)")
        .in("id", ids)
        .limit(500);

      for (const row of data ?? []) {
        const email = (row.user as { email?: string } | null)?.email;
        if (email) adressen.add(email);
      }
    }
  }

  const t = emailTemplates.newRelevantProject(opdracht.name, opdracht.resortName);
  for (const email of adressen) {
    await sendEmail({ to: email, ...t });
  }
}
