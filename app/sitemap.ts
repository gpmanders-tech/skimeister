import type { MetadataRoute } from "next";
import { RESORTS } from "@/lib/constants/resorts";
import { BLOG_POSTS } from "@/lib/constants/blog";
import { getOpenOpdrachten } from "@/lib/opdrachten/queries";

// Canonicale host: bewust hardcoded op www (waar de site naartoe redirect en
// waar de Search Console-property op staat). Niet uit env, want die bevatte
// spaties en de non-www-variant — dat brak de sitemap.
const BASE = "https://www.skimeister.nl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Elke open opdracht is een eigen vindbare pagina.
  const opdrachten = await getOpenOpdrachten({}, 500);

  const staticPaths = [
    "",
    "/opdrachten",
    "/instructeurs",
    "/fuer-skischulen",
    "/voor-reisorganisaties",
    "/voor-scholen",
    "/skileraar-worden",
    "/prijzen",
    "/over-ons",
    "/faq",
    "/contact",
    "/blog",
    "/privacy",
    "/voorwaarden",
    "/register",
    "/login",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));

  // Alleen skigebieden met echte inhoud (minstens één open opdracht). De rest
  // staat op noindex, en wat je niet geïndexeerd wilt hebben hoort ook niet in
  // je sitemap.
  const gebiedenMetWerk = new Set(
    opdrachten.map((o) => o.resort_id).filter((id): id is string => Boolean(id)),
  );
  const resortEntries: MetadataRoute.Sitemap = RESORTS.filter((r) =>
    gebiedenMetWerk.has(r.id),
  ).map((r) => ({
    url: `${BASE}/skigebied/${r.slug}`,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((b) => ({
    url: `${BASE}/blog/${b.slug}`,
    lastModified: b.date,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const opdrachtEntries: MetadataRoute.Sitemap = opdrachten.map((o) => ({
    url: `${BASE}/opdrachten/${o.id}`,
    lastModified: o.updated_at,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticEntries, ...opdrachtEntries, ...resortEntries, ...blogEntries];
}
