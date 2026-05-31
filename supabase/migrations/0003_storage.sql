-- ============================================================================
-- Skimeister.nl — Storage buckets + policies
-- 'avatars'   : profielfoto's en logo's (publiek leesbaar)
-- 'documents' : VOG/EHBO/verzekering/certificaten (privé)
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- ── Avatars: publiek leesbaar, eigenaar beheert eigen map ───────────────────
-- Conventie: bestandspad begint met de user-id, bijv. "<uid>/foto.jpg".
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

-- ── Documents: privé, alleen eigenaar (en admin via service role) ───────────
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
