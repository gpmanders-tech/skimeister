"use client";

import { useActionState } from "react";
import { uploadDocumentAction, type DocState } from "@/lib/documents/actions";
import { DOC_TYPE_LABELS, DOC_TYPES } from "@/lib/constants/options";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, FormError, FormMessage } from "@/components/ui/form";

const initial: DocState = {};

export function DocumentUploader() {
  const [state, formAction, pending] = useActionState(uploadDocumentAction, initial);

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm"
    >
      <h3 className="font-display text-lg font-bold text-alpine-900">
        Document uploaden
      </h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="doc_type">Type</Label>
          <Select id="doc_type" name="doc_type" defaultValue={DOC_TYPES.vog}>
            {Object.entries(DOC_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="expiry_date">Vervaldatum (optioneel)</Label>
          <Input id="expiry_date" name="expiry_date" type="date" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="file">Bestand (PDF of afbeelding)</Label>
          <Input id="file" name="file" type="file" accept=".pdf,image/*" required />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <FormError>{state.error}</FormError>
        <FormMessage>{state.message}</FormMessage>
        <Button type="submit" variant="accent" disabled={pending}>
          {pending ? "Uploaden…" : "Uploaden"}
        </Button>
      </div>
    </form>
  );
}
