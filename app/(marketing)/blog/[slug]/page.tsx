import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { BLOG_POSTS, getPostBySlug } from "@/lib/constants/blog";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Artikel niet gevonden" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: "Skimeister.nl" },
    publisher: { "@type": "Organization", name: "Skimeister.nl" },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="border-b border-alpine-100 bg-snow-texture">
        <Container className="py-16">
          <Link href="/blog" className="text-sm font-medium text-piste-600 hover:underline">
            ← Alle artikelen
          </Link>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold text-alpine-900">
            {post.title}
          </h1>
          <p className="mt-2 text-sm text-alpine-500">
            {formatDate(post.date)} · {post.readingMinutes} min lezen
          </p>
        </Container>
      </div>

      <Container className="py-12">
        <div className="mx-auto max-w-2xl space-y-6">
          {post.blocks.map((b, i) => (
            <div key={i}>
              {b.heading && (
                <h2 className="mb-2 font-display text-xl font-bold text-alpine-900">
                  {b.heading}
                </h2>
              )}
              <p className="text-alpine-800">{b.body}</p>
            </div>
          ))}

          <div className="rounded-2xl bg-alpine-600 p-8 text-center text-white">
            <p className="font-display text-xl font-bold">Klaar om aan de slag te gaan?</p>
            <p className="mt-2 text-sm text-alpine-100">
              Maak gratis een profiel aan en word gevonden door skischolen en organisaties.
            </p>
            <div className="mt-5">
              <ButtonLink href="/register" variant="accent">Maak gratis profiel aan</ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </article>
  );
}
