import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/marketing/PageHero";
import { PLANS_BY_AUDIENCE, type Plan } from "@/lib/constants/pricing";
import { euro, cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Prijzen",
  description:
    "Gratis voor instructeurs en aspiranten. Eerlijke abonnementen voor skischolen en reisorganisaties, en betalen per project voor scholen.",
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Prijzen"
        title="Eerlijke prijzen voor elke doelgroep"
        description="Instructeurs en aspiranten gebruiken Skimeister altijd gratis. Organisaties betalen alleen voor wat ze nodig hebben."
      />

      <Container className="py-16 space-y-16">
        <FreeBanner />
        <PlanGroup title="Voor skischolen" plans={PLANS_BY_AUDIENCE.skischool} />
        <PlanGroup title="Voor reisorganisaties" plans={PLANS_BY_AUDIENCE.reisorganisatie} />
        <PlanGroup title="Voor scholen (NL/BE)" plans={PLANS_BY_AUDIENCE.school} oneOff />
      </Container>
    </>
  );
}

function FreeBanner() {
  return (
    <div className="rounded-2xl border border-piste-200 bg-piste-50 p-8 text-center">
      <h2 className="font-display text-2xl font-bold text-alpine-900">
        Instructeur of aspirant? Altijd gratis.
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-alpine-700">
        Maak een volledig profiel aan, stel je beschikbaarheid in en meld je aan
        op projecten — zonder kosten.
      </p>
      <div className="mt-5">
        <ButtonLink href="/register" variant="accent">
          Maak gratis profiel aan
        </ButtonLink>
      </div>
    </div>
  );
}

function PlanGroup({
  title,
  plans,
  oneOff = false,
}: {
  title: string;
  plans: Plan[];
  oneOff?: boolean;
}) {
  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-bold text-alpine-900">{title}</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} oneOff={oneOff} />
        ))}
      </div>
    </div>
  );
}

function PlanCard({ plan, oneOff }: { plan: Plan; oneOff: boolean }) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-white p-8",
        plan.highlight
          ? "border-piste-300 shadow-lg ring-1 ring-piste-200"
          : "border-alpine-100 shadow-sm",
      )}
    >
      {plan.highlight && (
        <span className="absolute -top-3 left-8 rounded-full bg-piste-500 px-3 py-1 text-xs font-semibold text-white">
          Meest gekozen
        </span>
      )}
      <h3 className="text-lg font-semibold text-alpine-900">{plan.name}</h3>

      <div className="mt-4">
        {oneOff ? (
          <p>
            <span className="font-display text-4xl font-extrabold text-alpine-900">
              {euro(plan.priceOneOff!)}
            </span>
            <span className="ml-2 text-sm text-alpine-600">{plan.unit}</span>
          </p>
        ) : (
          <p>
            <span className="font-display text-4xl font-extrabold text-alpine-900">
              {euro(plan.priceMonthly!)}
            </span>
            <span className="text-sm text-alpine-600"> / maand</span>
            <span className="ml-2 block text-sm text-alpine-600">
              of {euro(plan.priceYearly!)} per jaar
            </span>
          </p>
        )}
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-alpine-800">
            <span className="mt-0.5 text-piste-500">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <ButtonLink
          href="/register"
          variant={plan.highlight ? "accent" : "outline"}
          className="w-full"
        >
          Aan de slag
        </ButtonLink>
      </div>
    </div>
  );
}
