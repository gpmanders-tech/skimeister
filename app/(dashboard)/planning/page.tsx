import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ExportButton, type ExportRow } from "@/components/planning/ExportButton";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { isOrgRole } from "@/lib/auth/roles";
import { getResortById } from "@/lib/constants/resorts";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/lib/types";

export const metadata = { title: "Planning" };

const MONTHS_NL = ["jan","feb","mrt","apr","mei","jun","jul","aug","sep","okt","nov","dec"];
const STATUS_DOT: Record<string, string> = {
  open: "bg-green-500",
  draft: "bg-alpine-300",
  closed: "bg-piste-500",
  completed: "bg-alpine-400",
};
const STATUS_LABEL: Record<string, string> = {
  open: "Open", draft: "Concept", closed: "Gesloten", completed: "Afgerond",
};

export default async function PlanningPage() {
  const user = await getSessionUser();
  if (!user) return null;
  if (!isOrgRole(user.role)) {
    return <PageHeader title="Planning" subtitle="Alleen voor organisaties." />;
  }

  const supabase = await createClient();
  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("user_id", user.id)
    .single();

  let projects: Project[] = [];
  const selectedByProject = new Map<string, number>();
  if (org) {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("organization_id", org.id)
      .order("start_date", { ascending: true });
    projects = (data ?? []) as Project[];

    if (projects.length) {
      const { data: apps } = await supabase
        .from("project_applications")
        .select("project_id, status")
        .in("project_id", projects.map((p) => p.id))
        .eq("status", "selected");
      for (const a of apps ?? []) {
        selectedByProject.set(a.project_id, (selectedByProject.get(a.project_id) ?? 0) + 1);
      }
    }
  }

  // Groeperen per maand (op startdatum).
  const groups = new Map<string, Project[]>();
  const noDate: Project[] = [];
  for (const p of projects) {
    if (!p.start_date) { noDate.push(p); continue; }
    const d = new Date(p.start_date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const arr = groups.get(key) ?? [];
    arr.push(p);
    groups.set(key, arr);
  }
  const sortedKeys = [...groups.keys()].sort();

  const exportRows: ExportRow[] = projects.map((p) => ({
    name: p.name,
    resort: p.resort_id ? getResortById(p.resort_id)?.name ?? "" : "",
    start: p.start_date ?? "",
    end: p.end_date ?? "",
    status: STATUS_LABEL[p.status] ?? p.status,
    needed: p.instructors_needed ?? "",
    selected: selectedByProject.get(p.id) ?? 0,
  }));

  return (
    <>
      <PageHeader
        title="Planning"
        subtitle="Al je projecten op een tijdlijn."
        action={<ExportButton rows={exportRows} />}
      />

      <div className="mb-6 flex flex-wrap gap-4 text-xs text-alpine-600">
        {Object.entries(STATUS_LABEL).map(([k, label]) => (
          <span key={k} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[k]}`} /> {label}
          </span>
        ))}
      </div>

      {projects.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-alpine-200 bg-white p-10 text-center text-sm text-alpine-500">
          Nog geen projecten. <Link href="/projecten/nieuw" className="text-piste-600 hover:underline">Maak je eerste project</Link>.
        </p>
      ) : (
        <div className="space-y-8">
          {sortedKeys.map((key) => {
            const [y, m] = key.split("-");
            return (
              <div key={key}>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-alpine-500">
                  {MONTHS_NL[Number(m) - 1]} {y}
                </h2>
                <div className="space-y-2 border-l-2 border-alpine-100 pl-4">
                  {groups.get(key)!.map((p) => (
                    <ProjectChip key={p.id} p={p} selected={selectedByProject.get(p.id) ?? 0} />
                  ))}
                </div>
              </div>
            );
          })}
          {noDate.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-alpine-500">
                Zonder datum
              </h2>
              <div className="space-y-2 border-l-2 border-alpine-100 pl-4">
                {noDate.map((p) => (
                  <ProjectChip key={p.id} p={p} selected={selectedByProject.get(p.id) ?? 0} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function ProjectChip({ p, selected }: { p: Project; selected: number }) {
  const needed = p.instructors_needed ?? 0;
  const remaining = Math.max(0, needed - selected);
  return (
    <Link
      href={`/projecten/${p.id}`}
      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-alpine-100 bg-white p-4 shadow-sm hover:shadow-md"
    >
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[p.status]}`} />
        <span className="font-medium text-alpine-900">{p.name}</span>
        <span className="text-xs text-alpine-500">
          {p.resort_id ? getResortById(p.resort_id)?.name : ""}
          {p.start_date && ` · ${formatDate(p.start_date)}`}
        </span>
      </div>
      <span className="text-xs text-alpine-600">
        {needed > 0
          ? remaining > 0
            ? `nog ${remaining} van ${needed} nodig`
            : `compleet (${needed})`
          : "—"}
      </span>
    </Link>
  );
}
