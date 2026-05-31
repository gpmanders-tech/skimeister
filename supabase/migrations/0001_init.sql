-- ============================================================================
-- Skimeister.nl — initieel database-schema (MVP)
-- Draai dit in de Supabase SQL Editor of via de Supabase CLI.
-- Kies bij het aanmaken van het project een EU-regio.
-- ============================================================================

-- ── Extensies ───────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ── Helper: updated_at automatisch bijwerken ────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- USERS  (1-op-1 met auth.users)
-- ============================================================================
create table public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  role        text not null check (role in
                ('instructor','aspirant','school_ski','travel_org','school_nl','admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger users_updated_at before update on public.users
  for each row execute function public.set_updated_at();

-- Admin-check (SECURITY DEFINER omzeilt RLS, voorkomt recursie)
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.users where id = auth.uid() and role = 'admin');
$$;

-- Maakt automatisch een public.users-rij aan na registratie.
-- De rol komt uit de user-metadata die we bij signUp meegeven.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'instructor')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- INSTRUCTOR PROFILES
-- ============================================================================
create table public.instructor_profiles (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null unique references public.users(id) on delete cascade,
  first_name               text,
  last_name                text,
  photo_url                text,
  bio                      text,
  date_of_birth            date,
  nationality              text,
  phone                    text,
  city                     text,
  years_experience         int,
  certifications           jsonb not null default '[]'::jsonb,
  languages                text[] not null default '{}',
  specializations          text[] not null default '{}',
  age_groups               text[] not null default '{}',
  preferred_resorts        text[] not null default '{}',
  hourly_rate              numeric(10,2),
  daily_rate               numeric(10,2),
  weekly_rate              numeric(10,2),
  has_own_transport        boolean not null default false,
  school_group_experience  boolean not null default false,
  pedagogical_background   text,
  vog_verified             boolean not null default false,
  vog_expiry               date,
  ehbo_verified            boolean not null default false,
  ehbo_expiry              date,
  insurance_verified       boolean not null default false,
  insurance_expiry         date,
  insurance_provider       text,
  is_approved              boolean not null default false,
  is_active                boolean not null default false,
  profile_completeness     int not null default 0,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index instructor_profiles_resorts_idx on public.instructor_profiles using gin (preferred_resorts);
create index instructor_profiles_active_idx  on public.instructor_profiles (is_approved, is_active);

create trigger instructor_profiles_updated_at before update on public.instructor_profiles
  for each row execute function public.set_updated_at();

-- ============================================================================
-- AVAILABILITY (beschikbaarheid per week)
-- ============================================================================
create table public.availability (
  id            uuid primary key default gen_random_uuid(),
  instructor_id uuid not null references public.instructor_profiles(id) on delete cascade,
  season        text not null,
  week_start    date not null,
  week_end      date not null,
  is_available  boolean not null default true,
  notes         text,
  created_at    timestamptz not null default now(),
  unique (instructor_id, week_start)
);

create index availability_instructor_idx on public.availability (instructor_id, season);

-- ============================================================================
-- ORGANIZATIONS (skischool / reisorganisatie / school)
-- ============================================================================
create table public.organizations (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null unique references public.users(id) on delete cascade,
  org_type              text not null check (org_type in ('ski_school','travel_org','school_nl')),
  name                  text not null,
  logo_url              text,
  description           text,
  website               text,
  phone                 text,
  address               text,
  city                  text,
  country               text,
  resort_locations      text[] not null default '{}',
  contact_person_name   text,
  contact_person_email  text,
  school_type           text check (school_type in ('basis','middelbaar')),
  subscription_status   text,
  subscription_tier     text,
  subscription_end_date date,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create trigger organizations_updated_at before update on public.organizations
  for each row execute function public.set_updated_at();

-- ============================================================================
-- PROJECTS (reisorganisaties + scholen)
-- ============================================================================
create table public.projects (
  id                 uuid primary key default gen_random_uuid(),
  organization_id    uuid not null references public.organizations(id) on delete cascade,
  name               text not null,
  description        text,
  resort_id          text,
  start_date         date,
  end_date           date,
  participants_count int,
  instructors_needed int,
  participant_level  text,
  age_group          text,
  language_required  text[] not null default '{}',
  min_certification  text,
  school_group       boolean not null default false,
  vog_required       boolean not null default false,
  ehbo_required      boolean not null default false,
  deadline           date,
  compensation       text,
  notes              text,
  status             text not null default 'draft'
                       check (status in ('draft','open','closed','completed')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index projects_status_idx on public.projects (status);
create index projects_org_idx    on public.projects (organization_id);

create trigger projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

-- ============================================================================
-- PROJECT APPLICATIONS
-- ============================================================================
create table public.project_applications (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.projects(id) on delete cascade,
  instructor_id uuid not null references public.instructor_profiles(id) on delete cascade,
  motivation    text,
  status        text not null default 'pending'
                  check (status in ('pending','selected','rejected','withdrawn')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (project_id, instructor_id)
);

create trigger project_applications_updated_at before update on public.project_applications
  for each row execute function public.set_updated_at();

-- ============================================================================
-- SCHOOL CONTACTS (skischolen beheren hun pool)
-- ============================================================================
create table public.school_contacts (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  instructor_id   uuid not null references public.instructor_profiles(id) on delete cascade,
  status          text not null default 'saved'
                    check (status in ('saved','contacted','in_gesprek','aangenomen','afgewezen')),
  notes           text,
  season          text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (organization_id, instructor_id, season)
);

create trigger school_contacts_updated_at before update on public.school_contacts
  for each row execute function public.set_updated_at();

-- ============================================================================
-- MESSAGES
-- ============================================================================
create table public.messages (
  id           uuid primary key default gen_random_uuid(),
  sender_id    uuid not null references public.users(id) on delete cascade,
  receiver_id  uuid not null references public.users(id) on delete cascade,
  context_type text not null check (context_type in ('project','school_contact')),
  context_id   uuid,
  content      text not null,
  is_read      boolean not null default false,
  created_at   timestamptz not null default now()
);

create index messages_receiver_idx on public.messages (receiver_id, is_read);
create index messages_sender_idx   on public.messages (sender_id);

-- ============================================================================
-- DOCUMENTS (VOG / EHBO / verzekering / certificaat)
-- ============================================================================
create table public.documents (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  doc_type    text not null check (doc_type in ('vog','ehbo','insurance','certificate')),
  file_url    text not null,
  verified    boolean not null default false,
  expiry_date date,
  uploaded_at timestamptz not null default now(),
  verified_at timestamptz,
  verified_by uuid references public.users(id)
);

create index documents_user_idx on public.documents (user_id);

-- ============================================================================
-- ASPIRANTS
-- ============================================================================
create table public.aspirants (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid not null unique references public.users(id) on delete cascade,
  first_name                text,
  last_name                 text,
  date_of_birth             date,
  city                      text,
  phone                     text,
  current_ski_level         text,
  motivation                text,
  availability_for_training text,
  status                    text not null default 'registered'
                              check (status in ('registered','enrolled','passed','active')),
  partner_referral_date     date,
  certificate_uploaded      boolean not null default false,
  certificate_url           text,
  approved_by_admin         boolean not null default false,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create trigger aspirants_updated_at before update on public.aspirants
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Helper: profiel-id's van de huidige gebruiker
-- ============================================================================
create or replace function public.my_instructor_id()
returns uuid language sql security definer stable set search_path = public as $$
  select id from public.instructor_profiles where user_id = auth.uid();
$$;

create or replace function public.my_org_id()
returns uuid language sql security definer stable set search_path = public as $$
  select id from public.organizations where user_id = auth.uid();
$$;
