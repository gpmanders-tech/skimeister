import type { Role } from "@/lib/constants/options";

export interface NavItem {
  href: string;
  label: string;
}

/** Navigatie per rol binnen het dashboard. */
export const DASHBOARD_NAV: Record<Role, NavItem[]> = {
  instructor: [
    { href: "/dashboard", label: "Overzicht" },
    { href: "/opdrachten", label: "Opdrachten" },
    { href: "/profiel/bewerken", label: "Profiel" },
    { href: "/beschikbaarheid", label: "Beschikbaarheid" },
    { href: "/mijn-aanmeldingen", label: "Mijn reacties" },
    { href: "/berichten", label: "Berichten" },
    { href: "/documenten", label: "Documenten" },
    { href: "/reviews", label: "Reviews" },
    { href: "/instellingen", label: "Instellingen" },
  ],
  aspirant: [
    { href: "/dashboard", label: "Overzicht" },
    { href: "/opleiding", label: "Opleiding" },
    { href: "/documenten", label: "Documenten" },
    { href: "/instellingen", label: "Instellingen" },
  ],
  school_ski: [
    { href: "/dashboard", label: "Overzicht" },
    { href: "/zoeken", label: "Instructeurs zoeken" },
    { href: "/contacten", label: "Contacten" },
    { href: "/contracten", label: "Contracten" },
    { href: "/berichten", label: "Berichten" },
    { href: "/abonnement", label: "Kosten" },
    { href: "/instellingen", label: "Instellingen" },
  ],
  travel_org: [
    { href: "/dashboard", label: "Overzicht" },
    { href: "/projecten", label: "Projecten" },
    { href: "/projecten/nieuw", label: "Nieuw project" },
    { href: "/planning", label: "Planning" },
    { href: "/contracten", label: "Contracten" },
    { href: "/berichten", label: "Berichten" },
    { href: "/abonnement", label: "Kosten" },
    { href: "/instellingen", label: "Instellingen" },
  ],
  school_nl: [
    { href: "/dashboard", label: "Overzicht" },
    { href: "/projecten/nieuw", label: "Nieuw project" },
    { href: "/hulp", label: "Hulp & ratio" },
    { href: "/contracten", label: "Contracten" },
    { href: "/documenten", label: "Documenten" },
    { href: "/betaling", label: "Betaling" },
    { href: "/instellingen", label: "Instellingen" },
  ],
  admin: [
    { href: "/admin/dashboard", label: "Overzicht" },
    { href: "/admin/opdrachten", label: "Opdrachten" },
    { href: "/admin/gebruikers", label: "Gebruikers" },
    { href: "/admin/profielen", label: "Profielen" },
    { href: "/admin/documenten", label: "Documenten" },
    { href: "/admin/aspiranten", label: "Aspiranten" },
  ],
};
