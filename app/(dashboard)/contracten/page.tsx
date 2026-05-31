import { PageHeader } from "@/components/dashboard/PageHeader";
import { ContractGenerator } from "@/components/contracts/ContractGenerator";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { isOrgRole } from "@/lib/auth/roles";

export const metadata = { title: "Contracten" };

export default async function ContractsPage() {
  const user = await getSessionUser();
  if (!user) return null;
  if (!isOrgRole(user.role)) {
    return <PageHeader title="Contracten" subtitle="Alleen voor organisaties." />;
  }

  const supabase = await createClient();
  const { data: org } = await supabase
    .from("organizations")
    .select("name")
    .eq("user_id", user.id)
    .single();

  return (
    <>
      <PageHeader
        title="Contracten"
        subtitle="Genereer een standaardcontract met de skileraar en download het als PDF."
      />
      <ContractGenerator defaultOrgName={org?.name ?? ""} />
    </>
  );
}
