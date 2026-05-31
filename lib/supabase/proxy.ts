import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Ververst de Supabase-sessie bij elke request en beschermt dashboard-routes.
 * Aangeroepen vanuit de root middleware.ts.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Zonder Supabase-config (bijv. de eerste keer lokaal draaien) slaan we de
  // sessie-check over, zodat de publieke site gewoon werkt zonder setup.
  if (!url || !anonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Beschermde delen van de app
  const protectedPrefixes = [
    "/dashboard",
    "/profiel",
    "/beschikbaarheid",
    "/projecten",
    "/mijn-aanmeldingen",
    "/berichten",
    "/documenten",
    "/reviews",
    "/zoeken",
    "/contacten",
    "/planning",
    "/abonnement",
    "/betaling",
    "/opleiding",
    "/hulp",
    "/instellingen",
    "/admin",
  ];

  const path = request.nextUrl.pathname;
  const isProtected = protectedPrefixes.some(
    (p) => path === p || path.startsWith(p + "/"),
  );

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
