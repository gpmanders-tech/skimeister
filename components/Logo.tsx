import Link from "next/link";
import { cn } from "@/lib/utils";

/** Skimeister-wordmark met berg-mark. */
export function Logo({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  const textColor = variant === "light" ? "text-white" : "text-alpine-600";
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 32 32"
        className="h-8 w-8 shrink-0"
        aria-hidden="true"
        fill="none"
      >
        <circle cx="16" cy="16" r="16" className="fill-alpine-600" />
        <path d="M6 23l5-9 3.2 5 2.3-3.8L23 23z" className="fill-white" />
        <path d="M14.2 19l2.3-3.8L23 23h-5.5z" className="fill-piste-500" />
      </svg>
      <span
        className={cn(
          "font-display text-xl font-extrabold tracking-tight",
          textColor,
        )}
      >
        Skimeister
        <span className="text-piste-500">.nl</span>
      </span>
    </Link>
  );
}
