import type { Aspirant } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "registered", label: "Aangemeld op Skimeister" },
  { key: "enrolled", label: "Ingeschreven bij de opleiding" },
  { key: "passed", label: "Anwärter-certificaat behaald" },
  { key: "active", label: "Profiel actief als instructeur" },
];

/** Bepaalt hoeveel stappen voltooid zijn op basis van de aspirant-status. */
function completedCount(a: Pick<Aspirant, "status" | "certificate_uploaded" | "approved_by_admin">): number {
  if (a.status === "active" || a.approved_by_admin) return 4;
  if (a.status === "passed" || a.certificate_uploaded) return 3;
  if (a.status === "enrolled") return 2;
  return 1;
}

export function Funnel({
  aspirant,
}: {
  aspirant: Pick<Aspirant, "status" | "certificate_uploaded" | "approved_by_admin">;
}) {
  const done = completedCount(aspirant);

  return (
    <div className="rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-alpine-900">Jouw voortgang</h3>
        <span className="text-sm text-alpine-600">{done} / 4</span>
      </div>
      <div className="mb-6 h-2.5 w-full overflow-hidden rounded-full bg-alpine-100">
        <div className="h-full rounded-full bg-piste-500 transition-all" style={{ width: `${(done / 4) * 100}%` }} />
      </div>
      <ol className="space-y-3">
        {STEPS.map((s, i) => {
          const isDone = i < done;
          const isCurrent = i === done;
          return (
            <li key={s.key} className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                  isDone
                    ? "bg-piste-500 text-white"
                    : isCurrent
                      ? "border-2 border-piste-400 text-piste-600"
                      : "border border-alpine-200 text-alpine-400",
                )}
              >
                {isDone ? "✓" : i + 1}
              </span>
              <span className={cn("text-sm", isDone ? "text-alpine-900" : "text-alpine-600")}>
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
