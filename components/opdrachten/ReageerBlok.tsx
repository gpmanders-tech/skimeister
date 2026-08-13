import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { ButtonLink } from "@/components/ui/Button";
import { ReageerFormulier } from "@/components/opdrachten/ReageerFormulier";

function Kader({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-alpine-100 bg-white p-5 shadow-sm sm:p-6">
      {children}
    </div>
  );
}

/**
 * Bepaalt wat een bezoeker bij een opdracht te zien krijgt. Iedereen mag de
 * opdracht lezen; alleen reageren vraagt een instructeursprofiel.
 */
export async function ReageerBlok({ opdrachtId }: { opdrachtId: string }) {
  const user = await getSessionUser();

  // ── Niet ingelogd ────────────────────────────────────────────────────────
  if (!user) {
    return (
      <Kader>
        <h2 className="font-display text-lg font-bold text-alpine-900">
          Reageren op deze opdracht
        </h2>
        <p className="mt-2 text-sm text-alpine-700">
          Maak een gratis profiel aan. Dat kost je een paar minuten en je kunt
          daarna op alle opdrachten reageren.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <ButtonLink
            href={`/register?next=/opdrachten/${opdrachtId}`}
            variant="accent"
            className="w-full sm:w-auto"
          >
            Gratis profiel aanmaken
          </ButtonLink>
          <ButtonLink
            href={`/login?redirect=/opdrachten/${opdrachtId}`}
            variant="ghost"
            className="w-full sm:w-auto"
          >
            Ik heb al een account
          </ButtonLink>
        </div>
      </Kader>
    );
  }

  // ── Ingelogd, maar geen instructeur ──────────────────────────────────────
  if (user.role !== "instructor" && user.role !== "aspirant") {
    return (
      <Kader>
        <p className="text-sm text-alpine-700">
          Je bent ingelogd als opdrachtgever. Reageren op opdrachten kan met een
          instructeursprofiel.
        </p>
      </Kader>
    );
  }

  if (user.role === "aspirant") {
    return (
      <Kader>
        <h2 className="font-display text-lg font-bold text-alpine-900">
          Nog even geduld
        </h2>
        <p className="mt-2 text-sm text-alpine-700">
          Als aspirant kun je nog niet op opdrachten reageren. Rond eerst je
          opleiding af, dan zetten we je profiel om naar instructeur.
        </p>
        <Link
          href="/opleiding"
          className="mt-3 inline-block text-sm font-semibold text-piste-600 hover:underline"
        >
          Bekijk je opleidingsstatus →
        </Link>
      </Kader>
    );
  }

  // ── Instructeur: heeft die al gereageerd? ────────────────────────────────
  const supabase = await createClient();
  const { data: profiel } = await supabase
    .from("instructor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profiel) {
    return (
      <Kader>
        <p className="text-sm text-alpine-700">
          Maak eerst je profiel af, dan kun je reageren.
        </p>
        <ButtonLink href="/profiel/bewerken" variant="accent" className="mt-4">
          Profiel afmaken
        </ButtonLink>
      </Kader>
    );
  }

  const { data: bestaand } = await supabase
    .from("project_applications")
    .select("id, status")
    .eq("project_id", opdrachtId)
    .eq("instructor_id", profiel.id)
    .maybeSingle();

  if (bestaand && bestaand.status !== "withdrawn") {
    return (
      <Kader>
        <p className="flex items-center gap-2 text-sm font-medium text-alpine-900">
          <span className="text-green-600">✓</span> Je hebt op deze opdracht gereageerd
        </p>
        <p className="mt-1 text-sm text-alpine-700">
          De opdrachtgever bekijkt je profiel en neemt contact op.
        </p>
        <Link
          href="/mijn-aanmeldingen"
          className="mt-3 inline-block text-sm font-semibold text-piste-600 hover:underline"
        >
          Bekijk je reacties →
        </Link>
      </Kader>
    );
  }

  return (
    <Kader>
      <h2 className="font-display text-lg font-bold text-alpine-900">
        Interesse in deze opdracht?
      </h2>
      <p className="mb-4 mt-1 text-sm text-alpine-700">
        Eén klik is genoeg. De opdrachtgever ziet je profiel.
      </p>
      <ReageerFormulier opdrachtId={opdrachtId} />
    </Kader>
  );
}
