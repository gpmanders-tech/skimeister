-- ============================================================================
-- Skimeister.nl — betalingen (Mollie) + facturatie-koppeling (WeFact)
-- ============================================================================

create table public.payments (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.users(id) on delete cascade,
  organization_id    uuid references public.organizations(id) on delete set null,
  kind               text not null check (kind in ('subscription','project')),
  plan_id            text,
  project_id         uuid references public.projects(id) on delete set null,
  description        text,
  amount             numeric(10,2) not null,
  currency           text not null default 'EUR',
  interval           text check (interval in ('month','year','once')),
  status             text not null default 'open'
                       check (status in ('open','pending','paid','failed','expired','canceled')),
  mollie_payment_id  text unique,
  wefact_invoice_id  text,
  period_end         date,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index payments_org_idx  on public.payments (organization_id);
create index payments_user_idx on public.payments (user_id);

create trigger payments_updated_at before update on public.payments
  for each row execute function public.set_updated_at();

-- RLS: eigenaar leest eigen betalingen; schrijven gebeurt server-side
-- (service role in de webhook / checkout-action).
alter table public.payments enable row level security;

create policy "payments: eigenaar leest" on public.payments
  for select using (user_id = auth.uid() or public.is_admin());
