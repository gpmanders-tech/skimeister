import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { withdrawApplicationAction } from "@/lib/projects/actions";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { getResortById } from "@/lib/constants/resorts";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/lib/types";

export const metadata = { title: "Mijn aanmeldingen" };

interface MyApp {
  id: string;
  status: string;
  created_at: string;
  project: Project | null;
}

const STATUS: Record<string, { label: string; color: string }> = {
  pending: { label: "In behandeling", color: "bg-alpine-100 text-alpine-700" },
  selected: { label: "Geselecteerd 🎉", color: "bg-green-50 text-green-700" },
  rejected: { label: "Afgewezen", color: "bg-piste-100 text-piste-700" },
  withdrawn: { label: "Ingetrokken", color: "bg-alpine-50 text-alpine-500" },
};

export default async function MyApplicationsPage() {
  const user = await getSessionUser();
  if (!user) return null;
  if (user.role !== "instructor") {
    return <PageHeader title="Mijn aanmeldingen" subtitle="Alleen voor instructeurs." />;
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("instructor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  let apps: MyApp[] = [];
  if (profile) {
    const { data } = await supabase
      .from("project_applications")
      .select("id, status, created_at, project:projects(*)")
      .eq("instructor_id", profile.id)
      .order("created_at", { ascending: false });
    apps = (data ?? []) as unknown as MyApp[];
  }

  return (
    <>
      <PageHeader
        title="Mijn aanmeldingen"
        subtitle="De projecten waarop je je hebt aangemeld."
      />

      {apps.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-alpine-200 bg-white p-10 text-center text-sm text-alpine-500">
          Je hebt je nog niet aangemeld op projecten.{" "}
          <Link href="/projecten" className="text-piste-600 hover:underline">
            Bekijk open projecten
          </Link>
          .
        </p>
      ) : (
        <div className="space-y-3">
          {apps.map((a) => {
            const p = a.project;
            const st = STATUS[a.status] ?? { label: a.status, color: "bg-alpine-50" };
            return (
              <div
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-alpine-100 bg-white p-5 shadow-sm"
              >
                <div>
                  {p ? (
                    <Link href={`/projecten/${p.id}`} className="font-medium text-alpine-900 hover:text-piste-600">
                      {p.name}
                    </Link>
                  ) : (
                    <span className="font-medium text-alpine-900">Project</span>
                  )}
                  <p className="text-xs text-alpine-500">
                    {p?.resort_id ? getResortById(p.resort_id)?.name : ""}
                    {p?.start_date ? ` · ${formatDate(p.start_date)}` : ""}
                    {` · aangemeld ${formatDate(a.created_at)}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${st.color}`}>
                    {st.label}
                  </span>
                  {a.status === "pending" && (
                    <form action={withdrawApplicationAction}>
                      <input type="hidden" name="id" value={a.id} />
                      <button type="submit" className="text-sm text-alpine-500 hover:text-red-600">
                        Intrekken
                      </button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
