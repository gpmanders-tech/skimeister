import createMollieClient, { type MollieClient } from "@mollie/api-client";

let cached: MollieClient | null = null;

/** Lazy Mollie-client. Geeft null als de API-key ontbreekt. */
export function getMollie(): MollieClient | null {
  const apiKey = process.env.MOLLIE_API_KEY;
  if (!apiKey) return null;
  if (!cached) cached = createMollieClient({ apiKey });
  return cached;
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
