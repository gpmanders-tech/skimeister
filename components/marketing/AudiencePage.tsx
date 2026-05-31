import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/marketing/PageHero";

export interface AudienceContent {
  eyebrow: string;
  title: string;
  description: string;
  steps: { t: string; d: string }[];
  benefits: { t: string; d: string }[];
  ctaTitle: string;
  ctaHref: string;
  ctaLabel: string;
}

export function AudiencePage({ content }: { content: AudienceContent }) {
  return (
    <>
      <PageHero
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />

      <Container className="py-16">
        <h2 className="font-display text-2xl font-bold text-alpine-900">Hoe werkt het</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {content.steps.map((s, i) => (
            <div key={s.t} className="rounded-2xl border border-alpine-100 bg-white p-7 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-piste-500 font-display font-bold text-white">
                {i + 1}
              </div>
              <h3 className="mt-4 font-semibold text-alpine-900">{s.t}</h3>
              <p className="mt-1.5 text-sm text-alpine-700">{s.d}</p>
            </div>
          ))}
        </div>
      </Container>

      <section className="bg-snow-texture py-16">
        <Container>
          <h2 className="font-display text-2xl font-bold text-alpine-900">
            Waarom Skimeister
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {content.benefits.map((b) => (
              <div key={b.t} className="flex gap-4">
                <span className="mt-1 text-piste-500">✓</span>
                <div>
                  <h3 className="font-semibold text-alpine-900">{b.t}</h3>
                  <p className="mt-1 text-sm text-alpine-700">{b.d}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <div className="rounded-3xl bg-alpine-600 px-8 py-12 text-center text-white">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{content.ctaTitle}</h2>
          <div className="mt-6">
            <ButtonLink href={content.ctaHref} variant="accent" size="lg">
              {content.ctaLabel}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </>
  );
}
