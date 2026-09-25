import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

/**
 * De site is voor skileraren (keuze Ger 25-9-2026). Pagina's voor skischolen,
 * reisorganisaties en scholen staan alleen nog in de voet.
 */
const NAV = [
  { href: "/opdrachten", label: "Opdrachten", primair: true },
  { href: "/crew", label: "De crew" },
  { href: "/werken-als-skileraar", label: "Werken als skileraar" },
  { href: "/skileraar-worden", label: "Skileraar worden" },
  { href: "/blog", label: "Blog" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-snow/95 shadow-sm backdrop-blur">
      <div aria-hidden="true" className="flex flex-col">
        <span className="h-1 bg-piste-500" />
        <span className="h-1 bg-amber-400" />
      </div>
      <Container className="flex h-20 items-center justify-between gap-3">
        <Logo />

        {/* Volledige navigatie vanaf desktop */}
        <nav className="hidden items-center gap-4 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.primair
                  ? "whitespace-nowrap text-sm font-bold text-piste-600 hover:text-piste-700"
                  : "whitespace-nowrap text-sm font-semibold text-alpine-800 hover:text-piste-600"
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
          <ButtonLink href="/login" variant="ghost" size="sm" className="max-xl:hidden">
            Inloggen
          </ButtonLink>
          <ButtonLink href="/register" variant="accent" size="sm" className="max-sm:hidden">
            Word lid
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
        {/* Op een smalle telefoon staat Aanmelden niet in de kop maar hier */}
        <Link
          href="/register"
          className="block rounded-xl px-3 py-2.5 text-sm font-bold text-piste-600 hover:bg-alpine-50 sm:hidden"
        >
          Word lid
        </Link>
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
