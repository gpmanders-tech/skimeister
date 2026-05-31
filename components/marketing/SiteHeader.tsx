import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

const NAV = [
  { href: "/voor-skischolen", label: "Voor skischolen" },
  { href: "/voor-reisorganisaties", label: "Voor reisorganisaties" },
  { href: "/voor-scholen", label: "Voor scholen" },
  { href: "/skileraar-worden", label: "Skileraar worden" },
  { href: "/prijzen", label: "Prijzen" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-alpine-100 bg-snow/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-alpine-800 hover:text-piste-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ButtonLink href="/login" variant="ghost" size="sm">
            Inloggen
          </ButtonLink>
          <ButtonLink href="/register" variant="accent" size="sm">
            Gratis aanmelden
          </ButtonLink>
        </div>
      </Container>
    </header>
  );
}
