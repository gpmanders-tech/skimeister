import { Button } from "@/components/ui/Button";
import { Label, Select } from "@/components/ui/form";
import { RESORTS } from "@/lib/constants/resorts";
import { LANGUAGES, SPECIALIZATIONS, AGE_GROUPS } from "@/lib/constants/options";

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

export function SearchFilters({ params }: { params: SearchParams }) {
  return (
    <form
      method="GET"
      className="space-y-4 rounded-2xl border border-alpine-100 bg-white p-5 shadow-sm"
    >
      <div>
        <Label htmlFor="resort">Skigebied</Label>
        <Select id="resort" name="resort" defaultValue={params.resort ?? ""}>
          <option value="">Alle gebieden</option>
          {RESORTS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="language">Taal</Label>
        <Select id="language" name="language" defaultValue={params.language ?? ""}>
          <option value="">Alle talen</option>
          {LANGUAGES.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="specialization">Specialisatie</Label>
        <Select
          id="specialization"
          name="specialization"
          defaultValue={params.specialization ?? ""}
        >
          <option value="">Alle specialisaties</option>
          {SPECIALIZATIONS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="age_group">Leeftijdsgroep</Label>
        <Select id="age_group" name="age_group" defaultValue={params.age_group ?? ""}>
          <option value="">Alle leeftijdsgroepen</option>
          {AGE_GROUPS.map((a) => (
            <option key={a.id} value={a.id}>
              {a.label}
            </option>
          ))}
        </Select>
      </div>

      <fieldset className="space-y-2">
        <legend className="mb-1 text-sm font-medium text-alpine-800">
          Vereisten
        </legend>
        <Check name="vog" label="VOG geverifieerd" checked={params.vog === "1"} />
        <Check name="ehbo" label="EHBO geverifieerd" checked={params.ehbo === "1"} />
        <Check name="insurance" label="Verzekerd" checked={params.insurance === "1"} />
        <Check name="isia" label="ISIA stamp" checked={params.isia === "1"} />
        <Check
          name="school_group"
          label="Schoolgroep-ervaring"
          checked={params.school_group === "1"}
        />
      </fieldset>

      <div>
        <Label htmlFor="sort">Sorteren op</Label>
        <Select id="sort" name="sort" defaultValue={params.sort ?? "relevance"}>
          <option value="relevance">Relevantie</option>
          <option value="rating">Beoordeling</option>
          <option value="experience">Ervaring</option>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button type="submit" variant="primary" className="w-full">
          Zoeken
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
