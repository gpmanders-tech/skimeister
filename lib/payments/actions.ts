"use server";

import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { isOrgRole } from "@/lib/auth/roles";
import { getMollie, siteUrl } from "@/lib/mollie/client";
import { PLANS } from "@/lib/constants/pricing";

export interface CheckoutState {
  error?: string;
}

function money(n: number): string {
  return n.toFixed(2);
}

function addPeriod(interval: "month" | "year" | "once"): string | null {
  const d = new Date();
  if (interval === "month") d.setMonth(d.getMonth() + 1);
  else if (interval === "year") d.setFullYear(d.getFullYear() + 1);
  else return null;
  return d.toISOString().slice(0, 10);
}

/** Start een Mollie-checkout voor een abonnement (skischool/reisorg). */
export async function startSubscriptionCheckout(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const user = await getSessionUser();
  if (!user || !isOrgRole(user.role)) return { error: "Geen toegang." };

  const planId = String(formData.get("plan_id") ?? "");
  const interval = formData.get("interval") === "year" ? "year" : "month";
  const plan = PLANS.find((p) => p.id === planId);
  if (!plan || plan.priceMonthly == null) return { error: "Onbekend abonnement." };

  const amount = interval === "year" ? plan.priceYearly! : plan.priceMonthly;
  return createMolliePayment({
    userId: user.id,
    kind: "subscription",
    planId: plan.id,
    description: `Skimeister ${plan.name} (${interval === "year" ? "jaar" : "maand"})`,
    amount,
    interval,
    redirectPath: "/abonnement?betaald=1",
  });
}

/** Start een Mollie-checkout voor een eenmalige projectbetaling (school). */
export async function startProjectCheckout(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const user = await getSessionUser();
  if (!user || user.role !== "school_nl") return { error: "Geen toegang." };

  const planId = String(formData.get("plan_id") ?? "school_project");
  const plan = PLANS.find((p) => p.id === planId && p.audience === "school");
  if (!plan || plan.priceOneOff == null) return { error: "Onbekend product." };

  return createMolliePayment({
    userId: user.id,
    kind: "project",
    planId: plan.id,
    description: `Skimeister ${plan.name}`,
    amount: plan.priceOneOff,
    interval: "once",
    redirectPath: "/betaling?betaald=1",
  });
}

async function createMolliePayment(opts: {
  userId: string;
  kind: "subscription" | "project";
  planId: string;
  description: string;
  amount: number;
  interval: "month" | "year" | "once";
  redirectPath: string;
}): Promise<CheckoutState> {
  const mollie = getMollie();
  if (!mollie) {
    return { error: "Betalen is nog niet geconfigureerd (Mollie-key ontbreekt)." };
  }

  const supabase = await createClient();
  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("user_id", opts.userId)
    .single();

  // Payment-record vooraf aanmaken (service role; RLS staat schrijven niet toe).
  const service = createServiceClient();
  const { data: payment, error } = await service
    .from("payments")
    .insert({
      user_id: opts.userId,
      organization_id: org?.id ?? null,
      kind: opts.kind,
      plan_id: opts.planId,
      description: opts.description,
      amount: opts.amount,
      interval: opts.interval,
      period_end: addPeriod(opts.interval),
      status: "open",
    })
    .select("id")
    .single();
  if (error || !payment) return { error: "Kon betaling niet aanmaken." };

  let checkoutUrl: string | undefined;
  try {
    const mopay = await mollie.payments.create({
      amount: { currency: "EUR", value: money(opts.amount) },
      description: opts.description,
      redirectUrl: `${siteUrl()}${opts.redirectPath}`,
      webhookUrl: `${siteUrl()}/api/webhooks/mollie`,
      metadata: { paymentId: payment.id },
    });
    await service
      .from("payments")
      .update({ mollie_payment_id: mopay.id, status: "pending" })
      .eq("id", payment.id);
    checkoutUrl = mopay.getCheckoutUrl() ?? undefined;
  } catch (e) {
    return { error: `Mollie-fout: ${(e as Error).message}` };
  }

  if (!checkoutUrl) return { error: "Geen betaallink ontvangen van Mollie." };
  redirect(checkoutUrl);
}
