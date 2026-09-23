import type { Metadata } from "next";
import { canoniek, webpaginaJsonLd } from "@/lib/seo";
import { AudiencePage } from "@/components/marketing/AudiencePage";
import { Tekstblokken } from "@/components/marketing/Tekstblokken";
import { Veelgesteld } from "@/components/marketing/Veelgesteld";
import { JsonLd } from "@/components/seo/JsonLd";
import { LANCERINGSACTIE, PLAATSINGSFEE } from "@/lib/constants/pricing";

const OMSCHRIJVING =
  "Skileraren voor je groepsreizen: plaats gratis je reizen, ontvang aanmeldingen van gecontroleerde instructeurs en plan je hele skiseizoen op één plek.";

export const metadata: Metadata = {
  ...canoniek("/voor-reisorganisaties"),
  title: "Skileraren voor reisorganisaties",
  description: OMSCHRIJVING,
};

const VRAGEN = [
  {
    v: "Wat kost Skimeister voor een reisorganisatie?",
    a: `Reizen plaatsen en aanmeldingen ontvangen is gratis. Je betaalt € ${PLAATSINGSFEE} per instructeur die daadwerkelijk geplaatst is, achteraf en exclusief btw. Er is geen abonnement. ${LANCERINGSACTIE}`,
  },
  {
    v: "Kan ik meerdere reizen tegelijk plaatsen?",
    a: "Ja. Je maakt per reis een project aan met gebied, data, niveau en het aantal instructeurs dat je nodig hebt, en plaatst zoveel reizen als je wilt.",
  },
  {
    v: "Hoe weet ik dat een instructeur betrouwbaar is?",
    a: "Wij controleren de VOG en het EHBO-certificaat van elke instructeur handmatig. Pas daarna verschijnt er een badge op het profiel.",
  },
  {
    v: "Kan ik mijn planning exporteren?",
    a: "Ja. Je ziet al je projecten in één seizoenskalender en exporteert die naar CSV of PDF.",
  },
];

export default function Page() {
  return (
    <>
    <JsonLd
      data={webpaginaJsonLd({
        pad: "/voor-reisorganisaties",
        naam: "Skileraren voor reisorganisaties",
        omschrijving: OMSCHRIJVING,
      })}
    />
    <AudiencePage
      kruimels={[{ naam: "Voor reisorganisaties", pad: "/voor-reisorganisaties" }]}
      content={{
        eyebrow: "Voor reisorganisaties",
        title: "Plan je hele seizoen op één plek",
        description:
          "Plaats onbeperkt projecten per seizoen, ontvang aanmeldingen van instructeurs en houd overzicht met de seizoenskalender.",
        steps: [
          { t: "Maak projecten aan", d: "Eén project per reis: gebied, data, niveau en hoeveel instructeurs je nodig hebt." },
          { t: "Ontvang aanmeldingen", d: "Instructeurs melden zich aan met motivatie; jij selecteert wie past." },
          { t: "Plan het seizoen", d: "Zie al je projecten in één kalender en exporteer naar CSV/PDF." },
        ],
        benefits: [
          { t: "Onbeperkt plaatsen", d: "Plaats zoveel reizen als je wilt. Plaatsen en reacties ontvangen is gratis." },
          { t: "Automatische matching", d: "Instructeurs zien projecten die passen bij hun gebied en beschikbaarheid." },
          { t: "Seizoenskalender", d: "Kleurgecodeerd overzicht van open, in behandeling en gesloten projecten." },
          { t: "Bulk communicatie", d: "Bereik in één keer alle aangemelde instructeurs van een project." },
        ],
        ctaTitle: "Begin met plannen voor komend seizoen",
        ctaHref: "/register",
        ctaLabel: "Start als reisorganisatie",
      }}
    >
      <Tekstblokken
        blokken={[
          {
            kop: "Skileraren voor je groepsreizen, per reis geregeld",
            alineas: [
              "Een reisorganisatie die met groepen op wintersport gaat, heeft elk seizoen opnieuw skileraren nodig: voor elke reis, in elk gebied, in de juiste week. Op Skimeister zet je elke reis als eigen project neer, met gebied, data, niveau en het aantal instructeurs dat je zoekt. Instructeurs die beschikbaar zijn melden zich aan met hun motivatie en jij kiest wie past.",
              "In de seizoenskalender zie je in één oogopslag welke reizen open, in behandeling of gesloten zijn. Zo houd je overzicht, ook als je tientallen weken tegelijk plant.",
            ],
          },
          {
            kop: "Minder risico, geen vaste lasten",
            alineas: [
              "Plaatsen en aanmeldingen ontvangen kost niets. Je betaalt pas als een instructeur daadwerkelijk voor je aan de slag gaat. Lees meer over de werkwijze bij skileraar inhuren of bekijk direct de prijzen.",
            ],
          },
        ]}
      />
      <Veelgesteld titel="Veelgestelde vragen van reisorganisaties" vragen={VRAGEN} />
    </AudiencePage>
    </>
  );
}
