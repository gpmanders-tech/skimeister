"use client";

import { useState } from "react";
import { Input, Label, Select } from "@/components/ui/form";

/** Aanbevolen leerling-instructeur-ratio's per niveau. */
const RATIOS: Record<string, { min: number; max: number; label: string }> = {
  beginner: { min: 6, max: 8, label: "Beginners" },
  gevorderd: { min: 8, max: 10, label: "Gevorderd" },
  gemengd: { min: 7, max: 9, label: "Gemengde groep" },
};

export function RatioCalculator() {
  const [students, setStudents] = useState(40);
  const [level, setLevel] = useState("beginner");

  const r = RATIOS[level];
  const max = Math.max(1, Math.ceil(students / r.min)); // strengste ratio → meeste instructeurs
  const min = Math.max(1, Math.ceil(students / r.max));

  return (
    <div className="rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm">
      <h3 className="font-display text-lg font-bold text-alpine-900">Ratio calculator</h3>
      <p className="mb-4 text-sm text-alpine-600">
        Bereken hoeveel skileraren je nodig hebt voor je groep.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="ratio-students">Aantal leerlingen</Label>
          <Input
            id="ratio-students"
            type="number"
            min={1}
            value={students}
            onChange={(e) => setStudents(Math.max(0, Number(e.target.value)))}
          />
        </div>
        <div>
          <Label htmlFor="ratio-level">Niveau</Label>
          <Select id="ratio-level" value={level} onChange={(e) => setLevel(e.target.value)}>
            {Object.entries(RATIOS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-piste-50 p-5 text-center">
        <p className="text-sm text-alpine-700">Aanbevolen aantal skileraren</p>
        <p className="mt-1 font-display text-3xl font-extrabold text-alpine-900">
          {min === max ? min : `${min}–${max}`}
        </p>
        <p className="mt-1 text-xs text-alpine-500">
          Op basis van 1 instructeur per {r.min}–{r.max} leerlingen ({r.label.toLowerCase()}).
        </p>
      </div>
    </div>
  );
}
