import type { Metadata } from "next";
import { canoniek, SITE, webpaginaJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

const OMSCHRIJVING =
  "Artikelen over skileraar worden, wat een skileraar verdient en de beste skigebieden om als instructeur in te werken in Oostenrijk en de Alpen.";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { BLOG_POSTS } from "@/lib/constants/blog";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  ...canoniek("/blog"),
  title: "Blog: skileraar worden en werken in de Alpen",
  description: OMSCHRIJVING,
};

export default function BlogIndex() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <JsonLd
        data={{
          ...webpaginaJsonLd({
            pad: "/blog",
            naam: "Blog van Skimeister.nl",
            omschrijving: OMSCHRIJVING,
            type: "CollectionPage",
          }),
          mainEntity: {
            "@type": "Blog",
            name: "Blog van Skimeister.nl",
            url: `${SITE}/blog`,
            blogPost: posts.map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              description: p.excerpt,
              datePublished: p.date,
              url: `${SITE}/blog/${p.slug}`,
            })),
          },
        }}
      />
      <PageHero
        eyebrow="Blog"
        title="Kennis & inspiratie voor de piste"
        description="Alles over skileraar worden, werken in de Alpen en het halen van je certificaat."
        kruimels={[{ naam: "Blog", pad: "/blog" }]}
      />
      <Container className="py-16">
        <p className="mb-10 max-w-3xl leading-relaxed text-alpine-800">
          Op deze blog schrijven we over het vak van skileraar: hoe je begint,
          welke diploma&apos;s er zijn in Oostenrijk, Zwitserland en Frankrijk,
          wat je kunt verdienen en in welke skigebieden het fijn werken is. De
          artikelen zijn bedoeld voor wie skileraar wil worden en voor wie al
          lesgeeft en een volgende stap zoekt, bijvoorbeeld een seizoen in de
          Alpen of een week met een schoolgroep.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="flex flex-col rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="text-xs text-alpine-500">
                {formatDate(p.date)} · {p.readingMinutes} min
              </p>
              <h2 className="mt-2 font-display text-lg font-bold text-alpine-900">
                {p.title}
              </h2>
              <p className="mt-2 flex-1 text-sm text-alpine-700">{p.excerpt}</p>
              <span className="mt-4 text-sm font-medium text-piste-600">Lees verder →</span>
            </Link>
          ))}
        </div>
        <p className="mt-10 text-sm text-alpine-700">
          Liever alles op één pagina? Lees de gidsen{" "}
          <Link href="/werken-als-skileraar" className="font-semibold text-piste-600 hover:underline">
            werken als skileraar
          </Link>{" "}
          en{" "}
          <Link href="/skileraar-worden" className="font-semibold text-piste-600 hover:underline">
            skileraar worden
          </Link>
          , of bekijk direct de{" "}
          <Link href="/opdrachten" className="font-semibold text-piste-600 hover:underline">
            vacatures voor skileraren
          </Link>
          .
        </p>
      </Container>
    </>
  );
}
