import Link from "next/link";
import type { Opdracht } from "@/lib/opdrachten/queries";
import {
  certificeringLabel,
  doelgroepLabel,
  instructeursLabel,
  periodeLabel,
  skigebiedLabel,
} from "@/lib/opdrachten/presentatie";

/** Kleine grijze eigenschap-chip. */
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-alpine-50 px-2.5 py-1 text-xs font-medium text-alpine-700">
      {children}
    </span>
  );
}

/**
 * Eén opdracht op het board. Volledig leesbaar zonder login: alle kerngegevens
 * staan op de kaart, alleen reageren vraagt een account.
 */
export function OpdrachtKaart({ opdracht: o }: { opdracht: Opdracht }) {
  const cert = certificeringLabel(o.min_certification);

  return (
    <Link
      href={`/opdrachten/${o.id}`}
      className="block rounded-2xl border border-alpine-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-piste-600">
            {skigebiedLabel(o.resort_id)}
          </p>
          <h3 className="mt-0.5 font-display text-lg font-bold text-alpine-900 sm:text-xl">
            {o.name}
          </h3>
        </div>
        {o.instructors_needed ? (
          <span className="shrink-0 rounded-full bg-piste-50 px-3 py-1 text-sm font-semibold text-piste-700">
            {o.instructors_needed}× gevraagd
          </span>
        ) : null}
      </div>

      <p className="mt-2 text-sm text-alpine-700">{periodeLabel(o)}</p>

      {o.description ? (
        <p className="mt-3 line-clamp-2 text-sm text-alpine-700">{o.description}</p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-1.5">
        <Chip>{doelgroepLabel(o)}</Chip>
        {cert ? <Chip>Min. {cert}</Chip> : null}
        {o.compensation ? <Chip>{o.compensation}</Chip> : null}
        {o.board_lodging ? <Chip>Kost &amp; inwoning</Chip> : null}
        {o.vog_required ? <Chip>VOG vereist</Chip> : null}
      </div>

      <span className="mt-4 inline-block text-sm font-semibold text-piste-600">
        Bekijk opdracht →
      </span>
    </Link>
  );
}
