import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { RESORTS, RESORTS_BY_COUNTRY } from "@/lib/constants/resorts";
import { REGISTERABLE_ROLES, ROLE_LABELS, ROLE_TAGLINES } from "@/lib/constants/options";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://skimeister.nl";

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Skimeister.nl",
      url: SITE,
      description:
        "Marktplaats die skileraren verbindt met skischolen, reisorganisaties en scholen.",
      areaServed: ["NL", "BE", "AT"],
    },
    {
      "@type": "WebSite",
      name: "Skimeister.nl",
      url: SITE,
      inLanguage: "nl-NL",
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <Hero />
      <HowItWorks />
      <Audiences />
      <Stats />
      <ResortsSection />
      <PricingTeaser />
      <Partners />
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
          <p className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-piste-200">
            De verbinding tussen skileraren en de skipiste
          </p>
          <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            Vind de beste skileraar voor jouw seizoen
          </h1>
          <p className="mt-5 max-w-xl text-lg text-alpine-100">
            Skimeister.nl verbindt gecertificeerde skileraren met skischolen,
            reisorganisaties en scholen in Oostenrijk en de Alpen. Eén platform
            voor het hele seizoen.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/register" variant="accent" size="lg">
              Maak gratis profiel aan
            </ButtonLink>
            <ButtonLink href="/instructeurs" variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              Vind jouw skileraar
            </ButtonLink>
          </div>
          <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-alpine-100">
            <span>✓ VOG &amp; EHBO geverifieerd</span>
            <span>✓ Gratis voor instructeurs</span>
            <span>✓ {RESORTS.length} skigebieden</span>
          </p>
        </div>
        <div className="relative hidden lg:block">
          <MountainArt />
        </div>
      </Container>
    </section>
  );
}

function MountainArt() {
  return (
    <svg viewBox="0 0 400 320" className="w-full drop-shadow-2xl" aria-hidden>
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#7ea2d5" />
          <stop offset="1" stopColor="#1b3a6b" />
        </linearGradient>
      </defs>
      <rect width="400" height="320" rx="24" fill="url(#sky)" />
      <circle cx="320" cy="70" r="34" fill="#ffd9c2" opacity="0.9" />
      <path d="M0 250 L90 120 L150 200 L210 90 L280 210 L340 150 L400 250 Z" fill="#112543" />
      <path d="M210 90 l24 36 -48 0 z M90 120 l18 28 -36 0 z" fill="#fff" />
      <path d="M0 250 L400 250 L400 320 L0 320 Z" fill="#fbfcfe" />
      <path d="M40 290 q160 -40 320 0" stroke="#ff6b35" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ── Hoe werkt het ─────────────────────────────────────────────────────────*/
function HowItWorks() {
  const steps = [
    { n: 1, t: "Maak een profiel", d: "Instructeurs, skischolen en organisaties maken in enkele minuten een profiel aan." },
    { n: 2, t: "Vind een match", d: "Zoek en filter op skigebied, certificering, beschikbaarheid en specialisatie." },
    { n: 3, t: "Regel het seizoen", d: "Neem contact op, plaats projecten en regel je hele seizoen op één plek." },
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
    school_ski: "/voor-skischolen",
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

/* ── Statistieken ──────────────────────────────────────────────────────────*/
function Stats() {
  const stats = [
    { v: `${RESORTS.length}`, l: "Skigebieden" },
    { v: "8", l: "Certificeringsinstituten" },
    { v: "5", l: "Doelgroepen" },
    { v: "100%", l: "Nederlandstalig" },
  ];
  return (
    <section className="bg-alpine-600 py-16 text-white">
      <Container>
        <div className="grid gap-8 text-center sm:grid-cols-4">
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
          title="Gratis voor instructeurs, eerlijk voor organisaties"
          center
        />
        <p className="mx-auto mt-4 max-w-2xl text-alpine-700">
          Instructeurs en aspiranten gebruiken Skimeister altijd gratis.
          Skischolen en reisorganisaties kiezen een abonnement; scholen betalen
          eenvoudig per project.
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

/* ── Partners ──────────────────────────────────────────────────────────────*/
function Partners() {
  return (
    <section className="py-16">
      <Container className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-alpine-500">
          In samenwerking met opleidings- en verzekeringspartners
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-alpine-300">
          <span className="font-display text-xl font-bold">Opleidingspartner</span>
          <span className="font-display text-xl font-bold">Verzekeringspartner</span>
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
            Maak vandaag nog een gratis profiel aan of vind de skileraar die bij
            jouw groep past.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/register" variant="accent" size="lg">
              Maak gratis profiel aan
            </ButtonLink>
            <ButtonLink href="/instructeurs" variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              Vind jouw skileraar
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
