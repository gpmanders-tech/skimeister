import type { Metadata } from "next";
import { AudiencePage } from "@/components/marketing/AudiencePage";
import { Container } from "@/components/ui/Container";
import { RatioCalculator } from "@/components/RatioCalculator";

export const metadata: Metadata = {
  title: "Voor scholen",
  description:
    "Gegarandeerd de juiste skileraar voor jouw schoolreis. Plaats eenvoudig een project en betaal per reis.",
};

export default function Page() {
  return (
    <>
    <AudiencePage
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
          { t: "Betaal per project", d: "Geen abonnement nodig — €79 per geplaatst project of een voordelige bundel." },
          { t: "VOG verplicht bij kinderen", d: "Bij groepen met kinderen tonen we alleen instructeurs met geldige VOG." },
          { t: "Ratio calculator", d: "Bereken direct hoeveel instructeurs je nodig hebt voor jouw groep." },
          { t: "Schoolgroep-ervaring", d: "Filter op instructeurs die ervaring hebben met schoolreizen." },
        ],
        ctaTitle: "Regel de skileraar voor jouw schoolreis",
        ctaHref: "/register",
        ctaLabel: "Start als school",
      }}
    />
    <section className="py-16">
      <Container className="max-w-2xl">
        <RatioCalculator />
      </Container>
    </section>
    </>
  );
}
