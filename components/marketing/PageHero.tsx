import { Container } from "@/components/ui/Container";
import { Sticker } from "@/components/huisstijl/Sticker";
import { Broodkruimels } from "@/components/marketing/Broodkruimels";
import { Strepen } from "@/components/huisstijl/Strepen";
import type { Kruimel } from "@/lib/seo";

const kleuren = {
  alpine: "bg-alpine-600 text-white",
  piste: "bg-piste-500 text-white",
  zon: "bg-amber-400 text-alpine-900",
  donker: "bg-alpine-900 text-white",
};

/**
 * Paginakop in de huisstijl van de familie sites: een gekleurd vlak, een
 * schuine sticker als bovenlabel en een titel in hoofdletters.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  kleur = "alpine",
  kruimels,
  home,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  kleur?: keyof typeof kleuren;
  /** Broodkruimelpad zonder de homepage; die zet het component er zelf voor. */
  kruimels?: Kruimel[];
  /** Naam van de homepage in het pad, bijvoorbeeld "Startseite". */
  home?: string;
}) {
  // Alleen "zon" is licht genoeg voor donkere letters.
  const donker = kleur !== "zon";

  return (
    <section
      className={`relative overflow-hidden ${kleuren[kleur]} ${donker ? "op-donker" : ""}`}
    >
      <Container className="relative py-14 sm:py-20">
        {kruimels?.length ? (
          <Broodkruimels
            kruimels={kruimels}
            home={home}
            label={home === "Startseite" ? "Brotkrümelnavigation" : undefined}
            licht={donker}
          />
        ) : null}
        {eyebrow && (
          <Sticker kleur={donker ? "zon" : "wit"} className="mb-4">
            {eyebrow}
          </Sticker>
        )}
        <h1 className="max-w-3xl text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p
            className={`mt-5 max-w-2xl text-lg leading-relaxed ${
              donker ? "text-white/90" : "text-alpine-900"
            }`}
          >
            {description}
          </p>
        )}
        <Strepen className="mt-8 w-28" licht={!donker} />
      </Container>
    </section>
  );
}
