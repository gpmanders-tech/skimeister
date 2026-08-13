import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/ui/Container";

const COLUMNS = [
  {
    title: "Doelgroepen",
    links: [
      { href: "/fuer-skischulen", label: "Für Skischulen" },
      { href: "/voor-reisorganisaties", label: "Reisorganisaties" },
      { href: "/voor-scholen", label: "Scholen" },
      { href: "/skileraar-worden", label: "Skileraar worden" },
    ],
  },
  {
    title: "Platform",
    links: [
      { href: "/instructeurs", label: "Instructeurs" },
      { href: "/prijzen", label: "Prijzen" },
      { href: "/blog", label: "Blog" },
      { href: "/over-ons", label: "Over ons" },
      { href: "/faq", label: "Veelgestelde vragen" },
    ],
  },
  {
    title: "Juridisch",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/voorwaarden", label: "Voorwaarden" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-alpine-100 bg-white">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-alpine-700">
            De verbinding tussen skileraren en de skipiste.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-alpine-900">{col.title}</h3>
            <ul className="mt-4 space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-alpine-700 hover:text-piste-600"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-alpine-100 py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-alpine-600 sm:flex-row">
          <p>© {new Date().getFullYear()} Skimeister.nl — Alle rechten voorbehouden.</p>
          <p>Gemaakt voor de piste 🏔️</p>
        </Container>
      </div>
    </footer>
  );
}
