import Link from "next/link";
import type { CompletenessResult } from "@/lib/profile/completeness";

/** De onderdelen van stap 2, met waar je ze invult. */
const STAP_2 = [
  { href: "/profiel/bewerken", label: "Foto, bio en specialisaties" },
  { href: "/profiel/bewerken", label: "Skigebieden van voorkeur" },
  { href: "/beschikbaarheid", label: "Beschikbaarheid per periode" },
  { href: "/documenten", label: "VOG en EHBO uploaden" },
];

/**
 * Profielvolledigheid als balk met percentage. Staat op het dashboard en op
 * de profielpagina, zodat een instructeur altijd ziet wat er nog mist.
 */
export function ProfielVoortgang({
  resultaat,
  toonStappen = false,
}: {
  resultaat: CompletenessResult;
  toonStappen?: boolean;
}) {
  const { score, missing, canActivate } = resultaat;

  return (
    <div className="rounded-2xl border border-alpine-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-alpine-800">Profiel compleet</span>
        <span className="font-display text-lg font-bold text-alpine-900">{score}%</span>
      </div>

      <div
        className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-alpine-100"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Profielvolledigheid"
      >
        <div
          className={`h-full rounded-full transition-all ${canActivate ? "bg-green-500" : "bg-piste-500"}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {missing.length > 0 ? (
        <p className="mt-3 text-sm text-alpine-600">
          Nog toe te voegen: {missing.join(", ")}.
        </p>
      ) : null}

      <p className="mt-2 text-sm">
        {canActivate ? (
          <span className="text-green-700">
            ✓ Je profiel is compleet genoeg om zichtbaar te zijn voor opdrachtgevers.
          </span>
        ) : (
          <span className="text-piste-700">
            Je kunt al op opdrachten reageren. Met een foto, bio, één certificaat en
            één voorkeursgebied word je ook gevonden door opdrachtgevers.
          </span>
        )}
      </p>

      {toonStappen ? (
        <ul className="mt-4 space-y-1.5 border-t border-alpine-50 pt-4">
          {STAP_2.map((s) => (
            <li key={s.label}>
              <Link
                href={s.href}
                className="text-sm font-medium text-piste-600 hover:underline"
              >
                {s.label} →
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
