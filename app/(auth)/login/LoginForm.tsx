"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInAction, type AuthState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/Button";
import { Input, Label, FormError } from "@/components/ui/form";

const initial: AuthState = {};

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, pending] = useActionState(signInAction, initial);

  return (
    <div className="rounded-2xl border border-alpine-100 bg-white p-8 shadow-sm">
      <h1 className="font-display text-2xl font-bold text-alpine-900">Inloggen</h1>
      <p className="mt-1 text-sm text-alpine-600">Welkom terug bij Skimeister.</p>

      <form action={formAction} className="mt-6 space-y-5">
        <input type="hidden" name="redirect" value={redirectTo} />
        <div>
          <Label htmlFor="email">E-mailadres</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div>
          <Label htmlFor="password">Wachtwoord</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>

        <FormError>{state.error}</FormError>

        <Button type="submit" variant="primary" className="w-full" disabled={pending}>
          {pending ? "Bezig…" : "Inloggen"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-alpine-600">
        Nog geen account?{" "}
        <Link href="/register" className="font-medium text-piste-600 hover:underline">
          Maak er een aan
        </Link>
      </p>
    </div>
  );
}
