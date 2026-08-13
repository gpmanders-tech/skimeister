import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

/** Opdrachten staat bewust vooraan: dat is waar het platform om draait. */
const NAV = [
  { href: "/opdrachten", label: "Opdrachten", primair: true },
  { href: "/fuer-skischulen", label: "Für Skischulen" },
  { href: "/voor-reisorganisaties", label: "Voor reisorganisaties" },
  { href: "/voor-scholen", label: "Voor scholen" },
  { href: "/skileraar-worden", label: "Skileraar worden" },
  { href: "/prijzen", label: "Prijzen" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-alpine-100 bg-snow/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-3">
        <Logo />

        {/* Volledige navigatie vanaf desktop */}
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.primair
                  ? "text-sm font-semibold text-piste-600 hover:text-piste-700"
                  : "text-sm font-medium text-alpine-800 hover:text-piste-600"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Op mobiel blijft Opdrachten altijd zichtbaar */}
          <Link
            href="/opdrachten"
            className="text-sm font-semibold text-piste-600 hover:text-piste-700 lg:hidden"
          >
            Opdrachten
          </Link>
          <ButtonLink href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
            Inloggen
          </ButtonLink>
          <ButtonLink href="/register" variant="accent" size="sm">
            Aanmelden
          </ButtonLink>
          <MobielMenu />
        </div>
      </Container>
    </header>
  );
}

/**
 * Uitklapmenu voor mobiel. Bewust met <details>, zodat het zonder JavaScript
 * werkt en er geen client-component nodig is.
 */
function MobielMenu() {
  return (
    <details className="relative lg:hidden">
      <summary
        aria-label="Menu"
        className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg text-alpine-800 hover:bg-alpine-50"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path
            d="M3 6h14M3 10h14M3 14h14"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </summary>
      <nav className="absolute right-0 top-11 w-60 rounded-2xl border border-alpine-100 bg-white p-2 shadow-xl">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              item.primair
                ? "block rounded-xl px-3 py-2.5 text-sm font-semibold text-piste-600 hover:bg-alpine-50"
                : "block rounded-xl px-3 py-2.5 text-sm font-medium text-alpine-800 hover:bg-alpine-50"
            }
          >
            {item.label}
          </Link>
        ))}
        <div className="my-1 border-t border-alpine-100" />
        <Link
          href="/login"
          className="block rounded-xl px-3 py-2.5 text-sm font-medium text-alpine-800 hover:bg-alpine-50"
        >
          Inloggen
        </Link>
      </nav>
    </details>
  );
}
