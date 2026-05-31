"use client";

import { useActionState } from "react";
import { applyToProjectAction, type ProjectState } from "@/lib/projects/actions";
import { Button } from "@/components/ui/Button";
import { Label, Textarea, FormError, FormMessage } from "@/components/ui/form";

const initial: ProjectState = {};

export function ApplyForm({
  projectId,
  existingMotivation,
  status,
}: {
  projectId: string;
  existingMotivation?: string | null;
  status?: string | null;
}) {
  const [state, formAction, pending] = useActionState(applyToProjectAction, initial);

  const alreadyApplied =
    status === "pending" || status === "selected";

  return (
    <form action={formAction} className="rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm">
      <h3 className="font-display text-lg font-bold text-alpine-900">
        {alreadyApplied ? "Je aanmelding" : "Aanmelden op dit project"}
      </h3>
      {status && (
        <p className="mt-1 text-sm text-alpine-600">
          Huidige status: <StatusLabel status={status} />
        </p>
      )}
      <input type="hidden" name="project_id" value={projectId} />
      <div className="mt-4">
        <Label htmlFor="motivation">Motivatie</Label>
        <Textarea
          id="motivation"
          name="motivation"
          defaultValue={existingMotivation ?? ""}
          placeholder="Vertel waarom jij past bij dit project…"
        />
      </div>
      <div className="mt-4 space-y-3">
        <FormError>{state.error}</FormError>
        <FormMessage>{state.message}</FormMessage>
        <Button type="submit" variant="accent" disabled={pending}>
          {pending ? "Versturen…" : alreadyApplied ? "Aanmelding bijwerken" : "Aanmelden"}
        </Button>
      </div>
    </form>
  );
}

function StatusLabel({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "in behandeling",
    selected: "geselecteerd 🎉",
    rejected: "afgewezen",
    withdrawn: "ingetrokken",
  };
  return <span className="font-medium">{map[status] ?? status}</span>;
}
