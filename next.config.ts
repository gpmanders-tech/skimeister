import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Eén domeinvariant: alles naar www, permanent (308). Vercel doet dit
      // op domeinniveau nu met een tijdelijke 307; deze regel maakt 'm
      // permanent zodra het verkeer hier langskomt. Definitieve fix staat in
      // Vercel: Settings → Domains → skimeister.nl → Redirect to www (308).
      {
        source: "/:pad*",
        has: [{ type: "host", value: "skimeister.nl" }],
        destination: "https://www.skimeister.nl/:pad*",
        permanent: true,
      },
      // De skischolenpagina is Duitstalig en staat daarom op een Duitse URL.
      // De oude Nederlandse URL blijft werken en geeft de link-waarde door.
      {
        source: "/voor-skischolen",
        destination: "/fuer-skischulen",
        permanent: true,
      },
    ];
  },

  // De site is ook bereikbaar op de vercel.app-adressen van het project. Google
  // vindt die kopie en meldt "alternatieve pagina met correcte canonieke tag".
  // De canonical wijst goed, maar het kost crawlbudget, dus zetten we elk
  // vercel.app-adres op noindex. De hostregex kan alleen op *.vercel.app
  // matchen, nooit op skimeister.nl of www.skimeister.nl.
  async headers() {
    return [
      {
        source: "/:pad*",
        has: [{ type: "host", value: ".*\.vercel\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
