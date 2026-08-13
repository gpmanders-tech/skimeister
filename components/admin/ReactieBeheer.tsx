import Link from "next/link";
import { setReactieStatusAction, saveReactieNotitieAction } from "@/lib/admin/opdrachten";
import { REACTIE_STATUSSEN, REACTIE_STATUS_LABELS, type ReactieStatus } from "@/lib/constants/options";
import { getCertById } from "@/lib/constants/certifications";
import { formatDate } from "@/lib/utils";

export interface Reactie {
  id: string;
  status: ReactieStatus;
  motivation: string | null;
  admin_notes: string | null;
  created_at: string;
  instructeur: {
    id: string;
    naam: string;
    email: string | null;
    city: string | null;
    years_experience: number | null;
    certificeringen: string[];
    vog_verified: boolean;
    ehbo_verified: boolean;
  } | null;
}

const STATUS_KLEUR: Record<ReactieStatus, string> = {
  pending: "bg-piste-50 text-piste-700",
  in_gesprek: "bg-amber-50 text-amber-700",
  selected: "bg-green-50 text-green-700",
  rejected: "bg-alpine-50 text-alpine-600",
  withdrawn: "bg-alpine-50 text-alpine-500",
};

export function ReactieBeheer({
  reacties,
  opdrachtId,
}: {
  reacties: Reactie[];
  opdrachtId: string;
}) {
  if (reacties.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-alpine-200 bg-white p-8 text-center text-sm text-alpine-500">
        Nog geen reacties op deze opdracht.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reacties.map((r) => (
        <article
          key={r.id}
          className="rounded-2xl border border-alpine-100 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              {r.instructeur ? (
                <Link
                  href={`/instructeur/${r.instructeur.id}`}
                  className="font-display text-lg font-bold text-alpine-900 hover:text-piste-600"
                >
                  {r.instructeur.naam}
                </Link>
              ) : (
                <span className="font-display text-lg font-bold text-alpine-500">
                  Profiel verwijderd
                </span>
              )}
              <p className="mt-0.5 text-sm text-alpine-600">
                {[
                  r.instructeur?.city,
                  r.instructeur?.years_experience
                    ? `${r.instructeur.years_experience} jaar ervaring`
                    : null,
                  r.instructeur?.email,
                ]
                  .filter(Boolean)
                  .join(" · ") || "Geen gegevens ingevuld"}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_KLEUR[r.status]}`}
            >
              {REACTIE_STATUS_LABELS[r.status]}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {(r.instructeur?.certificeringen ?? []).map((c) => (
              <span
                key={c}
                className="rounded-full bg-alpine-50 px-2.5 py-1 text-xs font-medium text-alpine-700"
              >
                {getCertById(c)?.name ?? c}
              </span>
            ))}
            {r.instructeur?.vog_verified ? (
              <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                ✓ VOG
              </span>
            ) : null}
            {r.instructeur?.ehbo_verified ? (
              <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                ✓ EHBO
              </span>
            ) : null}
          </div>

          {r.motivation ? (
            <blockquote className="mt-4 border-l-2 border-alpine-200 pl-4 text-sm italic text-alpine-800">
              {r.motivation}
            </blockquote>
          ) : null}

          <p className="mt-3 text-xs text-alpine-500">
            Gereageerd op {formatDate(r.created_at)}
          </p>

          <div className="mt-4 grid gap-4 border-t border-alpine-50 pt-4 sm:grid-cols-2">
            <form action={setReactieStatusAction} className="flex items-end gap-2">
              <input type="hidden" name="id" value={r.id} />
              <input type="hidden" name="opdracht_id" value={opdrachtId} />
              <div className="flex-1">
                <label
                  htmlFor={`status-${r.id}`}
                  className="mb-1.5 block text-xs font-medium text-alpine-700"
                >
                  Status
                </label>
                <select
                  id={`status-${r.id}`}
                  name="status"
                  defaultValue={r.status === "withdrawn" ? "pending" : r.status}
                  disabled={r.status === "withdrawn"}
                  className="w-full rounded-xl border border-alpine-200 px-3 py-2 text-sm disabled:bg-alpine-50"
                >
                  {REACTIE_STATUSSEN.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={r.status === "withdrawn"}
                className="rounded-xl bg-alpine-600 px-4 py-2 text-sm font-medium text-white hover:bg-alpine-700 disabled:opacity-40"
              >
                Zet
              </button>
            </form>

            <form action={saveReactieNotitieAction} className="flex items-end gap-2">
              <input type="hidden" name="id" value={r.id} />
              <input type="hidden" name="opdracht_id" value={opdrachtId} />
              <div className="flex-1">
                <label
                  htmlFor={`notitie-${r.id}`}
                  className="mb-1.5 block text-xs font-medium text-alpine-700"
                >
                  Notitie
                </label>
                <input
                  id={`notitie-${r.id}`}
                  name="admin_notes"
                  defaultValue={r.admin_notes ?? ""}
                  placeholder="Gebeld, wacht op VOG…"
                  className="w-full rounded-xl border border-alpine-200 px-3 py-2 text-sm"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl border border-alpine-200 px-4 py-2 text-sm font-medium text-alpine-800 hover:bg-alpine-50"
              >
                Bewaar
              </button>
            </form>
          </div>

          <p className="mt-2 text-xs text-alpine-500">
            Bij &quot;Geplaatst&quot; en &quot;Afgewezen&quot; krijgt de instructeur automatisch bericht.
          </p>
        </article>
      ))}
    </div>
  );
}
