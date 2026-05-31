import { PageHeader } from "@/components/dashboard/PageHeader";
import { setDocumentVerifiedAction } from "@/lib/admin/actions";
import { createServiceClient } from "@/lib/supabase/server";
import { DOC_TYPE_LABELS, type DocType } from "@/lib/constants/options";
import { formatDate } from "@/lib/utils";
import type { DocumentRow } from "@/lib/types";

export const metadata = { title: "Documenten — admin" };
export const dynamic = "force-dynamic";

export default async function AdminDocumentsPage() {
  const service = createServiceClient();
  const { data } = await service
    .from("documents")
    .select("*")
    .order("verified", { ascending: true })
    .order("uploaded_at", { ascending: false });
  const docs = (data ?? []) as DocumentRow[];

  const withUrls = await Promise.all(
    docs.map(async (d) => {
      const { data: signed } = await service.storage
        .from("documents")
        .createSignedUrl(d.file_url, 60 * 30);
      return { ...d, signedUrl: signed?.signedUrl ?? null };
    }),
  );

  return (
    <>
      <PageHeader
        title="Documenten verifiëren"
        subtitle="Controleer geüploade VOG, EHBO en verzekeringsbewijzen."
      />

      {withUrls.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-alpine-200 bg-white p-10 text-center text-sm text-alpine-500">
          Geen documenten geüpload.
        </p>
      ) : (
        <div className="space-y-2">
          {withUrls.map((d) => (
            <div
              key={d.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-alpine-100 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="font-medium text-alpine-900">
                  {DOC_TYPE_LABELS[d.doc_type as DocType]}
                </p>
                <p className="text-xs text-alpine-500">
                  Geüpload {formatDate(d.uploaded_at)}
                  {d.expiry_date && ` · verloopt ${formatDate(d.expiry_date)}`} ·{" "}
                  {d.verified ? (
                    <span className="text-green-700">geverifieerd</span>
                  ) : (
                    <span className="text-piste-700">nog niet geverifieerd</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {d.signedUrl && (
                  <a
                    href={d.signedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-piste-600 hover:underline"
                  >
                    Bekijken
                  </a>
                )}
                <form action={setDocumentVerifiedAction}>
                  <input type="hidden" name="id" value={d.id} />
                  <input type="hidden" name="verified" value={d.verified ? "0" : "1"} />
                  <button
                    type="submit"
                    className={
                      d.verified
                        ? "rounded-lg border border-alpine-200 px-3 py-1.5 text-sm text-alpine-700 hover:bg-alpine-50"
                        : "rounded-lg bg-piste-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-piste-600"
                    }
                  >
                    {d.verified ? "Verificatie intrekken" : "Verifiëren"}
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
