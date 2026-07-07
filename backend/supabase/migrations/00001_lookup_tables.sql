-- Create categories table
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default now()
);

-- Create seasons table
create table public.seasons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Create badges table
create table public.badges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  color_hex text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Create regions table
create table public.regions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  is_active boolean default true
);

-- Enable RLS
alter table public.categories enable row level security;
alter table public.seasons enable row level security;
alter table public.badges enable row level security;
alter table public.regions enable row level security;

-- Create policies for public reads (active items only)
create policy "Public read categories" on public.categories for select using (true);
create policy "Public read active seasons" on public.seasons for select using (is_active = true);
create policy "Public read active badges" on public.badges for select using (is_active = true);
create policy "Public read active regions" on public.regions for select using (is_active = true);

-- Create policies for admin writes (using authenticated role and perhaps a specific admin check, 
-- but for now we assume all authenticated users are admins as requested)
create policy "Admin all categories" on public.categories for all to authenticated using (true) with check (true);
create policy "Admin all seasons" on public.seasons for all to authenticated using (true) with check (true);
create policy "Admin all badges" on public.badges for all to authenticated using (true) with check (true);
create policy "Admin all regions" on public.regions for all to authenticated using (true) with check (true);

-- Seed data for seasons
insert into public.seasons (name, slug, sort_order) values
  ('Christmas', 'christmas', 1),
  ('Valentine''s Day', 'valentines-day', 2),
  ('Easter', 'easter', 3),
  ('Mother''s Day', 'mothers-day', 4),
  ('Eid', 'eid', 5),
  ('General', 'general', 6);

-- Seed data for badges
insert into public.badges (name, slug, color_hex) values
  ('New', 'new', '#FF0000'),
  ('Limited Edition', 'limited-edition', '#000000'),
  ('Best Seller', 'best-seller', '#FFD700');

-- Seed data for regions
insert into public.regions (name, slug) values
  ('Global', 'global'),
  ('Middle East', 'middle-east'),
  ('Europe', 'europe'),
  ('North America', 'north-america'),
  ('Asia Pacific', 'asia-pacific');
