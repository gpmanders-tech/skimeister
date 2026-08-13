import { PageHeader } from "@/components/dashboard/PageHeader";
import { OpdrachtForm, type OrganisatieKeuze } from "@/components/admin/OpdrachtForm";
import { createServiceClient } from "@/lib/supabase/server";

export const metadata = { title: "Nieuwe opdracht — admin" };
export const dynamic = "force-dynamic";

export default async function NieuweOpdrachtPage() {
  const service = createServiceClient();
  const { data } = await service
    .from("organizations")
    .select("id, name")
    .order("name")
    .limit(200);

  return (
    <>
      <PageHeader
        title="Nieuwe opdracht"
        subtitle="Zet 'direct publiceren' aan om hem meteen op het board te zetten."
      />
      <OpdrachtForm organisaties={(data ?? []) as OrganisatieKeuze[]} />
    </>
  );
}
