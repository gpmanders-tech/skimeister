import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { getSessionUser, ensureRoleRecord } from "@/lib/auth/user";
import { DASHBOARD_NAV } from "@/lib/constants/nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  // Zorg dat het rol-specifieke record bestaat (profiel/organisatie/aspirant).
  await ensureRoleRecord(user);

  const items = DASHBOARD_NAV[user.role];

  return (
    <div className="flex min-h-screen flex-col bg-snow lg:flex-row">
      <aside className="border-b border-alpine-100 bg-white lg:w-64 lg:border-b-0 lg:border-r">
        <div className="p-4">
          <Logo />
        </div>
        <div className="lg:sticky lg:top-0 lg:h-[calc(100vh-5rem)]">
          <DashboardNav items={items} role={user.role} email={user.email} />
        </div>
      </aside>
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-10">{children}</div>
      </main>
    </div>
  );
}
