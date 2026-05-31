-- ============================================================================
-- Skimeister.nl — reviews (fase 2)
-- Organisaties laten na het seizoen een beoordeling achter per instructeur.
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

-- Gemiddelde rating + aantal op het profiel cachen.
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

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.reviews enable row level security;

-- Reviews zijn publiek leesbaar (tonen op het profiel).
create policy "reviews: publiek leesbaar" on public.reviews
  for select using (true);

-- Organisaties beheren hun eigen reviews; instructeurs kunnen niet reageren.
create policy "reviews: org maakt aan" on public.reviews
  for insert with check (organization_id = public.my_org_id());
create policy "reviews: org werkt eigen bij" on public.reviews
  for update using (organization_id = public.my_org_id());
create policy "reviews: org verwijdert eigen" on public.reviews
  for delete using (organization_id = public.my_org_id());
