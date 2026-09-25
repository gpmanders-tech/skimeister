import type { Metadata } from "next";
import Link from "next/link";
import { canoniek, faqJsonLd, type Vraag } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  ...canoniek("/faq"),
  title: "Veelgestelde vragen over Skimeister",
  description:
    "Antwoorden op de meest gestelde vragen over Skimeister.nl: kosten, certificeringen, de controle van VOG en EHBO, skigebieden en reageren op opdrachten.",
};

/** Gegroepeerd, zodat skileraren en opdrachtgevers snel hun eigen vragen vinden. */
const GROEPEN: { titel: string; vragen: Vraag[] }[] = [
  {
    titel: "Voor skileraren",
    vragen: [
      {
        v: "Is Skimeister gratis voor instructeurs?",
        a: "Ja. Instructeurs en aspiranten gebruiken Skimeister altijd volledig gratis. Een profiel aanmaken, beschikbaarheid instellen en reageren op opdrachten kost niets.",
      },
      {
        v: "Moet ik een account hebben om de opdrachten te zien?",
        a: "Nee. Alle opdrachten staan open en volledig zichtbaar, ook zonder account. Een gratis profiel heb je pas nodig als je wilt reageren.",
      },
      {
        v: "Hoe reageer ik op een opdracht?",
        a: "Met één klik vanuit je gratis profiel. Een bericht erbij mag, maar hoeft niet. De opdrachtgever neemt daarna zelf contact met je op.",
      },
      {
        v: "Welk diploma heb ik minimaal nodig?",
        a: "Het minimumniveau om via Skimeister aan het werk te gaan is ÖSV Schilehrer Anwärter of een vergelijkbaar diploma. Nog niet zover? Meld je dan aan als aspirant.",
      },
    ],
  },
  {
    titel: "Voor skischolen, reisorganisaties en scholen",
    vragen: [
      {
        v: "Wat kost het voor skischolen en reisorganisaties?",
        a: "Skischolen en reisorganisaties plaatsen gratis een opdracht en ontvangen gratis reacties. Je betaalt € 195 per instructeur die je daadwerkelijk plaatst, achteraf. Er is geen abonnement en geen kosten vooraf. Scholen betalen € 79 per project. De eerste plaatsing van seizoen 2026/27 is gratis.",
      },
      {
        v: "Hoe betaal ik?",
        a: "Betalen gaat veilig via iDEAL. Je ontvangt altijd een nette factuur voor je administratie.",
      },
      {
        v: "Is er een Duitstalige versie voor skischolen?",
        a: "Ja. Skischolen vinden alle uitleg in het Duits op de pagina Für Skischulen, en wie als skischool inlogt ziet het hele platform in het Duits.",
      },
    ],
  },
  {
    titel: "Controle en certificering",
    vragen: [
      {
        v: "Welke certificeringen worden ondersteund?",
        a: "Alle gangbare diploma's: NEVSKI, BASI, ÖSV, DSV, Swiss Snowsports, FSBA/BVSL en internationale ISIA. Bij elke certificering staat uitleg voor wie de niveaus niet kent.",
      },
      {
        v: "Hoe werkt de verificatie van VOG, EHBO en verzekering?",
        a: "VOG en EHBO zijn niet verplicht. Heb je ze, dan upload je ze in je profiel. Na onze controle verschijnt er een badge, zodat opdrachtgevers zien dat alles op orde is.",
      },
      {
        v: "Is een VOG verplicht?",
        a: "Nee, niet om lid te worden van de crew. Bij sommige opdrachten met kinderen vraagt de opdrachtgever wel om een VOG; dat staat dan bij de opdracht.",
      },
    ],
  },
  {
    titel: "Skigebieden",
    vragen: [
      {
        v: "In welke skigebieden is Skimeister actief?",
        a: "In 25 topgebieden in Oostenrijk, Zwitserland en Frankrijk, van St. Anton en Kitzbühel tot Verbier en Val d'Isère.",
      },
    ],
  },
];

const ALLE_VRAGEN = GROEPEN.flatMap((g) => g.vragen);

export default function Page() {
  return (
    <>
      <JsonLd data={faqJsonLd(ALLE_VRAGEN)} />
      <PageHero
        eyebrow="FAQ"
        title="Veelgestelde vragen"
        description="Alles over kosten, certificeringen, de controle van VOG en EHBO en reageren op opdrachten, voor skileraren en voor opdrachtgevers."
        kruimels={[{ naam: "Veelgestelde vragen", pad: "/faq" }]}
      />
      <Container className="py-16">
        <div className="mx-auto max-w-3xl space-y-12">
          {GROEPEN.map((groep) => (
            <section key={groep.titel}>
              <h2 className="font-display text-2xl font-bold text-alpine-900">{groep.titel}</h2>
              <div className="mt-2 divide-y divide-alpine-100">
                {groep.vragen.map((item) => (
                  <details key={item.v} className="group py-5">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-alpine-900 marker:content-none">
                      {item.v}
                      <span className="text-piste-500 transition-transform group-open:rotate-45" aria-hidden="true">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-sm text-alpine-700">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}

          <div className="rounded-2xl border border-alpine-100 bg-white p-6 text-sm text-alpine-700 shadow-sm">
            Meer weten? Lees de gids{" "}
            <Link href="/werken-als-skileraar" className="font-semibold text-piste-600 hover:underline">
              werken als skileraar
            </Link>
            , bekijk hoe je een{" "}
            <Link href="/skileraar-inhuren" className="font-semibold text-piste-600 hover:underline">
              skileraar inhuurt
            </Link>{" "}
            of neem{" "}
            <Link href="/contact" className="font-semibold text-piste-600 hover:underline">
              contact
            </Link>{" "}
            met ons op.
          </div>
        </div>
      </Container>
    </>
  );
}
