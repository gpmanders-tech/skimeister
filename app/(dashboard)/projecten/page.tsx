import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { isOrgRole } from "@/lib/auth/roles";
import { getResortById } from "@/lib/constants/resorts";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/lib/types";

export const metadata = { title: "Projecten" };

const STATUS_LABELS: Record<string, string> = {
  draft: "Concept",
  open: "Open",
  closed: "Gesloten",
  completed: "Afgerond",
};
const STATUS_COLORS: Record<string, string> = {
  draft: "bg-alpine-100 text-alpine-700",
  open: "bg-green-50 text-green-700",
  closed: "bg-piste-100 text-piste-700",
  completed: "bg-alpine-50 text-alpine-500",
};

export default async function ProjectsPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const supabase = await createClient();
  const org = isOrgRole(user.role);

  let projects: Project[] = [];
  if (org) {
    const { data: o } = await supabase
      .from("organizations")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (o) {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("organization_id", o.id)
        .order("created_at", { ascending: false });
      projects = (data ?? []) as Project[];
    }
  } else {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "open")
      .order("start_date", { ascending: true });
    projects = (data ?? []) as Project[];
  }

  return (
    <>
      <PageHeader
        title="Projecten"
        subtitle={org ? "Jouw projecten." : "Openstaande projecten waarop je je kunt aanmelden."}
        action={
          org ? (
            <Link
              href="/projecten/nieuw"
              className="rounded-full bg-piste-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-piste-600"
            >
              Nieuw project
            </Link>
          ) : undefined
        }
      />

      {projects.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-alpine-200 bg-white p-10 text-center text-sm text-alpine-500">
          {org ? "Je hebt nog geen projecten aangemaakt." : "Er zijn momenteel geen open projecten."}
        </p>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/projecten/${p.id}`}
              className="block rounded-xl border border-alpine-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-semibold text-alpine-900">{p.name}</h3>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[p.status]}`}>
                  {STATUS_LABELS[p.status]}
                </span>
              </div>
              <p className="mt-1 text-sm text-alpine-600">
                {p.resort_id ? getResortById(p.resort_id)?.name : "Gebied n.t.b."}
                {p.start_date && ` · ${formatDate(p.start_date)}`}
                {p.instructors_needed ? ` · ${p.instructors_needed} instructeur(s) nodig` : ""}
              </p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
