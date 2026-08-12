-- ============================================================================
-- Spamaccounts opsporen en opruimen
-- Draaien in de Supabase SQL Editor. Werk de stappen op volgorde af.
-- ============================================================================

-- ── STAP 1: kijken wat er binnenkomt ────────────────────────────────────────
-- Patroon herkennen: alles op één dag? Eén rol? Eén maildomein?
select
  date_trunc('day', u.created_at) as dag,
  u.role,
  count(*) as aantal
from public.users u
group by 1, 2
order by 1 desc, 3 desc;


-- ── STAP 2: de verdachten ───────────────────────────────────────────────────
-- Nooit ingelogd, geen profiel, geen enkele activiteit. Dat is vrijwel zeker bot.
-- Bekijk deze lijst eerst met eigen ogen voordat je stap 3 draait.
select
  u.id,
  u.email,
  u.role,
  u.created_at,
  a.last_sign_in_at,
  a.raw_user_meta_data->>'phone' as telefoon,
  a.raw_user_meta_data->>'city'  as woonplaats
from public.users u
join auth.users a on a.id = u.id
where u.role <> 'admin'
  and a.last_sign_in_at is null
  and not exists (select 1 from public.instructor_profiles p where p.user_id = u.id)
  and not exists (select 1 from public.organizations       o where o.user_id = u.id)
  and not exists (select 1 from public.aspirants           s where s.user_id = u.id)
  and not exists (select 1 from public.messages            m where m.sender_id = u.id)
  and not exists (select 1 from public.payments            p where p.user_id = u.id)
  and u.created_at < now() - interval '3 days'   -- verse aanmeldingen met rust laten
order by u.created_at desc;


-- ── STAP 3: verwijderen ─────────────────────────────────────────────────────
-- Draai dit PAS als de lijst uit stap 2 klopt. Verwijderen uit auth.users
-- ruimt public.users automatisch mee op (on delete cascade).
--
-- Verwijder eerst het commentaarteken hieronder.
--
-- delete from auth.users a
-- where a.id in (
--   select u.id
--   from public.users u
--   join auth.users au on au.id = u.id
--   where u.role <> 'admin'
--     and au.last_sign_in_at is null
--     and not exists (select 1 from public.instructor_profiles p where p.user_id = u.id)
--     and not exists (select 1 from public.organizations       o where o.user_id = u.id)
--     and not exists (select 1 from public.aspirants           s where s.user_id = u.id)
--     and not exists (select 1 from public.messages            m where m.sender_id = u.id)
--     and not exists (select 1 from public.payments            p where p.user_id = u.id)
--     and u.created_at < now() - interval '3 days'
-- );


-- ── STAP 4: controle achteraf ───────────────────────────────────────────────
select count(*) as accounts_over from public.users;
