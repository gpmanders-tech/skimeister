import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { getSessionUser } from "@/lib/auth/user";
import { PLAATSINGSFEE, LANCERINGSACTIE } from "@/lib/constants/pricing";

export const metadata = { title: "Kosten" };

/**
 * Er zijn geen abonnementen meer. Deze pagina legt uit wat een organisatie
 * betaalt en wanneer. De route blijft bestaan zodat oude links en bookmarks
 * ergens zinnigs uitkomen.
 */
export default async function KostenPage() {
  const user = await getSessionUser();
  if (!user) return null;

  if (user.role === "school_nl") {
    return (
      <PageHeader
        title="Kosten"
        subtitle="Als school betaal je per project. Zie Betaling in het menu."
      />
    );
  }

  if (user.role !== "school_ski" && user.role !== "travel_org") {
    return (
      <PageHeader
        title="Kosten"
        subtitle="Voor dit account zijn er geen kosten. Instructeurs en aspiranten gebruiken Skimeister gratis."
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Kosten"
        subtitle="Geen abonnement. Je betaalt pas als er iemand geplaatst is."
      />

      <div className="rounded-2xl border border-piste-200 bg-piste-50 p-6">
        <p className="font-display text-lg font-bold text-alpine-900">
          Lanceringsactie: {LANCERINGSACTIE}
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm">
        <p className="font-display text-3xl font-extrabold text-alpine-900">
          € {PLAATSINGSFEE}
        </p>
        <p className="mt-1 text-sm text-alpine-600">per geplaatste instructeur</p>

        <ul className="mt-5 space-y-2 text-sm text-alpine-800">
          {[
            "Opdrachten plaatsen is gratis",
            "Reacties bekijken en gesprekken voeren is gratis",
            "Je betaalt pas bij een bevestigde plaatsing",
            "Geen abonnement, geen opzegtermijn",
            "Je ontvangt achteraf een factuur",
          ].map((r) => (
            <li key={r} className="flex items-start gap-2">
              <span className="mt-0.5 text-piste-500">✓</span>
              {r}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 text-sm text-alpine-600">
        Vragen over een factuur of een plaatsing?{" "}
        <Link href="/contact" className="font-medium text-piste-600 hover:underline">
          Neem contact op
        </Link>
        .
      </p>
    </>
  );
}
