import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { updateContactStatusAction } from "@/lib/contacts/actions";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { isOrgRole } from "@/lib/auth/roles";
import { taalVoorRol, type Taal } from "@/lib/i18n/taal";
import type { InstructorProfile, ContactStatus } from "@/lib/types";

export const metadata = { title: "Contacten" };

const STATUS_LABELS: Record<Taal, Record<ContactStatus, string>> = {
  nl: {
    saved: "Bewaard",
    contacted: "Benaderd",
    in_gesprek: "In gesprek",
    aangenomen: "Aangenomen",
    afgewezen: "Afgewezen",
  },
  de: {
    saved: "Gemerkt",
    contacted: "Kontaktiert",
    in_gesprek: "Im Gespräch",
    aangenomen: "Zugesagt",
    afgewezen: "Abgesagt",
  },
};

const L = {
  nl: {
    titel: "Contacten",
    subtitel: "Beheer de instructeurs die je hebt opgeslagen.",
    alleenOrganisaties: "Alleen voor organisaties.",
    vergelijk: "Vergelijk",
    zoeken: "Instructeurs zoeken",
    opslaan: "Opslaan",
    seizoen: "seizoen",
  },
  de: {
    titel: "Kontakte",
    subtitel: "Verwalten Sie die von Ihnen gemerkten Skilehrer.",
    alleenOrganisaties: "Nur für Organisationen.",
    vergelijk: "Vergleichen",
    zoeken: "Skilehrer suchen",
    opslaan: "Speichern",
    seizoen: "Saison",
  },
} as const;

interface ContactRow {
  id: string;
  status: ContactStatus;
  season: string | null;
  instructor: InstructorProfile | null;
}

export default async function ContactsPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const taal = taalVoorRol(user.role);
  const t = L[taal];
  const statusLabels = STATUS_LABELS[taal];

  if (!isOrgRole(user.role)) {
    return <PageHeader title={t.titel} subtitle={t.alleenOrganisaties} />;
  }

  const supabase = await createClient();
  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("user_id", user.id)
    .single();

  let contacts: ContactRow[] = [];
  if (org) {
    const { data } = await supabase
      .from("school_contacts")
      .select("id, status, season, instructor:instructor_profiles(*)")
      .eq("organization_id", org.id)
      .order("created_at", { ascending: false });
    contacts = (data ?? []) as unknown as ContactRow[];
  }

  const compareIds = contacts
    .map((c) => c.instructor?.id)
    .filter((x): x is string => !!x)
    .slice(0, 4);

  return (
    <>
      <PageHeader
        title={t.titel}
        subtitle={t.subtitel}
        action={
          <div className="flex gap-2">
            {compareIds.length >= 2 && (
              <Link
                href={`/vergelijk?ids=${compareIds.join(",")}`}
                className="rounded-full border border-alpine-200 px-5 py-2.5 text-sm font-medium text-alpine-700 hover:bg-alpine-50"
              >
                {t.vergelijk} ({compareIds.length})
              </Link>
            )}
            <Link
              href="/zoeken"
              className="rounded-full bg-piste-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-piste-600"
            >
              {t.zoeken}
            </Link>
          </div>
        }
      />

      {contacts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-alpine-200 bg-white p-10 text-center text-sm text-alpine-500">
          {taal === "de"
            ? "Noch keine Kontakte. Suchen Sie Skilehrer und merken Sie sie hier vor."
            : "Nog geen contacten. Zoek instructeurs en bewaar ze hier."}
        </p>
      ) : (
        <div className="space-y-3">
          {contacts.map((c) => {
            const p = c.instructor;
            const name = p
              ? [p.first_name, p.last_name].filter(Boolean).join(" ") || "Instructeur"
              : "Onbekend";
            return (
              <div
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-alpine-100 bg-white p-4 shadow-sm"
              >
                <div>
                  {p ? (
                    <Link
                      href={`/instructeur/${p.id}`}
                      className="font-medium text-alpine-900 hover:text-piste-600"
                    >
                      {name}
                    </Link>
                  ) : (
                    <span className="font-medium text-alpine-900">{name}</span>
                  )}
                  <p className="text-xs text-alpine-500">
                    {p?.city ?? ""} {c.season ? `· ${t.seizoen} ${c.season}` : ""}
                  </p>
                </div>
                <form action={updateContactStatusAction} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={c.id} />
                  <select
                    name="status"
                    defaultValue={c.status}
                    className="rounded-lg border border-alpine-200 px-3 py-1.5 text-sm"
                  >
                    {(Object.keys(statusLabels) as ContactStatus[]).map((s) => (
                      <option key={s} value={s}>
                        {statusLabels[s]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-lg border border-alpine-200 px-3 py-1.5 text-sm font-medium text-alpine-700 hover:bg-alpine-50"
                  >
                    {t.opslaan}
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
