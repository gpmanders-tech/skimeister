-- 179 spamaccounts verwijderen (opgespoord 6-10-2026, akkoord Ger).
-- Allemaal rol instructor, aangemaakt 1-6 t/m 11-8-2026 (voor de bot-afweer), nooit ingelogd,
-- geen profiel, organisatie, aspirant, bericht, betaling of reactie. Lijst als reserve in
-- C:\Users\gpman\.servicedesk\skimeister-backup\spamaccounts-2026-10-06.txt
-- Plakken in de Supabase SQL Editor en op Run drukken. Verwijderen uit auth.users ruimt public.users mee op.
delete from auth.users a where a.id in (
  select u.id from public.users u join auth.users au on au.id = u.id
  where u.role = 'instructor' and au.last_sign_in_at is null
    and not exists (select 1 from public.instructor_profiles p where p.user_id = u.id)
    and not exists (select 1 from public.organizations o where o.user_id = u.id)
    and not exists (select 1 from public.aspirants s where s.user_id = u.id)
    and not exists (select 1 from public.messages m where m.sender_id = u.id)
    and not exists (select 1 from public.payments p where p.user_id = u.id)
    and not exists (select 1 from public.project_applications pa where pa.instructor_id = u.id)
    and u.created_at < '2026-08-12'
);
-- Daarna hoort hier 6 uit te komen (admin, 3 eigen testaccounts, info@traxeo.nl, ger@manderstravel.nl):
select count(*) as gebruikers_over from public.users;
