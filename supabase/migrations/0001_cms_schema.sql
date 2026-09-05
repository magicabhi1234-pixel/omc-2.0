-- ============================================================================
-- OMC 2.0 Custom CMS - initial schema
-- Run this once, in full, via the Supabase SQL Editor (Dashboard > SQL Editor
-- > New query > paste > Run). Safe to re-run: every statement is idempotent
-- (IF NOT EXISTS / CREATE OR REPLACE / ON CONFLICT DO NOTHING).
-- ============================================================================

create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ----------------------------------------------------------------------------
-- Helper: auto-maintain updated_at on any table that has the column
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ----------------------------------------------------------------------------
-- Roles & profiles (auth)
-- ----------------------------------------------------------------------------
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text unique not null check (name in ('super_admin', 'admin', 'editor', 'author')),
  description text
);

insert into public.roles (name, description) values
  ('super_admin', 'Full access: users, settings, content, media, roles'),
  ('admin', 'Content management, media management, blog management'),
  ('editor', 'Content editing, blog editing'),
  ('author', 'Manage own content only')
on conflict (name) do nothing;

-- One row per Supabase Auth user (auth.users is managed by Supabase Auth
-- itself; this table adds the app-specific profile/role/status on top of it).
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role_id uuid not null references public.roles(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create index if not exists idx_profiles_role_id on public.profiles(role_id);

-- ----------------------------------------------------------------------------
-- Categories & tags (blog taxonomy)
-- ----------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Universities
-- ----------------------------------------------------------------------------
create table if not exists public.universities (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  logo_url text,
  logo_alt text,
  featured boolean not null default false,
  study_mode text not null default 'Online & Distance'
    check (study_mode in ('Online', 'Distance', 'Online & Distance')),
  duration text not null default '2 Years',
  eligibility text not null default '',
  starting_fee text not null default '',
  emi text,
  placement_support text,
  rating numeric(2,1) check (rating is null or (rating >= 0 and rating <= 5)),
  review_count integer check (review_count is null or review_count >= 0),
  approvals text[] not null default '{}',
  rankings jsonb not null default '[]', -- [{source, value}]
  brochure_url text,
  website_url text,
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id)
);

drop trigger if exists set_universities_updated_at on public.universities;
create trigger set_universities_updated_at before update on public.universities
  for each row execute function public.set_updated_at();

create index if not exists idx_universities_status on public.universities(status);
create index if not exists idx_universities_featured on public.universities(featured) where featured = true;

-- ----------------------------------------------------------------------------
-- Testimonials
-- ----------------------------------------------------------------------------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  designation text,
  university text, -- free text attribution, not a reference (matches source schema)
  image_url text,
  image_alt text,
  review text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id)
);

drop trigger if exists set_testimonials_updated_at on public.testimonials;
create trigger set_testimonials_updated_at before update on public.testimonials
  for each row execute function public.set_updated_at();

create index if not exists idx_testimonials_status on public.testimonials(status);

-- ----------------------------------------------------------------------------
-- Blog posts
-- ----------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  h1 text,
  featured_image_url text,
  featured_image_alt text,
  excerpt text not null default '',
  content jsonb not null default '[]', -- Portable-Text-shaped block array (see docs/cms-content-format.md)
  author text not null default 'Admin',
  published_date timestamptz not null default now(),
  category_id uuid references public.categories(id),
  category text, -- denormalized label, kept for frontend display without a join
  tags text[] not null default '{}',
  faqs jsonb not null default '[]', -- [{question, answer}]
  status text not null default 'draft' check (status in ('draft', 'published')),
  seo_meta_title text,
  seo_meta_description text,
  seo_keywords text[],
  seo_canonical_url text,
  seo_og_image_url text,
  seo_no_index boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id)
);

drop trigger if exists set_blog_posts_updated_at on public.blog_posts;
create trigger set_blog_posts_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();

create index if not exists idx_blog_posts_status on public.blog_posts(status);
create index if not exists idx_blog_posts_published_date on public.blog_posts(published_date desc);
create index if not exists idx_blog_posts_category_id on public.blog_posts(category_id);

create table if not exists public.blog_post_related (
  blog_post_id uuid not null references public.blog_posts(id) on delete cascade,
  related_post_id uuid not null references public.blog_posts(id) on delete cascade,
  sort_order integer not null default 0,
  primary key (blog_post_id, related_post_id),
  check (blog_post_id <> related_post_id)
);

create index if not exists idx_blog_post_related_post on public.blog_post_related(blog_post_id, sort_order);

-- ----------------------------------------------------------------------------
-- Landing pages
-- ----------------------------------------------------------------------------
create table if not exists public.landing_pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null
    check (category in ('Online MBA', 'Distance MBA', 'MBA Specializations', 'Executive MBA', 'University Pages', 'Bachelor Programs')),
  region text default 'none' check (region in ('north', 'south', 'east', 'west', 'none')),
  status text not null default 'draft' check (status in ('draft', 'published')),

  hero jsonb not null default '{}',                 -- {badge, heading, description, image:{src,alt}, primaryButtonText, secondaryButtonText, stat1Value, stat1Label, stat2Value, stat2Label, stat3Value, stat3Label}
  university_section jsonb not null default '{}',   -- {badge, heading, description}
  compare_section jsonb,                            -- {badge, heading, description, features:[{label,key}]}
  why_choose jsonb,                                 -- {heading, description, items:[{title,description,icon}]}
  stats jsonb,                                      -- {heading, description, stats:[{value,label}]}
  specializations jsonb,                            -- {heading, description, items:[{title,slug,description,icon}]}
  benefits jsonb,                                   -- {heading, description, items:[{title,description,icon}]}
  career_scope jsonb,                               -- {heading, description, roles:[{title,salaryRange,description}]}
  highlight_banner jsonb,                           -- {heading, description, buttonLabel}
  faq jsonb,                                        -- {heading, description, faqs:[{question,answer}]}
  testimonials_heading text default 'What Our Students Say',
  cta jsonb not null default '{}',                  -- {badge, heading, description, primaryButtonText, secondaryButtonText}

  seo_meta_title text,
  seo_meta_description text,
  seo_keywords text[],
  seo_canonical_url text,
  seo_og_image_url text,
  seo_no_index boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id)
);

drop trigger if exists set_landing_pages_updated_at on public.landing_pages;
create trigger set_landing_pages_updated_at before update on public.landing_pages
  for each row execute function public.set_updated_at();

create index if not exists idx_landing_pages_status on public.landing_pages(status);
create index if not exists idx_landing_pages_category on public.landing_pages(category);

create table if not exists public.landing_page_universities (
  landing_page_id uuid not null references public.landing_pages(id) on delete cascade,
  university_id uuid not null references public.universities(id) on delete cascade,
  sort_order integer not null default 0,
  primary key (landing_page_id, university_id)
);

create index if not exists idx_lpu_landing_page on public.landing_page_universities(landing_page_id, sort_order);
create index if not exists idx_lpu_university on public.landing_page_universities(university_id);

create table if not exists public.landing_page_testimonials (
  landing_page_id uuid not null references public.landing_pages(id) on delete cascade,
  testimonial_id uuid not null references public.testimonials(id) on delete cascade,
  sort_order integer not null default 0,
  primary key (landing_page_id, testimonial_id)
);

create index if not exists idx_lpt_landing_page on public.landing_page_testimonials(landing_page_id, sort_order);

-- ----------------------------------------------------------------------------
-- Media library (Supabase Storage keeps the bytes; this table is the catalog)
-- ----------------------------------------------------------------------------
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  storage_path text not null unique,
  url text not null,
  mime_type text,
  size_bytes bigint,
  alt_text text,
  width integer,
  height integer,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create index if not exists idx_media_created_at on public.media(created_at desc);
create index if not exists idx_media_mime_type on public.media(mime_type);

-- ----------------------------------------------------------------------------
-- Navigation & site settings (header nav, footer, contact info, etc.)
-- ----------------------------------------------------------------------------
create table if not exists public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  menu_key text not null, -- e.g. 'header', 'footer-quick-links'
  label text not null,
  href text not null,
  sort_order integer not null default 0,
  is_external boolean not null default false,
  opens_new_tab boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_navigation_items_updated_at on public.navigation_items;
create trigger set_navigation_items_updated_at before update on public.navigation_items
  for each row execute function public.set_updated_at();

create index if not exists idx_navigation_items_menu on public.navigation_items(menu_key, sort_order);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Generic content blocks - any future content type, no migration required
-- ----------------------------------------------------------------------------
create table if not exists public.content_blocks (
  id uuid primary key default gen_random_uuid(),
  content_type text not null, -- e.g. 'banner', 'faq_page', anything not yet a first-class table
  slug text,
  title text,
  data jsonb not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  seo_meta_title text,
  seo_meta_description text,
  seo_canonical_url text,
  seo_og_image_url text,
  seo_no_index boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  unique (content_type, slug)
);

drop trigger if exists set_content_blocks_updated_at on public.content_blocks;
create trigger set_content_blocks_updated_at before update on public.content_blocks
  for each row execute function public.set_updated_at();

create index if not exists idx_content_blocks_type on public.content_blocks(content_type, status);

-- ----------------------------------------------------------------------------
-- Activity logs (full audit trail)
-- ----------------------------------------------------------------------------
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  user_email text,
  action text not null, -- create | update | delete | publish | unpublish | login | logout | upload | user_create | user_update | user_delete | password_reset
  content_type text not null, -- university | testimonial | blog_post | landing_page | media | user | settings | navigation | content_block
  content_id text,
  previous_value jsonb,
  new_value jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_activity_logs_created_at on public.activity_logs(created_at desc);
create index if not exists idx_activity_logs_content on public.activity_logs(content_type, content_id);
create index if not exists idx_activity_logs_user on public.activity_logs(user_id);

-- ============================================================================
-- Row Level Security
--
-- The admin dashboard's Server Actions always use the service-role key
-- (server-only, never shipped to the client) - the service role bypasses RLS
-- entirely, so every policy below is defense-in-depth / anon-key safety net,
-- not the primary access-control mechanism. The frontend also reads via a
-- server-only client (mirroring how it only ever called Sanity from server
-- components), so these "public can read published" policies exist so the
-- lighter anon key could be used too, without ever exposing draft content.
-- ============================================================================

alter table public.roles enable row level security;
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.universities enable row level security;
alter table public.testimonials enable row level security;
alter table public.blog_posts enable row level security;
alter table public.blog_post_related enable row level security;
alter table public.landing_pages enable row level security;
alter table public.landing_page_universities enable row level security;
alter table public.landing_page_testimonials enable row level security;
alter table public.media enable row level security;
alter table public.navigation_items enable row level security;
alter table public.site_settings enable row level security;
alter table public.content_blocks enable row level security;
alter table public.activity_logs enable row level security;

drop policy if exists "public read published universities" on public.universities;
create policy "public read published universities" on public.universities
  for select using (status = 'published');

drop policy if exists "public read published testimonials" on public.testimonials;
create policy "public read published testimonials" on public.testimonials
  for select using (status = 'published');

drop policy if exists "public read published blog posts" on public.blog_posts;
create policy "public read published blog posts" on public.blog_posts
  for select using (status = 'published');

drop policy if exists "public read published landing pages" on public.landing_pages;
create policy "public read published landing pages" on public.landing_pages
  for select using (status = 'published');

drop policy if exists "public read landing page university links" on public.landing_page_universities;
create policy "public read landing page university links" on public.landing_page_universities
  for select using (true);

drop policy if exists "public read landing page testimonial links" on public.landing_page_testimonials;
create policy "public read landing page testimonial links" on public.landing_page_testimonials
  for select using (true);

drop policy if exists "public read navigation" on public.navigation_items;
create policy "public read navigation" on public.navigation_items
  for select using (true);

drop policy if exists "public read site settings" on public.site_settings;
create policy "public read site settings" on public.site_settings
  for select using (true);

drop policy if exists "public read published content blocks" on public.content_blocks;
create policy "public read published content blocks" on public.content_blocks
  for select using (status = 'published');

drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile" on public.profiles
  for select using (auth.uid() = id);

-- categories/tags/media/activity_logs/roles/blog_post_related: no public
-- policy - only the service-role (admin dashboard) reads/writes these; RLS
-- with zero policies means "deny all" for anon/authenticated, which is the
-- correct default for admin-only tables.

-- ============================================================================
-- End of schema. Next: run scripts/migrate-sanity-to-supabase.mjs and
-- scripts/create-super-admin.mjs (see docs/cms-deployment.md).
-- ============================================================================
