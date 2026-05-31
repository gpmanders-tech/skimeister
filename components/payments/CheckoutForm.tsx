"use client";

import { useActionState } from "react";
import {
  startSubscriptionCheckout,
  startProjectCheckout,
  type CheckoutState,
} from "@/lib/payments/actions";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/form";

const initial: CheckoutState = {};

export function CheckoutForm({
  kind,
  planId,
  interval,
  label,
  variant = "accent",
}: {
  kind: "subscription" | "project";
  planId: string;
  interval?: "month" | "year";
  label: string;
  variant?: "accent" | "outline";
}) {
  const action = kind === "subscription" ? startSubscriptionCheckout : startProjectCheckout;
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="plan_id" value={planId} />
      {interval && <input type="hidden" name="interval" value={interval} />}
      <Button type="submit" variant={variant} className="w-full" disabled={pending}>
        {pending ? "Doorsturen naar betaling…" : label}
      </Button>
      <FormError>{state.error}</FormError>
    </form>
  );
}
