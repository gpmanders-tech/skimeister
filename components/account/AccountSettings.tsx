"use client";

import { useActionState, useState } from "react";
import {
  changePasswordAction,
  deleteAccountAction,
  type AccountState,
} from "@/lib/account/actions";
import { Button } from "@/components/ui/Button";
import { Input, Label, FormError, FormMessage } from "@/components/ui/form";
import type { Taal } from "@/lib/i18n/taal";

const initial: AccountState = {};

const L = {
  nl: {
    wachtwoord: "Wachtwoord wijzigen",
    nieuw: "Nieuw wachtwoord",
    herhaal: "Herhaal wachtwoord",
    opslaan: "Wachtwoord opslaan",
    bezig: "Opslaan…",
    verwijderTitel: "Account verwijderen",
    verwijderUitleg: "Dit verwijdert je account en alle gekoppelde gegevens definitief. Typ",
    bevestigWoord: "VERWIJDER",
    omTeBevestigen: "om te bevestigen.",
    knop: "Account definitief verwijderen",
  },
  de: {
    wachtwoord: "Passwort ändern",
    nieuw: "Neues Passwort",
    herhaal: "Passwort wiederholen",
    opslaan: "Passwort speichern",
    bezig: "Wird gespeichert…",
    verwijderTitel: "Konto löschen",
    verwijderUitleg: "Damit werden Ihr Konto und alle zugehörigen Daten endgültig gelöscht. Geben Sie",
    bevestigWoord: "LÖSCHEN",
    omTeBevestigen: "ein, um zu bestätigen.",
    knop: "Konto endgültig löschen",
  },
} as const;

export function AccountSettings({ taal = "nl" }: { taal?: Taal }) {
  const t = L[taal];
  const [state, formAction, pending] = useActionState(changePasswordAction, initial);
  const [confirmText, setConfirmText] = useState("");

  return (
    <div className="space-y-6">
      <form action={formAction} className="rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm">
        <h3 className="font-display text-lg font-bold text-alpine-900">{t.wachtwoord}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="password">{t.nieuw}</Label>
            <Input id="password" name="password" type="password" minLength={8} required autoComplete="new-password" />
          </div>
          <div>
            <Label htmlFor="confirm">{t.herhaal}</Label>
            <Input id="confirm" name="confirm" type="password" minLength={8} required autoComplete="new-password" />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <FormError>{state.error}</FormError>
          <FormMessage>{state.message}</FormMessage>
          <Button type="submit" variant="primary" disabled={pending}>
            {pending ? t.bezig : t.opslaan}
          </Button>
        </div>
      </form>

      <form action={deleteAccountAction} className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h3 className="font-display text-lg font-bold text-red-800">{t.verwijderTitel}</h3>
        <p className="mt-1 text-sm text-red-700">
          {t.verwijderUitleg} <strong>{t.bevestigWoord}</strong> {t.omTeBevestigen}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Input
            name="confirm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={t.bevestigWoord}
            className="max-w-48"
          />
          <button
            type="submit"
            disabled={confirmText.trim().toUpperCase() !== t.bevestigWoord}
            className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-40"
          >
            {t.knop}
          </button>
        </div>
      </form>
    </div>
  );
}
