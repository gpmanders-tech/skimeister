import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Stars } from "@/components/reviews/Stars";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { isOrgRole } from "@/lib/auth/roles";
import { getCertById } from "@/lib/constants/certifications";
import { getResortById } from "@/lib/constants/resorts";
import { SPECIALIZATIONS, LANGUAGES, AGE_GROUPS } from "@/lib/constants/options";
import { euro } from "@/lib/utils";
import { badgeGeldig } from "@/lib/documents/status";
import type { InstructorProfile } from "@/lib/types";

export const metadata = { title: "Vergelijken" };

const lbl = (arr: readonly { id: string; label: string }[], id: string) =>
  arr.find((x) => x.id === id)?.label ?? id;

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) return null;
  if (!isOrgRole(user.role)) {
    return <PageHeader title="Vergelijken" subtitle="Alleen voor organisaties." />;
  }

  const { ids } = await searchParams;
  const idList = (ids ?? "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4);

  if (idList.length === 0) {
    return (
      <>
        <PageHeader title="Instructeurs vergelijken" />
        <p className="rounded-2xl border border-dashed border-alpine-200 bg-white p-10 text-center text-sm text-alpine-500">
          Selecteer instructeurs om te vergelijken vanuit je{" "}
          <Link href="/contacten" className="text-piste-600 hover:underline">contacten</Link>.
        </p>
      </>
    );
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("instructor_profiles")
    .select("*")
    .in("id", idList);
  const profiles = (data ?? []) as InstructorProfile[];

  const rows: { label: string; render: (p: InstructorProfile) => React.ReactNode }[] = [
    { label: "Plaats", render: (p) => p.city ?? "—" },
    { label: "Ervaring", render: (p) => (p.years_experience ? `${p.years_experience} jaar` : "—") },
    {
      label: "Beoordeling",
      render: (p) =>
        p.review_count > 0 ? (
          <span className="flex items-center gap-1">
            <Stars rating={p.avg_rating} /> {p.avg_rating.toFixed(1)} ({p.review_count})
          </span>
        ) : "—",
    },
    {
      label: "Certificeringen",
      render: (p) =>
        p.certifications?.length
          ? p.certifications.map((c) => getCertById(c.cert_id)?.name).filter(Boolean).join(", ")
          : "—",
    },
    { label: "Talen", render: (p) => p.languages?.map((l) => lbl(LANGUAGES, l)).join(", ") || "—" },
    { label: "Specialisaties", render: (p) => p.specializations?.map((s) => lbl(SPECIALIZATIONS, s)).join(", ") || "—" },
    { label: "Leeftijdsgroepen", render: (p) => p.age_groups?.map((a) => lbl(AGE_GROUPS, a)).join(", ") || "—" },
    { label: "VOG", render: (p) => (badgeGeldig(p.vog_verified, p.vog_expiry) ? "✓" : "—") },
    { label: "EHBO", render: (p) => (badgeGeldig(p.ehbo_verified, p.ehbo_expiry) ? "✓" : "—") },
    {
      label: "Verzekering",
      render: (p) => (badgeGeldig(p.insurance_verified, p.insurance_expiry) ? "✓" : "—"),
    },
    { label: "Schoolgroepen", render: (p) => (p.school_group_experience ? "✓" : "—") },
    { label: "Dagtarief", render: (p) => (p.daily_rate ? euro(p.daily_rate) : "—") },
    {
      label: "Gebieden",
      render: (p) => p.preferred_resorts?.map((r) => getResortById(r)?.name).filter(Boolean).join(", ") || "—",
    },
  ];

  return (
    <>
      <PageHeader title="Instructeurs vergelijken" subtitle={`${profiles.length} instructeurs naast elkaar.`} />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-40 p-3 text-left text-alpine-500"></th>
              {profiles.map((p) => {
                const name = [p.first_name, p.last_name].filter(Boolean).join(" ") || "Instructeur";
                return (
                  <th key={p.id} className="p-3 text-left align-bottom">
                    <Link href={`/instructeur/${p.id}`} className="font-semibold text-alpine-900 hover:text-piste-600">
                      {name}
                    </Link>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-alpine-100 align-top">
                <td className="p-3 font-medium text-alpine-600">{row.label}</td>
                {profiles.map((p) => (
                  <td key={p.id} className="p-3 text-alpine-800">{row.render(p)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
