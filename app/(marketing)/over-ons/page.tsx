import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Over ons",
  description: "Het verhaal achter Skimeister.nl — de verbinding tussen skileraren en de skipiste.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Over ons"
        title="De verbinding tussen skileraren en de skipiste"
      />
      <Container className="prose-page py-16">
        <div className="mx-auto max-w-2xl space-y-5 text-alpine-800">
          <p>
            Skimeister.nl is ontstaan uit een simpele constatering: goede
            skileraren en de partijen die hen zoeken — skischolen,
            reisorganisaties en scholen — vinden elkaar veel te moeilijk.
          </p>
          <p>
            Wij brengen die werelden samen op één Nederlandstalig platform.
            Instructeurs maken gratis een profiel aan, tonen hun certificeringen
            en beschikbaarheid, en worden gevonden door organisaties in heel de
            Alpen.
          </p>
          <p>
            Voor skischolen, reisorganisaties en scholen betekent dat: sneller de
            juiste, gecertificeerde en verzekerde skileraar vinden — met VOG en
            EHBO inzichtelijk en betrouwbaar geregeld.
          </p>
          <p className="font-semibold text-alpine-900">
            Eén platform voor het hele skiseizoen.
          </p>
        </div>
      </Container>
    </>
  );
}
