import type { Metadata } from "next";
import { canoniek } from "@/lib/seo";
import { AudiencePage } from "@/components/marketing/AudiencePage";
import { Container } from "@/components/ui/Container";
import { PartnerCard } from "@/components/marketing/PartnerCard";
import { TRAINING_PARTNER } from "@/lib/constants/partners";
import { Tekstblokken } from "@/components/marketing/Tekstblokken";
import { Veelgesteld } from "@/components/marketing/Veelgesteld";
import { LeesOok } from "@/components/marketing/LeesOok";
import { JsonLd } from "@/components/seo/JsonLd";
import { CERT_PER_LAND, webpaginaJsonLd } from "@/lib/seo";

const OMSCHRIJVING =
  "Skileraar worden: van goed skiën naar een diploma als ÖSV Anwärter of NEVSKI en betaald werk in de Alpen. De route stap voor stap, en gratis werk vinden.";

export const metadata: Metadata = {
  ...canoniek("/skileraar-worden"),
  title: "Skileraar worden: opleiding, diploma en werk",
  description: OMSCHRIJVING,
};

const VRAGEN = [
  {
    v: "Hoe word je skileraar?",
    a: "Zorg eerst dat je zelf vlot en gecontroleerd skiet op rode en zwarte pistes. Kies daarna een opleiding, bijvoorbeeld bij NEVSKI in Nederland of een ÖSV-opleiding in Oostenrijk, en haal je diploma. Met je diploma kun je aan de slag bij skischolen, reisorganisaties en scholen.",
  },
  {
    v: "Welk diploma heb je minimaal nodig om les te geven?",
    a: "Via Skimeister is het minimumniveau ÖSV Schilehrer Anwärter of een vergelijkbaar diploma. Het Oostenrijkse Anwärter-diploma is bij veel skischolen het instapniveau.",
  },
  {
    v: "Hoe lang duurt een opleiding tot skileraar?",
    a: "Een opleiding combineert theorie, zoals didactiek, veiligheid en sneeuwkunde, met veel praktijk. Reken op een aantal weken training en een examen. De precieze duur hangt af van het instituut en het niveau.",
  },
  {
    v: "Kan ik me al aanmelden zonder diploma?",
    a: "Ja. Meld je gratis aan als aspirant. Dan volgen we je voortgang en kun je je certificaat uploaden zodra je het hebt.",
  },
  {
    v: "Wat kost Skimeister voor een skileraar?",
    a: "Niets. Instructeurs en aspiranten betalen nooit voor Skimeister, niet voor hun profiel en niet voor reageren op opdrachten.",
  },
];

export default function Page() {
  return (
    <>
    <JsonLd
      data={webpaginaJsonLd({
        pad: "/skileraar-worden",
        naam: "Skileraar worden: opleiding, diploma en werk",
        omschrijving: OMSCHRIJVING,
      })}
    />
    <AudiencePage
      kruimels={[{ naam: "Skileraar worden", pad: "/skileraar-worden" }]}
      content={{
        eyebrow: "Voor instructeurs & aspiranten",
        title: "Start jouw carrière op de piste",
        description:
          "Of je nu al gecertificeerd bent of nog wilt beginnen: Skimeister helpt je aan werk als skileraar. Gratis, altijd.",
        steps: [
          { t: "Meld je aan", d: "Maak een gratis profiel aan als instructeur of aspirant." },
          { t: "Behaal je certificaat", d: "Aspirant? Volg de opleiding via onze partner en haal je Anwärter." },
          { t: "Vind werk", d: "Word zichtbaar voor skischolen en meld je aan op projecten." },
        ],
        benefits: [
          { t: "Altijd gratis", d: "Instructeurs en aspiranten betalen nooit voor Skimeister." },
          { t: "Eén profiel, veel werk", d: "Word gevonden door skischolen, reisorganisaties én scholen." },
          { t: "Beschikbaarheidskalender", d: "Markeer per week wanneer je beschikbaar bent voor het seizoen." },
          { t: "Opbouw van reviews", d: "Verzamel beoordelingen en versterk je profiel seizoen na seizoen." },
        ],
        ctaTitle: "Klaar om aan de slag te gaan op de piste?",
        ctaHref: "/register",
        ctaLabel: "Maak gratis profiel aan",
      }}
    >
      <Tekstblokken
        titel="De route naar skileraar, stap voor stap"
        intro="Skileraar worden is voor veel wintersporters een droom: betaald worden om de hele dag op de piste te staan. De route is overzichtelijk als je weet welke stappen er zijn."
        blokken={[
          {
            kop: "1. Zorg dat je zelf goed kunt skiën",
            alineas: [
              "Voordat je aan een opleiding begint, moet je vlot en gecontroleerd kunnen skiën op rode en zwarte pistes. Veel opleidingen beginnen met een instaptoets, dus oefen vooral op techniek en controle, niet op snelheid.",
            ],
          },
          {
            kop: "2. Kies een opleiding en een niveau",
            alineas: [
              "In Nederland kun je terecht bij NEVSKI. Internationaal zijn er onder meer BASI in het Verenigd Koninkrijk en ÖSV in Oostenrijk. Het Oostenrijkse Anwärter-diploma is bij veel skischolen het instapniveau en is ook het minimum om via Skimeister aan het werk te gaan.",
              `Kijk ook naar het land waar je wilt werken. ${CERT_PER_LAND.Oostenrijk.toelichting}`,
              `${CERT_PER_LAND.Zwitserland.toelichting} ${CERT_PER_LAND.Frankrijk.toelichting}`,
            ],
          },
          {
            kop: "3. Haal je diploma",
            alineas: [
              "Een opleiding combineert theorie, zoals didactiek, veiligheid en sneeuwkunde, met veel praktijk op de piste. Reken op een aantal weken training en een examen. Zorg daarnaast voor een geldig EHBO-certificaat en vraag een VOG aan: zonder die twee kom je bij groepen met kinderen niet aan de slag.",
            ],
          },
          {
            kop: "4. Vind je eerste werk",
            alineas: [
              "Met je diploma op zak kun je reageren op opdrachten van skischolen, reisorganisaties en scholen. Op Skimeister staan alle opdrachten open, met skigebied, periode, gevraagde certificering en vergoeding. Reageren gaat met één klik vanuit je gratis profiel, en wij controleren je VOG en EHBO handmatig zodat opdrachtgevers zien dat het in orde is.",
            ],
          },
        ]}
      />
    </AudiencePage>
    <section className="py-16">
      <Container className="max-w-2xl">
        <h2 className="mb-4 font-display text-2xl font-bold text-alpine-900">
          Nog niet gecertificeerd?
        </h2>
        <p className="text-alpine-700">
          Het minimumniveau om via Skimeister aan het werk te gaan is ÖSV
          Schilehrer Anwärter of een vergelijkbaar diploma. Meld je alvast aan als
          aspirant: dan volgen we je voortgang en kun je je certificaat uploaden
          zodra je het hebt.
        </p>
        <PartnerCard partner={TRAINING_PARTNER} />
      </Container>
    </section>
    <Veelgesteld titel="Veelgestelde vragen over skileraar worden" vragen={VRAGEN} />
    <LeesOok
      links={[
        {
          href: "/werken-als-skileraar",
          titel: "Werken als skileraar",
          tekst: "Voor wie je werkt en hoe je opdrachten vindt in de Alpen.",
        },
        {
          href: "/blog/hoe-word-je-skileraar",
          titel: "Hoe word je skileraar?",
          tekst: "Van eerste bocht tot betaalde baan op de piste.",
        },
        {
          href: "/opdrachten",
          titel: "Vacatures voor skileraren",
          tekst: "Bekijk de opdrachten die nu open staan.",
        },
      ]}
    />
    </>
  );
}
