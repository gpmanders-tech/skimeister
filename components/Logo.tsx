import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Skimeister-logo (richting F, gekozen 25-9-2026): "skimeister" in Titan One
 * met drie strepen eronder. Oranje en amber blijven altijd; de letters en de
 * onderste streep zijn inkt op een licht vlak en crème op een donker vlak.
 */
export function Logo({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  const inkt = variant === "light" ? "#faf6ee" : "#0b0a09";
  return (
    <Link href="/" aria-label="Skimeister, naar de homepage" className={cn("inline-flex items-center", className)}>
      <svg viewBox="0 0 320 130" className="h-11 w-auto" role="img" aria-hidden="true">
        <text
          x="160"
          y="72"
          textAnchor="middle"
          fontSize="58"
          textLength="290"
          lengthAdjust="spacingAndGlyphs"
          fill={inkt}
          style={{ fontFamily: "var(--font-titan), sans-serif" }}
        >
          skimeister
        </text>
        <rect x="18" y="86" width="284" height="9" rx="4.5" fill="#ff6b35" />
        <rect x="18" y="100" width="284" height="9" rx="4.5" fill="#ffb347" />
        <rect x="18" y="114" width="284" height="9" rx="4.5" fill={inkt} />
      </svg>
    </Link>
  );
}
