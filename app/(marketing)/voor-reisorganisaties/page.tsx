import type { Metadata } from "next";
import { AudiencePage } from "@/components/marketing/AudiencePage";

export const metadata: Metadata = {
  title: "Voor reisorganisaties",
  description:
    "Plan je hele skiseizoen op één plek. Plaats projecten, ontvang aanmeldingen en beheer je instructeurs per reis.",
};

export default function Page() {
  return (
    <AudiencePage
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
    />
  );
}
