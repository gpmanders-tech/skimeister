import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { decideApplicationAction } from "@/lib/projects/actions";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { isOrgRole } from "@/lib/auth/roles";
import type { InstructorProfile, Project } from "@/lib/types";

export const metadata = { title: "Aanmeldingen" };

interface AppRow {
  id: string;
  motivation: string | null;
  status: string;
  instructor: InstructorProfile | null;
}

const STATUS: Record<string, string> = {
  pending: "In behandeling",
  selected: "Geselecteerd",
  rejected: "Afgewezen",
  withdrawn: "Ingetrokken",
};

export default async function ApplicationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  if (!user || !isOrgRole(user.role)) {
    return <PageHeader title="Aanmeldingen" subtitle="Geen toegang." />;
  }
  const { id } = await params;

  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
  if (!project) notFound();
  const p = project as Project;

  const { data } = await supabase
    .from("project_applications")
    .select("id, motivation, status, instructor:instructor_profiles(*)")
    .eq("project_id", id)
    .order("created_at", { ascending: true });
  const apps = (data ?? []) as unknown as AppRow[];

  return (
    <>
      <PageHeader
        title="Aanmeldingen"
        subtitle={p.name}
        action={
          <Link href={`/projecten/${id}`} className="text-sm font-medium text-piste-600 hover:underline">
            ← Naar project
          </Link>
        }
      />

      {apps.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-alpine-200 bg-white p-10 text-center text-sm text-alpine-500">
          Nog geen aanmeldingen voor dit project.
        </p>
      ) : (
        <div className="space-y-4">
          {apps.map((a) => {
            const inst = a.instructor;
            const name = inst
              ? [inst.first_name, inst.last_name].filter(Boolean).join(" ") || "Instructeur"
              : "Onbekend";
            return (
              <div key={a.id} className="rounded-xl border border-alpine-100 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    {inst ? (
                      <Link href={`/instructeur/${inst.id}`} className="font-semibold text-alpine-900 hover:text-piste-600">
                        {name}
                      </Link>
                    ) : (
                      <span className="font-semibold text-alpine-900">{name}</span>
                    )}
                    <p className="text-xs text-alpine-500">{inst?.city ?? ""}</p>
                    {inst && (
                      <Link
                        href={`/berichten/${inst.user_id}`}
                        className="text-xs font-medium text-piste-600 hover:underline"
                      >
                        Stuur bericht
                      </Link>
                    )}
                  </div>
                  <span className="rounded-full bg-alpine-50 px-2.5 py-0.5 text-xs font-medium text-alpine-700">
                    {STATUS[a.status] ?? a.status}
                  </span>
                </div>
                {a.motivation && (
                  <p className="mt-3 whitespace-pre-line text-sm text-alpine-700">{a.motivation}</p>
                )}
                {(a.status === "pending") && (
                  <div className="mt-4 flex gap-2">
                    <form action={decideApplicationAction}>
                      <input type="hidden" name="id" value={a.id} />
                      <input type="hidden" name="project_id" value={id} />
                      <input type="hidden" name="decision" value="selected" />
                      <button type="submit" className="rounded-lg bg-piste-500 px-4 py-2 text-sm font-medium text-white hover:bg-piste-600">
                        Selecteren
                      </button>
                    </form>
                    <form action={decideApplicationAction}>
                      <input type="hidden" name="id" value={a.id} />
                      <input type="hidden" name="project_id" value={id} />
                      <input type="hidden" name="decision" value="rejected" />
                      <button type="submit" className="rounded-lg border border-alpine-200 px-4 py-2 text-sm font-medium text-alpine-700 hover:bg-alpine-50">
                        Afwijzen
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
