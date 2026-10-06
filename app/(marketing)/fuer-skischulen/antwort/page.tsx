import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input, Label, Select, Textarea, FormError } from "@/components/ui/form";
import {
  skischuleAbmeldenAction,
  skischuleJaAction,
  skischuleSpaeterAction,
} from "@/lib/skischulen/actions";

/**
 * Landingspagina voor de twee knoppen in de mail aan skischolen (Ger 6-10-2026):
 * groen (a=ja) opent een kort formulier om een opdracht door te geven, rood (a=nein)
 * vraagt of we later nog contact mogen opnemen of dat ze zich willen afmelden.
 * Duitstalig, want skischolen zijn Duitstalig. Niet in de sitemap.
 */
export const metadata: Metadata = {
  title: "Ihre Antwort an Skimeister.nl",
  robots: { index: false, follow: false },
};

type Params = { a?: string; s?: string; n?: string; t?: string; fehler?: string };

export default async function Page({ searchParams }: { searchParams: Promise<Params> }) {
  const p = await searchParams;
  const s = (p.s ?? "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 16);
  const schule = (p.n ?? "").slice(0, 120);

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-xl rounded-2xl border border-alpine-100 bg-white p-8 shadow-sm">
        {p.t === "danke" && (
          <>
            <h1 className="text-2xl text-alpine-900">Vielen Dank!</h1>
            <p className="mt-4 text-alpine-700">
              Wir haben Ihre Anfrage erhalten und stellen den Auftrag kostenlos auf Skimeister.nl
              online. Wir melden uns innerhalb von zwei Werktagen bei Ihnen.
            </p>
          </>
        )}
        {p.t === "spaeter" && (
          <>
            <h1 className="text-2xl text-alpine-900">Danke für Ihre Rückmeldung</h1>
            <p className="mt-4 text-alpine-700">
              Wir melden uns gerne vor der nächsten Saison noch einmal. Bis dahin hören Sie nichts
              von uns.
            </p>
          </>
        )}
        {p.t === "abgemeldet" && (
          <>
            <h1 className="text-2xl text-alpine-900">Sie sind abgemeldet</h1>
            <p className="mt-4 text-alpine-700">
              Wir kontaktieren Sie nicht mehr. Entschuldigen Sie die Störung.
            </p>
          </>
        )}

        {!p.t && p.a === "ja" && (
          <>
            <h1 className="text-2xl text-alpine-900">Auftrag kostenlos anmelden</h1>
            <p className="mt-3 text-alpine-700">
              Sagen Sie uns kurz, wen Sie suchen. Wir stellen den Auftrag für Sie online und
              niederländischsprachige Skilehrer können direkt reagieren. Für die Saison 2026/27 ist
              die erste Vermittlung kostenlos.
            </p>
            {p.fehler && (
              <div className="mt-4">
                <FormError>Bitte geben Sie den Namen der Skischule und eine E-Mail-Adresse an.</FormError>
              </div>
            )}
            <form action={skischuleJaAction} className="mt-6 space-y-4">
              <input type="hidden" name="s" value={s} />
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              <div>
                <Label htmlFor="schule">Skischule</Label>
                <Input id="schule" name="schule" defaultValue={schule} required maxLength={120} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Ansprechpartner</Label>
                  <Input id="name" name="name" maxLength={120} autoComplete="name" />
                </div>
                <div>
                  <Label htmlFor="telefon">Telefon</Label>
                  <Input id="telefon" name="telefon" maxLength={60} autoComplete="tel" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">E-Mail</Label>
                <Input id="email" name="email" type="email" required maxLength={120} autoComplete="email" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="zeitraum">Zeitraum</Label>
                  <Input id="zeitraum" name="zeitraum" placeholder="z.B. 13.02. bis 27.02.2027" maxLength={200} />
                </div>
                <div>
                  <Label htmlFor="anzahl">Anzahl Skilehrer</Label>
                  <Input id="anzahl" name="anzahl" inputMode="numeric" maxLength={20} />
                </div>
              </div>
              <div>
                <Label htmlFor="disziplin">Disziplin</Label>
                <Select id="disziplin" name="disziplin" defaultValue="Ski">
                  <option>Ski</option>
                  <option>Snowboard</option>
                  <option>Ski und Snowboard</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="bemerkung">Anforderungen und Bemerkungen</Label>
                <Textarea
                  id="bemerkung"
                  name="bemerkung"
                  maxLength={2000}
                  placeholder="z.B. Ausbildung (Anwärter, Landesskilehrer), Kindergruppen, Unterkunft, Bezahlung"
                />
              </div>
              <Button type="submit">Auftrag senden</Button>
            </form>
          </>
        )}

        {!p.t && p.a === "nein" && (
          <>
            <h1 className="text-2xl text-alpine-900">Kein Bedarf, verstanden</h1>
            <p className="mt-3 text-alpine-700">
              Dürfen wir uns vor der nächsten Saison noch einmal bei Ihnen melden?
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <form action={skischuleSpaeterAction}>
                <input type="hidden" name="s" value={s} />
                <input type="hidden" name="schule" value={schule} />
                <Button type="submit">Ja, gerne später wieder</Button>
              </form>
              <form action={skischuleAbmeldenAction}>
                <input type="hidden" name="s" value={s} />
                <input type="hidden" name="schule" value={schule} />
                <Button type="submit" variant="outline">
                  Nein, bitte abmelden
                </Button>
              </form>
            </div>
          </>
        )}

        {!p.t && p.a !== "ja" && p.a !== "nein" && (
          <>
            <h1 className="text-2xl text-alpine-900">Skimeister.nl für Skischulen</h1>
            <p className="mt-4 text-alpine-700">
              Niederländischsprachige Skilehrer für Ihre Skischule.
            </p>
            <div className="mt-6">
              <ButtonLink href="/fuer-skischulen">Mehr erfahren</ButtonLink>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
