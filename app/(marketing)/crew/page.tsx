import type { Metadata } from "next";
import Link from "next/link";
import { canoniek, webpaginaJsonLd } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/marketing/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Strepen } from "@/components/huisstijl/Strepen";

const OMSCHRIJVING =
  "De Skimeister crew: Nederlandstalige skileraren die samen het seizoen in de Alpen ingaan. Gratis lid, VOG en EHBO gecontroleerd, opdrachten in één klik.";

export const metadata: Metadata = {
  ...canoniek("/crew"),
  title: "De crew: Nederlandstalige skileraren in de Alpen",
  description: OMSCHRIJVING,
};

const HOORT_ERBIJ = [
  {
    t: "Opdrachten eerst",
    d: "Skischolen, reisorganisaties en scholen zetten hun opdrachten op Skimeister. Nieuwe opdrachten in jouw gebieden krijg je in je mail, en reageren doe je in één klik.",
  },
  {
    t: "Samen op pad",
    d: "Bij veel opdrachten gaan meerdere skileraren tegelijk op pad. In februari 2027 bijvoorbeeld twee in Zell am See, drie in Bramberg en zes in Fügen.",
  },
  {
    t: "Het crewpak",
    d: "De crew rijdt in het zwarte Skimeister-pak met de drie strepen. Zo herkennen gasten én collega's je op de piste.",
  },
  {
    t: "Kennis voor je seizoen",
    d: "Van je eerste diploma tot werken bij een Oostenrijkse skischool: in de gidsen staat wat je moet weten.",
  },
];

const AFSPRAKEN = [
  "We geven les in het Nederlands, aan kinderen en volwassenen.",
  "Iedereen in de crew heeft een VOG en een EHBO-diploma; wij controleren ze met de hand.",
  "Minimaal ÖSV Anwärter of een vergelijkbaar diploma.",
  "Lid zijn is gratis, altijd.",
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={webpaginaJsonLd({
          pad: "/crew",
          naam: "De Skimeister crew",
          omschrijving: OMSCHRIJVING,
        })}
      />
      <PageHero
        eyebrow="Crew 26/27"
        title="De Skimeister crew"
        description="Nederlandstalige skileraren die samen het seizoen in de Alpen ingaan. Je vindt hier je opdrachten, je collega's en alles wat je moet weten."
        kleur="donker"
        kruimels={[{ naam: "De crew", pad: "/crew" }]}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <h2 className="text-3xl text-alpine-900 sm:text-4xl">Wat hoort erbij</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {HOORT_ERBIJ.map((v, i) => (
              <div key={v.t} className="rounded-2xl border border-alpine-100 bg-white p-7">
                <p className="text-xs font-bold uppercase tracking-widest text-piste-600">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 text-xl font-extrabold text-alpine-900">{v.t}</h3>
                <p className="mt-2 text-alpine-700">{v.d}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="op-donker bg-alpine-900 py-16 text-snow sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl">Waar de crew voor staat</h2>
            <ul className="mt-6 space-y-3">
              {AFSPRAKEN.map((a) => (
                <li key={a} className="flex gap-3 text-alpine-100">
                  <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-alpine-600 p-10">
            <p className="font-display text-5xl text-snow sm:text-6xl">skimeister</p>
            <Strepen className="mt-3 w-full max-w-xs" />
            <p className="mt-6 text-sm text-alpine-200">
              Het logo dat de crew op het pak draagt.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="text-center">
          <h2 className="text-3xl text-alpine-900 sm:text-4xl">Zo word je crewlid</h2>
          <ol className="mx-auto mt-10 grid max-w-4xl gap-5 text-left md:grid-cols-3">
            {[
              ["Maak je profiel", "Gratis, met je diploma's, je talen en de gebieden waar je wilt lesgeven."],
              ["Wij checken je papieren", "We controleren je VOG en EHBO met de hand."],
              ["Reageer en ga mee", "Kies een opdracht die bij je past en reageer in één klik."],
            ].map(([t, d], i) => (
              <li key={t} className="rounded-2xl border border-alpine-100 bg-white p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-piste-500 font-display text-lg text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-extrabold text-alpine-900">{t}</h3>
                <p className="mt-1 text-sm text-alpine-700">{d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/register" variant="accent" size="lg">
              Word crewlid
            </ButtonLink>
            <ButtonLink href="/opdrachten" variant="outline" size="lg">
              Bekijk de opdrachten
            </ButtonLink>
          </div>
          <p className="mt-6 text-sm text-alpine-600">
            Nog geen diploma?{" "}
            <Link href="/skileraar-worden" className="font-semibold text-piste-600 hover:underline">
              Zo word je skileraar
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
