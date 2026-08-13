import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/marketing/PageHero";
import { OpdrachtKaart } from "@/components/opdrachten/OpdrachtKaart";
import { getRecenteOpdrachten } from "@/lib/opdrachten/queries";

export const metadata: Metadata = {
  title: "Skileraren op Skimeister",
  description:
    "Skimeister koppelt gecertificeerde skileraren aan skischolen, reisorganisaties en scholen. VOG en EHBO worden handmatig gecontroleerd.",
  alternates: { canonical: "/instructeurs" },
};

export const revalidate = 300;

export default async function Page() {
  const opdrachten = await getRecenteOpdrachten(3);

  return (
    <>
      <PageHero
        eyebrow="Skileraren"
        title="Gecertificeerd, gecontroleerd, beschikbaar"
        description="Wij werven skileraren op de opdrachten die er zijn. Elke VOG en elk EHBO-certificaat wordt handmatig gecontroleerd voordat er een badge op een profiel verschijnt."
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
            <ButtonLink href="/fuer-skischulen" variant="outline">
              Een opdracht plaatsen
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
    </>
  );
}
