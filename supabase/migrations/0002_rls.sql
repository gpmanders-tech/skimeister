-- ============================================================================
-- Skimeister.nl — Row Level Security policies
-- Gebruikers zien alleen eigen data of publieke data.
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

-- ── USERS ───────────────────────────────────────────────────────────────────
create policy "users: eigen rij lezen" on public.users
  for select using (id = auth.uid() or public.is_admin());
create policy "users: eigen rij bijwerken" on public.users
  for update using (id = auth.uid());

-- ── INSTRUCTOR PROFILES ─────────────────────────────────────────────────────
-- Goedgekeurde, actieve profielen zijn zichtbaar voor iedereen (publiek + zoek).
create policy "profiles: publiek leest goedgekeurde" on public.instructor_profiles
  for select using (is_approved and is_active);
create policy "profiles: eigenaar leest eigen" on public.instructor_profiles
  for select using (user_id = auth.uid() or public.is_admin());
create policy "profiles: eigenaar maakt aan" on public.instructor_profiles
  for insert with check (user_id = auth.uid());
create policy "profiles: eigenaar werkt bij" on public.instructor_profiles
  for update using (user_id = auth.uid() or public.is_admin());

-- ── AVAILABILITY ────────────────────────────────────────────────────────────
create policy "availability: leesbaar voor ingelogden" on public.availability
  for select using (auth.uid() is not null);
create policy "availability: eigenaar beheert" on public.availability
  for all using (instructor_id = public.my_instructor_id())
  with check (instructor_id = public.my_instructor_id());

-- ── ORGANIZATIONS ───────────────────────────────────────────────────────────
create policy "orgs: leesbaar voor ingelogden" on public.organizations
  for select using (auth.uid() is not null);
create policy "orgs: eigenaar maakt aan" on public.organizations
  for insert with check (user_id = auth.uid());
create policy "orgs: eigenaar werkt bij" on public.organizations
  for update using (user_id = auth.uid() or public.is_admin());

-- ── PROJECTS ────────────────────────────────────────────────────────────────
-- Open projecten zijn zichtbaar voor ingelogden; eigenaar ziet al zijn projecten.
create policy "projects: open zichtbaar" on public.projects
  for select using (status = 'open' or organization_id = public.my_org_id() or public.is_admin());
create policy "projects: eigenaar maakt aan" on public.projects
  for insert with check (organization_id = public.my_org_id());
create policy "projects: eigenaar beheert" on public.projects
  for update using (organization_id = public.my_org_id() or public.is_admin());
create policy "projects: eigenaar verwijdert" on public.projects
  for delete using (organization_id = public.my_org_id());

-- ── PROJECT APPLICATIONS ────────────────────────────────────────────────────
-- Zichtbaar voor de aangemelde instructeur en de eigenaar van het project.
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
-- Instructeur kan intrekken; org kan selecteren/afwijzen.
create policy "applications: instructeur werkt eigen bij" on public.project_applications
  for update using (instructor_id = public.my_instructor_id());
create policy "applications: org beslist" on public.project_applications
  for update using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.organization_id = public.my_org_id()
    )
  );

-- ── SCHOOL CONTACTS ─────────────────────────────────────────────────────────
create policy "contacts: org beheert eigen" on public.school_contacts
  for all using (organization_id = public.my_org_id())
  with check (organization_id = public.my_org_id());

-- ── MESSAGES ────────────────────────────────────────────────────────────────
create policy "messages: betrokkenen lezen" on public.messages
  for select using (sender_id = auth.uid() or receiver_id = auth.uid());
create policy "messages: verzender stuurt" on public.messages
  for insert with check (sender_id = auth.uid());
create policy "messages: ontvanger markeert gelezen" on public.messages
  for update using (receiver_id = auth.uid());

-- ── DOCUMENTS ───────────────────────────────────────────────────────────────
create policy "documents: eigenaar leest" on public.documents
  for select using (user_id = auth.uid() or public.is_admin());
create policy "documents: eigenaar beheert" on public.documents
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ── ASPIRANTS ───────────────────────────────────────────────────────────────
create policy "aspirants: eigenaar leest" on public.aspirants
  for select using (user_id = auth.uid() or public.is_admin());
create policy "aspirants: eigenaar maakt aan" on public.aspirants
  for insert with check (user_id = auth.uid());
create policy "aspirants: eigenaar/admin werkt bij" on public.aspirants
  for update using (user_id = auth.uid() or public.is_admin());
