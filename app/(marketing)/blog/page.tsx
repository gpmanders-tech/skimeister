import type { Metadata } from "next";
import { canoniek } from "@/lib/seo";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { BLOG_POSTS } from "@/lib/constants/blog";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  ...canoniek("/blog"),
  title: "Blog",
  description:
    "Tips en achtergrond over skileraar worden, verdiensten en de beste skigebieden om in te werken.",
};

export default function BlogIndex() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Kennis & inspiratie voor de piste"
        description="Alles over skileraar worden, werken in de Alpen en het halen van je certificaat."
      />
      <Container className="py-16">
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
      </Container>
    </>
  );
}
