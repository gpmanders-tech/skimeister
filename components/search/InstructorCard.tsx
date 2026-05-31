import Link from "next/link";
import type { InstructorProfile } from "@/lib/types";
import { getCertById } from "@/lib/constants/certifications";
import { getResortById } from "@/lib/constants/resorts";
import { SPECIALIZATIONS } from "@/lib/constants/options";
import { euro } from "@/lib/utils";
import { Stars } from "@/components/reviews/Stars";

function specLabel(id: string) {
  return SPECIALIZATIONS.find((s) => s.id === id)?.label ?? id;
}

export function InstructorCard({ p }: { p: InstructorProfile }) {
  const name =
    [p.first_name, p.last_name].filter(Boolean).join(" ") || "Instructeur";
  const certs = (p.certifications ?? [])
    .map((c) => getCertById(c.cert_id))
    .filter(Boolean)
    .slice(0, 4);
  const hasIsia = (p.certifications ?? []).some((c) => c.cert_id === "isia-stamp");
  const resorts = (p.preferred_resorts ?? [])
    .map((id) => getResortById(id)?.name)
    .filter(Boolean)
    .slice(0, 3);

  return (
    <Link
      href={`/instructeur/${p.id}`}
      className="flex flex-col rounded-2xl border border-alpine-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        {p.photo_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={p.photo_url}
            alt={name}
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-alpine-100 font-display font-bold text-alpine-600">
            {name.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-alpine-900">{name}</h3>
          <p className="truncate text-sm text-alpine-600">
            {p.city ?? "—"}
            {p.years_experience ? ` · ${p.years_experience} jr ervaring` : ""}
          </p>
          {p.review_count > 0 && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-alpine-500">
              <Stars rating={p.avg_rating} />
              {p.avg_rating.toFixed(1)} ({p.review_count})
            </p>
          )}
        </div>
      </div>

      {certs.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {certs.map((c) => (
            <span
              key={c!.id}
              className="rounded bg-alpine-50 px-2 py-0.5 text-xs font-medium text-alpine-700"
            >
              {c!.name}
            </span>
          ))}
          {hasIsia && (
            <span className="rounded bg-piste-100 px-2 py-0.5 text-xs font-medium text-piste-700">
              ISIA
            </span>
          )}
        </div>
      )}

      {resorts.length > 0 && (
        <p className="mt-2 text-xs text-alpine-500">{resorts.join(" · ")}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {p.vog_verified && <Badge>VOG ✓</Badge>}
        {p.ehbo_verified && <Badge>EHBO ✓</Badge>}
        {p.insurance_verified && <Badge>Verzekerd ✓</Badge>}
        {p.school_group_experience && <Badge>Schoolgroepen</Badge>}
      </div>

      <div className="mt-auto pt-3">
        {p.specializations?.length > 0 && (
          <p className="text-xs text-alpine-600">
            {p.specializations.slice(0, 3).map(specLabel).join(", ")}
          </p>
        )}
        {p.daily_rate && (
          <p className="mt-1 text-sm font-medium text-alpine-900">
            vanaf {euro(p.daily_rate)} / dag
          </p>
        )}
      </div>
    </Link>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
      {children}
    </span>
  );
}
