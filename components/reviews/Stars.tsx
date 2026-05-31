export function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const full = Math.round(rating);
  const cls = size === "lg" ? "text-xl" : "text-sm";
  return (
    <span className={`${cls} text-piste-500`} aria-label={`${rating} van 5 sterren`}>
      {"★".repeat(full)}
      <span className="text-alpine-200">{"★".repeat(5 - full)}</span>
    </span>
  );
}
