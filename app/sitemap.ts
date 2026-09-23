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

  // /login en /register staan er bewust niet in: formulieren zonder
  // zoekwaarde, en ze trokken alleen meldingen over canonical en titel.
  // Ze blijven gewoon bereikbaar en gelinkt vanuit het menu.
  const staticPaths: { pad: string; prioriteit: number }[] = [
    { pad: "", prioriteit: 1 },
    { pad: "/opdrachten", prioriteit: 0.9 },
    { pad: "/werken-als-skileraar", prioriteit: 0.8 },
    { pad: "/skileraar-worden", prioriteit: 0.8 },
    { pad: "/skileraar-inhuren", prioriteit: 0.8 },
    { pad: "/instructeurs", prioriteit: 0.7 },
    { pad: "/fuer-skischulen", prioriteit: 0.7 },
    { pad: "/voor-reisorganisaties", prioriteit: 0.7 },
    { pad: "/voor-scholen", prioriteit: 0.7 },
    { pad: "/prijzen", prioriteit: 0.7 },
    { pad: "/faq", prioriteit: 0.6 },
    { pad: "/over-ons", prioriteit: 0.5 },
    { pad: "/contact", prioriteit: 0.5 },
    { pad: "/blog", prioriteit: 0.6 },
    { pad: "/privacy", prioriteit: 0.2 },
    { pad: "/voorwaarden", prioriteit: 0.2 },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map(({ pad, prioriteit }) => ({
    url: `${BASE}${pad}`,
    changeFrequency: pad === "/opdrachten" ? "daily" : "weekly",
    priority: prioriteit,
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
