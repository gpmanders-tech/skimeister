import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Instructeurs",
  description:
    "Bekijk gecertificeerde skileraren op Skimeister.nl. Maak een account aan om volledige profielen te zien en contact op te nemen.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Instructeurs"
        title="Gecertificeerde skileraren"
        description="Een greep uit de instructeurs op Skimeister. Maak als organisatie een account aan om volledige profielen te bekijken, te filteren en contact op te nemen."
      />
      <Container className="py-16">
        <div className="rounded-2xl border border-alpine-100 bg-white p-10 text-center shadow-sm">
          <p className="text-alpine-700">
            Profielen van instructeurs verschijnen hier zodra de eerste
            instructeurs zich hebben aangemeld.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/register" variant="accent">
              Account aanmaken
            </ButtonLink>
            <ButtonLink href="/voor-skischolen" variant="outline">
              Voor skischolen
            </ButtonLink>
          </div>
        </div>
      </Container>
    </>
  );
}
