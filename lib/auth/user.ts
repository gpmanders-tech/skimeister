import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/constants/options";
import { orgTypeForRole } from "@/lib/auth/roles";

export interface SessionUser {
  id: string;
  email: string;
  role: Role;
}

/**
 * Haalt de ingelogde gebruiker + rol op (server-side).
 * Geeft null als er geen sessie is of Supabase niet is geconfigureerd.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: row } = await supabase
    .from("users")
    .select("role, email")
    .eq("id", user.id)
    .single();

  if (!row) return null;
  return { id: user.id, email: row.email ?? user.email ?? "", role: row.role as Role };
}

/**
 * Zorgt dat het rol-specifieke record bestaat (profiel / organisatie / aspirant).
 * Idempotent — veilig om bij elke dashboard-load aan te roepen.
 */
export async function ensureRoleRecord(user: SessionUser): Promise<void> {
  const supabase = await createClient();

  if (user.role === "instructor") {
    const { data } = await supabase
      .from("instructor_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!data) {
      await supabase.from("instructor_profiles").insert({ user_id: user.id });
    }
    return;
  }

  if (user.role === "aspirant") {
    const { data } = await supabase
      .from("aspirants")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!data) {
      await supabase.from("aspirants").insert({ user_id: user.id });
    }
    return;
  }

  const orgType = orgTypeForRole(user.role);
  if (orgType) {
    const { data } = await supabase
      .from("organizations")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!data) {
      await supabase.from("organizations").insert({
        user_id: user.id,
        org_type: orgType,
        name: user.email.split("@")[0],
      });
    }
  }
}
