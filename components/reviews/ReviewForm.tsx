"use client";

import { useActionState } from "react";
import { submitReviewAction, type ReviewState } from "@/lib/reviews/actions";
import { Button } from "@/components/ui/Button";
import { Label, Textarea, Select, FormError, FormMessage } from "@/components/ui/form";

const initial: ReviewState = {};

export function ReviewForm({
  instructorId,
  current,
}: {
  instructorId: string;
  current?: { rating: number; comment: string | null } | null;
}) {
  const [state, formAction, pending] = useActionState(submitReviewAction, initial);

  return (
    <form action={formAction} className="rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm">
      <h3 className="font-display text-lg font-bold text-alpine-900">
        {current ? "Je review bijwerken" : "Laat een review achter"}
      </h3>
      <input type="hidden" name="instructor_id" value={instructorId} />
      <div className="mt-4 grid gap-4">
        <div>
          <Label htmlFor="rating">Score</Label>
          <Select id="rating" name="rating" defaultValue={String(current?.rating ?? 5)}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {"★".repeat(n)} ({n})
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="comment">Toelichting (optioneel)</Label>
          <Textarea id="comment" name="comment" defaultValue={current?.comment ?? ""} />
        </div>
      </div>
      <div className="mt-4 space-y-3">
        <FormError>{state.error}</FormError>
        <FormMessage>{state.message}</FormMessage>
        <Button type="submit" variant="accent" disabled={pending}>
          {pending ? "Versturen…" : "Review plaatsen"}
        </Button>
      </div>
    </form>
  );
}
