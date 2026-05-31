import type { Metadata } from "next";
import { AudiencePage } from "@/components/marketing/AudiencePage";

export const metadata: Metadata = {
  title: "Voor skischolen",
  description:
    "Vind en werf de beste gecertificeerde skileraren voor jouw skischool in Oostenrijk en de Alpen.",
};

export default function Page() {
  return (
    <AudiencePage
      content={{
        eyebrow: "Voor skischolen",
        title: "Vind en werf de beste instructeurs",
        description:
          "Zoek gericht in een pool van gecertificeerde, Nederlandstalige skileraren en bouw je seizoensteam op één plek.",
        steps: [
          { t: "Maak een schoolprofiel", d: "Vertel wie je bent, in welk gebied je zit en wat je zoekt." },
          { t: "Zoek en filter", d: "Filter op certificering, taal, beschikbaarheid, specialisatie en meer." },
          { t: "Neem contact op", d: "Beheer je shortlist en contactstatussen tot het seizoen rond is." },
        ],
        benefits: [
          { t: "Geverifieerde documenten", d: "Zie in één oogopslag welke instructeurs VOG, EHBO en verzekering op orde hebben." },
          { t: "Slimme filters", d: "Vind precies de instructeur die past bij jouw gasten en niveaus." },
          { t: "Beschikbaarheid vooraf", d: "Zoek op exact datumbereik en match direct op beschikbare weken." },
          { t: "Eén seizoensoverzicht", d: "Houd je hele werving en shortlist overzichtelijk bij." },
        ],
        ctaTitle: "Klaar om je seizoensteam te bouwen?",
        ctaHref: "/register",
        ctaLabel: "Start als skischool",
      }}
    />
  );
}
