import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { broodkruimelJsonLd, type Kruimel } from "@/lib/seo";

/**
 * Zichtbaar broodkruimelpad plus de bijbehorende BreadcrumbList. Staat in de
 * gekleurde paginakop, dus de letters zijn licht. De laatste kruimel is de
 * huidige pagina en is geen link.
 */
export function Broodkruimels({
  kruimels,
  home = "Home",
  label = "Broodkruimels",
  licht = true,
}: {
  kruimels: Kruimel[];
  home?: string;
  label?: string;
  licht?: boolean;
}) {
  const pad = [{ naam: home, pad: "/" }, ...kruimels];
  const kleur = licht ? "text-white/80" : "text-alpine-600";
  return (
    <>
      <JsonLd data={broodkruimelJsonLd(kruimels, home)} />
      <nav aria-label={label} className={`mb-4 text-sm ${kleur}`}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {pad.map((k, i) => {
            const laatste = i === pad.length - 1;
            return (
              <li key={k.pad} className="flex items-center gap-2">
                {laatste ? (
                  <span aria-current="page" className="font-semibold">
                    {k.naam}
                  </span>
                ) : (
                  <>
                    <Link href={k.pad} className="underline-offset-4 hover:underline">
                      {k.naam}
                    </Link>
                    <span aria-hidden="true">/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
