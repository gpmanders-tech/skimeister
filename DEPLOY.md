# Skimeister.nl — deployen naar Vercel + skimeister.nl

Deze app is een full-stack Next.js-applicatie en draait op Vercel (de host van
de makers van Next.js). Een gewone FTP-upload werkt niet — er draait server-code.

De code is al **deploy-klaar**: git-repo, `vercel.json` (incl. cron voor de
vervaldatum-reminders) en deze handleiding staan klaar.

---

## Stap 1 — Code naar GitHub (aanbevolen)

Met GitHub deployt Vercel automatisch bij elke wijziging.

1. Maak een (privé) repo aan op https://github.com/new — bijv. `skimeister`.
   Laat "Add a README" uit (we hebben al bestanden).
2. Koppel en push vanuit de projectmap. In de chat met `!` ervoor:
   ```
   ! git -C "C:/Users/gpman/OneDrive/Skimeister" remote add origin https://github.com/<jouw-gebruiker>/skimeister.git
   ! git -C "C:/Users/gpman/OneDrive/Skimeister" push -u origin main
   ```

> Geen GitHub? Dan kan het ook direct met de Vercel-CLI (zie onderaan).

---

## Stap 2 — Vercel-project aanmaken

1. Ga naar https://vercel.com en log in (mag met je GitHub-account).
2. **Add New… → Project** → kies de `skimeister`-repo → **Import**.
3. Vercel herkent Next.js automatisch. **Region** staat via `vercel.json` al op
   Frankfurt (EU). Klik **Deploy**.
4. Na ~1 minuut staat de site op een `*.vercel.app`-adres. De **publieke site
   werkt meteen**; login/dashboard werkt zodra de keys uit stap 3 ingevuld zijn.

---

## Stap 3 — Omgevingsvariabelen invullen (Vercel → Settings → Environment Variables)

Vul deze in (zelfde namen als in `.env.example`). Zonder deze werkt alleen de
publieke site.

| Variabele | Waar vandaan |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://skimeister.nl` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → API (geheim!) |
| `MOLLIE_API_KEY` | Mollie → Developers → API keys |
| `WEFACT_API_KEY` | WeFact → Instellingen → API |
| `WEFACT_API_URL` | `https://api.mijnwefact.nl/v2/` |
| `RESEND_API_KEY` | Resend → API Keys |
| `RESEND_FROM_EMAIL` | bijv. `Skimeister <no-reply@skimeister.nl>` |
| `ADMIN_EMAIL` | `info@skimeister.nl` |
| `CRON_SECRET` | zelf een lange willekeurige string verzinnen |

Na het invullen: **Deployments → Redeploy** zodat ze actief worden.

> De cron (`vercel.json`) draait dagelijks om 07:00 en stuurt automatisch
> `Authorization: Bearer <CRON_SECRET>` mee — die check zit al in de route.

---

## Stap 4 — Database opzetten (Supabase)

1. Maak een project op https://supabase.com — **kies een EU-regio**.
2. SQL Editor → draai de migraties op volgorde:
   `0001_init` → `0002_rls` → `0003_storage` → `0004_payments` →
   `0005_reviews` → `0006_saved_searches`.
3. Maak jezelf admin:
   ```sql
   update public.users set role = 'admin' where email = 'jouw@mail.nl';
   ```

---

## Stap 5 — Domein skimeister.nl koppelen

1. In Vercel: **Project → Settings → Domains → Add** → `skimeister.nl`
   (en `www.skimeister.nl`).
2. Vercel toont welke DNS-records je moet zetten. Bij je registrar (waar
   skimeister.nl staat) zet je:
   - `A`-record voor `@` → het IP dat Vercel toont (meestal `76.76.21.21`)
   - `CNAME` voor `www` → `cname.vercel-dns.com`
3. DNS kan tot ~uur duren. Daarna is de site live op **https://skimeister.nl**
   (Vercel regelt automatisch het SSL-certificaat).

---

## Alternatief — deployen zonder GitHub (Vercel CLI)

In de chat met `!` ervoor:
```
! npm i -g vercel
! vercel login
! vercel --cwd "C:/Users/gpman/OneDrive/Skimeister"
```
Volg de vragen (kies/maak het project). Voor de productie-versie:
```
! vercel --prod --cwd "C:/Users/gpman/OneDrive/Skimeister"
```
Env-variabelen en domein regel je daarna in het Vercel-dashboard (stap 3 & 5).
