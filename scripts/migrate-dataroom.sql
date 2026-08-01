-- scripts/migrate-dataroom.sql
-- Dataroom Prospects & Docs — Retbaa Circle
-- Exécuter dans Supabase SQL Editor

create table if not exists public.dataroom_prospects (
  id uuid default gen_random_uuid() primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  type text not null check (type in ('personal', 'entity')),
  entity_name text,
  entity_siren text,
  channel text not null check (channel in ('holding', 'spv', 'manufacture')),
  amount_range text not null,
  nda_signed_at timestamptz,
  nda_signer_name text,
  status text not null default 'pending' check (status in ('pending', 'access_requested', 'approved', 'rejected')),
  access_requested_at timestamptz,
  approved_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.dataroom_prospects enable row level security;

create policy "Insert prospect public" on public.dataroom_prospects
  for insert to anon, authenticated with check (true);

create policy "Lecture prospects fondateur" on public.dataroom_prospects
  for select to authenticated
  using (exists (select 1 from public.user_profiles where id = auth.uid() and role = 'founder'));

create policy "Update prospects fondateur" on public.dataroom_prospects
  for update to authenticated
  using (exists (select 1 from public.user_profiles where id = auth.uid() and role = 'founder'));

create policy "Update prospect self" on public.dataroom_prospects
  for update to authenticated
  using (email = auth.email());

create table if not exists public.dataroom_docs (
  id serial primary key,
  title text not null,
  type text not null,
  channel text default 'all',
  pdf_path text,
  preview_only boolean default true,
  sort_order integer default 100,
  created_at timestamptz default now()
);

alter table public.dataroom_docs enable row level security;

create policy "Lecture docs authentifiés" on public.dataroom_docs
  for select to authenticated using (true);

create policy "Ecriture docs fondateur" on public.dataroom_docs
  for all to authenticated
  using (exists (select 1 from public.user_profiles where id = auth.uid() and role = 'founder'));
