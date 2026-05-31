"use client";

import { useActionState } from "react";
import { saveProjectAction, type ProjectState } from "@/lib/projects/actions";
import type { Project } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea, Select, FormError, FormMessage } from "@/components/ui/form";
import { RESORTS } from "@/lib/constants/resorts";
import { LANGUAGES, PROJECT_AGE_GROUPS, PARTICIPANT_LEVELS } from "@/lib/constants/options";
import { CERTIFICATIONS } from "@/lib/constants/certifications";

const initial: ProjectState = {};

export function ProjectForm({ project }: { project?: Project }) {
  const [state, formAction, pending] = useActionState(saveProjectAction, initial);
  const p = project;

  return (
    <form action={formAction} className="space-y-6">
      {p && <input type="hidden" name="project_id" value={p.id} />}

      <Section title="Algemeen">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="name">Projectnaam *</Label>
            <Input id="name" name="name" defaultValue={p?.name ?? ""} required placeholder="Bijv. Schoolreis 3 havo — Saalbach" />
          </div>
          <div>
            <Label htmlFor="description">Omschrijving</Label>
            <Textarea id="description" name="description" defaultValue={p?.description ?? ""} />
          </div>
        </div>
      </Section>

      <Section title="Gebied & data">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="resort_id">Skigebied</Label>
            <Select id="resort_id" name="resort_id" defaultValue={p?.resort_id ?? ""}>
              <option value="">Kies een gebied</option>
              {RESORTS.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </Select>
          </div>
          <div />
          <div>
            <Label htmlFor="start_date">Startdatum</Label>
            <Input id="start_date" name="start_date" type="date" defaultValue={p?.start_date ?? ""} />
          </div>
          <div>
            <Label htmlFor="end_date">Einddatum</Label>
            <Input id="end_date" name="end_date" type="date" defaultValue={p?.end_date ?? ""} />
          </div>
        </div>
      </Section>

      <Section title="Groep & behoefte">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="participants_count">Aantal deelnemers</Label>
            <Input id="participants_count" name="participants_count" type="number" defaultValue={p?.participants_count ?? ""} />
          </div>
          <div>
            <Label htmlFor="instructors_needed">Aantal instructeurs nodig</Label>
            <Input id="instructors_needed" name="instructors_needed" type="number" defaultValue={p?.instructors_needed ?? ""} />
          </div>
          <div>
            <Label htmlFor="participant_level">Niveau</Label>
            <Select id="participant_level" name="participant_level" defaultValue={p?.participant_level ?? ""}>
              <option value="">Kies niveau</option>
              {PARTICIPANT_LEVELS.map((l) => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="age_group">Leeftijdsgroep</Label>
            <Select id="age_group" name="age_group" defaultValue={p?.age_group ?? ""}>
              <option value="">Kies leeftijdsgroep</option>
              {PROJECT_AGE_GROUPS.map((a) => (
                <option key={a.id} value={a.id}>{a.label}</option>
              ))}
            </Select>
          </div>
        </div>
      </Section>

      <Section title="Eisen">
        <div className="mb-4">
          <Label>Vereiste talen</Label>
          <div className="grid gap-1.5 sm:grid-cols-3">
            {LANGUAGES.map((l) => (
              <label key={l.id} className="flex items-center gap-2 text-sm text-alpine-800">
                <input type="checkbox" name="language_required" value={l.id} defaultChecked={p?.language_required?.includes(l.id)} className="h-4 w-4 rounded border-alpine-300" />
                {l.label}
              </label>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="min_certification">Minimale certificering</Label>
            <Select id="min_certification" name="min_certification" defaultValue={p?.min_certification ?? ""}>
              <option value="">Geen specifieke eis</option>
              {CERTIFICATIONS.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="deadline">Deadline aanmelden</Label>
            <Input id="deadline" name="deadline" type="date" defaultValue={p?.deadline ?? ""} />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <label className="flex items-center gap-2 text-sm text-alpine-800">
            <input type="checkbox" name="vog_required" defaultChecked={p?.vog_required} className="h-4 w-4 rounded border-alpine-300" />
            VOG verplicht (automatisch bij kinderen)
          </label>
          <label className="flex items-center gap-2 text-sm text-alpine-800">
            <input type="checkbox" name="ehbo_required" defaultChecked={p?.ehbo_required} className="h-4 w-4 rounded border-alpine-300" />
            EHBO verplicht
          </label>
          <label className="flex items-center gap-2 text-sm text-alpine-800">
            <input type="checkbox" name="school_group" defaultChecked={p?.school_group} className="h-4 w-4 rounded border-alpine-300" />
            Dit is een schoolgroep
          </label>
        </div>
      </Section>

      <Section title="Vergoeding & notities">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="compensation">Vergoeding (optioneel)</Label>
            <Input id="compensation" name="compensation" defaultValue={p?.compensation ?? ""} placeholder="Bijv. € 1.200 + reis & verblijf" />
          </div>
          <div>
            <Label htmlFor="notes">Interne notities</Label>
            <Textarea id="notes" name="notes" defaultValue={p?.notes ?? ""} />
          </div>
        </div>
      </Section>

      <FormError>{state.error}</FormError>
      <FormMessage>{state.message}</FormMessage>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm font-medium text-alpine-800">
          <input
            type="checkbox"
            name="publish"
            defaultChecked={p?.status === "open"}
            className="h-4 w-4 rounded border-alpine-300"
          />
          Direct publiceren (zichtbaar voor instructeurs)
        </label>
        <Button type="submit" variant="accent" disabled={pending}>
          {pending ? "Opslaan…" : p ? "Project opslaan" : "Project aanmaken"}
        </Button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-display text-lg font-bold text-alpine-900">{title}</h3>
      {children}
    </section>
  );
}
