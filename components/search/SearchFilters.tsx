import { Button } from "@/components/ui/Button";
import { Label, Select } from "@/components/ui/form";
import { RESORTS } from "@/lib/constants/resorts";
import { LANGUAGES, SPECIALIZATIONS, AGE_GROUPS } from "@/lib/constants/options";
import type { Taal } from "@/lib/i18n/taal";

export interface SearchParams {
  resort?: string;
  language?: string;
  specialization?: string;
  age_group?: string;
  vog?: string;
  ehbo?: string;
  insurance?: string;
  isia?: string;
  school_group?: string;
  sort?: string;
}

/** Filterlabels. Alleen deze twee talen; zie lib/i18n/taal.ts. */
const L = {
  nl: {
    skigebied: "Skigebied", alleGebieden: "Alle gebieden",
    taal: "Taal", alleTalen: "Alle talen",
    specialisatie: "Specialisatie", alleSpecialisaties: "Alle specialisaties",
    leeftijd: "Leeftijdsgroep", alleLeeftijden: "Alle leeftijdsgroepen",
    vereisten: "Vereisten",
    vog: "VOG gecontroleerd", ehbo: "EHBO gecontroleerd",
    verzekerd: "Verzekerd", isia: "ISIA stamp", schoolgroep: "Schoolgroep-ervaring",
    sorteren: "Sorteren op", relevantie: "Relevantie",
    beoordeling: "Beoordeling", ervaring: "Ervaring",
    zoeken: "Zoeken",
  },
  de: {
    skigebied: "Skigebiet", alleGebieden: "Alle Skigebiete",
    taal: "Sprache", alleTalen: "Alle Sprachen",
    specialisatie: "Schwerpunkt", alleSpecialisaties: "Alle Schwerpunkte",
    leeftijd: "Altersgruppe", alleLeeftijden: "Alle Altersgruppen",
    vereisten: "Voraussetzungen",
    vog: "Führungszeugnis geprüft", ehbo: "Erste-Hilfe-Nachweis geprüft",
    verzekerd: "Haftpflicht versichert", isia: "ISIA Stamp",
    schoolgroep: "Erfahrung mit Schulklassen",
    sorteren: "Sortieren nach", relevantie: "Relevanz",
    beoordeling: "Bewertung", ervaring: "Erfahrung",
    zoeken: "Suchen",
  },
} as const;

export function SearchFilters({
  params,
  taal = "nl",
}: {
  params: SearchParams;
  taal?: Taal;
}) {
  const t = L[taal];

  return (
    <form
      method="GET"
      className="space-y-4 rounded-2xl border border-alpine-100 bg-white p-5 shadow-sm"
    >
      <div>
        <Label htmlFor="resort">{t.skigebied}</Label>
        <Select id="resort" name="resort" defaultValue={params.resort ?? ""}>
          <option value="">{t.alleGebieden}</option>
          {RESORTS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="language">{t.taal}</Label>
        <Select id="language" name="language" defaultValue={params.language ?? ""}>
          <option value="">{t.alleTalen}</option>
          {LANGUAGES.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="specialization">{t.specialisatie}</Label>
        <Select
          id="specialization"
          name="specialization"
          defaultValue={params.specialization ?? ""}
        >
          <option value="">{t.alleSpecialisaties}</option>
          {SPECIALIZATIONS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="age_group">{t.leeftijd}</Label>
        <Select id="age_group" name="age_group" defaultValue={params.age_group ?? ""}>
          <option value="">{t.alleLeeftijden}</option>
          {AGE_GROUPS.map((a) => (
            <option key={a.id} value={a.id}>
              {a.label}
            </option>
          ))}
        </Select>
      </div>

      <fieldset className="space-y-2">
        <legend className="mb-1 text-sm font-medium text-alpine-800">
          {t.vereisten}
        </legend>
        <Check name="vog" label={t.vog} checked={params.vog === "1"} />
        <Check name="ehbo" label={t.ehbo} checked={params.ehbo === "1"} />
        <Check name="insurance" label={t.verzekerd} checked={params.insurance === "1"} />
        <Check name="isia" label={t.isia} checked={params.isia === "1"} />
        <Check
          name="school_group"
          label={t.schoolgroep}
          checked={params.school_group === "1"}
        />
      </fieldset>

      <div>
        <Label htmlFor="sort">{t.sorteren}</Label>
        <Select id="sort" name="sort" defaultValue={params.sort ?? "relevance"}>
          <option value="relevance">{t.relevantie}</option>
          <option value="rating">{t.beoordeling}</option>
          <option value="experience">{t.ervaring}</option>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button type="submit" variant="primary" className="w-full">
          {t.zoeken}
        </Button>
      </div>
    </form>
  );
}

function Check({
  name,
  label,
  checked,
}: {
  name: string;
  label: string;
  checked: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-alpine-800">
      <input
        type="checkbox"
        name={name}
        value="1"
        defaultChecked={checked}
        className="h-4 w-4 rounded border-alpine-300"
      />
      {label}
    </label>
  );
}
