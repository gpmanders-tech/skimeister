import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Funnel } from "@/components/aspirant/Funnel";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { DASHBOARD_NAV } from "@/lib/constants/nav";
import { ROLE_LABELS, ROLE_TAGLINES, type Role } from "@/lib/constants/options";
import { ProfielVoortgang } from "@/components/profile/ProfielVoortgang";
import { computeCompleteness, type CompletenessResult } from "@/lib/profile/completeness";
import type { Aspirant, InstructorProfile } from "@/lib/types";

const INTRO: Record<Exclude<Role, "admin">, string> = {
  instructor:
    "Maak je profiel compleet, stel je beschikbaarheid in en meld je aan op projecten.",
  aspirant:
    "Volg je voortgang richting je certificaat en zet de eerste stappen op de piste.",
  school_ski:
    "Zoek gecertificeerde instructeurs en bouw je seizoensteam op.",
  travel_org:
    "Plaats projecten en plan je hele seizoen op één plek.",
  school_nl:
    "Plaats je schoolreis en vind de juiste skileraar voor jouw groep.",
};

export default async function DashboardHome() {
  const user = await getSessionUser();
  if (!user) return null;

  if (user.role === "admin") {
    return (
      <>
        <PageHeader title="Adminoverzicht" subtitle="Beheer het platform." />
        <QuickLinks role="admin" />
      </>
    );
  }

  let aspirant: Aspirant | null = null;
  if (user.role === "aspirant") {
    const supabase = await createClient();
    const { data } = await supabase
      .from("aspirants")
      .select("*")
      .eq("user_id", user.id)
      .single();
    aspirant = (data as Aspirant) ?? null;
  }

  let voortgang: CompletenessResult | null = null;
  if (user.role === "instructor") {
    const supabase = await createClient();
    const { data } = await supabase
      .from("instructor_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) voortgang = computeCompleteness(data as InstructorProfile);
  }

  return (
    <>
      <PageHeader
        title={`Welkom, ${ROLE_LABELS[user.role]}`}
        subtitle={ROLE_TAGLINES[user.role]}
      />
      {aspirant ? (
        <div className="mb-8">
          <Funnel aspirant={aspirant} />
          <p className="mt-3 text-sm text-alpine-600">
            Ga naar{" "}
            <Link href="/opleiding" className="font-medium text-piste-600 hover:underline">
              Opleiding
            </Link>{" "}
            voor de volgende stap.
          </p>
        </div>
      ) : voortgang ? (
        <div className="mb-8 space-y-4">
          <Link
            href="/opdrachten"
            className="block rounded-2xl bg-alpine-600 p-6 text-white shadow-sm transition-colors hover:bg-alpine-700"
          >
            <span className="font-display text-lg font-bold">
              Bekijk de open opdrachten
            </span>
            <span className="mt-1 block text-sm text-alpine-100">
              Reageren kan met één klik. Je hebt er geen compleet profiel voor nodig.
            </span>
          </Link>
          <ProfielVoortgang resultaat={voortgang} toonStappen />
        </div>
      ) : (
        <div className="mb-8 rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm">
          <p className="text-alpine-700">{INTRO[user.role]}</p>
        </div>
      )}
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-alpine-500">
        Snel naar
      </h2>
      <QuickLinks role={user.role} />
    </>
  );
}

function QuickLinks({ role }: { role: Role }) {
  const items = DASHBOARD_NAV[role].filter(
    (i) => i.href !== "/dashboard" && i.href !== "/admin/dashboard",
  );
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-xl border border-alpine-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <span className="font-medium text-alpine-900">{item.label}</span>
          <span className="mt-1 block text-sm text-piste-600">Openen →</span>
        </Link>
      ))}
    </div>
  );
}
