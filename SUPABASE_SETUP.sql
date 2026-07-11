-- ============================================================================
-- Universal Design Duo — Supabase setup
-- Run this once in your Supabase project's SQL editor:
--   https://supabase.com/dashboard/project/_/sql/new
-- ============================================================================

-- 1. Site content — a single JSONB row the admin panel reads and writes.
create table if not exists public.site_content (
  id          integer primary key,
  data        jsonb not null,
  updated_at  timestamptz default now()
);

-- Enable RLS with NO policies. The app only touches this table server-side
-- using the service-role key, which bypasses RLS. This blocks all anon access.
alter table public.site_content enable row level security;

-- 2. Storage bucket for admin image uploads. Public = true so <img> tags on the
--    live site can load the images without auth. Writes happen server-side with
--    the service-role key.
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;
