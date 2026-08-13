import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ReageerBlok } from "@/components/opdrachten/ReageerBlok";
import { getOpdracht } from "@/lib/opdrachten/queries";
import {
  certificeringLabel,
  doelgroepLabel,
  instructeursLabel,
  opdrachtTitel,
  periodeLabel,
  skigebiedLabel,
} from "@/lib/opdrachten/presentatie";
import { LANGUAGES, PARTICIPANT_LEVELS } from "@/lib/constants/options";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const o = await getOpdracht(id);
  if (!o) return { title: "Opdracht niet gevonden" };

  const titel = opdrachtTitel(o);
  return {
    title: titel,
    description:
      o.description?.slice(0, 155) ??
      `${instructeursLabel(o.instructors_needed)} in ${skigebiedLabel(o.resort_id)}. ${periodeLabel(o)}.`,
    alternates: { canonical: `/opdrachten/${id}` },
    openGraph: { title: titel, type: "article" },
  };
}

export default async function OpdrachtPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const o = await getOpdracht(id);
  if (!o) notFound();

  const cert = certificeringLabel(o.min_certification);
  const niveau = PARTICIPANT_LEVELS.find((n) => n.id === o.participant_level)?.label;
  const talen = (o.language_required ?? [])
    .map((t) => LANGUAGES.find((l) => l.id === t)?.label ?? t)
    .join(", ");

  return (
    <>
      <section className="bg-alpine-600 py-10 text-white sm:py-14">
        <Container>
          <Link
            href="/opdrachten"
            className="text-sm font-medium text-alpine-100 hover:text-white"
          >
            ← Alle opdrachten
          </Link>
          <p className="mt-4 text-sm font-semibold text-piste-300">
            {skigebiedLabel(o.resort_id)}
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">
            {o.name}
          </h1>
          <p className="mt-2 text-alpine-100">{periodeLabel(o)}</p>
        </Container>
      </section>

      <section className="py-8 sm:py-12">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
            <div className="space-y-6">
              <div className="rounded-2xl border border-alpine-100 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="font-display text-lg font-bold text-alpine-900">
                  De opdracht
                </h2>
                <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  <Rij label="Skigebied" waarde={skigebiedLabel(o.resort_id)} />
                  <Rij label="Periode" waarde={periodeLabel(o)} />
                  <Rij label="Gevraagd" waarde={instructeursLabel(o.instructors_needed)} />
                  <Rij label="Doelgroep" waarde={doelgroepLabel(o)} />
                  <Rij label="Certificering" waarde={cert ? `Minimaal ${cert}` : "In overleg"} />
                  <Rij label="Vergoeding" waarde={o.compensation ?? "In overleg"} />
                  <Rij
                    label="Kost en inwoning"
                    waarde={o.board_lodging ? "Inbegrepen" : "Niet inbegrepen"}
                  />
                  {niveau ? <Rij label="Niveau deelnemers" waarde={niveau} /> : null}
                  {talen ? <Rij label="Talen" waarde={talen} /> : null}
                  {o.participants_count ? (
                    <Rij label="Groepsgrootte" waarde={`${o.participants_count} deelnemers`} />
                  ) : null}
                </dl>

                {(o.vog_required || o.ehbo_required) && (
                  <p className="mt-5 rounded-xl bg-alpine-50 px-4 py-3 text-sm text-alpine-800">
                    <strong>Vereist voor deze opdracht:</strong>{" "}
                    {[o.vog_required && "geldige VOG", o.ehbo_required && "EHBO-certificaat"]
                      .filter(Boolean)
                      .join(" en ")}
                    . Skimeister controleert deze documenten handmatig.
                  </p>
                )}
              </div>

              {o.description ? (
                <div className="rounded-2xl border border-alpine-100 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="font-display text-lg font-bold text-alpine-900">
                    Omschrijving
                  </h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-alpine-800">
                    {o.description}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="lg:sticky lg:top-24">
              <ReageerBlok opdrachtId={o.id} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function Rij({ label, waarde }: { label: string; waarde: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-alpine-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-alpine-900">{waarde}</dd>
    </div>
  );
}
