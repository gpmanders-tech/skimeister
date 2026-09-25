import type { Metadata } from "next";
import { Archivo, Titan_One } from "next/font/google";
import "./globals.css";
import { CookieBanner } from "@/components/CookieBanner";
import { SITE, OG_IMAGE } from "@/lib/seo";

// Retro-huisstijl (25-9-2026): Titan One zoals in het logo voor koppen,
// Archivo voor lopende tekst. Gekoppeld via --font-display en --font-sans in
// globals.css, zodat pagina's met font-display of font-sans niets hoeven te
// veranderen.
const titan = Titan_One({
  variable: "--font-titan",
  weight: "400",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  // BEWUST GEEN canonical hier: een canonical in de root-layout geldt voor
  // élke pagina die er zelf geen zet, en vertelt Google dan dat al die
  // pagina's duplicaten van de homepage zijn. Elke pagina zet 'm zelf met
  // canoniek() uit lib/seo.ts.
  verification: {
    google:
      process.env.GOOGLE_SITE_VERIFICATION ??
      "kaWRgUaBbKFikBZ7WZHE3HLLRhRZihjhNBzG75BWXMc",
  },
  title: {
    default: "Skimeister.nl: opdrachten en vacatures voor skileraren",
    template: "%s · Skimeister.nl",
  },
  description:
    "Open opdrachten van skischolen, reisorganisaties en scholen in de Alpen. VOG en EHBO worden handmatig gecontroleerd. Gratis voor skileraren.",
  // Geen keywords-tag: Google negeert die sinds 2009.
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: "Skimeister.nl",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE.url],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${titan.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-snow text-alpine-900">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
