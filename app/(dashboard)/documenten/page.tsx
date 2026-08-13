import { PageHeader } from "@/components/dashboard/PageHeader";
import { DocumentUploader } from "@/components/documents/DocumentUploader";
import { InsurancePromo } from "@/components/InsurancePromo";
import { deleteDocumentAction } from "@/lib/documents/actions";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { DOC_TYPE_LABELS, type DocType } from "@/lib/constants/options";
import {
  documentStatus,
  DOC_STATUS_LABELS,
  DOC_STATUS_STIJL,
} from "@/lib/documents/status";
import { formatDate } from "@/lib/utils";
import type { DocumentRow } from "@/lib/types";

export const metadata = { title: "Documenten" };

export default async function DocumentsPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data: docs } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .order("uploaded_at", { ascending: false });

  // Verzekeringsstatus van de instructeur (voor de partner-callout).
  let showInsurancePromo = false;
  if (user.role === "instructor") {
    const { data: prof } = await supabase
      .from("instructor_profiles")
      .select("insurance_verified")
      .eq("user_id", user.id)
      .maybeSingle();
    showInsurancePromo = !prof?.insurance_verified;
  }

  // Tijdelijke download-links genereren voor de privébestanden.
  const withUrls = await Promise.all(
    (docs ?? []).map(async (d: DocumentRow) => {
      const { data } = await supabase.storage
        .from("documents")
        .createSignedUrl(d.file_url, 60 * 30);
      return { ...d, signedUrl: data?.signedUrl ?? null };
    }),
  );

  return (
    <>
      <PageHeader
        title="Documenten"
        subtitle="Upload je VOG, EHBO-certificaat en verzekeringsbewijs. Ze staan op 'ingediend' tot Skimeister ze handmatig heeft gecontroleerd. Pas daarna verschijnt de badge op je profiel."
      />

      <div className="mb-8">
        <DocumentUploader />
      </div>

      {showInsurancePromo && (
        <div className="mb-8">
          <InsurancePromo />
        </div>
      )}

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-alpine-500">
        Mijn documenten
      </h2>
      {withUrls.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-alpine-200 bg-white p-8 text-center text-sm text-alpine-500">
          Je hebt nog geen documenten geüpload.
        </p>
      ) : (
        <ul className="space-y-3">
          {withUrls.map((d) => (
            <li
              key={d.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-alpine-100 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="font-medium text-alpine-900">
                  {DOC_TYPE_LABELS[d.doc_type as DocType]}
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-alpine-500">
                  <span
                    className={`rounded-full px-2 py-0.5 font-medium ${DOC_STATUS_STIJL[documentStatus(d)]}`}
                  >
                    {DOC_STATUS_LABELS[documentStatus(d)]}
                  </span>
                  <span>
                    Geüpload {formatDate(d.uploaded_at)}
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
                <form action={deleteDocumentAction}>
                  <input type="hidden" name="id" value={d.id} />
                  <input type="hidden" name="path" value={d.file_url} />
                  <button
                    type="submit"
                    className="text-sm text-alpine-500 hover:text-red-600"
                  >
                    Verwijderen
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
