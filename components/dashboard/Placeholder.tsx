import { PageHeader } from "@/components/dashboard/PageHeader";

/** Tijdelijke placeholder voor dashboardpagina's die nog gebouwd worden. */
export function Placeholder({
  title,
  subtitle,
  note = "Deze functie wordt binnenkort toegevoegd.",
}: {
  title: string;
  subtitle?: string;
  note?: string;
}) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="rounded-2xl border border-dashed border-alpine-200 bg-white p-10 text-center text-sm text-alpine-500">
        {note}
      </div>
    </>
  );
}
