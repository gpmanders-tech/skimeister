# Skimeister.nl — deployen naar Hetzner via Coolify

Alternatief voor `DEPLOY.md` (Vercel). Hier draait de Next.js-app op je **eigen
Hetzner-server** via **Coolify** — je eigen mini-Vercel. De **database/auth/opslag
blijft op Supabase Cloud**; alleen de Next.js-site verhuist.

Uitgangspunt: Coolify draait al op de Hetzner-server (bereikbaar op
`http://<server-ip>:8000`).

---

## Stap 0 — Repo is al klaar
De code hoeft niet aangepast: Coolify bouwt 'm zoals 'ie is. De cron uit
`vercel.json` werkt hier niet en wordt in **stap 6** apart gezet.
- Repo: `gpmanders-tech/skimeister`, branch `main`.

---

## Stap 1 — Nieuw project in Coolify
1. Dashboard openen: `http://<server-ip>:8000`.
2. **+ New → Project** → naam bijv. `skimeister`.
3. Daarbinnen **+ New Resource**:
   - Privé repo → **Private Repository (with GitHub App)**. Koppel eenmalig een
     GitHub App via **Settings → Sources → GitHub** (Coolify leidt je erdoorheen).
   - Publieke repo → **Public Repository**.
4. Kies de repo `skimeister`, branch `main`.

---

## Stap 2 — Build instellen
- **Build Pack: Nixpacks** (herkent Next.js automatisch — geen Dockerfile nodig).
- **Port: 3000** (poort van `next start`).

---

## Stap 3 — Omgevingsvariabelen ⚠️ belangrijkste valkuil
Kopieer de waarden 1-op-1 uit het huidige Vercel-project
(Settings → Environment Variables), dan kloppen ze zeker.

```
NEXT_PUBLIC_SITE_URL=https://skimeister.nl
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
MOLLIE_API_KEY=...
WEFACT_API_KEY=...
WEFACT_API_URL=https://api.mijnwefact.nl/v2/
RESEND_API_KEY=...
RESEND_FROM_EMAIL=Skimeister <no-reply@skimeister.nl>
ADMIN_EMAIL=info@skimeister.nl
CRON_SECRET=<lange willekeurige string>
```

🔑 **De valkuil:** zet bij de drie `NEXT_PUBLIC_*`-variabelen het vinkje
**"Build Variable / Available at buildtime"** aan. Die worden tijdens het bouwen
in de browser-code ingebakken. Vergeet je dat, dan bouwt 'ie wél maar werkt
login/dashboard niet (de Supabase-URL ontbreekt dan in de client-bundle).
De overige (geheime) keys blijven gewoon op runtime.

---

## Stap 4 — Deploy
Klik **Deploy**. Coolify draait `npm install` + `npm run build` + `npm start`.
Na ~1–2 min draait de app op een tijdelijk Coolify-adres. Test daar de publieke
site **én** login/dashboard vóór je het domein omzet.

---

## Stap 5 — Domein + SSL
1. Resource → **Domains** → zet `https://skimeister.nl` en voeg
   `https://www.skimeister.nl` toe.
2. Coolify regelt automatisch een Let's Encrypt-certificaat via Traefik —
   geen handwerk.

---

## Stap 6 — Cron terugzetten (vervaldatum-reminders)
`vercel.json` werkt niet in Coolify. Resource → **Scheduled Tasks** → nieuwe taak:
- **Schedule:** `0 7 * * *` (dagelijks 07:00)
- **Command:**
  ```
  curl -fsS -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/expiry-reminders
  ```
Zo blijven de automatische reminders draaien (de route checkt het Bearer-token).

---

## Stap 7 — DNS omzetten (als laatste — géén downtime)
Laat Vercel draaien tot dit werkt. Bij de DNS-beheerder (Hostnet):
- `A`-record `@`  → het **IP van de Hetzner-server**
- `A`-record (of CNAME) `www` → zelfde Hetzner-IP
- Verwijder daarna de oude Vercel-records (`76.76.21.21` / `cname.vercel-dns.com`).

DNS-propagatie kan tot ~1 uur duren. Zodra `skimeister.nl` op Hetzner wijst en
SSL werkt, is de verhuizing klaar en kan het Vercel-project weg.

---

## Verschillen t.o.v. de Vercel-deploy (`DEPLOY.md`)
| Onderdeel | Vercel | Coolify op Hetzner |
|---|---|---|
| Build | automatisch | Nixpacks, poort 3000 |
| `NEXT_PUBLIC_*` | automatisch buildtime | **handmatig "Build Variable" aanvinken** |
| Cron | `vercel.json` | **Scheduled Task** (stap 6) |
| SSL | automatisch | automatisch (Traefik/Let's Encrypt) |
| Domein-IP | `76.76.21.21` | IP van je Hetzner-server |
| Database | Supabase Cloud | Supabase Cloud (ongewijzigd) |

*Aangemaakt door Claude Code, 2026-06-27. Sleutels/wachtwoorden staan bewust NIET in dit bestand.*
