import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "outline" | "ghost" | "opFoto";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full text-center font-extrabold uppercase leading-tight tracking-wide transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none disabled:hover:translate-y-0";

const variants: Record<Variant, string> = {
  primary: "bg-alpine-600 text-white hover:bg-alpine-700 shadow-lg shadow-alpine-600/25",
  accent: "bg-piste-500 text-white hover:bg-piste-600 shadow-lg shadow-piste-600/25",
  outline: "border-2 border-alpine-600 text-alpine-700 hover:bg-alpine-50",
  ghost: "text-alpine-700 hover:bg-alpine-50",
  // Voor gebruik op een foto of een donker vlak. Als losse variant, want
  // klassen meegeven aan "outline" verliest het van de variant zelf.
  opFoto: "border-2 border-white text-white hover:bg-white hover:text-alpine-700",
};

// min-h in plaats van een vaste hoogte: een lange tekst in een smalle kolom
// loopt dan over twee regels in plaats van over de rand van de knop.
const sizes: Record<Size, string> = {
  sm: "min-h-9 px-4 py-1.5 text-sm",
  md: "min-h-11 px-6 py-2 text-sm",
  lg: "min-h-13 px-8 py-2.5 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: CommonProps & { href: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href"
  >) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
