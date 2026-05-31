import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { createServiceClient } from "@/lib/supabase/server";
import { getResortById } from "@/lib/constants/resorts";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Projecten — admin" };

const STATUS_LABEL: Record<string, string> = {
  draft: "Concept", open: "Open", closed: "Gesloten", completed: "Afgerond",
};

interface Row {
  id: string;
  name: string;
  resort_id: string | null;
  start_date: string | null;
  status: string;
  organization: { name: string } | null;
}

export default async function AdminProjectsPage() {
  const service = createServiceClient();
  const { data } = await service
    .from("projects")
    .select("id, name, resort_id, start_date, status, organization:organizations(name)")
    .order("created_at", { ascending: false })
    .limit(500);
  const projects = (data ?? []) as unknown as Row[];

  return (
    <>
      <PageHeader title="Projecten" subtitle={`${projects.length} projecten`} />

      {projects.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-alpine-200 bg-white p-10 text-center text-sm text-alpine-500">
          Nog geen projecten.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-alpine-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-alpine-50 text-left text-xs uppercase tracking-wide text-alpine-500">
              <tr>
                <th className="p-3">Project</th>
                <th className="p-3">Organisatie</th>
                <th className="p-3">Gebied</th>
                <th className="p-3">Start</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-alpine-50">
              {projects.map((p) => (
                <tr key={p.id}>
                  <td className="p-3">
                    <Link href={`/projecten/${p.id}`} className="font-medium text-alpine-900 hover:text-piste-600">
                      {p.name}
                    </Link>
                  </td>
                  <td className="p-3 text-alpine-700">{p.organization?.name ?? "—"}</td>
                  <td className="p-3 text-alpine-600">
                    {p.resort_id ? getResortById(p.resort_id)?.name : "—"}
                  </td>
                  <td className="p-3 text-alpine-500">{p.start_date ? formatDate(p.start_date) : "—"}</td>
                  <td className="p-3">
                    <span className="rounded-full bg-alpine-50 px-2 py-0.5 text-xs font-medium text-alpine-700">
                      {STATUS_LABEL[p.status] ?? p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
