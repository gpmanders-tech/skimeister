import { notFound } from "next/navigation";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button, ButtonLink } from "@/components/ui/Button";
import { saveContactAction } from "@/lib/contacts/actions";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { isOrgRole } from "@/lib/auth/roles";
import { getCertById } from "@/lib/constants/certifications";
import { getResortById } from "@/lib/constants/resorts";
import { SPECIALIZATIONS, LANGUAGES, AGE_GROUPS } from "@/lib/constants/options";
import { euro, formatDate } from "@/lib/utils";
import { badgeGeldig } from "@/lib/documents/status";
import { Stars } from "@/components/reviews/Stars";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import type { InstructorProfile, Review } from "@/lib/types";

const ORG_TYPE_LABELS: Record<string, string> = {
  ski_school: "Skischool",
  travel_org: "Reisorganisatie",
  school_nl: "School",
};

const lbl = (arr: readonly { id: string; label: string }[], id: string) =>
  arr.find((x) => x.id === id)?.label ?? id;

export default async function InstructorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  if (!user) return null;
  if (!isOrgRole(user.role) && user.role !== "admin") {
    return <PageHeader title="Profiel" subtitle="Geen toegang tot instructeurprofielen." />;
  }

  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("instructor_profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();
  const p = data as InstructorProfile;
  const name = [p.first_name, p.last_name].filter(Boolean).join(" ") || "Instructeur";

  // Reviews ophalen.
  const { data: reviewData } = await supabase
    .from("reviews")
    .select("*")
    .eq("instructor_id", p.id)
    .order("created_at", { ascending: false });
  const reviews = (reviewData ?? []) as Review[];

  // Bestaande review van deze organisatie ophalen (voor het formulier).
  let myReview: { rating: number; comment: string | null } | null = null;
  if (isOrgRole(user.role)) {
    const { data: org } = await supabase
      .from("organizations")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (org) {
      const { data: r } = await supabase
        .from("reviews")
        .select("rating, comment")
        .eq("instructor_id", p.id)
        .eq("organization_id", org.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      myReview = r ?? null;
    }
  }

  return (
    <>
      <PageHeader
        title={name}
        subtitle={`${p.city ?? ""}${p.years_experience ? ` · ${p.years_experience} jaar ervaring` : ""}`}
        action={
          <div className="flex gap-2">
            <form action={saveContactAction}>
              <input type="hidden" name="instructor_id" value={p.id} />
              <Button type="submit" variant="outline">Bewaar in contacten</Button>
            </form>
            <ButtonLink href={`/berichten/${p.user_id}`} variant="accent">Stuur bericht</ButtonLink>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-6">
          {p.bio && (
            <Card title="Over">
              <p className="whitespace-pre-line text-sm text-alpine-700">{p.bio}</p>
            </Card>
          )}

          <Card title="Certificeringen">
            {p.certifications?.length ? (
              <ul className="space-y-1.5">
                {p.certifications.map((c) => {
                  const cert = getCertById(c.cert_id);
                  if (!cert) return null;
                  return (
                    <li key={c.cert_id} className="flex items-center gap-2 text-sm text-alpine-800">
                      <span className="font-medium">{cert.name}</span>
                      {c.year_obtained && (
                        <span className="text-alpine-500">({c.year_obtained})</span>
                      )}
                      {cert.isiaHighlight && (
                        <span className="rounded bg-piste-100 px-1.5 py-0.5 text-xs text-piste-700">
                          Internationaal erkend
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-alpine-500">Geen certificeringen opgegeven.</p>
            )}
          </Card>

          <Card title="Specialisaties & talen">
            <Row label="Specialisaties" values={p.specializations?.map((s) => lbl(SPECIALIZATIONS, s))} />
            <Row label="Talen" values={p.languages?.map((s) => lbl(LANGUAGES, s))} />
            <Row label="Leeftijdsgroepen" values={p.age_groups?.map((s) => lbl(AGE_GROUPS, s))} />
          </Card>

          <Card title="Voorkeursgebieden">
            <div className="flex flex-wrap gap-2">
              {(p.preferred_resorts ?? []).map((rid) => (
                <span key={rid} className="rounded-full border border-alpine-200 px-3 py-1 text-sm text-alpine-700">
                  {getResortById(rid)?.name ?? rid}
                </span>
              ))}
            </div>
          </Card>

          <Card title={`Reviews${p.review_count ? ` (${p.review_count})` : ""}`}>
            {p.review_count > 0 ? (
              <div className="mb-4 flex items-center gap-2">
                <Stars rating={p.avg_rating} size="lg" />
                <span className="text-sm text-alpine-600">
                  {p.avg_rating.toFixed(1)} gemiddeld
                </span>
              </div>
            ) : (
              <p className="text-sm text-alpine-500">Nog geen reviews.</p>
            )}
            <ul className="space-y-4">
              {reviews.map((r) => (
                <li key={r.id} className="border-b border-alpine-50 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <Stars rating={r.rating} />
                    <span className="text-xs text-alpine-400">
                      {ORG_TYPE_LABELS[r.org_type]} · {formatDate(r.created_at)}
                    </span>
                  </div>
                  {r.comment && <p className="mt-1.5 text-sm text-alpine-700">{r.comment}</p>}
                </li>
              ))}
            </ul>
          </Card>

          {isOrgRole(user.role) && (
            <ReviewForm instructorId={p.id} current={myReview} />
          )}
        </div>

        <aside className="space-y-6">
          <Card title="Documenten">
            <ul className="space-y-1.5 text-sm">
              <DocLine ok={badgeGeldig(p.vog_verified, p.vog_expiry)} label="VOG" />
              <DocLine ok={badgeGeldig(p.ehbo_verified, p.ehbo_expiry)} label="EHBO" />
              <DocLine
                ok={badgeGeldig(p.insurance_verified, p.insurance_expiry)}
                label="Verzekering"
              />
            </ul>
          </Card>

          <Card title="Tarieven">
            <ul className="space-y-1 text-sm text-alpine-800">
              {p.hourly_rate && <li>Uur: {euro(p.hourly_rate)}</li>}
              {p.daily_rate && <li>Dag: {euro(p.daily_rate)}</li>}
              {p.weekly_rate && <li>Week: {euro(p.weekly_rate)}</li>}
              {!p.hourly_rate && !p.daily_rate && !p.weekly_rate && (
                <li className="text-alpine-500">Op aanvraag</li>
              )}
            </ul>
          </Card>

          {(p.has_own_transport || p.school_group_experience) && (
            <Card title="Extra">
              <ul className="space-y-1 text-sm text-alpine-800">
                {p.has_own_transport && <li>✓ Eigen vervoer</li>}
                {p.school_group_experience && <li>✓ Schoolgroep-ervaring</li>}
              </ul>
            </Card>
          )}
        </aside>
      </div>
    </>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm">
      <h3 className="mb-3 font-display text-lg font-bold text-alpine-900">{title}</h3>
      {children}
    </section>
  );
}

function Row({ label, values }: { label: string; values?: string[] }) {
  if (!values?.length) return null;
  return (
    <p className="mb-2 text-sm last:mb-0">
      <span className="text-alpine-500">{label}: </span>
      <span className="text-alpine-800">{values.join(", ")}</span>
    </p>
  );
}

function DocLine({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-center justify-between">
      <span className="text-alpine-700">{label}</span>
      {ok ? (
        <span className="text-green-700">door Skimeister gecontroleerd ✓</span>
      ) : (
        <span className="text-alpine-400">niet aangeleverd</span>
      )}
    </li>
  );
}
