import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Contact",
  description: "Neem contact op met het team van Skimeister.nl.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Neem contact op"
        description="Vragen over je profiel, een opdracht of een schoolreis? We helpen je graag."
      />
      <Container className="py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-alpine-100 bg-white p-8 shadow-sm">
          <dl className="space-y-4 text-alpine-800">
            <div>
              <dt className="text-sm font-semibold text-alpine-500">E-mail</dt>
              <dd>
                <a className="text-piste-600 hover:underline" href="mailto:info@skimeister.nl">
                  info@skimeister.nl
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-alpine-500">Website</dt>
              <dd>skimeister.nl</dd>
            </div>
          </dl>
          <p className="mt-6 text-sm text-alpine-600">
            We reageren doorgaans binnen één werkdag.
          </p>
        </div>
      </Container>
    </>
  );
}
