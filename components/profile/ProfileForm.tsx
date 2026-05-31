"use client";

import { useActionState } from "react";
import { updateProfileAction, type ProfileState } from "@/lib/profile/actions";
import type { InstructorProfile } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea, FormError, FormMessage } from "@/components/ui/form";
import {
  LANGUAGES,
  SPECIALIZATIONS,
  AGE_GROUPS,
} from "@/lib/constants/options";
import { RESORTS_BY_COUNTRY } from "@/lib/constants/resorts";
import { CERT_BODIES, CERTIFICATIONS_BY_BODY } from "@/lib/constants/certifications";

const initial: ProfileState = {};

export function ProfileForm({ profile }: { profile: InstructorProfile }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, initial);

  const certYear = (id: string) =>
    profile.certifications?.find((c) => c.cert_id === id)?.year_obtained ?? "";
  const hasCert = (id: string) =>
    profile.certifications?.some((c) => c.cert_id === id) ?? false;

  return (
    <form action={formAction} className="space-y-8">
      {/* Foto + persoonlijk */}
      <Section title="Persoonlijke gegevens">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="photo">Profielfoto</Label>
            {profile.photo_url && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={profile.photo_url}
                alt="Huidige profielfoto"
                className="mb-2 h-20 w-20 rounded-full object-cover"
              />
            )}
            <Input id="photo" name="photo" type="file" accept="image/*" />
          </div>
          <Field label="Voornaam" name="first_name" defaultValue={profile.first_name} />
          <Field label="Achternaam" name="last_name" defaultValue={profile.last_name} />
          <Field label="Woonplaats" name="city" defaultValue={profile.city} />
          <Field label="Nationaliteit" name="nationality" defaultValue={profile.nationality} />
          <Field label="Telefoon" name="phone" defaultValue={profile.phone} />
          <Field
            label="Jaren ervaring"
            name="years_experience"
            type="number"
            defaultValue={profile.years_experience}
          />
        </div>
        <div className="mt-4">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            defaultValue={profile.bio ?? ""}
            placeholder="Vertel iets over jezelf, je stijl en je ervaring…"
          />
        </div>
      </Section>

      {/* Certificeringen */}
      <Section title="Certificeringen" hint="Vink aan wat je hebt en vul eventueel het jaar in.">
        <div className="space-y-5">
          {CERT_BODIES.map((body) => (
            <div key={body.key}>
              <h4 className="mb-2 text-sm font-semibold text-alpine-800">
                {body.flag} {body.name}
              </h4>
              <div className="space-y-1.5">
                {CERTIFICATIONS_BY_BODY[body.key].map((c) => (
                  <div key={c.id} className="flex flex-wrap items-center gap-3">
                    <label className="flex flex-1 items-center gap-2 text-sm text-alpine-800">
                      <input
                        type="checkbox"
                        name="certifications"
                        value={c.id}
                        defaultChecked={hasCert(c.id)}
                        className="h-4 w-4 rounded border-alpine-300"
                      />
                      {c.name}
                      {c.isiaHighlight && (
                        <span className="rounded bg-piste-100 px-1.5 py-0.5 text-xs text-piste-700">
                          Internationaal erkend
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      name={`year_${c.id}`}
                      defaultValue={certYear(c.id)}
                      placeholder="Jaar"
                      className="w-24 rounded-lg border border-alpine-200 px-2 py-1 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Specialisaties / talen / leeftijdsgroepen */}
      <Section title="Specialisaties & talen">
        <CheckboxGrid
          label="Specialisaties"
          name="specializations"
          options={SPECIALIZATIONS.map((s) => ({ id: s.id, label: s.label }))}
          selected={profile.specializations}
        />
        <CheckboxGrid
          label="Talen"
          name="languages"
          options={LANGUAGES.map((l) => ({ id: l.id, label: l.label }))}
          selected={profile.languages}
        />
        <CheckboxGrid
          label="Leeftijdsgroepen"
          name="age_groups"
          options={AGE_GROUPS.map((a) => ({ id: a.id, label: a.label }))}
          selected={profile.age_groups}
        />
      </Section>

      {/* Voorkeursgebieden */}
      <Section title="Voorkeursgebieden">
        <div className="space-y-4">
          {(Object.keys(RESORTS_BY_COUNTRY) as Array<keyof typeof RESORTS_BY_COUNTRY>).map(
            (country) => (
              <div key={country}>
                <h4 className="mb-2 text-sm font-semibold text-alpine-800">{country}</h4>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {RESORTS_BY_COUNTRY[country].map((r) => (
                    <label key={r.id} className="flex items-center gap-2 text-sm text-alpine-800">
                      <input
                        type="checkbox"
                        name="preferred_resorts"
                        value={r.id}
                        defaultChecked={profile.preferred_resorts?.includes(r.id)}
                        className="h-4 w-4 rounded border-alpine-300"
                      />
                      {r.name}
                    </label>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      </Section>

      {/* Tarieven & extra */}
      <Section title="Tarieven & overig">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Uurtarief (€)" name="hourly_rate" type="number" defaultValue={profile.hourly_rate} />
          <Field label="Dagtarief (€)" name="daily_rate" type="number" defaultValue={profile.daily_rate} />
          <Field label="Weektarief (€)" name="weekly_rate" type="number" defaultValue={profile.weekly_rate} />
        </div>
        <div className="mt-4 space-y-2">
          <label className="flex items-center gap-2 text-sm text-alpine-800">
            <input type="checkbox" name="has_own_transport" defaultChecked={profile.has_own_transport} className="h-4 w-4 rounded border-alpine-300" />
            Ik heb eigen vervoer
          </label>
          <label className="flex items-center gap-2 text-sm text-alpine-800">
            <input type="checkbox" name="school_group_experience" defaultChecked={profile.school_group_experience} className="h-4 w-4 rounded border-alpine-300" />
            Ik heb ervaring met schoolgroepen
          </label>
        </div>
        <div className="mt-4">
          <Label htmlFor="pedagogical_background">Pedagogische achtergrond</Label>
          <Textarea
            id="pedagogical_background"
            name="pedagogical_background"
            defaultValue={profile.pedagogical_background ?? ""}
          />
        </div>
      </Section>

      <FormError>{state.error}</FormError>
      <FormMessage>{state.message}</FormMessage>

      <div className="sticky bottom-0 -mx-4 border-t border-alpine-100 bg-snow/95 px-4 py-4 backdrop-blur">
        <Button type="submit" variant="accent" disabled={pending}>
          {pending ? "Opslaan…" : "Profiel opslaan"}
        </Button>
      </div>
    </form>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm">
      <h3 className="font-display text-lg font-bold text-alpine-900">{title}</h3>
      {hint && <p className="mb-3 text-sm text-alpine-500">{hint}</p>}
      <div className={hint ? "" : "mt-4"}>{children}</div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number | null;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue ?? ""} />
    </div>
  );
}

function CheckboxGrid({
  label,
  name,
  options,
  selected,
}: {
  label: string;
  name: string;
  options: { id: string; label: string }[];
  selected?: string[];
}) {
  return (
    <div className="mb-4 last:mb-0">
      <Label>{label}</Label>
      <div className="grid gap-1.5 sm:grid-cols-3">
        {options.map((o) => (
          <label key={o.id} className="flex items-center gap-2 text-sm text-alpine-800">
            <input
              type="checkbox"
              name={name}
              value={o.id}
              defaultChecked={selected?.includes(o.id)}
              className="h-4 w-4 rounded border-alpine-300"
            />
            {o.label}
          </label>
        ))}
      </div>
    </div>
  );
}
