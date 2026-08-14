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
};

export default nextConfig;
