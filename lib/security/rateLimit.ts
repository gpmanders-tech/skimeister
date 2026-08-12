import { headers } from "next/headers";

/**
 * Simpele rate limit in het geheugen van de server-instantie.
 *
 * Let op: serverless draait meerdere instanties, dus dit is geen harde grens.
 * Het remt een bot die vanaf één IP honderden keren post wel flink af, zonder
 * externe dienst of database. Voor een harde grens is Upstash/Redis nodig.
 */

const hits = new Map<string, number[]>();

/** Voorkomt dat de map onbeperkt groeit bij veel losse IP's. */
function prune(now: number, windowMs: number): void {
  if (hits.size < 5_000) return;
  for (const [key, times] of hits) {
    const recent = times.filter((t) => now - t < windowMs);
    if (recent.length === 0) hits.delete(key);
    else hits.set(key, recent);
  }
}

export interface RateLimitResult {
  ok: boolean;
  retryAfterMinutes: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  prune(now, windowMs);

  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    const oldest = Math.min(...recent);
    const waitMs = windowMs - (now - oldest);
    hits.set(key, recent);
    return { ok: false, retryAfterMinutes: Math.max(1, Math.ceil(waitMs / 60_000)) };
  }

  recent.push(now);
  hits.set(key, recent);
  return { ok: true, retryAfterMinutes: 0 };
}

/** IP van de bezoeker achter de proxy van Vercel/Traefik. */
export async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return h.get("x-real-ip")?.trim() || "onbekend";
}
