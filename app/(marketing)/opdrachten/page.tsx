import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { OpdrachtKaart } from "@/components/opdrachten/OpdrachtKaart";
import { OpdrachtFilters } from "@/components/opdrachten/OpdrachtFilters";
import { getOpenOpdrachten } from "@/lib/opdrachten/queries";

export const metadata: Metadata = {
  title: "Opdrachten voor skileraren",
  description:
    "Alle open opdrachten voor skileraren in de Alpen: skigebied, periode, gevraagde certificering en vergoeding. Vrij te bekijken, reageren kan met een gratis profiel.",
  alternates: { canonical: "/opdrachten" },
};

// Het board moet altijd de actuele stand tonen, niet een gecachte versie.
export const dynamic = "force-dynamic";

export default async function OpdrachtenPage({
  searchParams,
}: {
  searchParams: Promise<{ resort?: string; van?: string; tot?: string; cert?: string }>;
}) {
  const filters = await searchParams;
  const opdrachten = await getOpenOpdrachten(filters);
  const heeftFilter = Boolean(filters.resort || filters.van || filters.tot || filters.cert);

  return (
    <>
      <section className="bg-alpine-600 py-12 text-white sm:py-16">
        <Container>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
            Opdrachten voor skileraren
          </h1>
          <p className="mt-3 max-w-2xl text-alpine-100">
            Echte opdrachten van skischolen, reisorganisaties en scholen. Alles is
            vrij te bekijken. Reageren kan met een gratis profiel, in één klik.
          </p>
        </Container>
      </section>

      <section className="py-8 sm:py-12">
        <Container>
          <OpdrachtFilters actief={filters} />

          <div className="mt-6 flex items-baseline justify-between gap-4">
            <p className="text-sm text-alpine-600">
              {opdrachten.length === 0
                ? "Geen opdrachten gevonden"
                : `${opdrachten.length} open ${opdrachten.length === 1 ? "opdracht" : "opdrachten"}`}
            </p>
          </div>

          {opdrachten.length > 0 ? (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {opdrachten.map((o) => (
                <OpdrachtKaart key={o.id} opdracht={o} />
              ))}
            </div>
          ) : (
            <LegeStaat heeftFilter={heeftFilter} />
          )}
        </Container>
      </section>
    </>
  );
}

function LegeStaat({ heeftFilter }: { heeftFilter: boolean }) {
  return (
    <div className="mt-4 rounded-2xl border border-dashed border-alpine-200 bg-white p-8 text-center sm:p-12">
      {heeftFilter ? (
        <>
          <h2 className="font-display text-xl font-bold text-alpine-900">
            Geen opdracht die hierop past
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-alpine-700">
            Probeer een ruimere periode of een ander skigebied.
          </p>
          <Link
            href="/opdrachten"
            className="mt-5 inline-block rounded-xl bg-alpine-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-alpine-700"
          >
            Bekijk alle opdrachten
          </Link>
        </>
      ) : (
        <>
          <h2 className="font-display text-xl font-bold text-alpine-900">
            Nog geen open opdrachten
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-alpine-700">
            We zijn in opbouw voor seizoen 2026/27. Maak een profiel aan, dan krijg
            je een mail zodra er een opdracht binnenkomt die bij je past.
          </p>
          <Link
            href="/register"
            className="mt-5 inline-block rounded-xl bg-piste-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-piste-600"
          >
            Maak een gratis profiel aan
          </Link>
        </>
      )}
    </div>
  );
}
