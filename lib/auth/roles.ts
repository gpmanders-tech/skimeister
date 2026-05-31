import type { Role } from "@/lib/constants/options";

/** Naar welk dashboard een rol gestuurd wordt na inloggen. */
export const DASHBOARD_PATH: Record<Role, string> = {
  instructor: "/dashboard",
  aspirant: "/dashboard",
  school_ski: "/dashboard",
  travel_org: "/dashboard",
  school_nl: "/dashboard",
  admin: "/admin/dashboard",
};

/** Of een rol bij een organisatie hoort (skischool/reisorg/school). */
export function isOrgRole(role: Role): boolean {
  return role === "school_ski" || role === "travel_org" || role === "school_nl";
}

/** Map platformrol → organizations.org_type. */
export function orgTypeForRole(role: Role): "ski_school" | "travel_org" | "school_nl" | null {
  switch (role) {
    case "school_ski":
      return "ski_school";
    case "travel_org":
      return "travel_org";
    case "school_nl":
      return "school_nl";
    default:
      return null;
  }
}
