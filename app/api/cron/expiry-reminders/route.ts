import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/client";
import { emailTemplates } from "@/lib/email/templates";

export const dynamic = "force-dynamic";

const DOC_FIELDS = [
  { verified: "vog_verified", expiry: "vog_expiry", label: "VOG" },
  { verified: "ehbo_verified", expiry: "ehbo_expiry", label: "EHBO-certificaat" },
  { verified: "insurance_verified", expiry: "insurance_expiry", label: "verzekering" },
] as const;

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86_400_000);
}

/**
 * Dagelijkse check op verlopende documenten. Beveiligd met CRON_SECRET.
 * Koppel aan een cron (bv. Vercel Cron of een externe scheduler) aan het eind.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Service role niet geconfigureerd" }, { status: 200 });
  }

  const service = createServiceClient();
  const { data } = await service
    .from("instructor_profiles")
    .select(
      "id, vog_verified, vog_expiry, ehbo_verified, ehbo_expiry, insurance_verified, insurance_expiry, user:users(email)",
    );

  let reminders = 0;
  let expired = 0;

  for (const p of data ?? []) {
    const email = (p.user as { email?: string } | null)?.email;
    if (!email) continue;

    for (const f of DOC_FIELDS) {
      const verified = p[f.verified as keyof typeof p];
      const expiry = p[f.expiry as keyof typeof p] as string | null;
      if (!verified || !expiry) continue;

      const days = daysUntil(expiry);

      if (days === 30 || days === 7) {
        await sendEmail({ to: email, ...emailTemplates.documentExpiring(f.label, days) });
        reminders++;
      } else if (days < 0) {
        // Verlopen: badge weghalen + notificatie.
        await service
          .from("instructor_profiles")
          .update({ [f.verified]: false })
          .eq("id", p.id);
        await sendEmail({ to: email, ...emailTemplates.documentExpired(f.label) });
        expired++;
      }
    }
  }

  return NextResponse.json({ ok: true, reminders, expired });
}
