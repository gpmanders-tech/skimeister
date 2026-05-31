/**
 * Gedeelde TypeScript-types die de Supabase-tabellen weerspiegelen.
 * Houd in sync met supabase/migrations.
 */
import type { Role } from "@/lib/constants/options";

export type { Role };

export interface UserRow {
  id: string;
  email: string;
  role: Role;
  created_at: string;
  updated_at: string;
}

/** Eén certificering op een instructeurprofiel (jsonb-array element). */
export interface CertificationEntry {
  cert_id: string;
  year_obtained?: number;
  certificate_url?: string;
  expiry_date?: string | null;
}

export interface InstructorProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  photo_url: string | null;
  bio: string | null;
  date_of_birth: string | null;
  nationality: string | null;
  phone: string | null;
  city: string | null;
  years_experience: number | null;
  certifications: CertificationEntry[];
  languages: string[];
  specializations: string[];
  age_groups: string[];
  preferred_resorts: string[];
  hourly_rate: number | null;
  daily_rate: number | null;
  weekly_rate: number | null;
  has_own_transport: boolean;
  school_group_experience: boolean;
  pedagogical_background: string | null;
  vog_verified: boolean;
  vog_expiry: string | null;
  ehbo_verified: boolean;
  ehbo_expiry: string | null;
  insurance_verified: boolean;
  insurance_expiry: string | null;
  insurance_provider: string | null;
  is_approved: boolean;
  is_active: boolean;
  profile_completeness: number;
  avg_rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  organization_id: string;
  instructor_id: string;
  rating: number;
  comment: string | null;
  season: string | null;
  org_type: OrgType;
  created_at: string;
}

export interface Availability {
  id: string;
  instructor_id: string;
  season: string;
  week_start: string;
  week_end: string;
  is_available: boolean;
  notes: string | null;
  created_at: string;
}

export type OrgType = "ski_school" | "travel_org" | "school_nl";

export interface Organization {
  id: string;
  user_id: string;
  org_type: OrgType;
  name: string;
  logo_url: string | null;
  description: string | null;
  website: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  resort_locations: string[];
  contact_person_name: string | null;
  contact_person_email: string | null;
  school_type: "basis" | "middelbaar" | null;
  subscription_status: string | null;
  subscription_tier: string | null;
  subscription_end_date: string | null;
  created_at: string;
  updated_at: string;
}

export type ProjectStatus = "draft" | "open" | "closed" | "completed";

export interface Project {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  resort_id: string | null;
  start_date: string | null;
  end_date: string | null;
  participants_count: number | null;
  instructors_needed: number | null;
  participant_level: string | null;
  age_group: string | null;
  language_required: string[];
  min_certification: string | null;
  school_group: boolean;
  vog_required: boolean;
  ehbo_required: boolean;
  deadline: string | null;
  compensation: string | null;
  notes: string | null;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export type ApplicationStatus = "pending" | "selected" | "rejected" | "withdrawn";

export interface ProjectApplication {
  id: string;
  project_id: string;
  instructor_id: string;
  motivation: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
}

export type ContactStatus =
  | "saved"
  | "contacted"
  | "in_gesprek"
  | "aangenomen"
  | "afgewezen";

export interface SchoolContact {
  id: string;
  organization_id: string;
  instructor_id: string;
  status: ContactStatus;
  notes: string | null;
  season: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  context_type: "project" | "school_contact";
  context_id: string | null;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface DocumentRow {
  id: string;
  user_id: string;
  doc_type: "vog" | "ehbo" | "insurance" | "certificate";
  file_url: string;
  verified: boolean;
  expiry_date: string | null;
  uploaded_at: string;
  verified_at: string | null;
  verified_by: string | null;
}

export interface Aspirant {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  city: string | null;
  phone: string | null;
  current_ski_level: string | null;
  motivation: string | null;
  availability_for_training: string | null;
  status: "registered" | "enrolled" | "passed" | "active";
  partner_referral_date: string | null;
  certificate_uploaded: boolean;
  certificate_url: string | null;
  approved_by_admin: boolean;
  created_at: string;
  updated_at: string;
}
