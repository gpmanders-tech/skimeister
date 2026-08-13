import { PARTNERS_ACTIEF, type Partner } from "@/lib/constants/partners";

export function PartnerCard({ partner }: { partner: Partner }) {
  // Zolang er geen echte partner is, tonen we geen partnerblok.
  if (!PARTNERS_ACTIEF) return null;

  return (
    <div className="rounded-2xl border border-alpine-100 bg-white p-7 shadow-sm">
      <h3 className="font-display text-xl font-bold text-alpine-900">{partner.name}</h3>
      <p className="mt-1 text-sm text-alpine-600">{partner.tagline}</p>
      <ul className="mt-4 space-y-2">
        {partner.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-alpine-800">
            <span className="mt-0.5 text-piste-500">✓</span>
            {b}
          </li>
        ))}
      </ul>
      <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-block rounded-full bg-piste-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-piste-600"
      >
        Meer informatie
      </a>
    </div>
  );
}
