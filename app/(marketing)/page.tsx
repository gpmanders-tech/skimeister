import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { RESORTS, RESORTS_BY_COUNTRY } from "@/lib/constants/resorts";
import { REGISTERABLE_ROLES, ROLE_LABELS, ROLE_TAGLINES } from "@/lib/constants/options";

const SITE = "https://www.skimeister.nl";

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
          <HeroVisual />
        </div>
      </Container>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative">
      {/* Alpenfoto */}
      <div className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
        <div className="relative aspect-[3/2]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-alps.jpg"
            alt="Besneeuwde Alpentop tegen een blauwe lucht"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-alpine-900/45 via-alpine-900/5 to-transparent" />
        </div>
      </div>

      {/* Zwevende instructeurkaart */}
      <div className="absolute -bottom-6 -left-6 w-64 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-alpine-100">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-alpine-500 to-alpine-700 font-display text-lg font-bold text-white">
            L
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 font-semibold text-alpine-900">
              Lars V.
              <span className="h-2 w-2 rounded-full bg-green-500" />
            </p>
            <p className="text-xs text-alpine-500">Sankt Anton · 8 jr ervaring</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1 text-sm">
          <span className="text-piste-500">★★★★★</span>
          <span className="font-medium text-alpine-700">4,9</span>
          <span className="text-xs text-alpine-400">(27)</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-alpine-50 px-2 py-0.5 text-xs font-medium text-alpine-700">
            ÖSV Landeslehrer
          </span>
          <span className="rounded-full bg-alpine-50 px-2 py-0.5 text-xs font-medium text-alpine-700">
            ISIA
          </span>
        </div>
      </div>

      {/* Zwevende verificatie-badge */}
      <div className="absolute -right-4 top-6 rounded-xl bg-white px-3 py-2 shadow-lg ring-1 ring-alpine-100">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-alpine-900">
          <span className="text-green-600">✓</span> VOG &amp; EHBO
        </p>
        <p className="text-xs text-alpine-500">geverifieerd</p>
      </div>
    </div>
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
