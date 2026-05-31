import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MessageComposer } from "@/components/messages/MessageComposer";
import { markConversationRead } from "@/lib/messages/actions";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { resolveUserNames } from "@/lib/messages/names";
import { cn } from "@/lib/utils";
import type { Message } from "@/lib/types";

export const metadata = { title: "Gesprek" };

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const user = await getSessionUser();
  if (!user) return null;
  const { userId: other } = await params;

  // Inkomende berichten als gelezen markeren.
  await markConversationRead(other);

  const supabase = await createClient();
  const { data } = await supabase
    .from("messages")
    .select("*")
    .or(
      `and(sender_id.eq.${user.id},receiver_id.eq.${other}),and(sender_id.eq.${other},receiver_id.eq.${user.id})`,
    )
    .order("created_at", { ascending: true });
  const messages = (data ?? []) as Message[];

  const names = await resolveUserNames(supabase, [other]);
  const otherName = names.get(other) ?? "Gebruiker";

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-2">
        <Link href="/berichten" className="text-sm font-medium text-piste-600 hover:underline">
          ← Alle berichten
        </Link>
      </div>
      <PageHeader title={otherName} />

      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-alpine-100 bg-snow shadow-sm">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <p className="py-10 text-center text-sm text-alpine-500">
              Nog geen berichten. Stuur het eerste bericht.
            </p>
          ) : (
            messages.map((m) => {
              const mine = m.sender_id === user.id;
              return (
                <div
                  key={m.id}
                  className={cn("flex", mine ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                      mine
                        ? "bg-alpine-600 text-white"
                        : "border border-alpine-100 bg-white text-alpine-800",
                    )}
                  >
                    <p className="whitespace-pre-line">{m.content}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <MessageComposer receiverId={other} />
      </div>
    </div>
  );
}
