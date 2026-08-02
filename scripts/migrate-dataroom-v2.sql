-- Migration Dataroom v2 — NDA complet avec métadonnées contrepartie + signature
alter table public.dataroom_prospects add column if not exists nda_meta jsonb;
