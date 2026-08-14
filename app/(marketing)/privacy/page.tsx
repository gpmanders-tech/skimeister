import type { Metadata } from "next";
import { canoniek } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  ...canoniek("/privacy"),
  title: "Privacybeleid",
  description: "Hoe Skimeister.nl omgaat met je persoonsgegevens (AVG/GDPR).",
};

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Juridisch" title="Privacybeleid" />
      <Container className="py-16">
        <div className="mx-auto max-w-2xl space-y-5 text-sm text-alpine-800">
          <p className="rounded-lg bg-piste-50 p-4 text-piste-700">
            Let op: dit is een concepttekst. Laat de definitieve privacyverklaring
            controleren door een jurist voordat je live gaat.
          </p>
          <h2 className="font-display text-lg font-bold text-alpine-900">1. Wie zijn wij</h2>
          <p>
            Skimeister.nl verwerkt persoonsgegevens van gebruikers om
            skileraren en organisaties met elkaar te verbinden.
          </p>
          <h2 className="font-display text-lg font-bold text-alpine-900">2. Welke gegevens</h2>
          <p>
            Wij verwerken account- en profielgegevens, geüploade documenten
            (zoals VOG, EHBO en verzekeringsbewijs) en communicatie binnen het
            platform.
          </p>
          <h2 className="font-display text-lg font-bold text-alpine-900">3. Opslag in de EU</h2>
          <p>
            Je gegevens worden opgeslagen binnen de Europese Unie (Supabase
            EU-hosting).
          </p>
          <h2 className="font-display text-lg font-bold text-alpine-900">4. Jouw rechten</h2>
          <p>
            Je hebt recht op inzage, correctie en verwijdering van je gegevens.
            Stuur daarvoor een verzoek naar info@skimeister.nl.
          </p>
          <h2 className="font-display text-lg font-bold text-alpine-900">5. Cookies</h2>
          <p>
            Wij gebruiken alleen functionele cookies die nodig zijn om in te
            loggen en het platform te laten werken.
          </p>
        </div>
      </Container>
    </>
  );
}
