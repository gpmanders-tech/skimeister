/**
 * Minimale WeFact API v2-client.
 * Docs: https://www.wefact.nl/api/  (POST met api_key, controller, action, params)
 */

const WEFACT_URL = process.env.WEFACT_API_URL ?? "https://api.mijnwefact.nl/v2/";

export interface WeFactResponse {
  controller?: string;
  action?: string;
  status: "success" | "error";
  errors?: string[];
  [key: string]: unknown;
}

export function wefactConfigured(): boolean {
  return !!process.env.WEFACT_API_KEY;
}

/** Lage-level WeFact-call. */
export async function wefactRequest(
  controller: string,
  action: string,
  params: Record<string, unknown> = {},
): Promise<WeFactResponse> {
  const apiKey = process.env.WEFACT_API_KEY;
  if (!apiKey) throw new Error("WEFACT_API_KEY ontbreekt.");

  const body = new URLSearchParams();
  body.set("api_key", apiKey);
  body.set("controller", controller);
  body.set("action", action);
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    body.set(k, typeof v === "object" ? JSON.stringify(v) : String(v));
  }

  const res = await fetch(WEFACT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  return (await res.json()) as WeFactResponse;
}

export interface InvoiceLine {
  Description: string;
  PriceExclVat: number;
  Number?: number;
  TaxPercentage?: number;
}

/**
 * Zoekt of maakt een debiteur op e-mailadres en maakt vervolgens een factuur
 * (direct als 'verzonden' gemarkeerd, want de betaling is al binnen).
 * Geeft het factuurnummer/-id terug of null bij een fout.
 */
export async function createWefactInvoice(opts: {
  email: string;
  companyName: string;
  lines: InvoiceLine[];
}): Promise<string | null> {
  // 1. Debiteur zoeken of aanmaken.
  let debtorCode: string | undefined;
  const existing = await wefactRequest("debtor", "list", {
    searchat: "EmailAddress",
    searchfor: opts.email,
  });
  const debtors = (existing.debtors as Array<{ DebtorCode: string }>) ?? [];
  if (existing.status === "success" && debtors.length > 0) {
    debtorCode = debtors[0].DebtorCode;
  } else {
    const created = await wefactRequest("debtor", "add", {
      CompanyName: opts.companyName,
      EmailAddress: opts.email,
    });
    debtorCode = (created.debtor as { DebtorCode?: string })?.DebtorCode;
    if (created.status !== "success") return null;
  }

  // 2. Factuur aanmaken + direct verzenden.
  const invoice = await wefactRequest("invoice", "add", {
    DebtorCode: debtorCode,
    InvoiceLines: opts.lines,
  });
  if (invoice.status !== "success") return null;
  const inv = invoice.invoice as { Identifier?: string; InvoiceCode?: string };

  // Markeer als verzonden (betaling is al via Mollie ontvangen).
  if (inv?.Identifier) {
    await wefactRequest("invoice", "sendbyemail", { Identifier: inv.Identifier });
  }
  return inv?.InvoiceCode ?? inv?.Identifier ?? null;
}
