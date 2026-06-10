import type { MetadataRoute } from "next";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.skimeister.nl").trim();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/admin", "/api", "/instellingen", "/berichten"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
