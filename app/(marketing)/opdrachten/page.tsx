import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { OpdrachtKaart } from "@/components/opdrachten/OpdrachtKaart";
import { OpdrachtFilters } from "@/components/opdrachten/OpdrachtFilters";
import { getOpenOpdrachten } from "@/lib/opdrachten/queries";
import { Broodkruimels } from "@/components/marketing/Broodkruimels";
import { Tekstblokken } from "@/components/marketing/Tekstblokken";
import { Veelgesteld } from "@/components/marketing/Veelgesteld";
import { LeesOok } from "@/components/marketing/LeesOok";
import { JsonLd } from "@/components/seo/JsonLd";
import { webpaginaJsonLd } from "@/lib/seo";

const OMSCHRIJVING =
  "Vacatures voor skileraren in de Alpen: skigebied, periode, certificering en vergoeding per opdracht. Vrij te bekijken, reageren met een gratis profiel.";

// Doelterm van deze pagina: "vacature skileraar" (zie plan.json van de SEO Agent).
export const metadata: Metadata = {
  title: "Vacatures skileraar: open opdrachten in de Alpen",
  description: OMSCHRIJVING,
  alternates: { canonical: "/opdrachten" },
};

const VRAGEN = [
  {
    v: "Wat voor vacatures voor skileraren staan hier?",
    a: "Opdrachten van skischolen in de Alpen, van reisorganisaties die met groepen op wintersport gaan en van scholen in Nederland en België met een schoolreis. Per opdracht zie je het skigebied, de periode, de gevraagde certificering en de vergoeding.",
  },
  {
    v: "Hoe reageer ik op een vacature als skileraar?",
    a: "Maak een gratis profiel aan en reageer met één klik op de opdracht die bij je past. Een bericht erbij mag, maar hoeft niet. De opdrachtgever neemt daarna zelf contact met je op.",
  },
  {
    v: "Welk diploma heb ik minimaal nodig?",
    a: "Het minimumniveau om via Skimeister aan het werk te gaan is ÖSV Schilehrer Anwärter of een vergelijkbaar diploma. Per opdracht staat welke certificering de opdrachtgever vraagt.",
  },
  {
    v: "Kost reageren op een opdracht geld?",
    a: "Nee. Voor skileraren en aspiranten is Skimeister altijd gratis, ook het reageren op opdrachten.",
  },
  {
    v: "Hoor ik het als er een nieuwe opdracht bijkomt?",
    a: "Ja. Leg in je profiel vast wanneer je beschikbaar bent, dan krijg je een mail zodra er een opdracht binnenkomt die bij je past.",
  },
];

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
      <JsonLd
        data={webpaginaJsonLd({
          pad: "/opdrachten",
          naam: "Vacatures en opdrachten voor skileraren",
          omschrijving: OMSCHRIJVING,
          type: "CollectionPage",
        })}
      />
      <section className="bg-alpine-600 py-12 text-white sm:py-16">
        <Container>
          <Broodkruimels kruimels={[{ naam: "Opdrachten", pad: "/opdrachten" }]} />
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
            Vacatures en opdrachten voor skileraren
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

      <Tekstblokken
        blokken={[
          {
            kop: "Een vacature als skileraar, zonder omwegen",
            alineas: [
              "Op dit board staan de opdrachten van skischolen, reisorganisaties en scholen die een skileraar zoeken. Alles staat open en volledig zichtbaar: je hoeft geen account te hebben om te zien waar het werk is, wanneer het is en wat het oplevert. Zo kies je zelf wat bij je past.",
              "Filter op skigebied, periode of certificering om snel te vinden wat past bij je diploma en je agenda. Reageren gaat met één klik vanuit je gratis profiel. De opdrachtgever ziet je certificering en je gecontroleerde documenten en neemt daarna zelf contact met je op.",
            ],
          },
          {
            kop: "Waarom opdrachtgevers hier zoeken",
            alineas: [
              "Skimeister controleert de VOG en het EHBO-certificaat van elke skileraar handmatig. Pas daarna verschijnt er een badge op het profiel. Voor opdrachtgevers die met groepen of kinderen werken is dat precies wat ze willen weten, en voor jou betekent het dat je die papieren niet voor elke opdracht opnieuw hoeft op te sturen.",
            ],
          },
        ]}
      />

      <Veelgesteld titel="Veelgestelde vragen over vacatures voor skileraren" vragen={VRAGEN} />

      <LeesOok
        links={[
          {
            href: "/werken-als-skileraar",
            titel: "Werken als skileraar",
            tekst: "Voor wie je werkt, welke diploma's je nodig hebt en hoe een seizoen werkt.",
          },
          {
            href: "/skileraar-worden",
            titel: "Skileraar worden",
            tekst: "Nog geen diploma? Zo begin je aan de opleiding.",
          },
          {
            href: "/skileraar-inhuren",
            titel: "Zelf een skileraar zoeken?",
            tekst: "Plaats gratis een opdracht voor je skischool, reis of schoolreis.",
          },
        ]}
      />
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
