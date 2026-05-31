"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUpAction, type AuthState } from "@/lib/auth/actions";
import {
  REGISTERABLE_ROLES,
  ROLE_LABELS,
  ROLE_TAGLINES,
  type Role,
} from "@/lib/constants/options";
import { Button } from "@/components/ui/Button";
import { Input, Label, FormError, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

const initial: AuthState = {};

export function RegisterForm() {
  const [role, setRole] = useState<Role>("instructor");
  const [state, formAction, pending] = useActionState(signUpAction, initial);

  if (state.message) {
    return (
      <div className="rounded-2xl border border-alpine-100 bg-white p-8 text-center shadow-sm">
        <h1 className="font-display text-2xl font-bold text-alpine-900">
          Bijna klaar!
        </h1>
        <FormMessage>{state.message}</FormMessage>
        <Link
          href="/login"
          className="mt-4 inline-block text-sm font-medium text-piste-600 hover:underline"
        >
          Naar inloggen →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-alpine-100 bg-white p-8 shadow-sm">
      <h1 className="font-display text-2xl font-bold text-alpine-900">
        Maak een account
      </h1>
      <p className="mt-1 text-sm text-alpine-600">Kies je accounttype.</p>

      <form action={formAction} className="mt-6 space-y-5">
        <input type="hidden" name="role" value={role} />

        <div className="grid grid-cols-1 gap-2">
          {REGISTERABLE_ROLES.map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setRole(r)}
              className={cn(
                "rounded-xl border p-3 text-left transition-colors",
                role === r
                  ? "border-piste-400 bg-piste-50 ring-1 ring-piste-300"
                  : "border-alpine-200 hover:bg-alpine-50",
              )}
            >
              <div className="text-sm font-semibold text-alpine-900">
                {ROLE_LABELS[r]}
              </div>
              <div className="text-xs text-alpine-600">{ROLE_TAGLINES[r]}</div>
            </button>
          ))}
        </div>

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
            autoComplete="new-password"
            minLength={8}
            required
          />
          <p className="mt-1 text-xs text-alpine-500">Minimaal 8 tekens.</p>
        </div>

        <FormError>{state.error}</FormError>

        <Button type="submit" variant="accent" className="w-full" disabled={pending}>
          {pending ? "Bezig…" : "Account aanmaken"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-alpine-600">
        Al een account?{" "}
        <Link href="/login" className="font-medium text-piste-600 hover:underline">
          Inloggen
        </Link>
      </p>
    </div>
  );
}
