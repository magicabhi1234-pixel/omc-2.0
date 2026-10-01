-- ============================================================================
-- OMC 2.0 - security hardening, lead management, username login
-- Run via the Supabase SQL Editor after 0001_cms_schema.sql. Idempotent: every
-- statement is IF NOT EXISTS / CREATE OR REPLACE, so it's safe to re-run and
-- safe against a live `leads` table that predates this file (columns are only
-- ever added, never altered or dropped).
-- ============================================================================

-- Prerequisite check: 0001 creates public.profiles and public.omc_set_updated_at().
do $$
begin
  if to_regclass('public.profiles') is null
     or to_regprocedure('public.omc_set_updated_at()') is null then
    raise exception 'Apply supabase/migrations/0001_cms_schema.sql before this migration (public.profiles / public.omc_set_updated_at() are missing).';
  end if;
end $$;

-- ----------------------------------------------------------------------------
-- Leads (form submissions from /api/leads)
-- The table already exists in production (created outside migrations); this
-- block makes its shape reproducible and adds the admin-management columns.
-- ----------------------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  mobile text not null,
  email text not null,
  city text,
  specialization text not null,
  created_at timestamptz not null default now()
);

alter table public.leads add column if not exists lead_type text not null default 'inquiry';
alter table public.leads add column if not exists source text;        -- which form: hero | contact | popup | ...
alter table public.leads add column if not exists page_path text;     -- page the form was submitted from
alter table public.leads add column if not exists status text not null default 'new';
alter table public.leads add column if not exists notes text;
alter table public.leads add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'leads_lead_type_check') then
    alter table public.leads add constraint leads_lead_type_check
      check (lead_type in ('inquiry', 'contact'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'leads_status_check') then
    alter table public.leads add constraint leads_status_check
      check (status in ('new', 'contacted', 'qualified', 'converted', 'closed', 'spam'));
  end if;
end $$;

drop trigger if exists set_leads_updated_at on public.leads;
create trigger set_leads_updated_at before update on public.leads
  for each row execute function public.omc_set_updated_at();

create index if not exists idx_leads_created_at on public.leads(created_at desc);
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_lead_type on public.leads(lead_type);

alter table public.leads enable row level security;
-- No policies: only the service role (server-side /api/leads + admin) touches leads.

-- ----------------------------------------------------------------------------
-- Newsletter subscribers
-- ----------------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text,
  page_path text,
  status text not null default 'subscribed' check (status in ('subscribed', 'unsubscribed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_newsletter_email on public.newsletter_subscribers (lower(email));
create index if not exists idx_newsletter_created_at on public.newsletter_subscribers(created_at desc);

drop trigger if exists set_newsletter_updated_at on public.newsletter_subscribers;
create trigger set_newsletter_updated_at before update on public.newsletter_subscribers
  for each row execute function public.omc_set_updated_at();

alter table public.newsletter_subscribers enable row level security;

-- ----------------------------------------------------------------------------
-- Username login (/omc-adminlogin accepts username OR email)
-- ----------------------------------------------------------------------------
alter table public.profiles add column if not exists username text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_username_format') then
    alter table public.profiles add constraint profiles_username_format
      check (username is null or username ~ '^[a-z0-9_.-]{3,40}$');
  end if;
end $$;

create unique index if not exists idx_profiles_username on public.profiles (username) where username is not null;

-- ----------------------------------------------------------------------------
-- Rate limiting (fixed window, shared across all serverless instances)
-- ----------------------------------------------------------------------------
create table if not exists public.rate_limits (
  key text primary key,
  count integer not null default 0,
  window_start timestamptz not null default now()
);

alter table public.rate_limits enable row level security;

-- Atomically counts a hit for `p_key` and returns true while the caller is
-- still within `p_limit` hits per `p_window_seconds`. Single statement, so
-- concurrent requests can't race past the limit.
create or replace function public.check_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  insert into public.rate_limits as r (key, count, window_start)
  values (p_key, 1, now())
  on conflict (key) do update
    set count = case
                  when r.window_start < now() - make_interval(secs => p_window_seconds) then 1
                  else r.count + 1
                end,
        window_start = case
                         when r.window_start < now() - make_interval(secs => p_window_seconds) then now()
                         else r.window_start
                       end
  returning count into v_count;

  -- Opportunistic cleanup so the table doesn't grow unbounded.
  if random() < 0.01 then
    delete from public.rate_limits where window_start < now() - interval '1 day';
  end if;

  return v_count <= p_limit;
end;
$$;

revoke all on function public.check_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.check_rate_limit(text, integer, integer) to service_role;
