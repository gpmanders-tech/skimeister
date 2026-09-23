import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/marketing/PageHero";
import { OpdrachtKaart } from "@/components/opdrachten/OpdrachtKaart";
import { getRecenteOpdrachten } from "@/lib/opdrachten/queries";
import { Tekstblokken } from "@/components/marketing/Tekstblokken";
import { Veelgesteld } from "@/components/marketing/Veelgesteld";
import { LeesOok } from "@/components/marketing/LeesOok";
import { JsonLd } from "@/components/seo/JsonLd";
import { webpaginaJsonLd } from "@/lib/seo";

const OMSCHRIJVING =
  "Skileraar zoeken? Skimeister koppelt gecertificeerde skileraren aan skischolen, reisorganisaties en scholen. VOG en EHBO handmatig gecontroleerd.";

export const metadata: Metadata = {
  title: "Skileraar zoeken: gecontroleerde skileraren",
  description: OMSCHRIJVING,
  alternates: { canonical: "/instructeurs" },
};

const VRAGEN = [
  {
    v: "Kan ik door profielen van skileraren bladeren?",
    a: "Je plaatst een opdracht en skileraren die beschikbaar zijn voor jouw week en jouw gebied reageren zelf. Dat werkt beter dan bladeren door profielen, omdat je alleen mensen ziet die echt kunnen.",
  },
  {
    v: "Hoe weet ik dat een skileraar betrouwbaar is?",
    a: "Wij controleren elke VOG en elk EHBO-certificaat handmatig voordat er een badge op een profiel verschijnt. Bij groepen met kinderen tonen we alleen skileraren met een geldige VOG.",
  },
  {
    v: "Wat kost een skileraar zoeken via Skimeister?",
    a: "Een opdracht plaatsen en reacties ontvangen is gratis. Skischolen en reisorganisaties betalen pas bij een bevestigde plaatsing, scholen betalen een vast bedrag per project. Alle bedragen staan op de prijzenpagina.",
  },
];

export const revalidate = 300;

export default async function Page() {
  const opdrachten = await getRecenteOpdrachten(3);

  return (
    <>
      <JsonLd
        data={webpaginaJsonLd({
          pad: "/instructeurs",
          naam: "Skileraar zoeken: gecertificeerd en gecontroleerd",
          omschrijving: OMSCHRIJVING,
        })}
      />
      <PageHero
        eyebrow="Skileraren"
        title="Skileraar zoeken: gecertificeerd en gecontroleerd"
        description="Wij werven skileraren op de opdrachten die er zijn. Elke VOG en elk EHBO-certificaat wordt handmatig gecontroleerd voordat er een badge op een profiel verschijnt."
        kruimels={[{ naam: "Skileraren", pad: "/instructeurs" }]}
      />

      <Container className="py-12 sm:py-16">
        {/* Vraag-eerst: laat zien wat er te doen is, niet een lege profielenlijst. */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-extrabold text-alpine-900">
            Op zoek naar een skileraar?
          </h2>
          <p className="mt-3 text-alpine-700">
            Plaats je opdracht, dan werven wij er gericht instructeurs bij. Dat
            werkt beter dan bladeren door profielen: je ziet alleen mensen die
            daadwerkelijk beschikbaar zijn voor jouw week en jouw gebied.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/opdrachten" variant="accent">
              Bekijk de open opdrachten
            </ButtonLink>
            <ButtonLink href="/skileraar-inhuren" variant="outline">
              Een skileraar inhuren
            </ButtonLink>
          </div>
        </div>

        {opdrachten.length > 0 ? (
          <div className="mt-12">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-alpine-500">
              Nu open
            </h3>
            <div className="grid gap-4 lg:grid-cols-3">
              {opdrachten.map((o) => (
                <OpdrachtKaart key={o.id} opdracht={o} />
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-12 rounded-2xl border border-alpine-100 bg-white p-6 text-center shadow-sm sm:p-8">
          <h3 className="font-display text-lg font-bold text-alpine-900">
            Zelf skileraar?
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-alpine-700">
            Maak een gratis profiel aan en reageer met één klik op de opdrachten
            die bij je passen. Aanmelden kost een paar minuten.
          </p>
          <ButtonLink href="/register" variant="primary" className="mt-5">
            Maak een gratis profiel aan
          </ButtonLink>
        </div>
      </Container>

      <Tekstblokken
        blokken={[
          {
            kop: "Wie vind je op Skimeister?",
            alineas: [
              "Skileraren en aspiranten uit Nederland en België die willen lesgeven in de Alpen of op een schoolreis. Op hun profiel staan hun certificering, ervaring en de weken waarin ze beschikbaar zijn. Alle gangbare diploma's komen voor: NEVSKI, BASI, ÖSV, DSV, Swiss Snowsports, FSBA/BVSL en de internationale ISIA-stamp.",
              "Het minimumniveau om via Skimeister aan het werk te gaan is ÖSV Schilehrer Anwärter of een vergelijkbaar diploma. In je opdracht geef je zelf aan welk niveau je vraagt.",
            ],
          },
          {
            kop: "Zo zoek je een skileraar",
            alineas: [
              "Zet je opdracht op het board met het skigebied, de periode, de gevraagde certificering en de vergoeding. Skileraren die passen reageren met één klik. Jij bekijkt de reacties, ziet welke documenten gecontroleerd zijn en neemt zelf contact op met wie je wilt spreken.",
            ],
          },
        ]}
      />

      <Veelgesteld titel="Veelgestelde vragen over een skileraar zoeken" vragen={VRAGEN} />

      <LeesOok
        links={[
          {
            href: "/skileraar-inhuren",
            titel: "Skileraar inhuren",
            tekst: "Stap voor stap een skileraar inhuren voor je skischool, reis of schoolreis.",
          },
          {
            href: "/prijzen",
            titel: "Prijzen",
            tekst: "Gratis plaatsen, betalen pas bij een bevestigde plaatsing.",
          },
          {
            href: "/werken-als-skileraar",
            titel: "Werken als skileraar",
            tekst: "Zelf skileraar? Lees hoe je via Skimeister aan werk komt.",
          },
        ]}
      />
    </>
  );
}
