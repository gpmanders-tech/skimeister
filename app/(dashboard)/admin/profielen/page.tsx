import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { setProfileApprovalAction } from "@/lib/admin/actions";
import { createClient } from "@/lib/supabase/server";
import type { InstructorProfile } from "@/lib/types";

export const metadata = { title: "Profielen — admin" };

export default async function AdminProfilesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("instructor_profiles")
    .select("*")
    .order("is_approved", { ascending: true })
    .order("created_at", { ascending: false });
  const profiles = (data ?? []) as InstructorProfile[];

  const pending = profiles.filter((p) => !p.is_approved);
  const approved = profiles.filter((p) => p.is_approved);

  return (
    <>
      <PageHeader
        title="Profielen goedkeuren"
        subtitle={`${pending.length} wachten op goedkeuring · ${approved.length} goedgekeurd`}
      />

      <Section title="Wacht op goedkeuring" empty="Geen profielen in afwachting.">
        {pending.map((p) => (
          <ProfileRow key={p.id} p={p} approved={false} />
        ))}
      </Section>

      <div className="mt-8">
        <Section title="Goedgekeurd" empty="Nog geen goedgekeurde profielen.">
          {approved.map((p) => (
            <ProfileRow key={p.id} p={p} approved />
          ))}
        </Section>
      </div>
    </>
  );
}

function Section({
  title,
  empty,
  children,
}: {
  title: string;
  empty: string;
  children: React.ReactNode;
}) {
  const arr = Array.isArray(children) ? children : [children];
  const isEmpty = arr.filter(Boolean).length === 0;
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-alpine-500">
        {title}
      </h2>
      {isEmpty ? (
        <p className="rounded-2xl border border-dashed border-alpine-200 bg-white p-8 text-center text-sm text-alpine-500">
          {empty}
        </p>
      ) : (
        <div className="space-y-2">{children}</div>
      )}
    </div>
  );
}

function ProfileRow({ p, approved }: { p: InstructorProfile; approved: boolean }) {
  const name = [p.first_name, p.last_name].filter(Boolean).join(" ") || "(naam ontbreekt)";
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-alpine-100 bg-white p-4 shadow-sm">
      <div>
        <p className="font-medium text-alpine-900">{name}</p>
        <p className="text-xs text-alpine-500">
          {p.city ?? "—"} · {p.profile_completeness}% compleet ·{" "}
          {p.certifications?.length ?? 0} certificaten
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Link href={`/instructeur/${p.id}`} className="text-sm text-piste-600 hover:underline">
          Bekijken
        </Link>
        <form action={setProfileApprovalAction}>
          <input type="hidden" name="id" value={p.id} />
          <input type="hidden" name="approve" value={approved ? "0" : "1"} />
          <button
            type="submit"
            className={
              approved
                ? "rounded-lg border border-alpine-200 px-3 py-1.5 text-sm text-alpine-700 hover:bg-alpine-50"
                : "rounded-lg bg-piste-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-piste-600"
            }
          >
            {approved ? "Goedkeuring intrekken" : "Goedkeuren"}
          </button>
        </form>
      </div>
    </div>
  );
}
