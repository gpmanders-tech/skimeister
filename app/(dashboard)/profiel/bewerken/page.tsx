import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { computeCompleteness } from "@/lib/profile/completeness";
import type { InstructorProfile } from "@/lib/types";

export const metadata = { title: "Profiel bewerken" };

export default async function ProfileEditPage() {
  const user = await getSessionUser();
  if (!user) return null;

  if (user.role !== "instructor") {
    return (
      <PageHeader
        title="Profiel"
        subtitle="Een instructeurprofiel is alleen beschikbaar voor instructeurs."
      />
    );
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("instructor_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return (
      <PageHeader
        title="Profiel"
        subtitle="Je profiel wordt aangemaakt. Herlaad de pagina."
      />
    );
  }

  const completeness = computeCompleteness(profile as InstructorProfile);

  return (
    <>
      <PageHeader
        title="Profiel bewerken"
        subtitle="Hoe completer je profiel, hoe hoger je in de zoekresultaten komt."
      />

      <div className="mb-8 rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-alpine-800">Profiel compleet</span>
          <span className="font-display text-lg font-bold text-alpine-900">
            {completeness.score}%
          </span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-alpine-100">
          <div
            className="h-full rounded-full bg-piste-500 transition-all"
            style={{ width: `${completeness.score}%` }}
          />
        </div>
        {completeness.missing.length > 0 && (
          <p className="mt-3 text-sm text-alpine-600">
            Nog toe te voegen: {completeness.missing.join(", ")}.
          </p>
        )}
        <p className="mt-2 text-sm">
          {completeness.canActivate ? (
            <span className="text-green-700">
              ✓ Je profiel voldoet aan de minimumeisen en kan actief zijn.
            </span>
          ) : (
            <span className="text-piste-700">
              Vul foto, bio, minimaal 1 certificaat en 1 voorkeursgebied in om je
              profiel te activeren.
            </span>
          )}
        </p>
      </div>

      <ProfileForm profile={profile as InstructorProfile} />
    </>
  );
}
