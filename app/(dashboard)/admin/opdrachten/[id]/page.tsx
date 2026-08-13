import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { OpdrachtForm, type OpdrachtFormWaarden } from "@/components/admin/OpdrachtForm";
import { ReactieBeheer, type Reactie } from "@/components/admin/ReactieBeheer";
import { setOpdrachtStatusAction, deleteOpdrachtAction } from "@/lib/admin/opdrachten";
import { createServiceClient } from "@/lib/supabase/server";
import { OPDRACHT_STATUS_LABELS, type ReactieStatus } from "@/lib/constants/options";
import { badgeGeldig } from "@/lib/documents/status";

export const metadata = { title: "Opdracht — admin" };
export const dynamic = "force-dynamic";

interface ProfielRij {
  id: string;
  first_name: string | null;
  last_name: string | null;
  city: string | null;
  years_experience: number | null;
  certifications: { cert_id?: string }[] | null;
  vog_verified: boolean;
  vog_expiry: string | null;
  ehbo_verified: boolean;
  ehbo_expiry: string | null;
  user: { email: string } | null;
}

/** Zoals de join uit Supabase terugkomt, vóór het platslaan naar Reactie. */
interface RuweReactie {
  id: string;
  status: ReactieStatus;
  motivation: string | null;
  admin_notes: string | null;
  created_at: string;
  instructor: ProfielRij | null;
}

export default async function AdminOpdrachtPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = createServiceClient();

  const { data: opdracht } = await service
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!opdracht) notFound();

  const { data: rijen } = await service
    .from("project_applications")
    .select(
      "id, status, motivation, admin_notes, created_at, instructor:instructor_profiles(id, first_name, last_name, city, years_experience, certifications, vog_verified, vog_expiry, ehbo_verified, ehbo_expiry, user:users(email))",
    )
    .eq("project_id", id)
    .order("created_at", { ascending: false });

  const reacties: Reactie[] = ((rijen ?? []) as unknown as RuweReactie[]).map((r) => {
    const p = r.instructor;
    const naam = [p?.first_name, p?.last_name].filter(Boolean).join(" ");
    return {
      id: r.id,
      status: r.status,
      motivation: r.motivation,
      admin_notes: r.admin_notes,
      created_at: r.created_at,
      instructeur: p
        ? {
            id: p.id,
            naam: naam || "Naam nog niet ingevuld",
            email: p.user?.email ?? null,
            city: p.city,
            years_experience: p.years_experience,
            certificeringen: (p.certifications ?? [])
              .map((c) => c.cert_id)
              .filter((c): c is string => Boolean(c)),
            // Badge alleen bij een goedgekeurd én geldig document.
            vog_verified: badgeGeldig(p.vog_verified, p.vog_expiry),
            ehbo_verified: badgeGeldig(p.ehbo_verified, p.ehbo_expiry),
          }
        : null,
    };
  });

  const waarden = opdracht as OpdrachtFormWaarden;
  const status = (opdracht.status as string) ?? "draft";

  return (
    <>
      <PageHeader
        title={opdracht.name as string}
        subtitle={`Status: ${OPDRACHT_STATUS_LABELS[status] ?? status} · ${reacties.length} ${reacties.length === 1 ? "reactie" : "reacties"}`}
        action={
          status === "open" ? (
            <Link
              href={`/opdrachten/${id}`}
              className="rounded-xl border border-alpine-200 px-4 py-2 text-sm font-medium text-alpine-800 hover:bg-alpine-50"
            >
              Bekijk publieke pagina →
            </Link>
          ) : null
        }
      />

      {/* ── Statusknoppen ──────────────────────────────────────────────── */}
      <div className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-alpine-100 bg-white p-4 shadow-sm">
        {(["open", "closed", "completed", "draft"] as const)
          .filter((s) => s !== status)
          .map((s) => (
            <form key={s} action={setOpdrachtStatusAction}>
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="status" value={s} />
              <button
                type="submit"
                className="rounded-xl border border-alpine-200 px-4 py-2 text-sm font-medium text-alpine-800 hover:bg-alpine-50"
              >
                {s === "open"
                  ? "Publiceren"
                  : s === "closed"
                    ? "Sluiten"
                    : s === "completed"
                      ? "Afronden"
                      : "Terug naar concept"}
              </button>
            </form>
          ))}

        {/* Verwijderen zit achter een extra klik: het haalt ook alle reacties weg. */}
        <details className="ml-auto">
          <summary className="cursor-pointer list-none rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50">
            Verwijderen
          </summary>
          <form action={deleteOpdrachtAction} className="mt-2 rounded-xl bg-red-50 p-3">
            <input type="hidden" name="id" value={id} />
            <p className="mb-2 text-sm text-red-800">
              Dit verwijdert de opdracht én alle {reacties.length} reacties. Niet
              terug te draaien.
            </p>
            <button
              type="submit"
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Ja, definitief verwijderen
            </button>
          </form>
        </details>
      </div>

      {/* ── Reacties ───────────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="mb-4 font-display text-xl font-bold text-alpine-900">
          Reacties ({reacties.length})
        </h2>
        <ReactieBeheer reacties={reacties} opdrachtId={id} />
      </section>

      {/* ── Bewerken ───────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 font-display text-xl font-bold text-alpine-900">
          Opdracht bewerken
        </h2>
        <OpdrachtForm waarden={{ ...waarden, id }} />
      </section>
    </>
  );
}
