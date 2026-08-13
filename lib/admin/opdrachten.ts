"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { notifyMatchingInstructors, notifyDecision } from "@/lib/email/notify";
import { getResortById } from "@/lib/constants/resorts";
import { REACTIE_STATUSSEN } from "@/lib/constants/options";

export interface OpdrachtState {
  error?: string;
  message?: string;
}

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

function num(v: FormDataEntryValue | null): number | null {
  if (v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function str(v: FormDataEntryValue | null): string | null {
  const s = (v as string)?.trim();
  return s ? s : null;
}

/**
 * De beheerder plaatst opdrachten onder een eigen "huisorganisatie".
 * Een project hoort altijd bij een organisatie; voor opdrachten die jij zelf
 * plaatst is dat Skimeister. Wordt eenmalig aangemaakt en daarna hergebruikt.
 */
async function huisOrganisatieId(adminUserId: string): Promise<string> {
  const service = createServiceClient();

  const { data: bestaand } = await service
    .from("organizations")
    .select("id")
    .eq("user_id", adminUserId)
    .maybeSingle();
  if (bestaand) return bestaand.id;

  const { data, error } = await service
    .from("organizations")
    .insert({
      user_id: adminUserId,
      org_type: "travel_org",
      name: "Skimeister",
      description: "Opdrachten die door Skimeister zelf zijn geplaatst.",
    })
    .select("id")
    .single();

  if (error) throw new Error(`Huisorganisatie aanmaken mislukt: ${error.message}`);
  return data.id;
}

/** Maakt een opdracht aan of werkt 'm bij. */
export async function saveOpdrachtAction(
  _prev: OpdrachtState,
  formData: FormData,
): Promise<OpdrachtState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Geen toegang." };

  const name = str(formData.get("name"));
  if (!name) return { error: "Geef de opdracht een titel." };

  const startDate = str(formData.get("start_date"));
  const endDate = str(formData.get("end_date"));
  if (startDate && endDate && endDate < startDate) {
    return { error: "De einddatum ligt vóór de startdatum." };
  }

  const ageGroup = str(formData.get("age_group"));
  const schoolGroup = formData.get("school_group") === "on";
  // Bij kinderen en schoolgroepen is een VOG hoe dan ook verplicht.
  const vogRequired =
    formData.get("vog_required") === "on" || ageGroup === "kids" || schoolGroup;

  const service = createServiceClient();
  const opdrachtId = str(formData.get("opdracht_id"));

  // Bij een nieuwe opdracht mag je de opdrachtgever kiezen; bij bewerken
  // blijft die staan zodat een bestaande koppeling niet per ongeluk verspringt.
  const gekozenOrg = str(formData.get("organization_id"));

  const payload = {
    name,
    description: str(formData.get("description")),
    resort_id: str(formData.get("resort_id")),
    start_date: startDate,
    end_date: endDate,
    participants_count: num(formData.get("participants_count")),
    instructors_needed: num(formData.get("instructors_needed")),
    participant_level: str(formData.get("participant_level")),
    age_group: ageGroup,
    language_required: formData.getAll("language_required").map(String),
    min_certification: str(formData.get("min_certification")),
    school_group: schoolGroup,
    vog_required: vogRequired,
    ehbo_required: formData.get("ehbo_required") === "on",
    board_lodging: formData.get("board_lodging") === "on",
    deadline: str(formData.get("deadline")),
    compensation: str(formData.get("compensation")),
    notes: str(formData.get("notes")),
    status: formData.get("publish") === "on" ? "open" : "draft",
  };

  if (opdrachtId) {
    const { error } = await service.from("projects").update(payload).eq("id", opdrachtId);
    if (error) return { error: vertaalFout(error.message) };

    revalidatePath("/admin/opdrachten");
    revalidatePath(`/admin/opdrachten/${opdrachtId}`);
    revalidatePath(`/opdrachten/${opdrachtId}`);
    revalidatePath("/opdrachten");
    return { message: "Opdracht opgeslagen." };
  }

  let organizationId: string;
  try {
    organizationId = gekozenOrg ?? (await huisOrganisatieId(admin.id));
  } catch (e) {
    return { error: (e as Error).message };
  }

  const { data, error } = await service
    .from("projects")
    .insert({ ...payload, organization_id: organizationId })
    .select("id")
    .single();
  if (error) return { error: vertaalFout(error.message) };

  // Direct open gezet? Instructeurs met dit gebied als voorkeur een seintje geven.
  if (payload.status === "open") {
    await notifyMatchingInstructors({
      name: payload.name,
      resort_id: payload.resort_id,
      resortName: getResortById(payload.resort_id ?? "")?.name ?? "de Alpen",
      start_date: payload.start_date,
      end_date: payload.end_date,
    });
  }

  revalidatePath("/admin/opdrachten");
  revalidatePath("/opdrachten");
  redirect(`/admin/opdrachten/${data.id}`);
}

/** Open zetten, sluiten of afronden. */
export async function setOpdrachtStatusAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["draft", "open", "closed", "completed"].includes(status)) return;

  const service = createServiceClient();
  const { data } = await service
    .from("projects")
    .update({ status })
    .eq("id", id)
    .select("name, resort_id, start_date, end_date")
    .single();

  // Bij publiceren matchende instructeurs mailen.
  if (status === "open" && data) {
    await notifyMatchingInstructors({
      name: data.name,
      resort_id: data.resort_id,
      resortName: getResortById(data.resort_id ?? "")?.name ?? "de Alpen",
      start_date: data.start_date,
      end_date: data.end_date,
    });
  }

  revalidatePath("/admin/opdrachten");
  revalidatePath(`/admin/opdrachten/${id}`);
  revalidatePath(`/opdrachten/${id}`);
  revalidatePath("/opdrachten");
}

/** Verwijdert een opdracht definitief, inclusief de reacties erop. */
export async function deleteOpdrachtAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const service = createServiceClient();
  // project_applications hangt met on delete cascade aan projects.
  await service.from("projects").delete().eq("id", id);

  revalidatePath("/admin/opdrachten");
  revalidatePath("/opdrachten");
  redirect("/admin/opdrachten");
}

/** Zet de status van een reactie en mailt de instructeur bij een besluit. */
export async function setReactieStatusAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;

  const id = String(formData.get("id") ?? "");
  const opdrachtId = String(formData.get("opdracht_id") ?? "");
  const status = String(formData.get("status") ?? "");
  const geldig = REACTIE_STATUSSEN.some((s) => s.id === status);
  if (!id || !geldig) return;

  const service = createServiceClient();
  const { data: reactie } = await service
    .from("project_applications")
    .update({ status })
    .eq("id", id)
    .select("instructor_id")
    .single();

  // Alleen bij een definitief besluit krijgt de instructeur bericht.
  if (reactie && (status === "selected" || status === "rejected")) {
    const { data: profiel } = await service
      .from("instructor_profiles")
      .select("user_id")
      .eq("id", reactie.instructor_id)
      .single();
    const { data: opdracht } = await service
      .from("projects")
      .select("name")
      .eq("id", opdrachtId)
      .single();
    if (profiel && opdracht) {
      await notifyDecision(profiel.user_id, opdracht.name, status);
    }
  }

  revalidatePath(`/admin/opdrachten/${opdrachtId}`);
}

/** Slaat de interne notitie bij een reactie op. */
export async function saveReactieNotitieAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;

  const id = String(formData.get("id") ?? "");
  const opdrachtId = String(formData.get("opdracht_id") ?? "");
  if (!id) return;

  const service = createServiceClient();
  await service
    .from("project_applications")
    .update({ admin_notes: str(formData.get("admin_notes")) })
    .eq("id", id);

  revalidatePath(`/admin/opdrachten/${opdrachtId}`);
}

function vertaalFout(message: string): string {
  if (message.includes("board_lodging")) {
    return "De kolom board_lodging bestaat nog niet. Draai eerst supabase/migrations/0007_opdrachten.sql in de Supabase SQL Editor.";
  }
  return message;
}
