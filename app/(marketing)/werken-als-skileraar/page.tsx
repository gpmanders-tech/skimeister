import type { Metadata } from "next";
import { canoniek, CERT_PER_LAND, webpaginaJsonLd } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/marketing/PageHero";
import { Tekstblokken, type Tekstblok } from "@/components/marketing/Tekstblokken";
import { Veelgesteld } from "@/components/marketing/Veelgesteld";
import { LeesOok } from "@/components/marketing/LeesOok";
import { JsonLd } from "@/components/seo/JsonLd";

/**
 * Gids op de zoekterm "werken als skileraar". Alleen feiten die elders op de
 * site al staan: de controle van VOG en EHBO, gratis voor skileraren, de
 * certificeringen per land (CERT_PER_LAND) en de werkwijze van het board.
 */

const OMSCHRIJVING =
  "Werken als skileraar in Oostenrijk, Zwitserland of Frankrijk: welke diploma's je nodig hebt, hoe een seizoen werkt en hoe je opdrachten vindt.";

export const metadata: Metadata = {
  ...canoniek("/werken-als-skileraar"),
  title: "Werken als skileraar in de Alpen",
  description: OMSCHRIJVING,
};

const BLOKKEN: Tekstblok[] = [
  {
    kop: "Wat houdt werken als skileraar in?",
    alineas: [
      "Als skileraar geef je les aan groepen of losse gasten op de piste. Dat kan bij een skischool in de Alpen, bij een reisorganisatie die met eigen groepen op wintersport gaat of bij een school uit Nederland of België die een skireis organiseert. Het werk is afwisselend: de ene week sta je met beginners op de oefenweide, de week erna begeleid je een gevorderde groep over het hele skigebied.",
      "Naast het skiën zelf draait het werk om mensen. Je legt uit, stelt gerust, bewaakt de veiligheid van je groep en past het tempo aan op wie er voor je staat. Juist daarom vragen opdrachtgevers meer dan alleen een diploma: ze willen weten dat je betrouwbaar bent en weet wat je moet doen als er iets misgaat.",
    ],
  },
  {
    kop: "Voor wie werk je?",
    alineas: [
      "Op Skimeister plaatsen drie soorten opdrachtgevers werk voor skileraren. Elk type opdracht vraagt iets anders van je.",
    ],
    punten: [
      "Skischolen in de Alpen, vooral in Oostenrijk, zoeken instructeurs voor een deel van het seizoen of voor drukke weken. Als Nederlandstalige skileraar ben je daar precies goed voor Nederlandstalige groepen en schoolklassen.",
      "Reisorganisaties nemen skileraren mee op hun groepsreizen en zoeken per reis mensen voor een vaste week en een vast gebied.",
      "Scholen in Nederland en België zoeken skileraren voor hun schoolreis. Bij groepen met kinderen is een geldige VOG verplicht.",
    ],
  },
  {
    kop: "Welke diploma's heb je nodig?",
    alineas: [
      "Het minimumniveau om via Skimeister aan het werk te gaan is ÖSV Schilehrer Anwärter of een vergelijkbaar diploma. Op je profiel kun je alle gangbare diploma's kwijt: NEVSKI, BASI, ÖSV, DSV, Swiss Snowsports, FSBA/BVSL en de internationale ISIA-stamp.",
      `Oostenrijk: ${CERT_PER_LAND.Oostenrijk.toelichting}`,
      `Zwitserland: ${CERT_PER_LAND.Zwitserland.toelichting}`,
      `Frankrijk: ${CERT_PER_LAND.Frankrijk.toelichting}`,
    ],
  },
  {
    kop: "VOG en EHBO: waarom ze ertoe doen",
    alineas: [
      "Wie met groepen werkt, en zeker met kinderen, moet kunnen laten zien dat het goed zit. Skimeister controleert je Verklaring Omtrent het Gedrag (VOG) en je EHBO-certificaat handmatig. Pas na die controle verschijnt er een badge op je profiel, nooit automatisch. Opdrachtgevers zien daardoor meteen dat je papieren op orde zijn, en dat scheelt jou een hoop heen-en-weer gemail voor elke opdracht.",
    ],
  },
  {
    kop: "Hoe vind je werk als skileraar?",
    alineas: [
      "Alle opdrachten op Skimeister staan open en volledig zichtbaar, ook zonder account. Per opdracht zie je het skigebied, de periode, de gevraagde certificering en de vergoeding. Past een opdracht bij je, dan reageer je met één klik vanuit je gratis profiel. Een bericht erbij mag, maar hoeft niet.",
      "De opdrachtgever bekijkt de reacties en neemt daarna zelf contact met je op. Leg in je beschikbaarheidskalender per week vast wanneer je kunt, dan krijg je een mail zodra er een opdracht binnenkomt die bij je past.",
    ],
  },
  {
    kop: "Wat kost het?",
    alineas: [
      "Niets. Skileraren en aspiranten gebruiken Skimeister altijd gratis: je profiel, het bekijken van opdrachten, reageren en het laten controleren van je VOG en EHBO kosten je geen cent.",
    ],
  },
];

const VRAGEN = [
  {
    v: "Kan ik als Nederlander werken als skileraar in Oostenrijk?",
    a: "Ja. Oostenrijkse skischolen werken met de ÖSV-niveaus, maar Nederlandse NEVSKI-diploma's en de internationale ISIA-stamp worden daarnaast breed geaccepteerd. Het minimumniveau voor opdrachten via Skimeister is ÖSV Schilehrer Anwärter of een vergelijkbaar diploma.",
  },
  {
    v: "Heb ik een VOG nodig om als skileraar te werken?",
    a: "Bij groepen met kinderen, zoals schoolreizen, is een geldige VOG verplicht. Skimeister controleert je VOG en EHBO-certificaat handmatig en zet daarna een badge op je profiel.",
  },
  {
    v: "Kost het iets om via Skimeister werk te vinden?",
    a: "Nee. Voor skileraren en aspiranten is Skimeister altijd gratis, ook het reageren op opdrachten.",
  },
  {
    v: "Moet ik een account hebben om opdrachten te bekijken?",
    a: "Nee. Alle opdrachten zijn vrij te bekijken. Een gratis profiel heb je pas nodig als je wilt reageren.",
  },
  {
    v: "Ik ben nog niet gecertificeerd. Kan ik me al aanmelden?",
    a: "Ja, meld je aan als aspirant. Dan volgen we je voortgang en kun je je certificaat uploaden zodra je het hebt.",
  },
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={webpaginaJsonLd({
          pad: "/werken-als-skileraar",
          naam: "Werken als skileraar in de Alpen",
          omschrijving: OMSCHRIJVING,
        })}
      />
      <PageHero
        eyebrow="Gids"
        title="Werken als skileraar in de Alpen"
        description="Een seizoen, een paar weken of één schoolreis: zo werkt het als je als skileraar aan de slag wilt in Oostenrijk, Zwitserland of Frankrijk."
        kruimels={[{ naam: "Werken als skileraar", pad: "/werken-als-skileraar" }]}
      />

      <Tekstblokken blokken={BLOKKEN} />

      <Container className="pb-4">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <p className="font-display text-lg font-bold text-alpine-900">
            Benieuwd welk werk er nu klaarstaat?
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/opdrachten" variant="accent">
              Bekijk de vacatures
            </ButtonLink>
            <ButtonLink href="/register" variant="outline">
              Gratis profiel
            </ButtonLink>
          </div>
        </div>
      </Container>

      <Veelgesteld titel="Veelgestelde vragen over werken als skileraar" vragen={VRAGEN} achtergrond={false} />

      <LeesOok
        links={[
          {
            href: "/skileraar-worden",
            titel: "Skileraar worden",
            tekst: "Nog geen diploma? Zo begin je aan de opleiding en haal je je Anwärter.",
          },
          {
            href: "/blog/wat-verdient-een-skileraar",
            titel: "Wat verdient een skileraar?",
            tekst: "Uurtarieven, dagtarieven en seizoenscontracten op een rij.",
          },
          {
            href: "/blog/top-skigebieden-voor-instructeurs",
            titel: "Top skigebieden voor instructeurs",
            tekst: "Waar werk je als skileraar het fijnst?",
          },
        ]}
      />
    </>
  );
}
