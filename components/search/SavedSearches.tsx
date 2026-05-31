import Link from "next/link";
import { saveSearchAction, deleteSearchAction } from "@/lib/search/actions";
import type { SearchParams } from "@/components/search/SearchFilters";

export interface SavedSearch {
  id: string;
  name: string;
  params: Record<string, string>;
}

const FILTER_KEYS = [
  "resort", "language", "specialization", "age_group",
  "vog", "ehbo", "insurance", "isia", "school_group", "sort",
] as const;

export function SavedSearches({
  current,
  saved,
}: {
  current: SearchParams;
  saved: SavedSearch[];
}) {
  const hasActiveFilters = FILTER_KEYS.some((k) => current[k]);

  return (
    <div className="rounded-2xl border border-alpine-100 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-alpine-800">Opgeslagen zoekopdrachten</h3>

      {hasActiveFilters && (
        <form action={saveSearchAction} className="mt-3 flex gap-2">
          {FILTER_KEYS.map((k) =>
            current[k] ? <input key={k} type="hidden" name={k} value={current[k]} /> : null,
          )}
          <input
            name="name"
            required
            placeholder="Naam"
            className="min-w-0 flex-1 rounded-lg border border-alpine-200 px-3 py-1.5 text-sm"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-alpine-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-alpine-700"
          >
            Bewaar
          </button>
        </form>
      )}

      {saved.length === 0 ? (
        <p className="mt-3 text-xs text-alpine-500">
          {hasActiveFilters
            ? "Geef je huidige filters een naam om ze te bewaren."
            : "Stel filters in en bewaar ze als favoriet."}
        </p>
      ) : (
        <ul className="mt-3 space-y-1.5">
          {saved.map((s) => {
            const qs = new URLSearchParams(s.params).toString();
            return (
              <li key={s.id} className="flex items-center justify-between gap-2">
                <Link
                  href={`/zoeken?${qs}`}
                  className="truncate text-sm text-piste-600 hover:underline"
                >
                  {s.name}
                </Link>
                <form action={deleteSearchAction}>
                  <input type="hidden" name="id" value={s.id} />
                  <button type="submit" className="text-xs text-alpine-400 hover:text-red-600">
                    ✕
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
