import type { Metadata } from "next";
import Link from "next/link";
import { canoniek, SITE } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { OpdrachtKaart } from "@/components/opdrachten/OpdrachtKaart";
import { getRecenteOpdrachten } from "@/lib/opdrachten/queries";
import { getLiveCijfers, type LiveCijfers } from "@/lib/stats";
import { RESORTS_BY_COUNTRY } from "@/lib/constants/resorts";
import { REGISTERABLE_ROLES, ROLE_LABELS, ROLE_TAGLINES } from "@/lib/constants/options";

// Homepage blijft statisch, maar haalt elke 5 minuten verse opdrachten op.
export const revalidate = 300;

export const metadata: Metadata = {
  ...canoniek("/"),
  // absolute: anders plakt de titelsjabloon er nog eens "· Skimeister.nl" achter.
  title: { absolute: "Skimeister.nl — Opdrachten voor gecontroleerde skileraren" },
  description:
    "Open opdrachten van skischolen, reisorganisaties en scholen in Oostenrijk, Zwitserland en Frankrijk. VOG en EHBO handmatig gecontroleerd. Gratis voor skileraren.",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#organisatie`,
      name: "Skimeister.nl",
      url: SITE,
      logo: `${SITE}/og-skimeister.jpg`,
      image: `${SITE}/og-skimeister.jpg`,
      description:
        "Platform waar skischolen, reisorganisaties en scholen opdrachten plaatsen voor skileraren. VOG en EHBO worden handmatig gecontroleerd.",
      areaServed: ["NL", "BE", "AT", "CH", "FR"],
      knowsLanguage: ["nl", "de"],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        url: `${SITE}/contact`,
        availableLanguage: ["Dutch", "German"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      name: "Skimeister.nl",
      url: SITE,
      inLanguage: "nl-NL",
      publisher: { "@id": `${SITE}/#organisatie` },
    },
  ],
};

export default async function HomePage() {
  const [opdrachten, cijfers] = await Promise.all([
    getRecenteOpdrachten(3),
    getLiveCijfers(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <Hero />
      <OpenOpdrachten opdrachten={opdrachten} />
      <HowItWorks />
      <Audiences />
      <Cijfers cijfers={cijfers} />
      <ResortsSection />
      <PricingTeaser />
      <FinalCta />
    </>
  );
}

/* ── Hero ──────────────────────────────────────────────────────────────────*/
function Hero() {
  return (
    <section className="relative overflow-hidden bg-alpine-600 text-white">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(255,255,255,.4) 0, transparent 25%), radial-gradient(circle at 85% 10%, rgba(255,107,53,.5) 0, transparent 30%)",
        }}
        aria-hidden
      />
      <Container className="relative grid gap-10 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-piste-200">
            <span className="h-1.5 w-1.5 rounded-full bg-piste-300" />
            In opbouw voor seizoen 2026/27
          </p>
          <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            Echte opdrachten voor gecontroleerde skileraren
          </h1>
          <p className="mt-5 max-w-xl text-lg text-alpine-100">
            Skischolen, reisorganisaties en scholen plaatsen hun opdrachten
            open en zichtbaar. Wij controleren VOG en EHBO handmatig, zodat je
            weet wie er voor je groep staat.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/opdrachten" variant="accent" size="lg">
              Bekijk de opdrachten
            </ButtonLink>
            <ButtonLink
              href="/register"
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Maak een gratis profiel aan
            </ButtonLink>
          </div>
          <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-alpine-100">
            <span>✓ VOG &amp; EHBO handmatig gecontroleerd</span>
            <span>✓ Gratis voor instructeurs</span>
            <span>✓ Reageren in één klik</span>
          </p>
        </div>
        <div className="relative hidden lg:block">
          <HeroVisual />
        </div>
      </Container>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative">
      {/*
        Foto: skiles op de piste, van afstand gefotografeerd. Bewust geen
        herkenbare gezichten, dus geen portretrecht- of privacykwestie.
        Bron: Pexels (foto 35923083), Pexels-licentie, vrij voor commercieel
        gebruik zonder naamsvermelding. Uitgesneden naar 3:2.
      */}
      <div className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
        <div className="relative aspect-[3/2]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-skiles.jpg"
            alt="Een skileraar geeft les aan een groep op een besneeuwde piste, van een afstand gefotografeerd"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-alpine-900/45 via-alpine-900/5 to-transparent" />
        </div>
      </div>

      {/* Zwevende verificatie-badge */}
      <div className="absolute -right-4 top-6 rounded-xl bg-white px-3 py-2 shadow-lg ring-1 ring-alpine-100">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-alpine-900">
          <span className="text-green-600">✓</span> VOG &amp; EHBO
        </p>
        <p className="text-xs text-alpine-500">handmatig gecontroleerd</p>
      </div>
    </div>
  );
}

/* ── Open opdrachten ───────────────────────────────────────────────────────*/
function OpenOpdrachten({ opdrachten }: { opdrachten: Awaited<ReturnType<typeof getRecenteOpdrachten>> }) {
  return (
    <section className="border-b border-alpine-100 bg-snow-texture py-14 sm:py-16">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Open opdrachten" title="Werk dat nu klaarstaat" />
          <Link
            href="/opdrachten"
            className="text-sm font-semibold text-piste-600 hover:underline"
          >
            Alle opdrachten →
          </Link>
        </div>

        {opdrachten.length > 0 ? (
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {opdrachten.map((o) => (
              <OpdrachtKaart key={o.id} opdracht={o} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-alpine-200 bg-white p-8 text-center">
            <p className="text-alpine-800">
              De eerste opdrachten voor seizoen 2026/27 komen eraan.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-alpine-600">
              Maak nu een profiel aan, dan ben je erbij zodra ze online staan en
              krijg je een mail bij een opdracht die bij je past.
            </p>
            <ButtonLink href="/register" variant="accent" className="mt-5">
              Maak een gratis profiel aan
            </ButtonLink>
          </div>
        )}
      </Container>
    </section>
  );
}

/* ── Hoe werkt het ─────────────────────────────────────────────────────────*/
function HowItWorks() {
  const steps = [
    { n: 1, t: "Bekijk de opdrachten", d: "Alle opdrachten staan open en volledig zichtbaar, ook zonder account." },
    { n: 2, t: "Reageer in één klik", d: "Maak een gratis profiel aan en reageer op wat bij je past. Een bericht erbij mag, hoeft niet." },
    { n: 3, t: "Gecontroleerd aan het werk", d: "Wij controleren VOG en EHBO handmatig. De opdrachtgever neemt daarna zelf contact op." },
  ];
  return (
    <section className="py-20">
      <Container>
        <SectionHeading eyebrow="Hoe werkt het" title="In drie stappen geregeld" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl border border-alpine-100 bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-piste-500 font-display text-lg font-bold text-white">
                {s.n}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-alpine-900">{s.t}</h3>
              <p className="mt-2 text-sm text-alpine-700">{s.d}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ── Doelgroepen ───────────────────────────────────────────────────────────*/
function Audiences() {
  const links: Record<string, string> = {
    instructor: "/skileraar-worden",
    aspirant: "/skileraar-worden",
    school_ski: "/fuer-skischulen",
    travel_org: "/voor-reisorganisaties",
    school_nl: "/voor-scholen",
  };
  return (
    <section className="bg-snow-texture py-20">
      <Container>
        <SectionHeading eyebrow="Voor wie" title="Eén platform, vijf doelgroepen" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REGISTERABLE_ROLES.map((role) => (
            <Link
              key={role}
              href={links[role]}
              className="group rounded-2xl border border-alpine-100 bg-white p-7 transition-shadow hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-alpine-900 group-hover:text-piste-600">
                {ROLE_LABELS[role]}
              </h3>
              <p className="mt-2 text-sm text-alpine-700">{ROLE_TAGLINES[role]}</p>
              <span className="mt-4 inline-block text-sm font-medium text-piste-600">
                Meer weten →
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ── Live cijfers ──────────────────────────────────────────────────────────*/
/**
 * Alleen echte, telbare cijfers uit de database. Het blok verdwijnt zolang de
 * getallen te klein zijn om iets te betekenen: liever niets dan opsmuk.
 */
function Cijfers({ cijfers }: { cijfers: LiveCijfers }) {
  if (!cijfers.toonbaar) return null;

  const stats = [
    { v: `${cijfers.openOpdrachten}`, l: "Open opdrachten" },
    { v: `${cijfers.geverifieerdeInstructeurs}`, l: "Geverifieerde instructeurs" },
  ];

  return (
    <section className="bg-alpine-600 py-14 text-white">
      <Container>
        <div className="grid gap-8 text-center sm:grid-cols-2">
          {stats.map((s) => (
            <div key={s.l}>
              <div className="font-display text-4xl font-extrabold text-piste-300">{s.v}</div>
              <div className="mt-1 text-sm text-alpine-100">{s.l}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ── Skigebieden ───────────────────────────────────────────────────────────*/
function ResortsSection() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Skigebieden"
          title="Beschikbaar in de mooiste gebieden van de Alpen"
        />
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {(Object.keys(RESORTS_BY_COUNTRY) as Array<keyof typeof RESORTS_BY_COUNTRY>).map(
            (country) => (
              <div key={country}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-piste-600">
                  {country}
                </h3>
                <ul className="space-y-1.5">
                  {RESORTS_BY_COUNTRY[country].map((r) => (
                    <li key={r.id}>
                      <Link
                        href={`/skigebied/${r.slug}`}
                        className="text-sm text-alpine-800 hover:text-piste-600"
                      >
                        {r.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ),
          )}
        </div>
      </Container>
    </section>
  );
}

/* ── Pricing teaser ────────────────────────────────────────────────────────*/
function PricingTeaser() {
  return (
    <section className="bg-snow-texture py-20">
      <Container className="text-center">
        <SectionHeading
          eyebrow="Prijzen"
          title="Gratis voor instructeurs, geen risico voor organisaties"
          center
        />
        <p className="mx-auto mt-4 max-w-2xl text-alpine-700">
          Instructeurs en aspiranten gebruiken Skimeister altijd gratis. Skischolen
          en reisorganisaties plaatsen gratis een opdracht en betalen pas bij een
          bevestigde plaatsing. Scholen betalen per project.
        </p>
        <div className="mt-8">
          <ButtonLink href="/prijzen" variant="primary" size="lg">
            Bekijk alle prijzen
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

/* ── Final CTA ─────────────────────────────────────────────────────────────*/
function FinalCta() {
  return (
    <section className="py-20">
      <Container>
        <div className="rounded-3xl bg-alpine-600 px-8 py-14 text-center text-white sm:px-16">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
            Klaar voor het seizoen?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-alpine-100">
            We bouwen Skimeister op met de eerste lichting skileraren en
            opdrachtgevers voor seizoen 2026/27. Sluit je aan.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/opdrachten" variant="accent" size="lg">
              Bekijk de opdrachten
            </ButtonLink>
            <ButtonLink
              href="/register"
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Maak een gratis profiel aan
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ── Gedeelde sectiekop ────────────────────────────────────────────────────*/
function SectionHeading({
  eyebrow,
  title,
  center = false,
}: {
  eyebrow: string;
  title: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center" : "max-w-2xl"}>
      <p className="text-sm font-semibold uppercase tracking-wide text-piste-600">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-3xl font-extrabold text-alpine-900 sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}
