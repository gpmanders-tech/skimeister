export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-alpine-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-alpine-600">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
