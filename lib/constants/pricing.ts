/**
 * Prijsmodel. Instructeur & aspirant zijn altijd gratis.
 * Skischool & reisorganisatie = abonnement (Mollie terugkerend).
 * School NL/BE = eenmalig per project (Mollie one-off).
 */

export interface PlanFeature {
  text: string;
}

export interface Plan {
  id: string;
  name: string;
  audience: "skischool" | "reisorganisatie" | "school";
  priceMonthly?: number;
  priceYearly?: number;
  priceOneOff?: number;
  unit?: string;
  highlight?: boolean;
  features: string[];
}

export const PLANS: Plan[] = [
  // ── Skischool ──────────────────────────────────────────────────────────
  {
    id: "skischool_basic",
    name: "Skischool Basic",
    audience: "skischool",
    priceMonthly: 49,
    priceYearly: 399,
    features: [
      "Tot 20 profielen bekijken per maand",
      "10 contactverzoeken per maand",
      "Basis zoeken en filteren",
    ],
  },
  {
    id: "skischool_pro",
    name: "Skischool Pro",
    audience: "skischool",
    priceMonthly: 149,
    priceYearly: 999,
    highlight: true,
    features: [
      "Onbeperkt profielen bekijken",
      "Onbeperkt contactverzoeken",
      "Vergelijk instructeurs naast elkaar",
      "Exporteer seizoensoverzicht",
      "Notities per instructeur",
    ],
  },
  // ── Reisorganisatie ────────────────────────────────────────────────────
  {
    id: "travel_starter",
    name: "Reisorganisatie Starter",
    audience: "reisorganisatie",
    priceMonthly: 149,
    priceYearly: 999,
    features: [
      "Tot 5 actieve projecten",
      "Onbeperkt aanmeldingen per project",
      "Seizoenskalender",
    ],
  },
  {
    id: "travel_pro",
    name: "Reisorganisatie Pro",
    audience: "reisorganisatie",
    priceMonthly: 299,
    priceYearly: 1999,
    highlight: true,
    features: [
      "Onbeperkte projecten",
      "Seizoensplanning dashboard",
      "Export naar CSV/PDF",
      "Bulk communicatie",
    ],
  },
  // ── School NL/BE ───────────────────────────────────────────────────────
  {
    id: "school_project",
    name: "School — per project",
    audience: "school",
    priceOneOff: 79,
    unit: "per geplaatst project",
    features: [
      "Eén schoolreis-project plaatsen",
      "Onbeperkt aanmeldingen",
      "Inclusief contract template",
      "Inclusief ratio calculator",
    ],
  },
  {
    id: "school_bundle",
    name: "School — bundel",
    audience: "school",
    priceOneOff: 129,
    unit: "voor 2 projecten per jaar",
    highlight: true,
    features: [
      "Twee projecten per jaar",
      "Onbeperkt aanmeldingen",
      "Inclusief contract template",
      "Inclusief ratio calculator",
    ],
  },
];

export const PLANS_BY_AUDIENCE = {
  skischool: PLANS.filter((p) => p.audience === "skischool"),
  reisorganisatie: PLANS.filter((p) => p.audience === "reisorganisatie"),
  school: PLANS.filter((p) => p.audience === "school"),
};
