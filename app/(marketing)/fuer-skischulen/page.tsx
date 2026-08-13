import type { Metadata } from "next";
import { AudiencePage } from "@/components/marketing/AudiencePage";

/**
 * Duitstalige pagina voor skischolen. Bewust een eigen Duitse URL in plaats van
 * Duitse tekst op /voor-skischolen: zoekmachines koppelen taal aan de URL, en
 * deze doelgroep zoekt in het Duits. /voor-skischolen leidt hierheen door.
 */
export const metadata: Metadata = {
  title: "Für Skischulen",
  description:
    "Finden Sie geprüfte Skilehrerinnen und Skilehrer für Ihre Skischule in Österreich und den Alpen. Führungszeugnis und Erste-Hilfe-Nachweis werden von uns manuell geprüft.",
  alternates: {
    canonical: "/fuer-skischulen",
    languages: {
      "de-DE": "/fuer-skischulen",
      "nl-NL": "/voor-reisorganisaties",
    },
  },
  openGraph: { locale: "de_DE" },
};

export default function Page() {
  return (
    <AudiencePage
      lang="de"
      content={{
        eyebrow: "Für Skischulen",
        title: "Geprüfte Skilehrer für Ihre Saison",
        description:
          "Schreiben Sie Ihren Bedarf aus und erreichen Sie damit gezielt qualifizierte Skilehrerinnen und Skilehrer. Ausschreiben und Rückmeldungen erhalten ist kostenlos.",
        stepsTitle: "So funktioniert es",
        steps: [
          {
            t: "Auftrag ausschreiben",
            d: "Skigebiet, Zeitraum, gewünschte Qualifikation und Vergütung. Das dauert wenige Minuten und kostet nichts.",
          },
          {
            t: "Rückmeldungen erhalten",
            d: "Interessierte Skilehrer melden sich mit einem Klick. Sie sehen Qualifikation, Erfahrung und geprüfte Nachweise.",
          },
          {
            t: "Direkt Kontakt aufnehmen",
            d: "Sie sprechen selbst mit den Kandidaten und entscheiden. Erst bei einer bestätigten Vermittlung fällt eine Gebühr an.",
          },
        ],
        benefitsTitle: "Warum Skimeister",
        benefits: [
          {
            t: "Manuell geprüfte Nachweise",
            d: "Führungszeugnis und Erste-Hilfe-Nachweis werden von uns einzeln kontrolliert. Ein Prüfsiegel erscheint erst nach dieser Freigabe, nie automatisch.",
          },
          {
            t: "Kein Abonnement",
            d: "Keine monatlichen Kosten und keine Vorabgebühren. Sie zahlen 195 € je tatsächlich vermitteltem Skilehrer, im Nachhinein per Rechnung.",
          },
          {
            t: "Niederländischsprachige Gäste",
            d: "Unsere Skilehrer kommen aus den Niederlanden und Belgien. Genau richtig für niederländischsprachige Gruppen und Schulklassen.",
          },
          {
            t: "Verfügbarkeit im Voraus",
            d: "Skilehrer hinterlegen ihre freien Wochen. Sie sehen sofort, wer in Ihrem Zeitraum wirklich verfügbar ist.",
          },
        ],
        ctaTitle: "Bereit für Ihre Saison?",
        ctaHref: "/register",
        ctaLabel: "Als Skischule starten",
      }}
    />
  );
}
