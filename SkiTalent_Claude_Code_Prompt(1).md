# SkiTalent.nl — Complete Claude Code Prompt

Build a two-sided (actually five-sided) marketplace platform called
SkiTalent.nl that connects ski instructors with ski schools, travel
organizations, and Dutch/Belgian schools. Focused on the
Netherlands/Belgium → Austria (and wider Alps) market.

---

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (database + auth + storage)
- Stripe (subscriptions + one-time payments)
- Resend (transactional email)
- DocuSeal or PDF-lib (contract templates)
- Vercel (deployment)

---

## Design Requirements

- Clean, professional, trustworthy — appeals to both Dutch schools
  and Austrian ski schools
- Primary color: deep alpine blue (#1B3A6B)
- Accent: snow white + energetic orange (#FF6B35)
- Mobile-first responsive design
- Dutch language throughout all UI
- Hero imagery: mountains, skiing, professional instructors
- Trust signals everywhere: certification badges, VOG verified,
  EHBO badge, star ratings, review counts
- Distinctive typography: pair a strong display font with a
  clean readable body font
- Subtle snow/mountain texture in backgrounds
- Tagline: "De verbinding tussen skileraren en de skipiste"

---

## User Types (5 roles)

1. **Instructeur** — active ski instructor (free)
2. **Aspirant** — wants to become a ski instructor (free)
3. **Skischool** — professional ski school in Austria/Alps (paid)
4. **Reisorganisatie** — travel organization running multiple
   ski trips per season (paid subscription)
5. **School** — Dutch/Belgian school organizing annual ski trip
   (paid per project)
6. **Admin** — internal platform management

---

## Ski Resorts (25 — selectable on all profiles and projects)

### Oostenrijk (20)
1. St. Anton am Arlberg
2. Kitzbühel
3. Ischgl
4. Sölden
5. Mayrhofen
6. Zell am See / Kaprun
7. Saalbach-Hinterglemm
8. Schladming / Ski Amadé
9. Lech / Zürs am Arlberg
10. Obertauern
11. Flachau / Snow Space Salzburg
12. Montafon
13. Stubaier Gletscher
14. Obergurgl / Hochgurgl
15. Zillertal Arena
16. Alpbach / Wildschönau
17. Bad Gastein / Bad Hofgastein
18. Wagrain / Kleinarl
19. Skicircus Saalbach Hinterglemm Leogang
20. Kitzsteinhorn (Kaprun)

### Zwitserland (3)
21. Verbier
22. Zermatt
23. Davos / Klosters

### Frankrijk (2)
24. Les Trois Vallées (Courchevel, Méribel, Val Thorens)
25. Val d'Isère / Tignes

Each resort gets its own SEO page: /skigebied/[slug]
showing available instructors for that resort.

---

## Ski Instructor Certifications

Store as structured data with: name, level, year_obtained,
certificate_url (upload), expiry_date (where applicable).

### 🇳🇱 NEVSKI (Nederlands — primaire doelgroep)
- NEVSKI 1 — Recreatief, basis groepslessen
- NEVSKI 2 — Gevorderd, zelfstandige lessen
- NEVSKI 3 — Professioneel niveau
- NEVSKI 4 — Hoogste Nederlandse niveau
- NEVSKI Snowboard 1
- NEVSKI Snowboard 2
- NEVSKI Snowboard 3

### 🇬🇧 BASI (Brits)
- BASI Level 1
- BASI Level 2
- BASI Level 3
- BASI Level 4 ISTD (internationaal erkend)
- BASI Snowboard Level 1-4

### 🇦🇹 ÖSV (Oostenrijks — staatsdiploma)
- ÖSV Schilehrerwart
- ÖSV Schilehrer Anwärter ← minimumniveau platform
- ÖSV Landesschilehrer
- ÖSV Staatlich geprüfter Schilehrer

### 🇩🇪 DSV (Duits)
- DSV Trainer C
- DSV Trainer B
- DSV Trainer A
- DSV Ski Lehrer

### 🇨🇭 Swiss Snowsports
- Swiss Snowsports J+S
- Swiss Snowsports Leiter
- Swiss Snowsports Experte

### 🇧🇪 FSBA/BVSL (Belgisch)
- Moniteur de ski Brevet B
- Moniteur de ski Brevet A
- Moniteur fédéral

### 🌍 Internationaal
- ISIA Stamp (internationaal erkend — vereist voor
  werken buiten eigen land)
- ISB Snowboard Level 1 / 2 / 3

Display certification badges on instructor cards.
Tooltip explains each certification to schools
who don't know the differences.
ISIA stamp gets a special "Internationaal erkend"
highlight badge.

---

## Verplichte Documenten op Profiel

### VOG (Verklaring Omtrent Gedrag)
- Upload als PDF/image
- Verplicht voor instructeurs met specialisatie "kinderen"
- Toon verified badge op profiel na admin goedkeuring
- Vervaldatum bijhouden (VOG is 1 jaar geldig)
- Automatische herinnering 30 dagen voor verlopen

### EHBO Certificaat
- Upload als PDF/image
- Vervaldatum bijhouden
- Automatische herinnering 30 dagen voor verlopen
- Verified badge op profiel
- Veel skischolen eisen dit — filteroptie in zoeken

### Aansprakelijkheidsverzekering
- Upload bewijs van verzekering
- Verzekeraar naam, polisnummer, vervaldatum
- Verified badge na upload
- Partnerschap sectie: "Nog geen verzekering?
  Bekijk onze partner [verzekeraar]"
- Referral link naar verzekeringspartner

---

## Pricing Model

### Instructeur — GRATIS altijd
### Aspirant — GRATIS altijd

### Skischool
- Basic: €49/maand of €399/jaar
  - Tot 20 profielen bekijken/maand
  - 10 contactverzoeken/maand
  - Basis zoeken en filteren
- Pro: €149/maand of €999/jaar
  - Onbeperkt profielen bekijken
  - Onbeperkt contactverzoeken
  - Vergelijk instructeurs naast elkaar
  - Exporteer seizoensoverzicht
  - Notities per instructeur

### Reisorganisatie
- Starter: €149/maand of €999/jaar
  - Tot 5 actieve projecten
  - Onbeperkt aanmeldingen per project
  - Seizoenskalender
- Pro: €299/maand of €1999/jaar
  - Onbeperkte projecten
  - Seizoensplanning dashboard
  - Export naar CSV/PDF
  - Bulk communicatie

### School NL/BE
- Per project: €79 per geplaatst project
- Bundel: 2 projecten €129/jaar
- Inclusief contract template
- Inclusief ratio calculator

---

## Database Schema (Supabase)

### users
```
id, email, role (instructor/aspirant/school_ski/
travel_org/school_nl/admin), created_at, updated_at
```

### instructor_profiles
```
id, user_id, first_name, last_name, photo_url, bio,
date_of_birth, nationality, phone, city,
years_experience, certifications (jsonb array),
languages (array: nl/de/en/fr/other),
specializations (array: kids/adults/freestyle/
  off-piste/snowboard/beginner/racing),
age_groups (array: basisschool/middelbaar/
  volwassenen/senioren),
preferred_resorts (array of resort ids),
hourly_rate, daily_rate, weekly_rate,
has_own_transport (boolean),
school_group_experience (boolean),
pedagogical_background (text),
vog_verified (boolean), vog_expiry,
ehbo_verified (boolean), ehbo_expiry,
insurance_verified (boolean), insurance_expiry,
insurance_provider,
is_approved, is_active, profile_completeness (int),
created_at, updated_at
```

### availability
```
id, instructor_id, season (e.g. "2025-2026"),
week_start (date), week_end (date),
is_available (boolean), notes, created_at
```

### organizations
```
id, user_id, org_type (ski_school/travel_org/school_nl),
name, logo_url, description, website, phone,
address, city, country,
resort_locations (array),
contact_person_name, contact_person_email,
school_type (basis/middelbaar — only for school_nl),
stripe_customer_id, subscription_status,
subscription_tier, subscription_end_date,
created_at, updated_at
```

### projects (reisorganisaties + scholen)
```
id, organization_id, name, description,
resort_id, start_date, end_date,
participants_count, instructors_needed,
participant_level (beginner/intermediate/
  advanced/mixed),
age_group (kids/teens/adults/mixed),
language_required (array),
min_certification,
school_group (boolean),
vog_required (boolean — auto true if kids),
ehbo_required (boolean),
deadline, compensation (optional),
notes,
status (draft/open/closed/completed),
created_at, updated_at
```

### project_applications
```
id, project_id, instructor_id,
motivation (text),
status (pending/selected/rejected/withdrawn),
created_at, updated_at
```

### school_contacts (skischolen)
```
id, organization_id, instructor_id,
status (saved/contacted/in_gesprek/
  aangenomen/afgewezen),
notes (internal),
season,
created_at, updated_at
```

### messages
```
id, sender_id, receiver_id,
context_type (project/school_contact),
context_id,
content, is_read, created_at
```

### reviews
```
id, organization_id, instructor_id,
rating (1-5), comment, season,
org_type, created_at
```

### aspirants
```
id, user_id, first_name, last_name,
date_of_birth, city, phone,
current_ski_level (beginner/recreational/
  advanced/racer),
motivation (text),
availability_for_training,
status (registered/enrolled/passed/active),
partner_referral_date,
certificate_uploaded (boolean),
certificate_url, approved_by_admin (boolean),
created_at, updated_at
```

### contracts
```
id, organization_id, instructor_id,
project_id (optional),
template_type, content (jsonb),
status (draft/sent/signed_instructor/
  signed_org/completed),
signed_at, created_at
```

### documents
```
id, user_id, doc_type (vog/ehbo/
  insurance/certificate),
file_url, verified (boolean),
expiry_date, uploaded_at, verified_at,
verified_by (admin_id)
```

---

## Pages Structure

### Publiek (geen login)
```
/ — Landing page
/instructeurs — Browse instructeurs (beperkt)
/voor-skischolen — Marketing skischolen
/voor-reisorganisaties — Marketing reisorg
/voor-scholen — Marketing NL/BE scholen
/skileraar-worden — Aspirant landing page
/skigebied/[slug] — Per resort pagina (SEO)
/over-ons
/blog — SEO content
/faq
/prijzen
/privacy
/voorwaarden
/contact
/register — Kies accounttype
/login
```

### Instructeur Dashboard
```
/dashboard — Overzicht + profiel completeness score
/profiel/bewerken — Profiel bewerken
/beschikbaarheid — Seizoenskalender instellen
/projecten — Openstaande projecten browsen
/projecten/[id] — Project detail + aanmelden
/mijn-aanmeldingen — Status eigen aanmeldingen
/berichten — Inbox
/documenten — VOG, EHBO, verzekering uploaden
/reviews — Ontvangen reviews
/instellingen
```

### Skischool Dashboard
```
/dashboard — Seizoensoverzicht + shortlist
/zoeken — Instructeurs zoeken + filteren
/instructeur/[id] — Volledig profiel
/contacten — Beheer contacten + status
/berichten — Inbox
/abonnement — Stripe portal
/instellingen
```

### Reisorganisatie Dashboard
```
/dashboard — Seizoensoverzicht
/projecten — Alle projecten
/projecten/nieuw — Project aanmaken
/projecten/[id] — Project + aanmeldingen
/projecten/[id]/aanmeldingen — Selectie
/planning — Seizoenskalender (alle projecten)
/berichten — Inbox
/abonnement — Stripe portal
/instellingen
```

### School NL/BE Dashboard
```
/dashboard — Projectoverzicht
/projecten/nieuw — Simpel project aanmaken
/projecten/[id] — Aanmeldingen bekijken
/hulp — Stappenplan + ratio calculator
/documenten — Contracten
/betaling — Per-project betaling
/instellingen
```

### Aspirant Dashboard
```
/dashboard — Voortgangsmeter (4 stappen)
/opleiding — Info + inschrijflink partner
/documenten — Certificaat uploaden na behalen
/instellingen
```

### Admin
```
/admin/dashboard — Statistieken
/admin/gebruikers — Alle gebruikers
/admin/profielen — Goedkeuren/afwijzen
/admin/documenten — VOG/EHBO/verzekering verifiëren
/admin/projecten — Alle projecten
/admin/abonnementen — Stripe overzicht
/admin/aspiranten — Aspiranten beheren
```

---

## Key Features

### 1. Instructeur Profiel Completeness Score
Toon percentage compleetheid op dashboard.
Stap voor stap prompts om ontbrekende info toe te voegen.
Hogere completeness = hogere ranking in zoekresultaten.
Verplichte velden voor activering:
- Foto, bio, minimaal 1 certificaat,
  beschikbaarheid huidig seizoen,
  minimaal 1 preferred resort.

### 2. Smart Search (Skischolen)
Filteropties:
- Beschikbaarheid (datumbereik)
- Skigebied voorkeur
- Certificeringsniveau + type
- Taal (verplicht of voorkeur)
- Specialisatie
- Leeftijdsgroep
- VOG geverifieerd (ja/nee)
- EHBO geverifieerd (ja/nee)
- Verzekering geverifieerd (ja/nee)
- ISIA stamp (ja/nee)
- Schoolgroep ervaring (ja/nee)
Sorteren op: relevantie, rating, ervaring
Sla zoekfilters op als favoriet

### 3. Project Systeem (Reisorganisaties + Scholen)
Reisorganisaties: onbeperkte projecten per seizoen
Scholen: per project betaald
Instructeurs zien openstaande projecten
gefilterd op hun beschikbaarheid en resortvoorkeur.
Push notificatie bij nieuw relevant project.

### 4. Beschikbaarheidskalender
Instructeurs markeren beschikbare weken per seizoen.
Visuele weekkalender (okt → apr).
Scholen zoeken op specifiek datumbereik.
Automatisch matchen op beschikbaarheid.

### 5. Messaging Systeem
In-platform berichten.
Email notificatie bij nieuw bericht.
Gelinkt aan project of contactverzoek.
Lees-ontvangstbevestiging.

### 6. Review Systeem
Scholen/orgs laten review achter na seizoen.
Instructeur kan niet reageren op eigen reviews.
Gemiddelde rating zichtbaar op profiel.
Gescheiden reviews per type org
(skischool / reisorg / school).

### 7. Contract Templates
Standaard contract voor:
- Skischool ↔ Instructeur
- Reisorganisatie ↔ Instructeur
- School ↔ Instructeur
Invulbare velden: naam, periode, vergoeding,
resort, taken.
Download als PDF.
Optioneel: digitaal ondertekenen.

### 8. Document Verificatie Systeem
Upload door gebruiker → Admin verifieert →
Badge verschijnt op profiel.
Expiry tracking met automatische reminders:
- 30 dagen voor verlopen: email herinnering
- 7 dagen voor verlopen: urgente herinnering
- Verlopen: badge verdwijnt + instructeur notificatie

### 9. Verzekering Partner Sectie
Dedicated sectie op profiel pagina + dashboard:
"Heb je een aansprakelijkheidsverzekering?"
Samenwerking met verzekeringspartner.
Referral link met tracking.
Info over welke verzekeringen relevant zijn.

### 10. Aspirant Opleiding Funnel
4-stappen voortgangsbalk op aspirant dashboard:
1. Aangemeld op SkiTalent ✅
2. Ingeschreven bij opleiding
3. Anwärter certificaat behaald
4. Profiel actief op platform
Samenwerking met opleidingspartner:
logo, data, kosten, locaties op /skileraar-worden.
Referral tracking per aspirant.
Na certificaat upload → admin verifieert →
profiel automatisch omgezet naar instructeur.

### 11. Ratio Calculator (voor Scholen)
Op /voor-scholen en in school dashboard:
Input: aantal leerlingen + niveau
Output: aanbevolen aantal instructeurs
Bijv: beginners → 1 per 6-8 leerlingen
      gevorderd → 1 per 8-10 leerlingen

### 12. Skigebied SEO Pagina's
/skigebied/st-anton, /skigebied/kitzbuehl etc.
Toont: resort info + beschikbare instructeurs
Goed voor organisch verkeer via Google.

### 13. Seizoenskalender (Reisorganisaties)
Visuele tijdlijn van alle projecten per seizoen.
Kleurcodering: open/in behandeling/gesloten.
Hoeveel instructeurs nog nodig per project.
Exporteer naar CSV/PDF.

---

## Email Notificaties (via Resend)

### Instructeur ontvangt:
- Welkom + profiel completeness tips
- Nieuwe aanvraag van skischool
- Geselecteerd voor project 🎉
- Aanmelding afgewezen
- Nieuw project in jouw preferred resort
- Bericht ontvangen
- Document verlopen / bijna verlopen
- Profiel goedgekeurd door admin

### Skischool ontvangt:
- Welkom
- Instructeur heeft uitnodiging geaccepteerd
- Bericht ontvangen
- Abonnement bevestiging/verlenging/verlopen

### Reisorganisatie ontvangt:
- Welkom
- Nieuwe aanmelding voor project
- Herinnering: project heeft nog X plekken open
- Bericht ontvangen

### School ontvangt:
- Welkom
- Betaling bevestigd, project live
- Eerste aanmelding ontvangen
- Herinnering: reis over 8 weken,
  heb je al geselecteerd?
- Contract klaar om te downloaden

### Aspirant ontvangt:
- Welkom + info over opleiding partner
- Herinnering na 14 dagen (niet ingeschreven?)
- Profiel geactiveerd na certificaat verificatie

---

## Stripe Integratie

Subscription checkout voor skischolen + reisorganisaties.
One-time payment voor scholen (per project €79).
Customer portal voor abonnementsbeheer.
Webhook handling:
- subscription.created
- subscription.updated
- subscription.deleted
- payment_intent.succeeded (scholen)
Stripe test mode voor development.

---

## SEO & Marketing

### On-page SEO
- Dutch keywords: skileraar gezocht,
  skischool oostenrijk, ski instructeur inhuren,
  skileraar worden, schoolreis skileraar,
  ski instructeur st anton etc.
- Meta descriptions per pagina
- Resort pagina's voor long-tail keywords
- Blog: "Hoe word je skileraar?",
  "Top 10 skigebieden voor instructeurs",
  "Wat verdient een skileraar?"
- Structured data (JSON-LD) voor personen/organisaties

### GDPR
- Cookie consent banner
- Privacy policy pagina
- Data verwijdering op verzoek
- Supabase EU data hosting

---

## Content (alle tekst in het Nederlands)

### Landing page secties:
1. Hero: "Vind de beste skileraar voor jouw seizoen"
2. Hoe werkt het (3 stappen per doelgroep)
3. Doelgroep tabs: Instructeur / Skischool /
   Reisorganisatie / School / Aspirant
4. Statistieken: X instructeurs, X skigebieden,
   X organisaties
5. Uitgelichte instructeurs
6. Testimonials
7. Skigebieden overzicht
8. Pricing
9. Partners (opleiding + verzekeraar)
10. CTA: "Maak gratis profiel aan" /
    "Vind jouw skileraar"

### Taglines per doelgroep:
- Instructeur: "Vind werk als skileraar"
- Aspirant: "Start jouw carrière op de piste"
- Skischool: "Vind en werf de beste instructeurs"
- Reisorganisatie: "Plan je hele seizoen op één plek"
- School: "Gegarandeerd de juiste skileraar
  voor jouw schoolreis"

---

## MVP Scope (bouw dit als eerste)

Fase 1 (MVP):
- Registratie + login (alle rollen)
- Instructeur profiel aanmaken
- Beschikbaarheid instellen
- Skischool zoekfunctie
- Project aanmaken (reisorg + school)
- Instructeur aanmelden op project
- Basic messaging
- Stripe subscriptions + per-project betaling
- Document upload (geen verificatie nog in MVP)
- Email notificaties (core flows)
- Admin: profielen goedkeuren

Fase 2 (na eerste gebruikers):
- Document verificatie badges
- Reviews
- Contract templates
- Vergelijk instructeurs
- Seizoenskalender reisorganisaties
- Aspirant funnel met partner
- Verzekering partner integratie
- Resort SEO pagina's
- Blog
- Ratio calculator

---

## Notes voor Development

- Alle database queries via Supabase RLS policies
  (row level security) — gebruikers zien alleen
  eigen data of publieke data
- Afbeeldingen via Supabase Storage
- Beschikbaarheidskalender component:
  week-based, seizoen okt t/m apr
- Mobiel-first: veel instructeurs gebruiken telefoon
- Laad profiel completeness score realtime
- Resort slugs: gebruik kebab-case
  (st-anton-am-arlberg)
- Stripe webhook endpoint: /api/webhooks/stripe
- Email templates: professioneel maar warm,
  Nederlandse toon
- Deploy op Vercel met environment variables
  voor Supabase + Stripe + Resend keys
