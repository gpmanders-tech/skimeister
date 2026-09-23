import Link from "next/link";
import { Container } from "@/components/ui/Container";

export interface Verwijzing {
  href: string;
  titel: string;
  tekst: string;
}

/** Blok met gerelateerde pagina's, voor bezoekers en voor interne links. */
export function LeesOok({
  titel = "Lees ook",
  links,
  pijl = "Lees verder",
}: {
  titel?: string;
  links: Verwijzing[];
  pijl?: string;
}) {
  return (
    <section className="py-16">
      <Container>
        <h2 className="font-display text-2xl font-bold text-alpine-900">{titel}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex flex-col rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="font-display text-lg font-bold text-alpine-900 group-hover:text-piste-600">
                {l.titel}
              </span>
              <span className="mt-2 flex-1 text-sm text-alpine-700">{l.tekst}</span>
              <span className="mt-4 text-sm font-semibold text-piste-600">{pijl} →</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
