import type { Metadata } from "next";
import { webpaginaJsonLd } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/marketing/PageHero";
import { Tekstblokken, type Tekstblok } from "@/components/marketing/Tekstblokken";
import { Veelgesteld } from "@/components/marketing/Veelgesteld";
import { LeesOok } from "@/components/marketing/LeesOok";
import { JsonLd } from "@/components/seo/JsonLd";
import { LANCERINGSACTIE, PLAATSINGSFEE, SCHOOL_PROJECT_PRIJS } from "@/lib/constants/pricing";

/**
 * Landingspagina op "skileraar inhuren" en "skileraar zoeken" voor
 * opdrachtgevers. Prijzen komen uit lib/constants/pricing.ts, zodat deze
 * pagina nooit iets anders zegt dan /prijzen.
 */

const OMSCHRIJVING =
  "Skileraar inhuren voor je skischool, groepsreis of schoolreis? Plaats gratis een opdracht en bereik skileraren met handmatig gecontroleerde VOG en EHBO.";

export const metadata: Metadata = {
  // Wederzijdse hreflang met de Duitse skischolenpagina.
  alternates: {
    canonical: "/skileraar-inhuren",
    languages: {
      "nl-NL": "/skileraar-inhuren",
      "de-DE": "/fuer-skischulen",
    },
  },
  title: "Skileraar inhuren voor je groep of skischool",
  description: OMSCHRIJVING,
};

const BLOKKEN: Tekstblok[] = [
  {
    kop: "Een skileraar zoeken zonder rondbellen",
    alineas: [
      "Een goede skileraar vinden voor een drukke week, een groepsreis of de jaarlijkse schoolreis kost vaak veel tijd. Je vraagt rond in je netwerk, zet een oproep online en moet daarna zelf nagaan of diploma's, VOG en EHBO in orde zijn. Skimeister draait dat om: je zet je opdracht op het board en skileraren die beschikbaar zijn reageren zelf.",
      "Op de opdracht staan het skigebied, de periode, de gevraagde certificering en de vergoeding. Skileraren zien in één oogopslag of het bij ze past en reageren met één klik. Jij bekijkt de reacties en neemt zelf contact op met wie je wilt spreken.",
    ],
  },
  {
    kop: "Zo huur je een skileraar in via Skimeister",
    alineas: [],
    punten: [
      "Plaats je opdracht: gebied, periode, niveau van de groep, gevraagde certificering en hoeveel skileraren je nodig hebt.",
      "Ontvang reacties van skileraren die in jouw periode beschikbaar zijn. Je ziet hun certificering, ervaring en gecontroleerde documenten.",
      "Neem zelf contact op, maak afspraken en kies wie er voor je groep komt te staan.",
    ],
  },
  {
    kop: "Gecontroleerd, niet alleen beloofd",
    alineas: [
      "Wij controleren de VOG en het EHBO-certificaat van elke skileraar handmatig. Pas na die controle verschijnt er een badge op het profiel, nooit automatisch. Bij groepen met kinderen tonen we alleen skileraren met een geldige VOG. Zo weet je wie er voor je groep staat.",
    ],
  },
  {
    kop: "Wat kost een skileraar inhuren via Skimeister?",
    alineas: [
      `Een opdracht plaatsen en reacties ontvangen is gratis. Skischolen en reisorganisaties betalen € ${PLAATSINGSFEE} per skileraar die daadwerkelijk geplaatst is, achteraf. Er is geen abonnement en er zijn geen kosten vooraf. Scholen in Nederland en België betalen € ${SCHOOL_PROJECT_PRIJS} per schoolreis-project, inclusief contracttemplate en ratio calculator. De genoemde bedragen zijn exclusief btw.`,
      `Lanceringsactie: ${LANCERINGSACTIE}`,
      "De vergoeding voor de skileraar staat bij je opdracht vermeld, zodat iedere skileraar vooraf weet waar hij aan toe is.",
    ],
  },
];

const VRAGEN = [
  {
    v: "Hoe snel kan ik een skileraar inhuren?",
    a: "Je opdracht plaatsen duurt een paar minuten. Skileraren die in jouw periode beschikbaar zijn kunnen daarna direct reageren. Hoe snel je iemand vindt, hangt af van het gebied, de periode en het gevraagde niveau.",
  },
  {
    v: "Betaal ik ook als er niemand geschikt reageert?",
    a: "Nee. Skischolen en reisorganisaties betalen pas bij een bevestigde plaatsing. Zit er niemand geschikt tussen, dan betaal je niets en zit je nergens aan vast.",
  },
  {
    v: "Welke diploma's hebben de skileraren?",
    a: "Skileraren vermelden hun certificering op hun profiel, bijvoorbeeld NEVSKI, BASI, ÖSV, DSV, Swiss Snowsports, FSBA/BVSL of ISIA. Het minimumniveau voor opdrachten via Skimeister is ÖSV Schilehrer Anwärter of vergelijkbaar. In je opdracht geef je aan welk niveau je vraagt.",
  },
  {
    v: "In welke skigebieden kan ik een skileraar inhuren?",
    a: "Skimeister richt zich op 27 skigebieden in Oostenrijk, Zwitserland en Frankrijk, van St. Anton en Kitzbühel tot Verbier en Val d'Isère.",
  },
  {
    v: "Ik ben een skischool in Oostenrijk. Is er een Duitse pagina?",
    a: "Ja. Voor skischolen staat alle uitleg in het Duits op de pagina Für Skischulen. Wie als skischool inlogt, ziet het hele platform in het Duits.",
  },
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={webpaginaJsonLd({
          pad: "/skileraar-inhuren",
          naam: "Skileraar inhuren voor je groep of skischool",
          omschrijving: OMSCHRIJVING,
        })}
      />
      <PageHero
        eyebrow="Voor opdrachtgevers"
        title="Skileraar inhuren voor je groep of skischool"
        description="Plaats gratis een opdracht en bereik skileraren met handmatig gecontroleerde VOG en EHBO. Je betaalt pas als er iemand geplaatst is."
        kruimels={[{ naam: "Skileraar inhuren", pad: "/skileraar-inhuren" }]}
      />

      <Tekstblokken blokken={BLOKKEN} />

      <Container className="pb-4">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <p className="font-display text-lg font-bold text-alpine-900">
            Een opdracht plaatsen kost niets.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" variant="accent">
              Plaats een opdracht
            </ButtonLink>
            <ButtonLink href="/prijzen" variant="outline">
              Bekijk de prijzen
            </ButtonLink>
          </div>
        </div>
      </Container>

      <Veelgesteld titel="Veelgestelde vragen over een skileraar inhuren" vragen={VRAGEN} achtergrond={false} />

      <LeesOok
        titel="Per soort opdrachtgever"
        pijl="Meer weten"
        links={[
          {
            href: "/fuer-skischulen",
            titel: "Für Skischulen",
            tekst: "Geprüfte Skilehrer für Ihre Saison, auf Deutsch erklärt.",
          },
          {
            href: "/voor-reisorganisaties",
            titel: "Voor reisorganisaties",
            tekst: "Skileraren per reis werven en je hele seizoen op één plek plannen.",
          },
          {
            href: "/voor-scholen",
            titel: "Voor scholen",
            tekst: "Een skileraar voor je schoolreis, met VOG en ratio calculator.",
          },
        ]}
      />
    </>
  );
}
