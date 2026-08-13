"use client";

import { useActionState } from "react";
import { startProjectCheckout, type CheckoutState } from "@/lib/payments/actions";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/form";

const initial: CheckoutState = {};

/**
 * Enige online betaling die overblijft: het schoolreis-project.
 * Abonnementen bestaan niet meer; de plaatsingsfee voor organisaties wordt
 * achteraf gefactureerd zodra een plaatsing bevestigd is.
 */
export function CheckoutForm({
  label,
  variant = "accent",
}: {
  label: string;
  variant?: "accent" | "outline";
}) {
  const [state, formAction, pending] = useActionState(startProjectCheckout, initial);

  return (
    <form action={formAction} className="space-y-2">
      <Button type="submit" variant={variant} className="w-full" disabled={pending}>
        {pending ? "Doorsturen naar betaling…" : label}
      </Button>
      <FormError>{state.error}</FormError>
    </form>
  );
}
