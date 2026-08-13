import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfielVoortgang } from "@/components/profile/ProfielVoortgang";
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

      <div className="mb-8">
        <ProfielVoortgang resultaat={completeness} />
      </div>

      <ProfileForm profile={profile as InstructorProfile} />
    </>
  );
}
