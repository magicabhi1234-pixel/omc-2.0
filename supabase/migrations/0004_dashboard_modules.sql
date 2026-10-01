-- ============================================================================
-- OMC 2.0 - dashboard modules: FAQ manager, media categories, Sanity sync log
-- Run via the Supabase SQL Editor after 0003. Idempotent.
-- Menus (header / footer / mobile) and global settings (branding, social,
-- tracking) need no schema change: they reuse navigation_items.menu_key and
-- site_settings keys.
-- ============================================================================

do $$
begin
  if to_regprocedure('public.omc_set_updated_at()') is null then
    raise exception 'Apply 0001-0003 before this migration.';
  end if;
end $$;

-- ----------------------------------------------------------------------------
-- FAQs (sitewide FAQ manager - "placement" picks where a FAQ is shown)
-- ----------------------------------------------------------------------------
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  placement text not null default 'home', -- home | contact | about | general
  sort_order integer not null default 0,
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null
);

drop trigger if exists set_faqs_updated_at on public.faqs;
create trigger set_faqs_updated_at before update on public.faqs
  for each row execute function public.omc_set_updated_at();

create index if not exists idx_faqs_placement on public.faqs(placement, sort_order) where status = 'published';

alter table public.faqs enable row level security;
drop policy if exists "public read published faqs" on public.faqs;
create policy "public read published faqs" on public.faqs for select using (status = 'published');

-- Seed with the homepage FAQs that are currently hardcoded, only if empty.
insert into public.faqs (question, answer, placement, sort_order)
select q, a, 'home', o from (values
  ('Is an online MBA valid in India?', 'Yes. Online MBA programs from UGC-entitled universities are valid across India and are treated on par with regular MBA degrees for jobs, promotions and higher studies.', 0),
  ('Do online MBA universities offer placement support?', 'Most leading online universities provide placement assistance and career services, such as resume reviews, interview preparation, virtual job fairs and access to hiring partners.', 1),
  ('What is the average online MBA fee in India?', 'Online MBA fees in India generally range from ₹60,000 to ₹2,00,000 for the full program, depending on the university, its rankings and the specialization.', 2)
) as seed(q, a, o)
where not exists (select 1 from public.faqs);

-- ----------------------------------------------------------------------------
-- Media categories (production's legacy media table already has `folder`)
-- ----------------------------------------------------------------------------
alter table public.media add column if not exists folder text not null default 'general';
alter table public.media add column if not exists updated_at timestamptz not null default now();
create index if not exists idx_media_folder on public.media(folder);

drop trigger if exists set_media_updated_at on public.media;
create trigger set_media_updated_at before update on public.media
  for each row execute function public.omc_set_updated_at();

-- Images copied from Sanity land in their own category.
update public.media set folder = 'sanity' where storage_path like 'sanity/%' and folder in ('images', 'general');

-- ----------------------------------------------------------------------------
-- Sanity -> dashboard sync runs (hybrid CMS audit trail)
-- ----------------------------------------------------------------------------
create table if not exists public.cms_sync_runs (
  id uuid primary key default gen_random_uuid(),
  trigger text not null,           -- manual | webhook | script
  mode text not null,              -- insert-only | update-existing
  status text not null,            -- success | partial | failed
  summary jsonb not null default '{}',
  started_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_cms_sync_runs_created on public.cms_sync_runs(created_at desc);
alter table public.cms_sync_runs enable row level security;
