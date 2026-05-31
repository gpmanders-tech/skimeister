"use client";

import { useActionState, useState } from "react";
import {
  saveAvailabilityAction,
  type AvailabilityState,
} from "@/lib/availability/actions";
import type { SeasonWeek } from "@/lib/availability/weeks";
import { Button } from "@/components/ui/Button";
import { FormError, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

const initial: AvailabilityState = {};

export function AvailabilityCalendar({
  season,
  weeks,
  initialSelected,
}: {
  season: string;
  weeks: SeasonWeek[];
  initialSelected: string[];
}) {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(initialSelected),
  );
  const [state, formAction, pending] = useActionState(saveAvailabilityAction, initial);

  const toggle = (start: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(start)) next.delete(start);
      else next.add(start);
      return next;
    });

  // Groepeer per maand voor de weergave.
  const byMonth = new Map<string, SeasonWeek[]>();
  for (const w of weeks) {
    const arr = byMonth.get(w.monthLabel) ?? [];
    arr.push(w);
    byMonth.set(w.monthLabel, arr);
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="season" value={season} />
      {[...selected].map((s) => (
        <input key={s} type="hidden" name="weeks" value={s} />
      ))}

      <div className="space-y-6">
        {[...byMonth.entries()].map(([month, monthWeeks]) => (
          <div key={month}>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-alpine-500">
              {month}
            </h3>
            <div className="flex flex-wrap gap-2">
              {monthWeeks.map((w) => {
                const active = selected.has(w.start);
                return (
                  <button
                    type="button"
                    key={w.start}
                    onClick={() => toggle(w.start)}
                    className={cn(
                      "rounded-xl border px-4 py-2 text-sm transition-colors",
                      active
                        ? "border-piste-400 bg-piste-500 text-white"
                        : "border-alpine-200 bg-white text-alpine-800 hover:bg-alpine-50",
                    )}
                    aria-pressed={active}
                  >
                    Week van {w.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <FormError>{state.error}</FormError>
        <FormMessage>{state.message}</FormMessage>
        <div className="flex items-center gap-4">
          <Button type="submit" variant="accent" disabled={pending}>
            {pending ? "Opslaan…" : "Beschikbaarheid opslaan"}
          </Button>
          <span className="text-sm text-alpine-600">
            {selected.size} weken geselecteerd
          </span>
        </div>
      </div>
    </form>
  );
}
