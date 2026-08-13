import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Veelgestelde vragen",
  description: "Antwoorden op de meest gestelde vragen over Skimeister.nl.",
};

const FAQS = [
  {
    q: "Is Skimeister gratis voor instructeurs?",
    a: "Ja. Instructeurs en aspiranten gebruiken Skimeister altijd volledig gratis — een profiel aanmaken, beschikbaarheid instellen en aanmelden op projecten kost niets.",
  },
  {
    q: "Wat kost het voor skischolen en reisorganisaties?",
    a: "Skischolen en reisorganisaties plaatsen gratis een opdracht en ontvangen gratis reacties. Je betaalt € 195 per instructeur die je daadwerkelijk plaatst, achteraf. Er is geen abonnement en geen kosten vooraf. Scholen betalen € 79 per project. De eerste plaatsing van seizoen 2026/27 is gratis.",
  },
  {
    q: "Welke certificeringen worden ondersteund?",
    a: "Alle gangbare diploma's: NEVSKI, BASI, ÖSV, DSV, Swiss Snowsports, FSBA/BVSL en internationale ISIA. Bij elke certificering staat uitleg voor wie de niveaus niet kent.",
  },
  {
    q: "Hoe werkt de verificatie van VOG, EHBO en verzekering?",
    a: "Instructeurs uploaden hun documenten. Na controle verschijnt een verified-badge op hun profiel, zodat organisaties zien dat alles op orde is.",
  },
  {
    q: "In welke skigebieden is Skimeister actief?",
    a: "In 25 topgebieden in Oostenrijk, Zwitserland en Frankrijk — van St. Anton en Kitzbühel tot Verbier en Val d'Isère.",
  },
  {
    q: "Hoe betaal ik?",
    a: "Betalen gaat veilig via iDEAL. Je ontvangt altijd een nette factuur voor je administratie.",
  },
];

export default function Page() {
  return (
    <>
      <PageHero eyebrow="FAQ" title="Veelgestelde vragen" />
      <Container className="py-16">
        <div className="mx-auto max-w-3xl divide-y divide-alpine-100">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-alpine-900 marker:content-none">
                {item.q}
                <span className="text-piste-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-alpine-700">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </>
  );
}
