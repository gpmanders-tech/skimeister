import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { createServiceClient } from "@/lib/supabase/server";
import { getResortById } from "@/lib/constants/resorts";
import { OPDRACHT_STATUS_LABELS } from "@/lib/constants/options";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Opdrachten — admin" };
export const dynamic = "force-dynamic";

interface Rij {
  id: string;
  name: string;
  resort_id: string | null;
  start_date: string | null;
  status: string;
  instructors_needed: number | null;
  organization: { name: string } | null;
}

const STATUS_KLEUR: Record<string, string> = {
  open: "bg-green-50 text-green-700",
  draft: "bg-alpine-50 text-alpine-600",
  closed: "bg-amber-50 text-amber-700",
  completed: "bg-alpine-50 text-alpine-600",
};

export default async function AdminOpdrachtenPage() {
  const service = createServiceClient();

  const { data } = await service
    .from("projects")
    .select(
      "id, name, resort_id, start_date, status, instructors_needed, organization:organizations(name)",
    )
    .order("created_at", { ascending: false })
    .limit(200);
  const opdrachten = (data ?? []) as unknown as Rij[];

  // Reacties per opdracht tellen, in één query.
  const { data: reacties } = await service
    .from("project_applications")
    .select("project_id, status")
    .limit(2000);

  const telling = new Map<string, { totaal: number; nieuw: number }>();
  for (const r of reacties ?? []) {
    const huidig = telling.get(r.project_id) ?? { totaal: 0, nieuw: 0 };
    huidig.totaal += 1;
    if (r.status === "pending") huidig.nieuw += 1;
    telling.set(r.project_id, huidig);
  }

  return (
    <>
      <PageHeader
        title="Opdrachten"
        subtitle={`${opdrachten.length} opdrachten`}
        action={
          <ButtonLink href="/admin/opdrachten/nieuw" variant="accent">
            Nieuwe opdracht
          </ButtonLink>
        }
      />

      {opdrachten.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-alpine-200 bg-white p-10 text-center">
          <p className="text-alpine-800">Nog geen opdrachten geplaatst.</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-alpine-600">
            Plaats je eerste opdracht. Zodra die op open staat, is hij publiek
            zichtbaar op het opdrachtenboard en krijgen instructeurs met een
            passend voorkeursgebied een mail.
          </p>
          <ButtonLink href="/admin/opdrachten/nieuw" variant="accent" className="mt-5">
            Nieuwe opdracht
          </ButtonLink>
        </div>
      ) : (
        <div className="space-y-3">
          {opdrachten.map((o) => {
            const t = telling.get(o.id) ?? { totaal: 0, nieuw: 0 };
            return (
              <Link
                key={o.id}
                href={`/admin/opdrachten/${o.id}`}
                className="block rounded-2xl border border-alpine-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-display text-base font-bold text-alpine-900 sm:text-lg">
                      {o.name}
                    </h2>
                    <p className="mt-0.5 text-sm text-alpine-600">
                      {[
                        o.resort_id ? getResortById(o.resort_id)?.name : "Gebied n.t.b.",
                        o.start_date ? formatDate(o.start_date) : "Datum n.t.b.",
                        o.instructors_needed ? `${o.instructors_needed}× gevraagd` : null,
                        o.organization?.name,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {t.nieuw > 0 ? (
                      <span className="rounded-full bg-piste-500 px-2.5 py-1 text-xs font-semibold text-white">
                        {t.nieuw} nieuw
                      </span>
                    ) : null}
                    <span className="rounded-full bg-alpine-50 px-2.5 py-1 text-xs font-medium text-alpine-700">
                      {t.totaal} {t.totaal === 1 ? "reactie" : "reacties"}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_KLEUR[o.status] ?? "bg-alpine-50 text-alpine-600"}`}
                    >
                      {OPDRACHT_STATUS_LABELS[o.status] ?? o.status}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
