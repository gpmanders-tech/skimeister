import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/marketing/PageHero";
import { PRIJSBLOKKEN, LANCERINGSACTIE, type PrijsBlok } from "@/lib/constants/pricing";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Prijzen",
  description:
    "Gratis voor instructeurs. Skischolen en reisorganisaties plaatsen gratis een opdracht en betalen pas bij een bevestigde plaatsing. Scholen betalen per project.",
  alternates: { canonical: "/prijzen" },
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Prijzen"
        title="Je betaalt pas als het werkt"
        description="Geen abonnement en geen kosten vooraf. Instructeurs gebruiken Skimeister altijd gratis. Organisaties betalen alleen als er iemand daadwerkelijk geplaatst is."
      />

      <Container className="space-y-10 py-12 sm:py-16">
        <Lancering />

        <div className="grid gap-6 lg:grid-cols-3">
          {PRIJSBLOKKEN.map((blok) => (
            <PrijsKaart key={blok.id} blok={blok} />
          ))}
        </div>

        <VeelGesteld />
      </Container>
    </>
  );
}

function Lancering() {
  return (
    <div className="rounded-2xl border border-piste-200 bg-piste-50 p-6 text-center sm:p-8">
      <p className="font-display text-lg font-bold text-alpine-900 sm:text-xl">
        Lanceringsactie: {LANCERINGSACTIE}
      </p>
      <p className="mx-auto mt-2 max-w-xl text-sm text-alpine-700">
        We bouwen dit platform op met de eerste lichting skischolen en
        reisorganisaties. Je eerste geplaatste instructeur kost je niets.
      </p>
    </div>
  );
}

function PrijsKaart({ blok }: { blok: PrijsBlok }) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-white p-6 sm:p-8",
        blok.highlight
          ? "border-piste-300 shadow-lg ring-1 ring-piste-200"
          : "border-alpine-100 shadow-sm",
      )}
    >
      {blok.highlight && (
        <span className="absolute -top-3 left-6 rounded-full bg-piste-500 px-3 py-1 text-xs font-semibold text-white">
          Geen risico vooraf
        </span>
      )}

      <h2 className="text-lg font-semibold text-alpine-900">{blok.naam}</h2>

      <p className="mt-4">
        <span className="font-display text-4xl font-extrabold text-alpine-900">
          {blok.prijs}
        </span>
        <span className="ml-2 text-sm text-alpine-600">{blok.eenheid}</span>
      </p>

      <p className="mt-3 text-sm text-alpine-700">{blok.samenvatting}</p>

      <ul className="mt-6 flex-1 space-y-3">
        {blok.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-alpine-800">
            <span className="mt-0.5 text-piste-500">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <ButtonLink
          href={blok.ctaHref}
          variant={blok.highlight ? "accent" : "outline"}
          className="w-full"
        >
          {blok.ctaLabel}
        </ButtonLink>
      </div>
    </div>
  );
}

function VeelGesteld() {
  const vragen = [
    {
      v: "Wanneer betaal ik als skischool of reisorganisatie?",
      a: "Pas als je met een instructeur tot overeenstemming komt en die de opdracht aanneemt. Plaatsen, reacties bekijken en gesprekken voeren kost niets.",
    },
    {
      v: "Wat als er niemand geschikt tussen zit?",
      a: "Dan betaal je niets. Je zit nergens aan vast en er is geen abonnement dat doorloopt.",
    },
    {
      v: "Waarom betalen scholen per project en niet per plaatsing?",
      a: "Een schoolreis heeft meestal meerdere instructeurs tegelijk nodig. Eén vast bedrag per project is voor een school beter te begroten dan een bedrag per persoon.",
    },
    {
      v: "Zit er btw bij de genoemde bedragen?",
      a: "De genoemde bedragen zijn exclusief btw. Je ontvangt een factuur met btw-specificatie.",
    },
  ];

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-bold text-alpine-900">
        Veelgestelde vragen over de prijs
      </h2>
      <div className="space-y-3">
        {vragen.map((q) => (
          <details
            key={q.v}
            className="rounded-2xl border border-alpine-100 bg-white p-5 shadow-sm"
          >
            <summary className="cursor-pointer list-none font-medium text-alpine-900">
              {q.v}
            </summary>
            <p className="mt-2 text-sm text-alpine-700">{q.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
