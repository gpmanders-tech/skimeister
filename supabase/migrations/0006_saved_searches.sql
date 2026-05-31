-- ============================================================================
-- Skimeister.nl — opgeslagen zoekfilters (fase 3)
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
