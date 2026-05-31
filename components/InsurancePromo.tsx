import { INSURANCE_PARTNER } from "@/lib/constants/partners";

/** Callout op het instructeur-dashboard/documenten: verzekering via partner. */
export function InsurancePromo() {
  return (
    <div className="rounded-2xl border border-piste-200 bg-piste-50 p-6">
      <h3 className="font-display text-lg font-bold text-alpine-900">
        Nog geen aansprakelijkheidsverzekering?
      </h3>
      <p className="mt-1 text-sm text-alpine-700">{INSURANCE_PARTNER.tagline}</p>
      <ul className="mt-3 space-y-1">
        {INSURANCE_PARTNER.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-alpine-800">
            <span className="mt-0.5 text-piste-500">✓</span>
            {b}
          </li>
        ))}
      </ul>
      <a
        href={INSURANCE_PARTNER.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block rounded-full bg-piste-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-piste-600"
      >
        Bekijk onze verzekeringspartner
      </a>
    </div>
  );
}
