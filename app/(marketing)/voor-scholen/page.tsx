import type { Metadata } from "next";
import { canoniek, webpaginaJsonLd } from "@/lib/seo";
import { Tekstblokken } from "@/components/marketing/Tekstblokken";
import { Veelgesteld } from "@/components/marketing/Veelgesteld";
import { JsonLd } from "@/components/seo/JsonLd";
import { SCHOOL_PROJECT_PRIJS } from "@/lib/constants/pricing";

const OMSCHRIJVING =
  "Een skileraar voor je schoolreis: plaats je project, ontvang aanmeldingen van instructeurs met gecontroleerde VOG en betaal een vast bedrag per reis.";

const VRAGEN = [
  {
    v: "Wat kost een schoolreis-project?",
    a: `€ ${SCHOOL_PROJECT_PRIJS} per schoolreis-project, exclusief btw. Daar zit de contracttemplate en de ratio calculator bij. Er is geen plaatsingsfee en geen abonnement.`,
  },
  {
    v: "Is een VOG verplicht voor een skileraar op schoolreis?",
    a: "Bij groepen met kinderen tonen we alleen instructeurs met een geldige VOG. Wij controleren de VOG en het EHBO-certificaat handmatig.",
  },
  {
    v: "Hoeveel skileraren heb ik nodig voor mijn groep?",
    a: "Dat hangt af van het aantal leerlingen en hun niveau. Met de ratio calculator op deze pagina reken je het direct uit.",
  },
  {
    v: "Waarom betalen scholen per project en niet per plaatsing?",
    a: "Een schoolreis heeft meestal meerdere instructeurs tegelijk nodig. Eén vast bedrag per project is voor een school beter te begroten dan een bedrag per persoon.",
  },
];
import { AudiencePage } from "@/components/marketing/AudiencePage";
import { Container } from "@/components/ui/Container";
import { RatioCalculator } from "@/components/RatioCalculator";

export const metadata: Metadata = {
  ...canoniek("/voor-scholen"),
  title: "Skileraar voor je schoolreis regelen",
  description: OMSCHRIJVING,
};

export default function Page() {
  return (
    <>
    <JsonLd
      data={webpaginaJsonLd({
        pad: "/voor-scholen",
        naam: "Skileraar voor je schoolreis regelen",
        omschrijving: OMSCHRIJVING,
      })}
    />
    <AudiencePage
      kruimels={[{ naam: "Voor scholen", pad: "/voor-scholen" }]}
      content={{
        eyebrow: "Voor scholen (NL/BE)",
        title: "Gegarandeerd de juiste skileraar voor jouw schoolreis",
        description:
          "Organiseer je jaarlijkse schoolreis zonder gedoe. Plaats een project, ontvang aanmeldingen en betaal eenvoudig per reis.",
        steps: [
          { t: "Plaats je schoolreis", d: "Simpel formulier: gebied, data, aantal leerlingen en niveau." },
          { t: "Ontvang aanmeldingen", d: "Gecertificeerde instructeurs met schoolgroep-ervaring melden zich aan." },
          { t: "Regel het contract", d: "Gebruik onze contract template en ratio calculator." },
        ],
        benefits: [
          { t: "Betaal per project", d: "Geen abonnement: € 79 per schoolreis-project, inclusief contracttemplate en ratio calculator." },
          { t: "VOG verplicht bij kinderen", d: "Bij groepen met kinderen tonen we alleen instructeurs met geldige VOG." },
          { t: "Ratio calculator", d: "Bereken direct hoeveel instructeurs je nodig hebt voor jouw groep." },
          { t: "Schoolgroep-ervaring", d: "Filter op instructeurs die ervaring hebben met schoolreizen." },
        ],
        ctaTitle: "Regel de skileraar voor jouw schoolreis",
        ctaHref: "/register",
        ctaLabel: "Start als school",
      }}
    >
      <Tekstblokken
        blokken={[
          {
            kop: "Skileraren voor een schoolreis naar de sneeuw",
            alineas: [
              "Een schoolreis naar de sneeuw staat of valt met goede begeleiding op de piste. Leerlingen hebben verschillende niveaus, de groep is groot en de verantwoordelijkheid ligt bij de school. Daarom zoek je skileraren die ervaring hebben met schoolgroepen en van wie je zeker weet dat VOG en EHBO in orde zijn.",
              "Via Skimeister plaats je je schoolreis als project met gebied, data, aantal leerlingen en niveau. Gecertificeerde instructeurs met schoolgroep-ervaring melden zich aan. Met de contracttemplate leg je de afspraken vast en met de ratio calculator reken je uit hoeveel skileraren je nodig hebt.",
            ],
          },
        ]}
      />
    </AudiencePage>
    <section className="py-16">
      <Container className="max-w-2xl">
        <RatioCalculator />
      </Container>
    </section>
    <Veelgesteld titel="Veelgestelde vragen van scholen" vragen={VRAGEN} />
    </>
  );
}
