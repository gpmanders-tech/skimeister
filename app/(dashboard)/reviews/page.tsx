import { PageHeader } from "@/components/dashboard/PageHeader";
import { Stars } from "@/components/reviews/Stars";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { formatDate } from "@/lib/utils";
import type { Review } from "@/lib/types";

export const metadata = { title: "Reviews" };

const ORG_TYPE_LABELS: Record<string, string> = {
  ski_school: "Skischool",
  travel_org: "Reisorganisatie",
  school_nl: "School",
};

export default async function ReviewsPage() {
  const user = await getSessionUser();
  if (!user) return null;
  if (user.role !== "instructor") {
    return <PageHeader title="Reviews" subtitle="Alleen voor instructeurs." />;
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("instructor_profiles")
    .select("id, avg_rating, review_count")
    .eq("user_id", user.id)
    .single();

  let reviews: Review[] = [];
  if (profile) {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("instructor_id", profile.id)
      .order("created_at", { ascending: false });
    reviews = (data ?? []) as Review[];
  }

  return (
    <>
      <PageHeader
        title="Reviews"
        subtitle="Beoordelingen die je hebt ontvangen. Je kunt niet reageren op eigen reviews."
      />

      {profile && profile.review_count > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm">
          <Stars rating={profile.avg_rating} size="lg" />
          <span className="text-alpine-700">
            <strong>{profile.avg_rating.toFixed(1)}</strong> gemiddeld over{" "}
            {profile.review_count} review{profile.review_count === 1 ? "" : "s"}
          </span>
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-alpine-200 bg-white p-10 text-center text-sm text-alpine-500">
          Je hebt nog geen reviews ontvangen.
        </p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-xl border border-alpine-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <Stars rating={r.rating} />
                <span className="text-xs text-alpine-400">
                  {ORG_TYPE_LABELS[r.org_type]} · {formatDate(r.created_at)}
                </span>
              </div>
              {r.comment && <p className="mt-2 text-sm text-alpine-700">{r.comment}</p>}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
