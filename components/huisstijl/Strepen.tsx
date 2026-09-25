import { cn } from "@/lib/utils";

/**
 * De drie strepen uit het logo: oranje, amber en crème (of inkt op een licht
 * vlak). Puur decoratief.
 */
export function Strepen({
  className,
  licht = false,
}: {
  className?: string;
  /** Op een licht vlak wordt de onderste streep inkt in plaats van crème. */
  licht?: boolean;
}) {
  return (
    <div aria-hidden="true" className={cn("strepen", className)}>
      <span className="bg-piste-500" />
      <span className="bg-amber-400" />
      <span className={licht ? "bg-alpine-900" : "bg-snow"} />
    </div>
  );
}
