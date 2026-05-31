import { PageHeader } from "@/components/dashboard/PageHeader";
import { Funnel } from "@/components/aspirant/Funnel";
import { AspirantActions } from "@/components/aspirant/AspirantActions";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { TRAINING_PARTNER } from "@/lib/constants/partners";
import type { Aspirant } from "@/lib/types";

export const metadata = { title: "Opleiding" };

export default async function OpleidingPage() {
  const user = await getSessionUser();
  if (!user) return null;
  if (user.role !== "aspirant") {
    return <PageHeader title="Opleiding" subtitle="Alleen voor aspiranten." />;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("aspirants")
    .select("*")
    .eq("user_id", user.id)
    .single();
  const aspirant = data as Aspirant | null;

  return (
    <>
      <PageHeader
        title="Opleiding"
        subtitle="Word skileraar via onze opleidingspartner en volg je voortgang."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {aspirant && <Funnel aspirant={aspirant} />}

        <div className="rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm">
          <h3 className="font-display text-lg font-bold text-alpine-900">
            {TRAINING_PARTNER.name}
          </h3>
          <p className="mt-1 text-sm text-alpine-600">{TRAINING_PARTNER.tagline}</p>
          <ul className="mt-4 space-y-2">
            {TRAINING_PARTNER.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-alpine-800">
                <span className="mt-0.5 text-piste-500">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6">{aspirant && <AspirantActions aspirant={aspirant} />}</div>
    </>
  );
}
