import { PageHeader } from "@/components/dashboard/PageHeader";
import { convertAspirantAction } from "@/lib/aspirant/actions";
import { createServiceClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { Aspirant } from "@/lib/types";

export const metadata = { title: "Aspiranten — admin" };

const STATUS: Record<string, string> = {
  registered: "Aangemeld",
  enrolled: "Ingeschreven",
  passed: "Certificaat behaald",
  active: "Actief (instructeur)",
};

export default async function AdminAspirantsPage() {
  const service = createServiceClient();
  const { data } = await service
    .from("aspirants")
    .select("*")
    .order("created_at", { ascending: false });
  const aspirants = (data ?? []) as Aspirant[];

  const withUrls = await Promise.all(
    aspirants.map(async (a) => {
      let signedUrl: string | null = null;
      if (a.certificate_url) {
        const { data: s } = await service.storage
          .from("documents")
          .createSignedUrl(a.certificate_url, 60 * 30);
        signedUrl = s?.signedUrl ?? null;
      }
      return { ...a, signedUrl };
    }),
  );

  return (
    <>
      <PageHeader
        title="Aspiranten"
        subtitle="Controleer certificaten en zet aspiranten om naar instructeur."
      />

      {withUrls.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-alpine-200 bg-white p-10 text-center text-sm text-alpine-500">
          Nog geen aspiranten.
        </p>
      ) : (
        <div className="space-y-3">
          {withUrls.map((a) => {
            const name = [a.first_name, a.last_name].filter(Boolean).join(" ") || "(naam ontbreekt)";
            const canConvert = a.certificate_uploaded && a.status !== "active";
            return (
              <div
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-alpine-100 bg-white p-4 shadow-sm"
              >
                <div>
                  <p className="font-medium text-alpine-900">{name}</p>
                  <p className="text-xs text-alpine-500">
                    {STATUS[a.status] ?? a.status}
                    {a.partner_referral_date && ` · ingeschreven ${formatDate(a.partner_referral_date)}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {a.signedUrl && (
                    <a
                      href={a.signedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-piste-600 hover:underline"
                    >
                      Certificaat
                    </a>
                  )}
                  {canConvert && (
                    <form action={convertAspirantAction}>
                      <input type="hidden" name="user_id" value={a.user_id} />
                      <button
                        type="submit"
                        className="rounded-lg bg-piste-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-piste-600"
                      >
                        Omzetten naar instructeur
                      </button>
                    </form>
                  )}
                  {a.status === "active" && (
                    <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      Omgezet ✓
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
