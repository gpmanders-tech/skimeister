"use client";

import { useActionState } from "react";
import { saveOpdrachtAction, type OpdrachtState } from "@/lib/admin/opdrachten";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea, FormError, FormMessage } from "@/components/ui/form";
import { RESORTS_BY_COUNTRY } from "@/lib/constants/resorts";
import { CERT_BODIES, CERTIFICATIONS_BY_BODY } from "@/lib/constants/certifications";
import { LANGUAGES, PARTICIPANT_LEVELS, PROJECT_AGE_GROUPS } from "@/lib/constants/options";

const initial: OpdrachtState = {};

export interface OpdrachtFormWaarden {
  id?: string;
  name?: string | null;
  description?: string | null;
  resort_id?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  deadline?: string | null;
  participants_count?: number | null;
  instructors_needed?: number | null;
  participant_level?: string | null;
  age_group?: string | null;
  language_required?: string[] | null;
  min_certification?: string | null;
  school_group?: boolean | null;
  vog_required?: boolean | null;
  ehbo_required?: boolean | null;
  board_lodging?: boolean | null;
  compensation?: string | null;
  notes?: string | null;
  status?: string | null;
}

export interface OrganisatieKeuze {
  id: string;
  name: string;
}

function Vak({ children, titel }: { children: React.ReactNode; titel: string }) {
  return (
    <fieldset className="rounded-2xl border border-alpine-100 bg-white p-5 shadow-sm sm:p-6">
      <legend className="px-2 font-display text-base font-bold text-alpine-900">
        {titel}
      </legend>
      <div className="mt-2 grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Vinkje({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-alpine-800">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked ?? false}
        className="h-4 w-4 rounded border-alpine-300 text-piste-500 focus:ring-piste-400"
      />
      {label}
    </label>
  );
}

export function OpdrachtForm({
  waarden = {},
  organisaties = [],
}: {
  waarden?: OpdrachtFormWaarden;
  organisaties?: OrganisatieKeuze[];
}) {
  const [state, formAction, pending] = useActionState(saveOpdrachtAction, initial);
  const nieuw = !waarden.id;
  const talen = waarden.language_required ?? [];

  return (
    <form action={formAction} className="space-y-5">
      {waarden.id ? <input type="hidden" name="opdracht_id" value={waarden.id} /> : null}

      <Vak titel="De opdracht">
        <div className="sm:col-span-2">
          <Label htmlFor="name">Titel</Label>
          <Input
            id="name"
            name="name"
            defaultValue={waarden.name ?? ""}
            placeholder="Skileraren gezocht voor schoolweek Sankt Anton"
            required
          />
        </div>

        <div>
          <Label htmlFor="resort_id">Skigebied</Label>
          <Select id="resort_id" name="resort_id" defaultValue={waarden.resort_id ?? ""}>
            <option value="">Nader te bepalen</option>
            {(Object.keys(RESORTS_BY_COUNTRY) as Array<keyof typeof RESORTS_BY_COUNTRY>).map(
              (land) => (
                <optgroup key={land} label={land}>
                  {RESORTS_BY_COUNTRY[land].map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </optgroup>
              ),
            )}
          </Select>
        </div>

        <div>
          <Label htmlFor="instructors_needed">Aantal instructeurs gevraagd</Label>
          <Input
            id="instructors_needed"
            name="instructors_needed"
            type="number"
            min={1}
            defaultValue={waarden.instructors_needed ?? ""}
          />
        </div>

        <div>
          <Label htmlFor="start_date">Startdatum</Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            defaultValue={waarden.start_date ?? ""}
          />
        </div>

        <div>
          <Label htmlFor="end_date">Einddatum</Label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            defaultValue={waarden.end_date ?? ""}
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="description">Omschrijving</Label>
          <Textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={waarden.description ?? ""}
            placeholder="Wat houdt de opdracht in, wat voor groep, wat verwacht je van de instructeur?"
          />
          <p className="mt-1 text-xs text-alpine-500">
            Deze tekst staat publiek op de opdrachtpagina.
          </p>
        </div>
      </Vak>

      <Vak titel="Groep en eisen">
        <div>
          <Label htmlFor="age_group">Doelgroep</Label>
          <Select id="age_group" name="age_group" defaultValue={waarden.age_group ?? ""}>
            <option value="">Gemengd</option>
            {PROJECT_AGE_GROUPS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="participant_level">Niveau deelnemers</Label>
          <Select
            id="participant_level"
            name="participant_level"
            defaultValue={waarden.participant_level ?? ""}
          >
            <option value="">Onbekend</option>
            {PARTICIPANT_LEVELS.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="participants_count">Aantal deelnemers</Label>
          <Input
            id="participants_count"
            name="participants_count"
            type="number"
            min={1}
            defaultValue={waarden.participants_count ?? ""}
          />
        </div>

        <div>
          <Label htmlFor="min_certification">Minimale certificering</Label>
          <Select
            id="min_certification"
            name="min_certification"
            defaultValue={waarden.min_certification ?? ""}
          >
            <option value="">In overleg</option>
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
        </div>

        <div className="sm:col-span-2">
          <Label>Gevraagde talen</Label>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {LANGUAGES.map((l) => (
              <label key={l.id} className="flex items-center gap-2 text-sm text-alpine-800">
                <input
                  type="checkbox"
                  name="language_required"
                  value={l.id}
                  defaultChecked={talen.includes(l.id)}
                  className="h-4 w-4 rounded border-alpine-300 text-piste-500 focus:ring-piste-400"
                />
                {l.label}
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2.5 sm:col-span-2">
          <Vinkje
            name="school_group"
            label="Schoolgroep uit Nederland of België"
            defaultChecked={waarden.school_group ?? false}
          />
          <Vinkje
            name="vog_required"
            label="VOG verplicht (automatisch bij kinderen en schoolgroepen)"
            defaultChecked={waarden.vog_required ?? false}
          />
          <Vinkje
            name="ehbo_required"
            label="EHBO-certificaat verplicht"
            defaultChecked={waarden.ehbo_required ?? false}
          />
        </div>
      </Vak>

      <Vak titel="Vergoeding">
        <div>
          <Label htmlFor="compensation">Vergoedingsindicatie</Label>
          <Input
            id="compensation"
            name="compensation"
            defaultValue={waarden.compensation ?? ""}
            placeholder="€ 950 per week"
          />
          <p className="mt-1 text-xs text-alpine-500">
            Vrije tekst. Staat publiek op de kaart en de opdrachtpagina.
          </p>
        </div>

        <div>
          <Label htmlFor="deadline">Reageren tot</Label>
          <Input
            id="deadline"
            name="deadline"
            type="date"
            defaultValue={waarden.deadline ?? ""}
          />
        </div>

        <div className="sm:col-span-2">
          <Vinkje
            name="board_lodging"
            label="Kost en inwoning inbegrepen"
            defaultChecked={waarden.board_lodging ?? false}
          />
        </div>
      </Vak>

      <Vak titel="Intern">
        {nieuw && organisaties.length > 0 ? (
          <div className="sm:col-span-2">
            <Label htmlFor="organization_id">Opdrachtgever</Label>
            <Select id="organization_id" name="organization_id" defaultValue="">
              <option value="">Skimeister (eigen plaatsing)</option>
              {organisaties.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </Select>
            <p className="mt-1 text-xs text-alpine-500">
              Alleen intern zichtbaar. Niet aanpasbaar na aanmaken.
            </p>
          </div>
        ) : null}

        <div className="sm:col-span-2">
          <Label htmlFor="notes">Interne notities</Label>
          <Textarea
            id="notes"
            name="notes"
            rows={3}
            defaultValue={waarden.notes ?? ""}
            placeholder="Contactpersoon, afspraken, wat je niet publiek wilt tonen."
          />
          <p className="mt-1 text-xs text-alpine-500">Niet zichtbaar voor instructeurs.</p>
        </div>

        <div className="sm:col-span-2">
          <Vinkje
            name="publish"
            label="Direct publiceren op het opdrachtenboard"
            defaultChecked={(waarden.status ?? "draft") === "open"}
          />
        </div>
      </Vak>

      <FormError>{state.error}</FormError>
      <FormMessage>{state.message}</FormMessage>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit" variant="accent" size="lg" disabled={pending}>
          {pending ? "Bezig…" : nieuw ? "Opdracht aanmaken" : "Wijzigingen opslaan"}
        </Button>
      </div>
    </form>
  );
}
