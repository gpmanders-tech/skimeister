"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/user";
import { isOrgRole } from "@/lib/auth/roles";
import { notifyNewApplication, notifyDecision, notifyMatchingInstructors } from "@/lib/email/notify";
import { getResortById } from "@/lib/constants/resorts";

export interface ProjectState {
  error?: string;
  message?: string;
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

async function myOrg(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("organizations")
    .select("id, org_type")
    .eq("user_id", userId)
    .single();
  return data;
}

/** Maak of werk een project bij. Bij nieuw project wordt naar het detail geredirect. */
export async function saveProjectAction(
  _prev: ProjectState,
  formData: FormData,
): Promise<ProjectState> {
  const user = await getSessionUser();
  if (!user || !isOrgRole(user.role)) return { error: "Geen toegang." };

  const org = await myOrg(user.id);
  if (!org) return { error: "Organisatie niet gevonden." };

  const name = str(formData.get("name"));
  if (!name) return { error: "Geef het project een naam." };

  const ageGroup = str(formData.get("age_group"));
  const vogExplicit = formData.get("vog_required") === "on";
  // VOG automatisch verplicht bij kinderen.
  const vogRequired = vogExplicit || ageGroup === "kids";

  const payload = {
    organization_id: org.id,
    name,
    description: str(formData.get("description")),
    resort_id: str(formData.get("resort_id")),
    start_date: str(formData.get("start_date")),
    end_date: str(formData.get("end_date")),
    participants_count: num(formData.get("participants_count")),
    instructors_needed: num(formData.get("instructors_needed")),
    participant_level: str(formData.get("participant_level")),
    age_group: ageGroup,
    language_required: formData.getAll("language_required").map(String),
    min_certification: str(formData.get("min_certification")),
    school_group: formData.get("school_group") === "on",
    vog_required: vogRequired,
    ehbo_required: formData.get("ehbo_required") === "on",
    deadline: str(formData.get("deadline")),
    compensation: str(formData.get("compensation")),
    notes: str(formData.get("notes")),
    status: formData.get("publish") === "on" ? "open" : "draft",
  };

  const supabase = await createClient();
  const projectId = str(formData.get("project_id"));

  if (projectId) {
    const { error } = await supabase
      .from("projects")
      .update(payload)
      .eq("id", projectId)
      .eq("organization_id", org.id);
    if (error) return { error: error.message };
    revalidatePath(`/projecten/${projectId}`);
    return { message: "Project opgeslagen." };
  }

  const { data, error } = await supabase
    .from("projects")
    .insert(payload)
    .select("id")
    .single();
  if (error) return { error: error.message };

  // Direct gepubliceerd? Matchende instructeurs op de hoogte stellen.
  if (payload.status === "open" && payload.resort_id) {
    await notifyMatchingInstructors(
      payload.resort_id,
      payload.name,
      getResortById(payload.resort_id)?.name ?? "jouw gebied",
    );
  }

  revalidatePath("/projecten");
  redirect(`/projecten/${data.id}`);
}

export async function setProjectStatusAction(formData: FormData): Promise<void> {
  const user = await getSessionUser();
  if (!user || !isOrgRole(user.role)) return;
  const org = await myOrg(user.id);
  if (!org) return;

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!["draft", "open", "closed", "completed"].includes(status)) return;

  const supabase = await createClient();
  await supabase
    .from("projects")
    .update({ status })
    .eq("id", id)
    .eq("organization_id", org.id);

  // Bij publiceren: matchende instructeurs mailen.
  if (status === "open") {
    const { data: proj } = await supabase
      .from("projects")
      .select("name, resort_id")
      .eq("id", id)
      .single();
    if (proj?.resort_id) {
      await notifyMatchingInstructors(
        proj.resort_id,
        proj.name,
        getResortById(proj.resort_id)?.name ?? "jouw gebied",
      );
    }
  }

  revalidatePath(`/projecten/${id}`);
  revalidatePath("/projecten");
}

/** Instructeur meldt zich aan op een project. */
export async function applyToProjectAction(
  _prev: ProjectState,
  formData: FormData,
): Promise<ProjectState> {
  const user = await getSessionUser();
  if (!user || user.role !== "instructor") return { error: "Geen toegang." };

  const projectId = String(formData.get("project_id") ?? "");
  const motivation = str(formData.get("motivation"));
  if (!projectId) return { error: "Project ontbreekt." };

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("instructor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!profile) return { error: "Profiel niet gevonden." };

  const { error } = await supabase.from("project_applications").upsert(
    {
      project_id: projectId,
      instructor_id: profile.id,
      motivation,
      status: "pending",
    },
    { onConflict: "project_id,instructor_id" },
  );
  if (error) return { error: error.message };

  // Organisatie op de hoogte stellen.
  const { data: proj } = await supabase
    .from("projects")
    .select("name, organization_id")
    .eq("id", projectId)
    .single();
  if (proj) {
    const { data: org } = await supabase
      .from("organizations")
      .select("user_id")
      .eq("id", proj.organization_id)
      .single();
    if (org) await notifyNewApplication(org.user_id, proj.name);
  }

  revalidatePath(`/projecten/${projectId}`);
  revalidatePath("/mijn-aanmeldingen");
  return { message: "Je aanmelding is verstuurd." };
}

export async function withdrawApplicationAction(formData: FormData): Promise<void> {
  const user = await getSessionUser();
  if (!user || user.role !== "instructor") return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("instructor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!profile) return;

  await supabase
    .from("project_applications")
    .update({ status: "withdrawn" })
    .eq("id", id)
    .eq("instructor_id", profile.id);
  revalidatePath("/mijn-aanmeldingen");
}

/** Organisatie selecteert of wijst een aanmelding af. */
export async function decideApplicationAction(formData: FormData): Promise<void> {
  const user = await getSessionUser();
  if (!user || !isOrgRole(user.role)) return;
  const org = await myOrg(user.id);
  if (!org) return;

  const id = String(formData.get("id") ?? "");
  const projectId = String(formData.get("project_id") ?? "");
  const decision = String(formData.get("decision") ?? "");
  if (!["selected", "rejected"].includes(decision)) return;

  const supabase = await createClient();
  // Controleer dat de aanmelding bij een project van deze org hoort (RLS dekt dit ook).
  await supabase
    .from("project_applications")
    .update({ status: decision })
    .eq("id", id);

  // Instructeur op de hoogte stellen.
  const { data: app } = await supabase
    .from("project_applications")
    .select("instructor_id")
    .eq("id", id)
    .single();
  const { data: proj } = await supabase
    .from("projects")
    .select("name")
    .eq("id", projectId)
    .single();
  if (app && proj) {
    const { data: inst } = await supabase
      .from("instructor_profiles")
      .select("user_id")
      .eq("id", app.instructor_id)
      .single();
    if (inst) {
      await notifyDecision(inst.user_id, proj.name, decision as "selected" | "rejected");
    }
  }

  revalidatePath(`/projecten/${projectId}/aanmeldingen`);
  revalidatePath(`/projecten/${projectId}`);
}
