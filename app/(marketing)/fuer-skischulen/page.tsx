import type { Metadata } from "next";
import { AudiencePage } from "@/components/marketing/AudiencePage";
import { SITE, OG_IMAGE, webpaginaJsonLd } from "@/lib/seo";
import { Tekstblokken } from "@/components/marketing/Tekstblokken";
import { Veelgesteld } from "@/components/marketing/Veelgesteld";
import { JsonLd } from "@/components/seo/JsonLd";
import { PLAATSINGSFEE } from "@/lib/constants/pricing";

const BESCHREIBUNG =
  "Geprüfte Skilehrerinnen und Skilehrer für Ihre Skischule in Österreich und den Alpen. Führungszeugnis und Erste-Hilfe-Nachweis manuell geprüft.";

const FRAGEN = [
  {
    v: "Was kostet Skimeister für eine Skischule?",
    a: `Einen Auftrag ausschreiben und Rückmeldungen erhalten ist kostenlos. Sie zahlen ${PLAATSINGSFEE} € je tatsächlich vermitteltem Skilehrer, im Nachhinein per Rechnung. Es gibt kein Abonnement und keine Vorabgebühren.`,
  },
  {
    v: "Welche Qualifikation haben die Skilehrer?",
    a: "Skilehrer geben ihre Ausbildung im Profil an, zum Beispiel ÖSV, NEVSKI, BASI, DSV, Swiss Snowsports oder ISIA. Mindestvoraussetzung für Aufträge über Skimeister ist der ÖSV Schilehrer Anwärter oder eine vergleichbare Ausbildung.",
  },
  {
    v: "Wie prüfen Sie Führungszeugnis und Erste-Hilfe-Nachweis?",
    a: "Wir kontrollieren jedes Dokument einzeln und von Hand. Ein Prüfsiegel erscheint erst nach dieser Freigabe im Profil, nie automatisch.",
  },
  {
    v: "Woher kommen die Skilehrer?",
    a: "Unsere Skilehrer kommen aus den Niederlanden und Belgien. Das passt genau zu niederländischsprachigen Gruppen und Schulklassen.",
  },
  {
    v: "Ist die Plattform auf Deutsch?",
    a: "Ja. Wer sich als Skischule anmeldet, sieht die gesamte Plattform auf Deutsch, einschließlich der E-Mails.",
  },
];

/**
 * Duitstalige pagina voor skischolen. Bewust een eigen Duitse URL in plaats van
 * Duitse tekst op /voor-skischolen: zoekmachines koppelen taal aan de URL, en
 * deze doelgroep zoekt in het Duits. /voor-skischolen leidt hierheen door.
 */
export const metadata: Metadata = {
  title: "Für Skischulen: geprüfte Skilehrer finden",
  description: BESCHREIBUNG,
  // hreflang wederzijds met /skileraar-inhuren, de Nederlandse pagina met
  // dezelfde bedoeling (een skileraar vinden voor een skischool). De oude
  // verwijzing naar /voor-reisorganisaties had geen terugverwijzing en ging
  // over een andere doelgroep.
  alternates: {
    canonical: "/fuer-skischulen",
    languages: {
      "de-DE": "/fuer-skischulen",
      "nl-NL": "/skileraar-inhuren",
    },
  },
  // Volledig uitgeschreven: een openGraph op paginaniveau vervangt die van de
  // root-layout, dus siteName, type en de afbeelding moeten hier ook staan.
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Skimeister.nl",
    url: `${SITE}/fuer-skischulen`,
    title: "Für Skischulen: geprüfte Skilehrer für Ihre Saison",
    description:
      "Schreiben Sie Ihren Bedarf kostenlos aus und erreichen Sie gezielt qualifizierte Skilehrer. Sie zahlen erst bei einer bestätigten Vermittlung.",
    images: [OG_IMAGE],
  },
};

export default function Page() {
  return (
    <>
    <JsonLd
      data={webpaginaJsonLd({
        pad: "/fuer-skischulen",
        naam: "Für Skischulen: geprüfte Skilehrer für Ihre Saison",
        omschrijving: BESCHREIBUNG,
        taal: "de-DE",
      })}
    />
    <AudiencePage
      lang="de"
      kruimels={[{ naam: "Für Skischulen", pad: "/fuer-skischulen" }]}
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
    >
      <Tekstblokken
        blokken={[
          {
            kop: "Skilehrer finden für die ganze Saison oder einzelne Wochen",
            alineas: [
              "Ob für die Hochsaison, für Ferienwochen oder für eine niederländische Schulgruppe: Auf Skimeister schreiben Sie Ihren Bedarf offen aus. Im Auftrag stehen Skigebiet, Zeitraum, gewünschte Qualifikation und Vergütung. Skilehrer, die in Ihrem Zeitraum verfügbar sind, melden sich mit einem Klick.",
              "Sie sehen bei jeder Rückmeldung Qualifikation, Erfahrung und die geprüften Nachweise. Danach nehmen Sie selbst Kontakt auf und entscheiden, wer zu Ihrer Skischule passt.",
            ],
          },
          {
            kop: "Warum niederländischsprachige Skilehrer?",
            alineas: [
              "Viele Gäste in den Alpen kommen aus den Niederlanden und Belgien. Ein Skilehrer, der ihre Sprache spricht, erklärt Technik und Sicherheit so, dass Kinder und Erwachsene es sofort verstehen. Genau diese Skilehrer erreichen Sie über Skimeister.",
            ],
          },
        ]}
      />
      <Veelgesteld titel="Häufige Fragen" vragen={FRAGEN} />
    </AudiencePage>
    </>
  );
}
