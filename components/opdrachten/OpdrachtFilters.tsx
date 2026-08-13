import Link from "next/link";
import { RESORTS_BY_COUNTRY } from "@/lib/constants/resorts";
import { CERT_BODIES, CERTIFICATIONS_BY_BODY } from "@/lib/constants/certifications";
import type { OpdrachtFilters as Filters } from "@/lib/opdrachten/queries";

const veld =
  "w-full rounded-xl border border-alpine-200 bg-white px-3 py-2.5 text-sm text-alpine-900 focus:border-alpine-400 focus:outline-none focus:ring-2 focus:ring-alpine-200";

/**
 * Filterbalk van het opdrachtenboard. Bewust een gewoon GET-formulier:
 * werkt zonder JavaScript, de filters staan in de URL en zijn dus deelbaar.
 */
export function OpdrachtFilters({ actief }: { actief: Filters }) {
  const heeftFilter = Boolean(actief.resort || actief.van || actief.tot || actief.cert);

  return (
    <form
      method="GET"
      className="rounded-2xl border border-alpine-100 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="resort" className="mb-1.5 block text-sm font-medium text-alpine-800">
            Skigebied
          </label>
          <select id="resort" name="resort" defaultValue={actief.resort ?? ""} className={veld}>
            <option value="">Alle gebieden</option>
            {(Object.keys(RESORTS_BY_COUNTRY) as Array<keyof typeof RESORTS_BY_COUNTRY>).map(
              (land) => (
                <optgroup key={land} label={land}>
                  {RESORTS_BY_COUNTRY[land].map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </optgroup>
              ),
            )}
          </select>
        </div>

        <div>
          <label htmlFor="van" className="mb-1.5 block text-sm font-medium text-alpine-800">
            Beschikbaar vanaf
          </label>
          <input
            id="van"
            name="van"
            type="date"
            defaultValue={actief.van ?? ""}
            className={veld}
          />
        </div>

        <div>
          <label htmlFor="tot" className="mb-1.5 block text-sm font-medium text-alpine-800">
            Tot en met
          </label>
          <input
            id="tot"
            name="tot"
            type="date"
            defaultValue={actief.tot ?? ""}
            className={veld}
          />
        </div>

        <div>
          <label htmlFor="cert" className="mb-1.5 block text-sm font-medium text-alpine-800">
            Certificering
          </label>
          <select id="cert" name="cert" defaultValue={actief.cert ?? ""} className={veld}>
            <option value="">Alle niveaus</option>
            {CERT_BODIES.map((body) => (
              <optgroup key={body.key} label={`${body.flag} ${body.name}`}>
                {CERTIFICATIONS_BY_BODY[body.key].map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="rounded-xl bg-alpine-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-alpine-700"
        >
          Filter opdrachten
        </button>
        {heeftFilter ? (
          <Link href="/opdrachten" className="text-sm font-medium text-alpine-600 hover:underline">
            Wis filters
          </Link>
        ) : null}
      </div>
    </form>
  );
}
