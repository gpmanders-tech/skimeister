import { PageHeader } from "@/components/dashboard/PageHeader";
import { SearchFilters, type SearchParams } from "@/components/search/SearchFilters";
import { SavedSearches, type SavedSearch } from "@/components/search/SavedSearches";
import { InstructorCard } from "@/components/search/InstructorCard";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { isOrgRole } from "@/lib/auth/roles";
import { taalVoorRol } from "@/lib/i18n/taal";
import { teksten } from "@/lib/i18n/teksten";
import type { InstructorProfile } from "@/lib/types";

export const metadata = { title: "Instructeurs zoeken" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const user = await getSessionUser();
  if (!user) return null;

  const t = teksten(taalVoorRol(user.role)).zoeken;

  if (!isOrgRole(user.role)) {
    return <PageHeader title={t.titel} subtitle={t.alleenOrganisaties} />;
  }

  const params = await searchParams;
  const supabase = await createClient();

  const { data: savedRows } = await supabase
    .from("saved_searches")
    .select("id, name, params")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const saved = (savedRows ?? []) as SavedSearch[];

  let q = supabase
    .from("instructor_profiles")
    .select("*")
    .eq("is_approved", true)
    .eq("is_active", true);

  if (params.resort) q = q.contains("preferred_resorts", [params.resort]);
  if (params.language) q = q.contains("languages", [params.language]);
  if (params.specialization) q = q.contains("specializations", [params.specialization]);
  if (params.age_group) q = q.contains("age_groups", [params.age_group]);
  if (params.vog === "1") q = q.eq("vog_verified", true);
  if (params.ehbo === "1") q = q.eq("ehbo_verified", true);
  if (params.insurance === "1") q = q.eq("insurance_verified", true);
  if (params.school_group === "1") q = q.eq("school_group_experience", true);

  if (params.sort === "experience") {
    q = q.order("years_experience", { ascending: false, nullsFirst: false });
  } else if (params.sort === "rating") {
    q = q.order("avg_rating", { ascending: false }).order("review_count", { ascending: false });
  } else {
    q = q.order("profile_completeness", { ascending: false });
  }

  const { data } = await q.limit(60);
  let results = (data ?? []) as InstructorProfile[];

  // ISIA-filter (op jsonb certifications) in JS.
  if (params.isia === "1") {
    results = results.filter((p) =>
      (p.certifications ?? []).some((c) => c.cert_id === "isia-stamp"),
    );
  }

  return (
    <>
      <PageHeader title={t.titel} subtitle={t.subtitel} />

      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <div className="space-y-4">
          <SearchFilters params={params} taal={taalVoorRol(user.role)} />
          <SavedSearches current={params} saved={saved} taal={taalVoorRol(user.role)} />
        </div>

        <div>
          <p className="mb-4 text-sm text-alpine-600">{t.gevonden(results.length)}</p>
          {results.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-alpine-200 bg-white p-10 text-center text-sm text-alpine-500">
              {t.geenResultaten}
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((p) => (
                <InstructorCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
