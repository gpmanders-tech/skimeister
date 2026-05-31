import type { Metadata } from "next";
import { AudiencePage } from "@/components/marketing/AudiencePage";
import { Container } from "@/components/ui/Container";
import { PartnerCard } from "@/components/marketing/PartnerCard";
import { TRAINING_PARTNER } from "@/lib/constants/partners";

export const metadata: Metadata = {
  title: "Skileraar worden",
  description:
    "Start jouw carrière op de piste. Word skileraar, behaal je certificaat en vind werk via Skimeister.nl.",
};

export default function Page() {
  return (
    <>
    <AudiencePage
      content={{
        eyebrow: "Voor instructeurs & aspiranten",
        title: "Start jouw carrière op de piste",
        description:
          "Of je nu al gecertificeerd bent of nog wilt beginnen — Skimeister helpt je aan werk als skileraar. Gratis, altijd.",
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
    />
    <section className="py-16">
      <Container className="max-w-2xl">
        <h2 className="mb-6 font-display text-2xl font-bold text-alpine-900">
          Nog niet gecertificeerd?
        </h2>
        <PartnerCard partner={TRAINING_PARTNER} />
      </Container>
    </section>
    </>
  );
}
