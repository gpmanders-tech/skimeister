import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/user";

export const dynamic = "force-dynamic";

/** Beschermt alle /admin-pagina's: alleen voor de admin-rol. */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");
  return <>{children}</>;
}
