import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
