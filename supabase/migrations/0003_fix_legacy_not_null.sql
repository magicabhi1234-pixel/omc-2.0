-- ============================================================================
-- OMC 2.0 - reconcile legacy NOT NULL columns in production with the app.
-- Run via the Supabase SQL Editor after 0002. Idempotent and safe on a fresh
-- database (every change is guarded by a column-existence check).
--
-- Production's pre-existing tables carry constraints the app doesn't satisfy:
-- * leads.city is NOT NULL, but City is optional on every lead form - so any
--   lead submitted without a city failed to save (the admin email still went
--   out, which is why it looked like a success).
-- * media.public_url is NOT NULL, but the dashboard writes `url` - so every
--   Media Library upload failed to create its catalog row.
-- ============================================================================

do $$
begin
  -- leads.city: optional, matching the form and the 0002 definition.
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'leads' and column_name = 'city' and is_nullable = 'NO') then
    alter table public.leads alter column city drop not null;
  end if;

  -- media.public_url: legacy duplicate of media.url. Keep it (other code may
  -- read it) but make it optional and keep both columns in sync.
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'media' and column_name = 'public_url') then
    alter table public.media alter column public_url drop not null;
    update public.media set url = public_url where url is null and public_url is not null;
    update public.media set public_url = url where public_url is null and url is not null;
  end if;
end $$;

create or replace function public.omc_sync_media_url()
returns trigger
language plpgsql
as $$
begin
  if new.url is null then new.url := new.public_url; end if;
  if new.public_url is null then new.public_url := new.url; end if;
  return new;
end;
$$;

do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'media' and column_name = 'public_url') then
    drop trigger if exists sync_media_url on public.media;
    create trigger sync_media_url before insert or update on public.media
      for each row execute function public.omc_sync_media_url();
  end if;
end $$;
