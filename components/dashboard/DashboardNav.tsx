"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/lib/auth/actions";
import type { NavItem } from "@/lib/constants/nav";
import { ROLE_LABELS, type Role } from "@/lib/constants/options";
import { cn } from "@/lib/utils";

export function DashboardNav({
  items,
  role,
  email,
}: {
  items: NavItem[];
  role: Role;
  email: string;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-piste-600">
          {ROLE_LABELS[role]}
        </p>
        <p className="truncate text-sm text-alpine-700" title={email}>
          {email}
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-2">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              item.href !== "/admin/dashboard" &&
              pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-alpine-600 text-white"
                  : "text-alpine-800 hover:bg-alpine-50",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form action={signOutAction} className="border-t border-alpine-100 p-2">
        <button
          type="submit"
          className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-alpine-600 hover:bg-alpine-50 hover:text-piste-600"
        >
          Uitloggen
        </button>
      </form>
    </div>
  );
}
