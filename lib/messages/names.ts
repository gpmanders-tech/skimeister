import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Lost weergavenamen op voor een set user-id's, op basis van organisatie- of
 * instructeurprofiel (de users-tabel is door RLS niet leesbaar voor anderen).
 */
export async function resolveUserNames(
  supabase: SupabaseClient,
  userIds: string[],
): Promise<Map<string, string>> {
  const names = new Map<string, string>();
  const unique = [...new Set(userIds)].filter(Boolean);
  if (unique.length === 0) return names;

  const [{ data: orgs }, { data: profiles }] = await Promise.all([
    supabase.from("organizations").select("user_id, name").in("user_id", unique),
    supabase
      .from("instructor_profiles")
      .select("user_id, first_name, last_name")
      .in("user_id", unique),
  ]);

  for (const o of orgs ?? []) {
    if (o.name) names.set(o.user_id, o.name);
  }
  for (const p of profiles ?? []) {
    const full = [p.first_name, p.last_name].filter(Boolean).join(" ");
    if (full && !names.has(p.user_id)) names.set(p.user_id, full);
  }
  return names;
}
