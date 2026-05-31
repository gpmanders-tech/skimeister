import { PageHeader } from "@/components/dashboard/PageHeader";
import { CheckoutForm } from "@/components/payments/CheckoutForm";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { isOrgRole } from "@/lib/auth/roles";
import { PLANS_BY_AUDIENCE, type Plan } from "@/lib/constants/pricing";
import { euro, formatDate, cn } from "@/lib/utils";

export const metadata = { title: "Abonnement" };

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ betaald?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) return null;

  if (user.role !== "school_ski" && user.role !== "travel_org") {
    return (
      <PageHeader
        title="Abonnement"
        subtitle={
          user.role === "school_nl"
            ? "Scholen betalen per project — zie Betaling."
            : "Geen abonnement nodig voor dit account."
        }
      />
    );
  }

  const { betaald } = await searchParams;
  const supabase = await createClient();
  const { data: org } = await supabase
    .from("organizations")
    .select("subscription_status, subscription_tier, subscription_end_date")
    .eq("user_id", user.id)
    .single();

  const audience = user.role === "school_ski" ? "skischool" : "reisorganisatie";
  const plans = PLANS_BY_AUDIENCE[audience];
  const active = org?.subscription_status === "active";

  return (
    <>
      <PageHeader
        title="Abonnement"
        subtitle="Kies of beheer je abonnement. Betalen gaat veilig via iDEAL; je ontvangt een factuur."
      />

      {betaald && (
        <div className="mb-6 rounded-xl bg-green-50 p-4 text-sm text-green-700">
          Bedankt! Zodra je betaling is verwerkt, wordt je abonnement actief.
        </div>
      )}

      {active && (
        <div className="mb-6 rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-alpine-700">
            Huidig abonnement:{" "}
            <span className="font-medium text-alpine-900">{org?.subscription_tier}</span>
            {org?.subscription_end_date && (
              <> · loopt t/m {formatDate(org.subscription_end_date)}</>
            )}
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border bg-white p-6 shadow-sm",
        plan.highlight ? "border-piste-300 ring-1 ring-piste-200" : "border-alpine-100",
      )}
    >
      <h3 className="font-display text-lg font-bold text-alpine-900">{plan.name}</h3>
      <p className="mt-2 text-sm text-alpine-600">
        {euro(plan.priceMonthly!)}/maand of {euro(plan.priceYearly!)}/jaar
      </p>
      <ul className="mt-4 flex-1 space-y-2">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-alpine-800">
            <span className="mt-0.5 text-piste-500">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-6 space-y-2">
        <CheckoutForm
          kind="subscription"
          planId={plan.id}
          interval="month"
          label={`Maandelijks — ${euro(plan.priceMonthly!)}`}
        />
        <CheckoutForm
          kind="subscription"
          planId={plan.id}
          interval="year"
          label={`Jaarlijks — ${euro(plan.priceYearly!)}`}
          variant="outline"
        />
      </div>
    </div>
  );
}
