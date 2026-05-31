"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendMessageAction, type MessageState } from "@/lib/messages/actions";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/form";

const initial: MessageState = {};

export function MessageComposer({
  receiverId,
  contextType = "school_contact",
  contextId,
}: {
  receiverId: string;
  contextType?: "project" | "school_contact";
  contextId?: string | null;
}) {
  const [state, formAction, pending] = useActionState(sendMessageAction, initial);
  const ref = useRef<HTMLFormElement>(null);

  // Reset het tekstveld na succesvol versturen (geen error).
  useEffect(() => {
    if (!pending && !state.error) ref.current?.reset();
  }, [pending, state]);

  return (
    <form ref={ref} action={formAction} className="border-t border-alpine-100 bg-white p-4">
      <input type="hidden" name="receiver_id" value={receiverId} />
      <input type="hidden" name="context_type" value={contextType} />
      {contextId && <input type="hidden" name="context_id" value={contextId} />}
      <FormError>{state.error}</FormError>
      <div className="flex items-end gap-2">
        <textarea
          name="content"
          required
          rows={2}
          placeholder="Typ een bericht…"
          className="flex-1 resize-none rounded-xl border border-alpine-200 px-4 py-2.5 text-sm focus:border-alpine-400 focus:outline-none focus:ring-2 focus:ring-alpine-200"
        />
        <Button type="submit" variant="accent" disabled={pending}>
          {pending ? "…" : "Versturen"}
        </Button>
      </div>
    </form>
  );
}
