import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { ApplyForm } from "@/components/projects/ApplyForm";
import { setProjectStatusAction } from "@/lib/projects/actions";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { isOrgRole } from "@/lib/auth/roles";
import { getResortById } from "@/lib/constants/resorts";
import { getCertById } from "@/lib/constants/certifications";
import { LANGUAGES, PARTICIPANT_LEVELS, PROJECT_AGE_GROUPS } from "@/lib/constants/options";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/lib/types";

const lbl = (arr: readonly { id: string; label: string }[], id?: string | null) =>
  id ? arr.find((x) => x.id === id)?.label ?? id : "—";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  if (!user) return null;
  const { id } = await params;

  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").eq("id", id).single();
  if (!data) notFound();
  const p = data as Project;

  // Is de viewer de eigenaar?
  let isOwner = false;
  if (isOrgRole(user.role)) {
    const { data: org } = await supabase
      .from("organizations")
      .select("id")
      .eq("user_id", user.id)
      .single();
    isOwner = !!org && org.id === p.organization_id;
  }

  // Aanmeldingen-telling voor eigenaar.
  let applicationCount = 0;
  if (isOwner) {
    const { count } = await supabase
      .from("project_applications")
      .select("id", { count: "exact", head: true })
      .eq("project_id", p.id);
    applicationCount = count ?? 0;
  }

  // User-id van de organisatie (voor het sturen van een bericht).
  const { data: orgOwner } = await supabase
    .from("organizations")
    .select("user_id")
    .eq("id", p.organization_id)
    .maybeSingle();
  const orgUserId = orgOwner?.user_id as string | undefined;

  // Instructeur: bestaande aanmelding ophalen.
  let myApplication: { motivation: string | null; status: string } | null = null;
  if (user.role === "instructor") {
    const { data: profile } = await supabase
      .from("instructor_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (profile) {
      const { data: app } = await supabase
        .from("project_applications")
        .select("motivation, status")
        .eq("project_id", p.id)
        .eq("instructor_id", profile.id)
        .maybeSingle();
      myApplication = app ?? null;
    }
  }

  return (
    <>
      <PageHeader
        title={p.name}
        subtitle={`${p.resort_id ? getResortById(p.resort_id)?.name : "Gebied n.t.b."}${p.start_date ? ` · ${formatDate(p.start_date)}${p.end_date ? ` – ${formatDate(p.end_date)}` : ""}` : ""}`}
        action={
          isOwner ? (
            <Link
              href={`/projecten/${p.id}/aanmeldingen`}
              className="rounded-full bg-piste-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-piste-600"
            >
              Aanmeldingen ({applicationCount})
            </Link>
          ) : undefined
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-6">
          {p.description && (
            <section className="rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm">
              <p className="whitespace-pre-line text-sm text-alpine-700">{p.description}</p>
            </section>
          )}

          <section className="rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm">
            <h3 className="mb-3 font-display text-lg font-bold text-alpine-900">Details</h3>
            <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              <Detail label="Niveau" value={lbl(PARTICIPANT_LEVELS, p.participant_level)} />
              <Detail label="Leeftijdsgroep" value={lbl(PROJECT_AGE_GROUPS, p.age_group)} />
              <Detail label="Deelnemers" value={p.participants_count?.toString() ?? "—"} />
              <Detail label="Instructeurs nodig" value={p.instructors_needed?.toString() ?? "—"} />
              <Detail
                label="Vereiste talen"
                value={p.language_required?.length ? p.language_required.map((l) => lbl(LANGUAGES, l)).join(", ") : "—"}
              />
              <Detail label="Min. certificering" value={p.min_certification ? getCertById(p.min_certification)?.name ?? "—" : "—"} />
              <Detail label="VOG vereist" value={p.vog_required ? "Ja" : "Nee"} />
              <Detail label="EHBO vereist" value={p.ehbo_required ? "Ja" : "Nee"} />
              <Detail label="Deadline" value={p.deadline ? formatDate(p.deadline) : "—"} />
              <Detail label="Vergoeding" value={p.compensation ?? "—"} />
            </dl>
          </section>

          {user.role === "instructor" && p.status === "open" && (
            <ApplyForm
              projectId={p.id}
              existingMotivation={myApplication?.motivation}
              status={myApplication?.status}
            />
          )}

          {user.role === "instructor" && orgUserId && (
            <Link
              href={`/berichten/${orgUserId}`}
              className="inline-block text-sm font-medium text-piste-600 hover:underline"
            >
              Stuur een bericht aan de organisator →
            </Link>
          )}

          {isOwner && (
            <details className="rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm">
              <summary className="cursor-pointer font-display text-lg font-bold text-alpine-900">
                Project bewerken
              </summary>
              <div className="mt-4">
                <ProjectForm project={p} />
              </div>
            </details>
          )}
        </div>

        <aside className="space-y-4">
          {isOwner && (
            <section className="rounded-2xl border border-alpine-100 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-alpine-800">Status</h3>
              <p className="mb-3 text-sm text-alpine-600">Huidig: {p.status}</p>
              <div className="flex flex-wrap gap-2">
                {(["open", "closed", "completed"] as const)
                  .filter((s) => s !== p.status)
                  .map((s) => (
                    <form key={s} action={setProjectStatusAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="status" value={s} />
                      <button
                        type="submit"
                        className="rounded-lg border border-alpine-200 px-3 py-1.5 text-sm font-medium text-alpine-700 hover:bg-alpine-50"
                      >
                        Markeer als {s}
                      </button>
                    </form>
                  ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-alpine-50 py-1.5">
      <dt className="text-xs text-alpine-500">{label}</dt>
      <dd className="text-sm text-alpine-800">{value}</dd>
    </div>
  );
}
