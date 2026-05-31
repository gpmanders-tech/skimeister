import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/marketing/PageHero";
import { RESORTS, getResortBySlug } from "@/lib/constants/resorts";

export function generateStaticParams() {
  return RESORTS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resort = getResortBySlug(slug);
  if (!resort) return { title: "Skigebied niet gevonden" };
  return {
    title: `Skileraar in ${resort.name}`,
    description: `Vind beschikbare gecertificeerde skileraren in ${resort.name} (${resort.country}) via Skimeister.nl.`,
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

  return (
    <>
      <PageHero
        eyebrow={resort.country}
        title={`Skileraar in ${resort.name}`}
        description={`Op zoek naar een gecertificeerde, Nederlandstalige skileraar in ${resort.name}? Bekijk beschikbare instructeurs of plaats een aanvraag.`}
      />

      <Container className="py-16">
        <div className="rounded-2xl border border-alpine-100 bg-white p-8 text-center shadow-sm">
          <p className="text-alpine-700">
            Beschikbare instructeurs voor <strong>{resort.name}</strong> verschijnen
            hier zodra ze hun profiel hebben aangemaakt.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/register" variant="accent">
              Plaats een aanvraag
            </ButtonLink>
            <ButtonLink href="/instructeurs" variant="outline">
              Bekijk alle instructeurs
            </ButtonLink>
          </div>
        </div>

        <div className="mt-12">
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
