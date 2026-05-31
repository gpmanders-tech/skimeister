"use client";

import { useActionState } from "react";
import {
  markEnrolledAction,
  uploadCertificateAction,
  type AspirantState,
} from "@/lib/aspirant/actions";
import { TRAINING_PARTNER } from "@/lib/constants/partners";
import { Button } from "@/components/ui/Button";
import { Input, Label, FormError, FormMessage } from "@/components/ui/form";
import type { Aspirant } from "@/lib/types";

const initial: AspirantState = {};

export function AspirantActions({ aspirant }: { aspirant: Aspirant }) {
  const [state, formAction, pending] = useActionState(uploadCertificateAction, initial);

  const enrolled = aspirant.status !== "registered";
  const hasCert = aspirant.certificate_uploaded || aspirant.status === "passed" || aspirant.status === "active";
  const active = aspirant.status === "active" || aspirant.approved_by_admin;

  if (active) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-sm text-green-800">
        Gefeliciteerd! Je bent nu instructeur op Skimeister. Maak je profiel compleet om
        gevonden te worden.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stap 2: inschrijven */}
      {!enrolled && (
        <div className="rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm">
          <h3 className="font-display text-lg font-bold text-alpine-900">
            Schrijf je in bij de opleiding
          </h3>
          <p className="mt-1 text-sm text-alpine-600">{TRAINING_PARTNER.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={TRAINING_PARTNER.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-piste-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-piste-600"
            >
              Naar de opleiding
            </a>
            <form action={markEnrolledAction}>
              <Button type="submit" variant="outline">Ik heb me ingeschreven</Button>
            </form>
          </div>
        </div>
      )}

      {/* Stap 3: certificaat uploaden */}
      {enrolled && !hasCert && (
        <form action={formAction} className="rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm">
          <h3 className="font-display text-lg font-bold text-alpine-900">
            Upload je certificaat
          </h3>
          <p className="mt-1 text-sm text-alpine-600">
            Behaald? Upload je Anwärter-certificaat. Na controle wordt je profiel omgezet
            naar instructeur.
          </p>
          <div className="mt-4">
            <Label htmlFor="file">Certificaat (PDF of afbeelding)</Label>
            <Input id="file" name="file" type="file" accept=".pdf,image/*" required />
          </div>
          <div className="mt-4 space-y-3">
            <FormError>{state.error}</FormError>
            <FormMessage>{state.message}</FormMessage>
            <Button type="submit" variant="accent" disabled={pending}>
              {pending ? "Uploaden…" : "Certificaat uploaden"}
            </Button>
          </div>
        </form>
      )}

      {/* Stap 4: wachten op verificatie */}
      {hasCert && !active && (
        <div className="rounded-2xl border border-alpine-100 bg-white p-6 text-sm text-alpine-700 shadow-sm">
          Je certificaat is geüpload en wordt gecontroleerd door de beheerder. Je krijgt
          bericht zodra je profiel actief is.
        </div>
      )}
    </div>
  );
}
