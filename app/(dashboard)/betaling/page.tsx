import { PageHeader } from "@/components/dashboard/PageHeader";
import { CheckoutForm } from "@/components/payments/CheckoutForm";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { PRIJSBLOK_PER_DOELGROEP } from "@/lib/constants/pricing";
import { euro, formatDate, cn } from "@/lib/utils";

export const metadata = { title: "Betaling" };

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ betaald?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) return null;

  if (user.role !== "school_nl") {
    return <PageHeader title="Betaling" subtitle="Per-project betaling is alleen voor scholen." />;
  }

  const { betaald } = await searchParams;
  const blok = PRIJSBLOK_PER_DOELGROEP.school;

  // Eerdere betalingen tonen.
  const supabase = await createClient();
  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader
        title="Betaling"
        subtitle="Betaal per geplaatst project. Inclusief contract template en ratio calculator. Betalen via iDEAL met factuur."
      />

      {betaald && (
        <div className="mb-6 rounded-xl bg-green-50 p-4 text-sm text-green-700">
          Bedankt voor je betaling! Je ontvangt een factuur per e-mail.
        </div>
      )}

      <div className="max-w-md">
        <div className="flex flex-col rounded-2xl border border-piste-300 bg-white p-6 shadow-sm ring-1 ring-piste-200">
          <h3 className="font-display text-lg font-bold text-alpine-900">{blok.naam}</h3>
          <p className="mt-2">
            <span className="font-display text-3xl font-extrabold text-alpine-900">
              {blok.prijs}
            </span>
            <span className="ml-2 text-sm text-alpine-600">{blok.eenheid}</span>
          </p>
          <ul className="mt-4 flex-1 space-y-2">
            {blok.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-alpine-800">
                <span className="mt-0.5 text-piste-500">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <CheckoutForm label={`Betaal ${blok.prijs}`} />
          </div>
        </div>
      </div>

      {(payments?.length ?? 0) > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-alpine-500">
            Betaalgeschiedenis
          </h2>
          <ul className="space-y-2">
            {(payments ?? []).map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-xl border border-alpine-100 bg-white p-4 text-sm shadow-sm"
              >
                <span className="text-alpine-800">{p.description}</span>
                <span className="flex items-center gap-3 text-alpine-600">
                  {euro(Number(p.amount))}
                  <StatusBadge status={p.status} />
                  <span className="text-xs text-alpine-400">{formatDate(p.created_at)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-green-50 text-green-700",
    pending: "bg-alpine-100 text-alpine-700",
    open: "bg-alpine-100 text-alpine-700",
    failed: "bg-red-50 text-red-700",
    expired: "bg-alpine-50 text-alpine-500",
    canceled: "bg-alpine-50 text-alpine-500",
  };
  const labels: Record<string, string> = {
    paid: "Betaald",
    pending: "In behandeling",
    open: "Open",
    failed: "Mislukt",
    expired: "Verlopen",
    canceled: "Geannuleerd",
  };
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", map[status] ?? "bg-alpine-50")}>
      {labels[status] ?? status}
    </span>
  );
}
