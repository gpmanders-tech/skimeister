import { PageHeader } from "@/components/dashboard/PageHeader";
import { ContractGenerator } from "@/components/contracts/ContractGenerator";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { isOrgRole } from "@/lib/auth/roles";
import { taalVoorRol } from "@/lib/i18n/taal";
import { teksten } from "@/lib/i18n/teksten";

export const metadata = { title: "Contracten" };

export default async function ContractsPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const taal = taalVoorRol(user.role);
  const t = teksten(taal).contracten;

  if (!isOrgRole(user.role)) {
    return <PageHeader title={t.titel} subtitle={t.alleenOrganisaties} />;
  }

  const supabase = await createClient();
  const { data: org } = await supabase
    .from("organizations")
    .select("name")
    .eq("user_id", user.id)
    .single();

  return (
    <>
      <PageHeader title={t.titel} subtitle={t.subtitel} />
      <ContractGenerator defaultOrgName={org?.name ?? ""} taal={taal} />
    </>
  );
}
