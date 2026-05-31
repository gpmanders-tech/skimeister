import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { resolveUserNames } from "@/lib/messages/names";
import { formatDate } from "@/lib/utils";
import type { Message } from "@/lib/types";

export const metadata = { title: "Berichten" };

export default async function InboxPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("messages")
    .select("*")
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order("created_at", { ascending: false });
  const messages = (data ?? []) as Message[];

  // Groepeer per gesprekspartner.
  const convos = new Map<
    string,
    { last: Message; unread: number }
  >();
  for (const m of messages) {
    const other = m.sender_id === user.id ? m.receiver_id : m.sender_id;
    const entry = convos.get(other);
    if (!entry) {
      convos.set(other, {
        last: m,
        unread: m.receiver_id === user.id && !m.is_read ? 1 : 0,
      });
    } else if (m.receiver_id === user.id && !m.is_read) {
      entry.unread += 1;
    }
  }

  const names = await resolveUserNames(supabase, [...convos.keys()]);

  return (
    <>
      <PageHeader title="Berichten" subtitle="Je gesprekken." />

      {convos.size === 0 ? (
        <p className="rounded-2xl border border-dashed border-alpine-200 bg-white p-10 text-center text-sm text-alpine-500">
          Je hebt nog geen berichten.
        </p>
      ) : (
        <div className="divide-y divide-alpine-100 overflow-hidden rounded-2xl border border-alpine-100 bg-white shadow-sm">
          {[...convos.entries()].map(([other, { last, unread }]) => (
            <Link
              key={other}
              href={`/berichten/${other}`}
              className="flex items-center justify-between gap-4 p-4 hover:bg-alpine-50"
            >
              <div className="min-w-0">
                <p className="font-medium text-alpine-900">
                  {names.get(other) ?? "Gebruiker"}
                </p>
                <p className="truncate text-sm text-alpine-600">{last.content}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-xs text-alpine-400">{formatDate(last.created_at)}</span>
                {unread > 0 && (
                  <span className="rounded-full bg-piste-500 px-2 py-0.5 text-xs font-medium text-white">
                    {unread}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
