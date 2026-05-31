import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { getSessionUser } from "@/lib/auth/user";
import { isOrgRole } from "@/lib/auth/roles";

export const metadata = { title: "Nieuw project" };

export default async function NewProjectPage() {
  const user = await getSessionUser();
  if (!user) return null;

  if (!isOrgRole(user.role)) {
    return (
      <PageHeader
        title="Nieuw project"
        subtitle="Alleen reisorganisaties en scholen kunnen projecten aanmaken."
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Nieuw project"
        subtitle="Beschrijf je reis of schoolreis en vind de juiste instructeurs."
      />
      <ProjectForm />
    </>
  );
}
