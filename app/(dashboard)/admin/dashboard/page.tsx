import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { createServiceClient } from "@/lib/supabase/server";
import { euro } from "@/lib/utils";

export const metadata = { title: "Admin — overzicht" };
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const service = createServiceClient();
  const head = { count: "exact" as const, head: true };

  const [usersR, instrR, pendingR, orgsR, openR] = await Promise.all([
    service.from("users").select("id", head),
    service.from("instructor_profiles").select("id", head),
    service.from("instructor_profiles").select("id", head).eq("is_approved", false),
    service.from("organizations").select("id", head),
    service.from("projects").select("id", head).eq("status", "open"),
  ]);
  const users = usersR.count ?? 0;
  const instructors = instrR.count ?? 0;
  const pendingProfiles = pendingR.count ?? 0;
  const orgs = orgsR.count ?? 0;
  const openProjects = openR.count ?? 0;

  const { data: paid } = await service
    .from("payments")
    .select("amount")
    .eq("status", "paid");
  const revenue = (paid ?? []).reduce(
    (s: number, p: { amount: number | string }) => s + Number(p.amount),
    0,
  );

  const stats = [
    { label: "Gebruikers", value: users },
    { label: "Instructeurs", value: instructors },
    { label: "Wacht op goedkeuring", value: pendingProfiles, href: "/admin/profielen" },
    { label: "Organisaties", value: orgs },
    { label: "Open projecten", value: openProjects },
    { label: "Omzet (betaald)", value: euro(revenue) },
  ];

  return (
    <>
      <PageHeader title="Adminoverzicht" subtitle="Statistieken van het platform." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => {
          const card = (
            <div className="rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm">
              <div className="font-display text-3xl font-extrabold text-alpine-900">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-alpine-600">{s.label}</div>
            </div>
          );
          return s.href ? (
            <Link key={s.label} href={s.href} className="block transition-shadow hover:shadow-md">
              {card}
            </Link>
          ) : (
            <div key={s.label}>{card}</div>
          );
        })}
      </div>
    </>
  );
}
