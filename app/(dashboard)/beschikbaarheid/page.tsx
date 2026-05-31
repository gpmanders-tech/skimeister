import { PageHeader } from "@/components/dashboard/PageHeader";
import { AvailabilityCalendar } from "@/components/availability/AvailabilityCalendar";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { currentSeason } from "@/lib/constants/options";
import { seasonWeeks } from "@/lib/availability/weeks";

export const metadata = { title: "Beschikbaarheid" };

export default async function AvailabilityPage() {
  const user = await getSessionUser();
  if (!user) return null;

  if (user.role !== "instructor") {
    return (
      <PageHeader
        title="Beschikbaarheid"
        subtitle="Alleen instructeurs stellen beschikbaarheid in."
      />
    );
  }

  const season = currentSeason(new Date());
  const weeks = seasonWeeks(season);

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("instructor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  let selected: string[] = [];
  if (profile) {
    const { data: rows } = await supabase
      .from("availability")
      .select("week_start")
      .eq("instructor_id", profile.id)
      .eq("season", season)
      .eq("is_available", true);
    selected = (rows ?? []).map((r) => r.week_start as string);
  }

  return (
    <>
      <PageHeader
        title="Beschikbaarheid"
        subtitle={`Markeer in welke weken je beschikbaar bent — seizoen ${season}.`}
      />
      <AvailabilityCalendar
        season={season}
        weeks={weeks}
        initialSelected={selected}
      />
    </>
  );
}
