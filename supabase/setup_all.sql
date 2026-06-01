-- ============================================================================
-- Skimeister.nl — VOLLEDIGE DATABASE-SETUP (alles in één)
-- Plak dit volledige bestand in de Supabase SQL Editor en klik op "Run".
-- Dit combineert migraties 0001 t/m 0006 in de juiste volgorde.
-- ============================================================================


-- ============================================================================
-- 0001 — INITIEEL SCHEMA
-- ============================================================================

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- USERS (1-op-1 met auth.users)
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

create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.users where id = auth.uid() and role = 'admin');
$$;

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

-- INSTRUCTOR PROFILES
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

-- AVAILABILITY
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

-- ORGANIZATIONS
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

-- PROJECTS
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

-- PROJECT APPLICATIONS
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

-- SCHOOL CONTACTS
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

-- MESSAGES
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

-- DOCUMENTS
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

-- ASPIRANTS
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

create or replace function public.my_instructor_id()
returns uuid language sql security definer stable set search_path = public as $$
  select id from public.instructor_profiles where user_id = auth.uid();
$$;

create or replace function public.my_org_id()
returns uuid language sql security definer stable set search_path = public as $$
  select id from public.organizations where user_id = auth.uid();
$$;


-- ============================================================================
-- 0002 — ROW LEVEL SECURITY
-- ============================================================================

alter table public.users                 enable row level security;
alter table public.instructor_profiles   enable row level security;
alter table public.availability          enable row level security;
alter table public.organizations         enable row level security;
alter table public.projects              enable row level security;
alter table public.project_applications  enable row level security;
alter table public.school_contacts       enable row level security;
alter table public.messages              enable row level security;
alter table public.documents             enable row level security;
alter table public.aspirants             enable row level security;

create policy "users: eigen rij lezen" on public.users
  for select using (id = auth.uid() or public.is_admin());
create policy "users: eigen rij bijwerken" on public.users
  for update using (id = auth.uid());

create policy "profiles: publiek leest goedgekeurde" on public.instructor_profiles
  for select using (is_approved and is_active);
create policy "profiles: eigenaar leest eigen" on public.instructor_profiles
  for select using (user_id = auth.uid() or public.is_admin());
create policy "profiles: eigenaar maakt aan" on public.instructor_profiles
  for insert with check (user_id = auth.uid());
create policy "profiles: eigenaar werkt bij" on public.instructor_profiles
  for update using (user_id = auth.uid() or public.is_admin());

create policy "availability: leesbaar voor ingelogden" on public.availability
  for select using (auth.uid() is not null);
create policy "availability: eigenaar beheert" on public.availability
  for all using (instructor_id = public.my_instructor_id())
  with check (instructor_id = public.my_instructor_id());

create policy "orgs: leesbaar voor ingelogden" on public.organizations
  for select using (auth.uid() is not null);
create policy "orgs: eigenaar maakt aan" on public.organizations
  for insert with check (user_id = auth.uid());
create policy "orgs: eigenaar werkt bij" on public.organizations
  for update using (user_id = auth.uid() or public.is_admin());

create policy "projects: open zichtbaar" on public.projects
  for select using (status = 'open' or organization_id = public.my_org_id() or public.is_admin());
create policy "projects: eigenaar maakt aan" on public.projects
  for insert with check (organization_id = public.my_org_id());
create policy "projects: eigenaar beheert" on public.projects
  for update using (organization_id = public.my_org_id() or public.is_admin());
create policy "projects: eigenaar verwijdert" on public.projects
  for delete using (organization_id = public.my_org_id());

create policy "applications: betrokkenen lezen" on public.project_applications
  for select using (
    instructor_id = public.my_instructor_id()
    or exists (
      select 1 from public.projects p
      where p.id = project_id and p.organization_id = public.my_org_id()
    )
    or public.is_admin()
  );
create policy "applications: instructeur meldt aan" on public.project_applications
  for insert with check (instructor_id = public.my_instructor_id());
create policy "applications: instructeur werkt eigen bij" on public.project_applications
  for update using (instructor_id = public.my_instructor_id());
create policy "applications: org beslist" on public.project_applications
  for update using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.organization_id = public.my_org_id()
    )
  );

create policy "contacts: org beheert eigen" on public.school_contacts
  for all using (organization_id = public.my_org_id())
  with check (organization_id = public.my_org_id());

create policy "messages: betrokkenen lezen" on public.messages
  for select using (sender_id = auth.uid() or receiver_id = auth.uid());
create policy "messages: verzender stuurt" on public.messages
  for insert with check (sender_id = auth.uid());
create policy "messages: ontvanger markeert gelezen" on public.messages
  for update using (receiver_id = auth.uid());

create policy "documents: eigenaar leest" on public.documents
  for select using (user_id = auth.uid() or public.is_admin());
create policy "documents: eigenaar beheert" on public.documents
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "aspirants: eigenaar leest" on public.aspirants
  for select using (user_id = auth.uid() or public.is_admin());
create policy "aspirants: eigenaar maakt aan" on public.aspirants
  for insert with check (user_id = auth.uid());
create policy "aspirants: eigenaar/admin werkt bij" on public.aspirants
  for update using (user_id = auth.uid() or public.is_admin());


-- ============================================================================
-- 0003 — STORAGE BUCKETS + POLICIES
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

create policy "avatars: publiek leesbaar" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatars: eigenaar uploadt" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars: eigenaar werkt bij" on storage.objects
  for update using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars: eigenaar verwijdert" on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "documents: eigenaar leest" on storage.objects
  for select using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "documents: eigenaar uploadt" on storage.objects
  for insert with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "documents: eigenaar verwijdert" on storage.objects
  for delete using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );


-- ============================================================================
-- 0004 — PAYMENTS
-- ============================================================================

create table public.payments (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.users(id) on delete cascade,
  organization_id    uuid references public.organizations(id) on delete set null,
  kind               text not null check (kind in ('subscription','project')),
  plan_id            text,
  project_id         uuid references public.projects(id) on delete set null,
  description        text,
  amount             numeric(10,2) not null,
  currency           text not null default 'EUR',
  interval           text check (interval in ('month','year','once')),
  status             text not null default 'open'
                       check (status in ('open','pending','paid','failed','expired','canceled')),
  mollie_payment_id  text unique,
  wefact_invoice_id  text,
  period_end         date,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index payments_org_idx  on public.payments (organization_id);
create index payments_user_idx on public.payments (user_id);

create trigger payments_updated_at before update on public.payments
  for each row execute function public.set_updated_at();

alter table public.payments enable row level security;

create policy "payments: eigenaar leest" on public.payments
  for select using (user_id = auth.uid() or public.is_admin());


-- ============================================================================
-- 0005 — REVIEWS
-- ============================================================================

create table public.reviews (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  instructor_id   uuid not null references public.instructor_profiles(id) on delete cascade,
  rating          int  not null check (rating between 1 and 5),
  comment         text,
  season          text,
  org_type        text not null check (org_type in ('ski_school','travel_org','school_nl')),
  created_at      timestamptz not null default now(),
  unique (organization_id, instructor_id, season)
);

create index reviews_instructor_idx on public.reviews (instructor_id);

alter table public.instructor_profiles
  add column if not exists avg_rating  numeric(3,2) not null default 0,
  add column if not exists review_count int        not null default 0;

create or replace function public.refresh_instructor_rating(p_instructor uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_avg numeric(3,2);
  v_cnt int;
begin
  select coalesce(round(avg(rating)::numeric, 2), 0), count(*)
    into v_avg, v_cnt
    from public.reviews where instructor_id = p_instructor;
  update public.instructor_profiles
     set avg_rating = v_avg, review_count = v_cnt
   where id = p_instructor;
end;
$$;

create or replace function public.reviews_after_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform public.refresh_instructor_rating(coalesce(new.instructor_id, old.instructor_id));
  return null;
end;
$$;

create trigger reviews_after_change
  after insert or update or delete on public.reviews
  for each row execute function public.reviews_after_change();

alter table public.reviews enable row level security;

create policy "reviews: publiek leesbaar" on public.reviews
  for select using (true);

create policy "reviews: org maakt aan" on public.reviews
  for insert with check (organization_id = public.my_org_id());
create policy "reviews: org werkt eigen bij" on public.reviews
  for update using (organization_id = public.my_org_id());
create policy "reviews: org verwijdert eigen" on public.reviews
  for delete using (organization_id = public.my_org_id());


-- ============================================================================
-- 0006 — SAVED SEARCHES
-- ============================================================================

create table public.saved_searches (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  name       text not null,
  params     jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index saved_searches_user_idx on public.saved_searches (user_id);

alter table public.saved_searches enable row level security;

create policy "saved_searches: eigenaar beheert" on public.saved_searches
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());


-- ============================================================================
-- KLAAR! Alle tabellen, beveiliging en opslag zijn aangemaakt.
-- ============================================================================
