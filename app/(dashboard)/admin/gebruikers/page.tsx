import { PageHeader } from "@/components/dashboard/PageHeader";
import { createServiceClient } from "@/lib/supabase/server";
import { ROLE_LABELS, type Role } from "@/lib/constants/options";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Gebruikers — admin" };

interface UserRow {
  id: string;
  email: string;
  role: Role;
  created_at: string;
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; q?: string }>;
}) {
  const { role, q } = await searchParams;
  const service = createServiceClient();

  let query = service.from("users").select("*").order("created_at", { ascending: false });
  if (role && role in ROLE_LABELS) query = query.eq("role", role);
  if (q) query = query.ilike("email", `%${q}%`);

  const { data } = await query.limit(500);
  const users = (data ?? []) as UserRow[];

  return (
    <>
      <PageHeader title="Gebruikers" subtitle={`${users.length} gebruikers`} />

      <form method="GET" className="mb-6 flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Zoek op e-mail…"
          className="flex-1 rounded-xl border border-alpine-200 px-4 py-2 text-sm"
        />
        <select name="role" defaultValue={role ?? ""} className="rounded-xl border border-alpine-200 px-3 py-2 text-sm">
          <option value="">Alle rollen</option>
          {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>
        <button type="submit" className="rounded-xl bg-alpine-600 px-5 py-2 text-sm font-medium text-white hover:bg-alpine-700">
          Filter
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-alpine-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-alpine-50 text-left text-xs uppercase tracking-wide text-alpine-500">
            <tr>
              <th className="p-3">E-mail</th>
              <th className="p-3">Rol</th>
              <th className="p-3">Aangemeld</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-alpine-50">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="p-3 text-alpine-900">{u.email}</td>
                <td className="p-3">
                  <span className="rounded-full bg-alpine-50 px-2 py-0.5 text-xs font-medium text-alpine-700">
                    {ROLE_LABELS[u.role] ?? u.role}
                  </span>
                </td>
                <td className="p-3 text-alpine-500">{formatDate(u.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="p-8 text-center text-sm text-alpine-500">Geen gebruikers gevonden.</p>
        )}
      </div>
    </>
  );
}
