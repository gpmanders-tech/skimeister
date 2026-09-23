import type { Metadata } from "next";
import Link from "next/link";
import { canoniek, webpaginaJsonLd } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";

const OMSCHRIJVING =
  "Het verhaal achter Skimeister.nl: waarom we skileraren en skischolen, reisorganisaties en scholen samenbrengen, en hoe we VOG en EHBO controleren.";

export const metadata: Metadata = {
  ...canoniek("/over-ons"),
  title: "Over ons: waarom Skimeister bestaat",
  description: OMSCHRIJVING,
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={webpaginaJsonLd({
          pad: "/over-ons",
          naam: "Over Skimeister.nl",
          omschrijving: OMSCHRIJVING,
          type: "AboutPage",
        })}
      />
      <PageHero
        eyebrow="Over ons"
        title="De verbinding tussen skileraren en de skipiste"
        kruimels={[{ naam: "Over ons", pad: "/over-ons" }]}
      />
      <Container className="prose-page py-16">
        <div className="mx-auto max-w-2xl space-y-5 text-alpine-800">
          <p>
            Skimeister.nl is ontstaan uit een simpele constatering: goede
            skileraren en de partijen die hen zoeken, zoals skischolen,
            reisorganisaties en scholen, vinden elkaar veel te moeilijk.
          </p>
          <p>
            Wij brengen die werelden samen op één Nederlandstalig platform.
            Instructeurs maken gratis een profiel aan, tonen hun certificeringen
            en beschikbaarheid, en worden gevonden door organisaties in heel de
            Alpen.
          </p>
          <p>
            Voor skischolen, reisorganisaties en scholen betekent dat: sneller de
            juiste, gecertificeerde skileraar vinden, met VOG en EHBO inzichtelijk
            en betrouwbaar geregeld.
          </p>

          <h2 className="pt-4 font-display text-2xl font-bold text-alpine-900">
            Opdrachten staan open, voor iedereen
          </h2>
          <p>
            De kern van Skimeister is het{" "}
            <Link href="/opdrachten" className="font-semibold text-piste-600 hover:underline">
              opdrachtenboard
            </Link>
            . Skischolen, reisorganisaties en scholen plaatsen daar hun werk, met
            skigebied, periode, gevraagde certificering en vergoeding. Alles is
            vrij te bekijken, ook zonder account. Skileraren reageren met één
            klik en de opdrachtgever neemt daarna zelf contact op.
          </p>

          <h2 className="pt-4 font-display text-2xl font-bold text-alpine-900">
            Handmatig gecontroleerd
          </h2>
          <p>
            Wie met groepen werkt, en zeker met kinderen, wil weten wie er voor de
            groep staat. Daarom controleren wij elke VOG en elk EHBO-certificaat
            met de hand. Pas na die controle verschijnt er een badge op een
            profiel, nooit automatisch.
          </p>

          <h2 className="pt-4 font-display text-2xl font-bold text-alpine-900">
            Eerlijk geprijsd
          </h2>
          <p>
            Skileraren en aspiranten betalen nooit iets. Organisaties plaatsen
            gratis een opdracht en betalen pas als er iemand daadwerkelijk
            geplaatst is. Scholen betalen een vast bedrag per project. Alle
            bedragen staan op de{" "}
            <Link href="/prijzen" className="font-semibold text-piste-600 hover:underline">
              prijzenpagina
            </Link>
            .
          </p>

          <h2 className="pt-4 font-display text-2xl font-bold text-alpine-900">
            In opbouw voor seizoen 2026/27
          </h2>
          <p>
            We bouwen Skimeister op met de eerste lichting skileraren en
            opdrachtgevers voor seizoen 2026/27. Ben je skileraar, lees dan hoe
            het{" "}
            <Link href="/werken-als-skileraar" className="font-semibold text-piste-600 hover:underline">
              werken als skileraar
            </Link>{" "}
            via Skimeister gaat. Zoek je er een, kijk dan hoe je een{" "}
            <Link href="/skileraar-inhuren" className="font-semibold text-piste-600 hover:underline">
              skileraar inhuurt
            </Link>
            .
          </p>
          <p className="font-semibold text-alpine-900">
            Eén platform voor het hele skiseizoen.
          </p>
        </div>
      </Container>
    </>
  );
}
