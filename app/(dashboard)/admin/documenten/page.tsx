import { PageHeader } from "@/components/dashboard/PageHeader";
import { setDocumentVerifiedAction } from "@/lib/admin/actions";
import { createServiceClient } from "@/lib/supabase/server";
import { DOC_TYPE_LABELS, type DocType } from "@/lib/constants/options";
import {
  documentStatus,
  DOC_STATUS_LABELS,
  DOC_STATUS_STIJL,
} from "@/lib/documents/status";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Documenten — admin" };
export const dynamic = "force-dynamic";

interface DocRij {
  id: string;
  user_id: string;
  doc_type: string;
  file_url: string;
  verified: boolean;
  expiry_date: string | null;
  uploaded_at: string;
  gebruiker: { email: string } | null;
}

export default async function AdminDocumentsPage() {
  const service = createServiceClient();

  const { data } = await service
    .from("documents")
    .select("*, gebruiker:users(email)")
    .order("verified", { ascending: true })
    .order("uploaded_at", { ascending: false });
  const docs = (data ?? []) as unknown as DocRij[];

  // Naam erbij zoeken, zodat je weet wiens VOG je beoordeelt.
  const { data: profielen } = await service
    .from("instructor_profiles")
    .select("user_id, first_name, last_name")
    .limit(1000);
  const naamPerUser = new Map<string, string>();
  for (const p of (profielen ?? []) as {
    user_id: string;
    first_name: string | null;
    last_name: string | null;
  }[]) {
    const naam = [p.first_name, p.last_name].filter(Boolean).join(" ");
    if (naam) naamPerUser.set(p.user_id, naam);
  }

  const withUrls = await Promise.all(
    docs.map(async (d) => {
      const { data: signed } = await service.storage
        .from("documents")
        .createSignedUrl(d.file_url, 60 * 30);
      return { ...d, signedUrl: signed?.signedUrl ?? null };
    }),
  );

  const wachtend = withUrls.filter((d) => !d.verified).length;

  return (
    <>
      <PageHeader
        title="Documenten verifiëren"
        subtitle={
          wachtend > 0
            ? `${wachtend} ${wachtend === 1 ? "document wacht" : "documenten wachten"} op controle. Een badge verschijnt pas nadat jij hem hier goedkeurt.`
            : "Alles is gecontroleerd. Een badge verschijnt pas nadat jij hem hier goedkeurt."
        }
      />

      {withUrls.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-alpine-200 bg-white p-10 text-center text-sm text-alpine-500">
          Nog geen documenten ingediend.
        </p>
      ) : (
        <div className="space-y-2">
          {withUrls.map((d) => {
            const status = documentStatus(d);
            return (
              <div
                key={d.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-alpine-100 bg-white p-4 shadow-sm"
              >
                <div className="min-w-0">
                  <p className="font-medium text-alpine-900">
                    {naamPerUser.get(d.user_id) ?? d.gebruiker?.email ?? "Onbekende gebruiker"}
                  </p>
                  <p className="text-sm text-alpine-700">
                    {DOC_TYPE_LABELS[d.doc_type as DocType] ?? d.doc_type}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-alpine-500">
                    <span
                      className={`rounded-full px-2 py-0.5 font-medium ${DOC_STATUS_STIJL[status]}`}
                    >
                      {DOC_STATUS_LABELS[status]}
                    </span>
                    <span>
                      Ingediend {formatDate(d.uploaded_at)}
                      {d.expiry_date && ` · verloopt ${formatDate(d.expiry_date)}`}
                    </span>
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
                          : "rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                      }
                    >
                      {d.verified ? "Goedkeuring intrekken" : "Goedkeuren"}
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
