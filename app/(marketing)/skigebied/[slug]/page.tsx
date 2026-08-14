import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/marketing/PageHero";
import { OpdrachtKaart } from "@/components/opdrachten/OpdrachtKaart";
import { RESORTS, getResortBySlug } from "@/lib/constants/resorts";
import { getOpenOpdrachten } from "@/lib/opdrachten/queries";
import { canoniek, CERT_PER_LAND } from "@/lib/seo";

export function generateStaticParams() {
  return RESORTS.map((r) => ({ slug: r.slug }));
}

// Elke 10 minuten verversen zodat nieuwe opdrachten hier vanzelf verschijnen.
export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resort = getResortBySlug(slug);
  if (!resort) return { title: "Skigebied niet gevonden" };

  const opdrachten = await getOpenOpdrachten({ resort: resort.id }, 20);
  const aantal = opdrachten.length;

  return {
    title:
      aantal > 0
        ? `${aantal} ${aantal === 1 ? "opdracht" : "opdrachten"} voor skileraren in ${resort.name}`
        : `Skileraar worden in ${resort.name}`,
    description:
      aantal > 0
        ? `${aantal} open ${aantal === 1 ? "opdracht" : "opdrachten"} voor skileraren in ${resort.name}, ${resort.country}. Bekijk periode, gevraagde certificering en vergoeding, en reageer met één klik.`
        : `Werken als skileraar in ${resort.name}, ${resort.country}: welke certificering gangbaar is en hoe je via Skimeister op opdrachten reageert.`,
    ...canoniek(`/skigebied/${slug}`),
    // Een pagina zonder opdrachten heeft weinig eigens te vertellen. Die
    // houden we uit de index tot er echte inhoud staat: 27 dunne pagina's
    // schaden het domein meer dan ze opleveren.
    robots: aantal > 0 ? undefined : { index: false, follow: true },
  };
}

export default async function ResortPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resort = getResortBySlug(slug);
  if (!resort) notFound();

  const opdrachten = await getOpenOpdrachten({ resort: resort.id }, 20);
  const cert = CERT_PER_LAND[resort.country];

  return (
    <>
      <PageHero
        eyebrow={resort.country}
        title={
          opdrachten.length > 0
            ? `Opdrachten voor skileraren in ${resort.name}`
            : `Skileraar worden in ${resort.name}`
        }
        description={
          opdrachten.length > 0
            ? `Er ${opdrachten.length === 1 ? "staat" : "staan"} nu ${opdrachten.length} open ${opdrachten.length === 1 ? "opdracht" : "opdrachten"} in ${resort.name}. Alles is vrij te bekijken; reageren kan met een gratis profiel.`
            : `Er staan op dit moment geen open opdrachten in ${resort.name}. Maak een profiel aan, dan krijg je bericht zodra er een binnenkomt.`
        }
      />

      <Container className="py-12 sm:py-16">
        {opdrachten.length > 0 ? (
          <div className="mb-12 grid gap-4 lg:grid-cols-2">
            {opdrachten.map((o) => (
              <OpdrachtKaart key={o.id} opdracht={o} />
            ))}
          </div>
        ) : (
          <div className="mb-12 rounded-2xl border border-dashed border-alpine-200 bg-white p-8 text-center">
            <p className="text-alpine-800">
              Nog geen open opdrachten in {resort.name}.
            </p>
            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/register" variant="accent">
                Maak een gratis profiel aan
              </ButtonLink>
              <ButtonLink href="/opdrachten" variant="outline">
                Bekijk alle opdrachten
              </ButtonLink>
            </div>
          </div>
        )}

        {/* Feitelijke informatie over certificering in dit land. */}
        {cert ? (
          <section className="mb-12 max-w-3xl">
            <h2 className="font-display text-xl font-bold text-alpine-900">
              Welke certificering vraagt men in {resort.country}?
            </h2>
            <p className="mt-3 text-alpine-800">{cert.toelichting}</p>
            <p className="mt-3 text-sm text-alpine-600">
              Skimeister controleert VOG en EHBO-certificaat handmatig voordat er
              een badge op een profiel verschijnt. Diploma&apos;s voeg je zelf toe
              aan je profiel.
            </p>
          </section>
        ) : null}

        <div>
          <h2 className="font-display text-xl font-bold text-alpine-900">
            Andere skigebieden
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {RESORTS.filter((r) => r.slug !== resort.slug)
              .slice(0, 12)
              .map((r) => (
                <Link
                  key={r.id}
                  href={`/skigebied/${r.slug}`}
                  className="rounded-full border border-alpine-200 px-3 py-1 text-sm text-alpine-700 hover:bg-alpine-50"
                >
                  {r.name}
                </Link>
              ))}
          </div>
        </div>
      </Container>
    </>
  );
}
