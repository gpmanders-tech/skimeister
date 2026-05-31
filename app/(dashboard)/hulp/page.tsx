import { PageHeader } from "@/components/dashboard/PageHeader";
import { RatioCalculator } from "@/components/RatioCalculator";

export const metadata = { title: "Hulp & ratio" };

const STEPS = [
  { t: "Plaats je schoolreis", d: "Maak een project aan met gebied, data, aantal leerlingen en niveau." },
  { t: "Betaal per project", d: "Reken eenvoudig af via iDEAL — je ontvangt een factuur." },
  { t: "Ontvang aanmeldingen", d: "Gecertificeerde instructeurs met schoolgroep-ervaring melden zich aan." },
  { t: "Selecteer & regel het contract", d: "Kies je instructeurs en gebruik de contract template." },
];

export default function HelpPage() {
  return (
    <>
      <PageHeader
        title="Hulp & ratio"
        subtitle="Stappenplan voor je schoolreis en de ratio calculator."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-display text-lg font-bold text-alpine-900">Stappenplan</h3>
          <ol className="space-y-4">
            {STEPS.map((s, i) => (
              <li key={s.t} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-piste-500 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-alpine-900">{s.t}</p>
                  <p className="text-sm text-alpine-600">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <RatioCalculator />
      </div>
    </>
  );
}
