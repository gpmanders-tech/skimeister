import { Container } from "@/components/ui/Container";

export interface Tekstblok {
  kop: string;
  alineas: string[];
  punten?: string[];
}

/** Leesbare uitlegtekst: tussenkoppen met alinea's en eventueel een lijstje. */
export function Tekstblokken({
  blokken,
  titel,
  intro,
}: {
  blokken: Tekstblok[];
  titel?: string;
  intro?: string;
}) {
  return (
    <section className="py-16">
      <Container className="max-w-3xl">
        {titel ? (
          <h2 className="font-display text-3xl font-extrabold text-alpine-900">{titel}</h2>
        ) : null}
        {intro ? <p className="mt-4 text-lg leading-relaxed text-alpine-800">{intro}</p> : null}
        <div className={titel || intro ? "mt-10 space-y-10" : "space-y-10"}>
          {blokken.map((b) => (
            <div key={b.kop}>
              <h2 className="font-display text-2xl font-bold text-alpine-900">{b.kop}</h2>
              {b.alineas.map((a) => (
                <p key={a.slice(0, 40)} className="mt-3 leading-relaxed text-alpine-800">
                  {a}
                </p>
              ))}
              {b.punten?.length ? (
                <ul className="mt-4 space-y-2">
                  {b.punten.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-alpine-800">
                      <span className="mt-0.5 text-piste-500" aria-hidden="true">✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
