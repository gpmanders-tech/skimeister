"use client";

import { useActionState, useState } from "react";
import { applyToProjectAction, type ProjectState } from "@/lib/projects/actions";
import { MAX_MOTIVATIE } from "@/lib/constants/options";
import { Button } from "@/components/ui/Button";
import { Textarea, FormError, FormMessage } from "@/components/ui/form";

const initial: ProjectState = {};

/**
 * Reageren is één klik. Het bericht is optioneel en staat ingeklapt, zodat
 * niemand eerst een motivatiebrief hoeft te schrijven om te kunnen reageren.
 */
export function ReageerFormulier({ opdrachtId }: { opdrachtId: string }) {
  const [state, formAction, pending] = useActionState(applyToProjectAction, initial);
  const [bericht, setBericht] = useState("");

  if (state.message) {
    return <FormMessage>{state.message}</FormMessage>;
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="project_id" value={opdrachtId} />

      <Button type="submit" variant="accent" size="lg" className="w-full" disabled={pending}>
        {pending ? "Bezig…" : "Reageer op deze opdracht"}
      </Button>

      <details className="group">
        <summary className="cursor-pointer list-none text-sm font-medium text-alpine-600 hover:text-piste-600">
          <span className="group-open:hidden">+ Bericht toevoegen (optioneel)</span>
          <span className="hidden group-open:inline">− Bericht verbergen</span>
        </summary>
        <div className="mt-2">
          <Textarea
            name="motivation"
            maxLength={MAX_MOTIVATIE}
            value={bericht}
            onChange={(e) => setBericht(e.target.value)}
            placeholder="Bijvoorbeeld: wanneer je beschikbaar bent, of waar je ervaring mee hebt."
          />
          <p className="mt-1 text-right text-xs text-alpine-500">
            {bericht.length}/{MAX_MOTIVATIE}
          </p>
        </div>
      </details>

      <FormError>{state.error}</FormError>
    </form>
  );
}
