import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd, type Vraag } from "@/lib/seo";

/**
 * Blok met veelgestelde vragen plus FAQPage-data. De vragen in de data zijn
 * precies de vragen die zichtbaar op de pagina staan.
 */
export function Veelgesteld({
  titel = "Veelgestelde vragen",
  vragen,
  achtergrond = true,
  metData = true,
}: {
  titel?: string;
  vragen: Vraag[];
  achtergrond?: boolean;
  /** Uit als de pagina al een eigen FAQPage heeft. */
  metData?: boolean;
}) {
  return (
    <section className={achtergrond ? "bg-snow-texture py-16" : "py-16"}>
      {metData ? <JsonLd data={faqJsonLd(vragen)} /> : null}
      <Container className="max-w-3xl">
        <h2 className="font-display text-2xl font-bold text-alpine-900">{titel}</h2>
        <div className="mt-6 space-y-3">
          {vragen.map((q) => (
            <details
              key={q.v}
              className="group rounded-2xl border border-alpine-100 bg-white p-5 shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-alpine-900 marker:content-none">
                {q.v}
                <span className="text-piste-500 transition-transform group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-alpine-700">{q.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
