import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { CookieBanner } from "@/components/CookieBanner";

const display = Poppins({
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.skimeister.nl"),
  alternates: { canonical: "/" },
  verification: {
    google:
      process.env.GOOGLE_SITE_VERIFICATION ??
      "kaWRgUaBbKFikBZ7WZHE3HLLRhRZihjhNBzG75BWXMc",
  },
  title: {
    default: "Skimeister.nl — De verbinding tussen skileraren en de skipiste",
    template: "%s · Skimeister.nl",
  },
  description:
    "Skimeister.nl verbindt skileraren met skischolen, reisorganisaties en scholen. Vind de beste skileraar voor jouw seizoen in Oostenrijk en de Alpen.",
  keywords: [
    "skileraar gezocht",
    "skischool oostenrijk",
    "ski instructeur inhuren",
    "skileraar worden",
    "schoolreis skileraar",
  ],
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: "Skimeister.nl",
    title: "Skimeister.nl — De verbinding tussen skileraren en de skipiste",
    description:
      "Vind de beste skileraar voor jouw seizoen. Voor instructeurs, skischolen, reisorganisaties en scholen.",
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
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-snow text-alpine-900">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
