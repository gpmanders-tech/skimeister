-- ============================================================================
-- 0007 — Opdrachtenboard en reactiebeheer
--
-- DRAAIEN IN DE SUPABASE SQL EDITOR (Dashboard → SQL Editor → New query →
-- plakken → Run). Alles is herhaalbaar: twee keer draaien kan geen kwaad.
-- ============================================================================


-- ── 1. Kost en inwoning bij een opdracht ────────────────────────────────────
-- Instructeurs vragen hier als eerste naar; het hoort op de kaart te staan.
alter table public.projects
  add column if not exists board_lodging boolean not null default false;


-- ── 2. Reacties: status "in gesprek" en een notitieveld voor de beheerder ───
-- De bestaande statussen waren pending/selected/rejected/withdrawn. Voor het
-- reactieoverzicht komt daar "in_gesprek" bij:
--   pending    = nieuw
--   in_gesprek = in gesprek
--   selected   = geplaatst
--   rejected   = afgewezen
--   withdrawn  = ingetrokken door de instructeur
alter table public.project_applications
  drop constraint if exists project_applications_status_check;

alter table public.project_applications
  add constraint project_applications_status_check
  check (status in ('pending','in_gesprek','selected','rejected','withdrawn'));

alter table public.project_applications
  add column if not exists admin_notes text;


-- ── 3. Publiek leesbaar opdrachtenboard ─────────────────────────────────────
-- De bestaande policy "projects: open zichtbaar" toetst al op status = 'open'
-- zonder auth.uid(), dus open opdrachten zijn zonder login leesbaar.
-- Deze policy maakt die bedoeling expliciet en overleeft een latere aanpassing
-- van de bestaande policy.
drop policy if exists "projects: publiek leest open opdrachten" on public.projects;
create policy "projects: publiek leest open opdrachten" on public.projects
  for select using (status = 'open');


-- ── 4. Controle ─────────────────────────────────────────────────────────────
select
  (select count(*) from public.projects where status = 'open') as open_opdrachten,
  (select count(*) from public.project_applications)           as reacties;
