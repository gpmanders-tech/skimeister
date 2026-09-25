import type { Metadata } from "next";
import Link from "next/link";
import { canoniek, SITE } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { OpdrachtKaart } from "@/components/opdrachten/OpdrachtKaart";
import { Band } from "@/components/huisstijl/Band";
import { Hoogtelijnen } from "@/components/huisstijl/Hoogtelijnen";
import { RondeSticker, Sticker } from "@/components/huisstijl/Sticker";
import { Strepen } from "@/components/huisstijl/Strepen";
import { getRecenteOpdrachten } from "@/lib/opdrachten/queries";
import { getLiveCijfers, type LiveCijfers } from "@/lib/stats";
import { RESORTS_BY_COUNTRY } from "@/lib/constants/resorts";
import { Veelgesteld } from "@/components/marketing/Veelgesteld";
import { LeesOok } from "@/components/marketing/LeesOok";

const HOME_VRAGEN = [
  {
    v: "Wat is Skimeister?",
    a: "Skimeister is de crew van Nederlandstalige skileraren die in de Alpen lesgeven. Je vindt hier je opdrachten van skischolen, reisorganisaties en scholen, je collega's voor het seizoen en de kennis die je nodig hebt. Wij controleren VOG en EHBO handmatig.",
  },
  {
    v: "Hoe word ik lid van de crew?",
    a: "Maak een gratis profiel aan met je diploma's en de gebieden waar je wilt lesgeven. Zodra we je VOG en EHBO hebben gecontroleerd, kun je met één klik reageren op opdrachten.",
  },
  {
    v: "Hoe vind ik een vacature als skileraar?",
    a: "Bekijk de opdrachten op het board, ook zonder account. Past er een bij je, dan reageer je met één klik vanuit je gratis profiel. De opdrachtgever neemt daarna zelf contact op.",
  },
  {
    v: "Hoe huur ik een skileraar in?",
    a: "Plaats gratis een opdracht met skigebied, periode, gevraagde certificering en vergoeding. Skileraren die beschikbaar zijn reageren zelf. Skischolen en reisorganisaties betalen pas bij een bevestigde plaatsing.",
  },
  {
    v: "Is Skimeister gratis voor skileraren?",
    a: "Ja. Skileraren en aspiranten betalen nooit iets, niet voor hun profiel en niet voor reageren op opdrachten.",
  },
];

// Homepage blijft statisch, maar haalt elke 5 minuten verse opdrachten op.
export const revalidate = 300;

export const metadata: Metadata = {
  ...canoniek("/"),
  // absolute: anders plakt de titelsjabloon er nog eens "· Skimeister.nl" achter.
  title: { absolute: "Skimeister.nl: opdrachten en vacatures voor skileraren" },
  description:
    "Vacatures en opdrachten voor skileraren van skischolen, reisorganisaties en scholen in de Alpen. VOG en EHBO handmatig gecontroleerd. Gratis voor skileraren.",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#organisatie`,
      name: "Skimeister.nl",
      url: SITE,
      logo: `${SITE}/logo-skimeister.png`,
      image: `${SITE}/og-skimeister-retro.jpg`,
      description:
        "Platform waar skischolen, reisorganisaties en scholen opdrachten plaatsen voor skileraren. VOG en EHBO worden handmatig gecontroleerd.",
      email: "info@skimeister.nl",
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
      <div className="-mt-7 mb-4 sm:-mt-9">
        <Band
          woorden={["De crew", "Nederlandstalig", "Oostenrijk", "Zwitserland", "Frankrijk", "VOG en EHBO gecontroleerd", "Samen het seizoen in"]}
          kleur="bg-piste-500 text-alpine-900"
        />
      </div>
      <CrewVoordelen />
      <OpenOpdrachten opdrachten={opdrachten} />
      <HowItWorks />
      <Cijfers cijfers={cijfers} />
      <ResortsSection />
      <LeesOok
        titel="Gidsen voor skileraren en opdrachtgevers"
        links={[
          {
            href: "/werken-als-skileraar",
            titel: "Werken als skileraar",
            tekst: "Voor wie je werkt, welke diploma's je nodig hebt en hoe je opdrachten vindt in de Alpen.",
          },
          {
            href: "/skileraar-worden",
            titel: "Skileraar worden",
            tekst: "De route van goed skiën naar je eerste diploma en je eerste opdracht.",
          },
          {
            href: "/skileraar-inhuren",
            titel: "Skileraar inhuren",
            tekst: "Zo vind je een gecontroleerde skileraar voor je skischool, reis of schoolreis.",
          },
        ]}
      />
      <VoorOpdrachtgevers />
      <Veelgesteld vragen={HOME_VRAGEN} />
      <FinalCta />
    </>
  );
}

/* ── Hero ──────────────────────────────────────────────────────────────────*/
function Hero() {
  return (
    <section className="relative overflow-hidden bg-alpine-600 text-white">
      {/* Hoogtelijnen rond Zermatt als watermerk */}
      <Hoogtelijnen className="absolute inset-0 h-full w-full opacity-40 [mask-image:radial-gradient(ellipse_at_50%_50%,black_60%,transparent_100%)]" />
      <Container className="relative grid gap-10 pb-16 pt-20 lg:grid-cols-2 lg:items-center lg:pb-20 lg:pt-28">
        <div>
          <Sticker kleur="zon" className="mb-5">
            Crew 26/27
          </Sticker>
          <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-tight [overflow-wrap:anywhere] sm:text-5xl">
            De crew van{" "}
            <span className="text-piste-300">Nederlandstalige</span> skileraren
          </h1>
          <p className="mt-5 max-w-xl text-lg text-alpine-100">
            Skimeister is de club voor skileraren die in de Alpen lesgeven in
            het Nederlands. Hier vind je je opdrachten, je collega&apos;s voor
            het seizoen en alles wat je moet weten.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/register" variant="accent" size="lg">
              Word crewlid
            </ButtonLink>
            <ButtonLink
              href="/opdrachten"
              variant="opFoto"
              size="lg"
            >
              Bekijk de opdrachten
            </ButtonLink>
          </div>
          <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-alpine-100">
            <span>✓ Gratis lid</span>
            <span>✓ VOG &amp; EHBO handmatig gecontroleerd</span>
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
    <div className="relative mx-auto w-full max-w-[19rem] sm:max-w-sm lg:ml-auto lg:mr-4">
      {/*
        Trosje polaroids, dezelfde indeling als op tuindorpskiet.nl en
        dagjeutrecht.nl: een grote foto met twee kleinere er schuin overheen.

        Grote foto: vier lachende mensen in skikleding op de piste, van dichtbij.
        De vorige foto was bewust van afstand genomen zonder herkenbare
        gezichten; de gebruiker vond die te ver weg en te saai (18-09-2026).
        Bron: Pexels (foto 6699199), Pexels-licentie, vrij voor commercieel
        gebruik zonder naamsvermelding.
        Let op: de licentie dekt het gebruik, maar deze mensen zijn geen
        Skimeister-instructeurs. Daarom staat er geen tekst bij die suggereert
        dat dit onze skileraren zijn.
      */}
      <div className="kantel polaroid -rotate-3 overflow-hidden rounded-sm transition-transform hover:rotate-0">
        <div className="relative aspect-[3/2]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-skileraren.jpg"
            alt="Vier lachende mensen in skikleding met ski's en snowboards op de piste, met besneeuwde bergen erachter"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Skiles op de piste, van afstand gefotografeerd, dus geen herkenbare
          gezichten. Bron: Pexels (foto 35923083), Pexels-licentie. */}
      <div className="kantel polaroid absolute -bottom-16 -left-12 w-32 rotate-6 overflow-hidden rounded-sm sm:w-36">
        <div className="relative aspect-square">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-skiles.jpg"
            alt="Een skileraar geeft les aan een groep op een besneeuwde piste"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Bergpanorama. Bron: Pexels, Pexels-licentie. */}
      <div className="kantel polaroid absolute -right-10 -top-12 hidden w-32 -rotate-6 overflow-hidden rounded-sm sm:block sm:w-36">
        <div className="relative aspect-[4/3]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-alps.jpg"
            alt="Besneeuwde bergtoppen boven een skigebied"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <RondeSticker
        boven="Crew"
        midden="26/27"
        onder="seizoen"
        className="absolute -bottom-10 -right-6 sm:-right-10"
      />
    </div>
  );
}

/* ── Open opdrachten ───────────────────────────────────────────────────────*/
function OpenOpdrachten({ opdrachten }: { opdrachten: Awaited<ReturnType<typeof getRecenteOpdrachten>> }) {
  return (
    <section className="border-b border-alpine-100 bg-snow-texture py-14 sm:py-16">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Seizoen 26/27" title="Hier gaat de crew deze winter heen" />
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
    { n: 1, t: "Maak je profiel", d: "Gratis, met je diploma's, je talen en de gebieden waar je wilt lesgeven." },
    { n: 2, t: "Wij checken je papieren", d: "We controleren je VOG en EHBO met de hand. Daarna hoor je bij de crew." },
    { n: 3, t: "Reageer en ga mee", d: "Kies een opdracht die bij je past en reageer in één klik. De opdrachtgever neemt zelf contact op." },
  ];
  return (
    <section className="py-20">
      <Container>
        <SectionHeading eyebrow="Lid worden" title="Zo word je crewlid" />
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

/* ── Crew ──────────────────────────────────────────────────────────────────*/
function CrewVoordelen() {
  const voordelen = [
    {
      t: "Opdrachten eerst",
      d: "Nieuwe opdrachten in jouw gebieden komen in je mail. Reageren doe je in één klik.",
    },
    {
      t: "Samen op pad",
      d: "Bij veel opdrachten gaan meerdere skileraren tegelijk, zoals zes in Fügen. Je staat er niet alleen voor.",
    },
    {
      t: "Het crewpak",
      d: "De crew rijdt in het zwarte Skimeister-pak. Herkenbaar op de piste, van Bramberg tot Fügen.",
    },
    {
      t: "Kennis voor je seizoen",
      d: "Gidsen over diploma's, werken in Oostenrijk en je eerste seizoen als skileraar.",
    },
  ];
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="De crew" title="Meer dan een vacaturebank" />
          <Link href="/crew" className="text-sm font-semibold text-piste-600 hover:underline">
            Over de crew →
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {voordelen.map((v, i) => (
            <div key={v.t} className="rounded-2xl bg-alpine-900 p-7 text-snow">
              <Strepen className="w-12" />
              <p className="mt-5 text-xs font-bold uppercase tracking-widest text-amber-400">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 text-lg font-extrabold">{v.t}</h3>
              <p className="mt-2 text-sm text-alpine-200">{v.d}</p>
            </div>
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

/* ── Opdrachtgevers ────────────────────────────────────────────────────────*/
function VoorOpdrachtgevers() {
  const links = [
    { href: "/fuer-skischulen", label: "Für Skischulen" },
    { href: "/voor-reisorganisaties", label: "Reisorganisaties" },
    { href: "/voor-scholen", label: "Scholen" },
    { href: "/prijzen", label: "Prijzen" },
  ];
  return (
    <section className="py-16">
      <Container>
        <div className="grid gap-8 rounded-3xl border-2 border-alpine-900 bg-white p-8 sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-piste-600">
              Voor opdrachtgevers
            </p>
            <h2 className="mt-2 text-3xl text-alpine-900 sm:text-4xl">Skileraren nodig?</h2>
            <p className="mt-4 max-w-xl text-alpine-700">
              Skischolen, reisorganisaties en scholen vinden in de crew
              gecontroleerde, Nederlandstalige skileraren. Een opdracht plaatsen
              is gratis; skischolen en reisorganisaties betalen pas bij een
              bevestigde plaatsing.
            </p>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="flex items-center justify-between rounded-xl bg-snow px-5 py-3 font-semibold text-alpine-900 hover:bg-amber-100"
                >
                  {l.label}
                  <span aria-hidden="true" className="text-piste-600">→</span>
                </Link>
              </li>
            ))}
          </ul>
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
            Rij mee met de crew
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-alpine-100">
            De eerste crew gaat in februari 2027 op pad naar Bramberg, Zell am
            See en Fügen. Sluit je aan en ga mee.
          </p>
          <Strepen className="mx-auto mt-6 w-24" />
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/register" variant="accent" size="lg">
              Word crewlid
            </ButtonLink>
            <ButtonLink
              href="/opdrachten"
              variant="opFoto"
              size="lg"
            >
              Bekijk de opdrachten
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
