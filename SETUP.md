# Skimeister.nl — setup & lokaal draaien

## 1. Dependencies installeren

```powershell
npm install
```

## 2. Omgevingsvariabelen

Kopieer `.env.example` naar `.env.local` en vul de waarden in:

```powershell
Copy-Item .env.example .env.local
```

Voor alleen de publieke website (zonder login) hoef je nog niets in te vullen —
die draait met placeholders. Voor login, profielen en betalingen heb je de
Supabase-, Mollie-, WeFact- en Resend-sleutels nodig.

## 3. Lokaal draaien

```powershell
npm run dev
```

Open http://localhost:3000. De volledige marketing-site en alle 25
skigebied-pagina's werken direct.

## 4. Database opzetten (Supabase)

1. Maak een gratis project aan op [supabase.com](https://supabase.com) — **kies een EU-regio**.
2. Ga naar **Project Settings → API** en zet in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Open de **SQL Editor** en draai de migraties in volgorde:
   - `supabase/migrations/0001_init.sql` (tabellen)
   - `supabase/migrations/0002_rls.sql` (beveiliging)
   - `supabase/migrations/0003_storage.sql` (uploads)
4. Een nieuwe gebruiker wordt automatisch aan `public.users` toegevoegd na
   registratie (trigger `handle_new_user`). De rol komt uit de signup-metadata.

> Een gebruiker tot admin maken: zet in de SQL Editor
> `update public.users set role = 'admin' where email = 'jouw@mail.nl';`

## 5. Betalingen (later)

- **Mollie**: zet `MOLLIE_API_KEY` (gebruik de `test_`-sleutel voor development).
- **WeFact**: zet `WEFACT_API_KEY`. Bij elke betaling maakt het platform een
  debiteur + factuur aan via de WeFact API.

## 6. E-mail (later)

- **Resend**: zet `RESEND_API_KEY` en `RESEND_FROM_EMAIL`.

---

## Projectstructuur

```
app/(marketing)      Publieke website (landing, doelgroepen, prijzen, SEO)
app/(auth)           Registratie & login            (in aanbouw)
app/(dashboard)      Dashboards per rol             (in aanbouw)
app/api              Webhooks (Mollie) & acties     (in aanbouw)
components/          Herbruikbare UI + marketing-componenten
lib/constants/       Skigebieden, certificeringen, opties, prijzen
lib/supabase/        Supabase browser-/server-clients + proxy-sessie
lib/types.ts         TypeScript-types van de database
supabase/migrations  SQL-schema, RLS en storage
```
