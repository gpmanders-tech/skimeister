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
    title: "Gidsen",
    links: [
      { href: "/opdrachten", label: "Vacatures skileraar" },
      { href: "/werken-als-skileraar", label: "Werken als skileraar" },
      { href: "/skileraar-inhuren", label: "Skileraar inhuren" },
      { href: "/instructeurs", label: "Skileraar zoeken" },
    ],
  },
  {
    title: "Platform",
    links: [
      { href: "/crew", label: "De crew" },
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
    <footer className="op-donker mt-auto bg-alpine-900 text-alpine-100">
      <div aria-hidden="true" className="flex flex-col">
        <span className="h-1 bg-piste-500" />
        <span className="h-1 bg-amber-400" />
      </div>
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-4">
          <Logo variant="light" />
          <p className="max-w-xs text-sm text-alpine-100">
            De crew van Nederlandstalige skileraren.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-piste-300">{col.title}</h3>
            <ul className="mt-4 space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm underline-offset-4 hover:text-white hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-white/15 py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-alpine-100/70 sm:flex-row">
          <p>© {new Date().getFullYear()} Skimeister.nl. Alle rechten voorbehouden.</p>
          <p>Gemaakt voor de piste</p>
        </Container>
      </div>
    </footer>
  );
}
