"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUpAction, type AuthState } from "@/lib/auth/actions";
import {
  LANGUAGES,
  REGISTERABLE_ROLES,
  ROLE_LABELS,
  ROLE_TAGLINES,
  type Role,
} from "@/lib/constants/options";
import { CERT_BODIES, CERTIFICATIONS_BY_BODY } from "@/lib/constants/certifications";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, FormError, FormMessage } from "@/components/ui/form";
import { HONEYPOT_FIELD, TOKEN_FIELD } from "@/lib/security/formFields";
import { cn } from "@/lib/utils";

const initial: AuthState = {};

export function RegisterForm({
  formToken,
  next,
}: {
  formToken: string;
  next?: string;
}) {
  const [role, setRole] = useState<Role>("instructor");
  const [state, formAction, pending] = useActionState(signUpAction, initial);

  const isInstructeur = role === "instructor" || role === "aspirant";

  // Alleen zichtbaar als het automatisch inloggen niet lukte.
  if (state.message) {
    return (
      <div className="rounded-2xl border border-alpine-100 bg-white p-8 text-center shadow-sm">
        <h1 className="font-display text-2xl font-bold text-alpine-900">Bijna klaar!</h1>
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
    <div className="rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="font-display text-2xl font-bold text-alpine-900">
        Maak een gratis account
      </h1>
      <p className="mt-1 text-sm text-alpine-600">
        {isInstructeur
          ? "Klaar in drie minuten. De rest van je profiel vul je later aan."
          : "Kies je accounttype."}
      </p>

      <form action={formAction} className="mt-6 space-y-5">
        <input type="hidden" name="role" value={role} />
        <input type="hidden" name={TOKEN_FIELD} value={formToken} />
        {next ? <input type="hidden" name="next" value={next} /> : null}

        {/* Honeypot: onzichtbaar voor bezoekers, bots vullen 'm wel in. */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor={HONEYPOT_FIELD}>Laat dit veld leeg</label>
          <input
            id={HONEYPOT_FIELD}
            name={HONEYPOT_FIELD}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

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
              <div className="text-sm font-semibold text-alpine-900">{ROLE_LABELS[r]}</div>
              <div className="text-xs text-alpine-600">{ROLE_TAGLINES[r]}</div>
            </button>
          ))}
        </div>

        {isInstructeur ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="first_name">Voornaam</Label>
              <Input
                id="first_name"
                name="first_name"
                autoComplete="given-name"
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name">Achternaam</Label>
              <Input
                id="last_name"
                name="last_name"
                autoComplete="family-name"
                required
              />
            </div>
          </div>
        ) : null}

        <div>
          <Label htmlFor="email">E-mailadres</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>

        <div>
          <Label htmlFor="phone">Telefoonnummer</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="06 12345678"
            required
          />
        </div>

        {isInstructeur ? (
          <>
            <div>
              <Label htmlFor="certification">Hoogste certificering</Label>
              <Select id="certification" name="certification" defaultValue="" required>
                <option value="" disabled>
                  Kies je niveau
                </option>
                {CERT_BODIES.map((body) => (
                  <optgroup key={body.key} label={`${body.flag} ${body.name}`}>
                    {CERTIFICATIONS_BY_BODY[body.key].map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </Select>
              <p className="mt-1 text-xs text-alpine-500">
                Meer certificaten kun je later toevoegen.
              </p>
            </div>

            <div>
              <Label htmlFor="years_experience">Jaren ervaring</Label>
              <Input
                id="years_experience"
                name="years_experience"
                type="number"
                inputMode="numeric"
                min={0}
                max={60}
                defaultValue={0}
                required
              />
            </div>

            <div>
              <Label>Talen waarin je lesgeeft</Label>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {LANGUAGES.map((l) => (
                  <label
                    key={l.id}
                    className="flex items-center gap-2 text-sm text-alpine-800"
                  >
                    <input
                      type="checkbox"
                      name="languages"
                      value={l.id}
                      defaultChecked={l.id === "nl"}
                      className="h-4 w-4 rounded border-alpine-300 text-piste-500 focus:ring-piste-400"
                    />
                    {l.label}
                  </label>
                ))}
              </div>
            </div>
          </>
        ) : null}

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

        <Button type="submit" variant="accent" size="lg" className="w-full" disabled={pending}>
          {pending ? "Bezig…" : "Account aanmaken"}
        </Button>

        {isInstructeur ? (
          <p className="text-center text-xs text-alpine-500">
            Daarna kun je meteen op opdrachten reageren. Foto, skigebieden,
            beschikbaarheid en je VOG vul je later aan.
          </p>
        ) : null}
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
