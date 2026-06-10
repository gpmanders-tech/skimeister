import type { MetadataRoute } from "next";

const BASE = "https://www.skimeister.nl";

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
