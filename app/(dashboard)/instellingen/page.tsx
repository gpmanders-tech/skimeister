import { PageHeader } from "@/components/dashboard/PageHeader";
import { AccountSettings } from "@/components/account/AccountSettings";
import { getSessionUser } from "@/lib/auth/user";
import { ROLE_LABELS } from "@/lib/constants/options";

export default async function SettingsPage() {
  const user = await getSessionUser();
  if (!user) return null;

  return (
    <>
      <PageHeader title="Instellingen" subtitle="Je accountgegevens." />
      <div className="mb-6 max-w-lg space-y-4 rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm">
        <Row label="E-mailadres" value={user.email} />
        <Row label="Accounttype" value={ROLE_LABELS[user.role]} />
      </div>

      <div className="max-w-2xl">
        <AccountSettings />
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-alpine-50 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-alpine-500">{label}</span>
      <span className="text-sm font-medium text-alpine-900">{value}</span>
    </div>
  );
}
