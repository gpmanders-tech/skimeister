import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Algemene voorwaarden",
  description: "De algemene voorwaarden voor het gebruik van Skimeister.nl.",
};

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Juridisch" title="Algemene voorwaarden" />
      <Container className="py-16">
        <div className="mx-auto max-w-2xl space-y-5 text-sm text-alpine-800">
          <p className="rounded-lg bg-piste-50 p-4 text-piste-700">
            Let op: dit is een concepttekst. Laat de definitieve voorwaarden
            controleren door een jurist voordat je live gaat.
          </p>
          <h2 className="font-display text-lg font-bold text-alpine-900">1. Dienst</h2>
          <p>
            Skimeister.nl is een platform dat skileraren in contact brengt met
            skischolen, reisorganisaties en scholen. Skimeister is geen partij
            bij de overeenkomsten die tussen gebruikers tot stand komen.
          </p>
          <h2 className="font-display text-lg font-bold text-alpine-900">2. Accounts</h2>
          <p>
            Gebruikers zijn verantwoordelijk voor de juistheid van hun gegevens
            en geüploade documenten.
          </p>
          <h2 className="font-display text-lg font-bold text-alpine-900">3. Betalingen</h2>
          <p>
            Instructeurs en aspiranten betalen niets. Skischolen en
            reisorganisaties plaatsen kosteloos opdrachten en ontvangen kosteloos
            reacties; er is een vergoeding van € 195 per instructeur die
            daadwerkelijk wordt geplaatst, die achteraf wordt gefactureerd.
            Scholen betalen € 79 per project. Genoemde bedragen zijn exclusief
            btw. Projectbetalingen verlopen via onze betaalpartner; voor alle
            betalingen wordt een factuur verstrekt.
          </p>
          <h2 className="font-display text-lg font-bold text-alpine-900">4. Aansprakelijkheid</h2>
          <p>
            Skimeister is niet aansprakelijk voor de uitvoering van afspraken
            tussen gebruikers onderling.
          </p>
        </div>
      </Container>
    </>
  );
}
