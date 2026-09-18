import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "outline" | "ghost" | "opFoto";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-extrabold uppercase tracking-wide transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none disabled:hover:translate-y-0";

const variants: Record<Variant, string> = {
  primary: "bg-alpine-600 text-white hover:bg-alpine-700 shadow-lg shadow-alpine-600/25",
  accent: "bg-piste-500 text-white hover:bg-piste-600 shadow-lg shadow-piste-600/25",
  outline: "border-2 border-alpine-600 text-alpine-700 hover:bg-alpine-50",
  ghost: "text-alpine-700 hover:bg-alpine-50",
  // Voor gebruik op een foto of een donker vlak. Als losse variant, want
  // klassen meegeven aan "outline" verliest het van de variant zelf.
  opFoto: "border-2 border-white text-white hover:bg-white hover:text-alpine-700",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
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
