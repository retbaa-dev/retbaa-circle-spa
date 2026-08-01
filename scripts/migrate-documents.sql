-- =============================================================
-- Migration : table `documents` — Retbaa Circle
-- Version 2 — compatible schema user_profiles existant
-- (sans colonne investor_ref)
--
-- Exécuter dans : app.supabase.com → SQL Editor
-- Projet : lufozqtrwrmowzojxcoi
-- =============================================================

-- ── 1. Création de la table ──────────────────────────────────
create table if not exists public.documents (
  id            serial primary key,
  title         text not null,
  type          text not null,
  format        text default 'PDF',
  date_label    text default '—',
  size_label    text default '—',
  status        text not null
                check (status in ('sign', 'upload', 'validated', 'pending')),
  priority      boolean default false,
  pdf_path      text,
  founder_exempt boolean default false,
  sort_order    integer default 100,
  -- visible_to : 'all' = tout le monde, 'founder' = fondateur seul,
  -- ou email exact de l'investisseur (ex: 'barthelemy@retbaa.com')
  visible_to    text[] default array['all'],
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── 2. RLS ───────────────────────────────────────────────────
alter table public.documents enable row level security;

-- Lecture : investisseur authentifié voit les docs 'all'
-- + les docs ciblés par son email
create policy "Lecture documents — investisseurs authentifiés"
  on public.documents for select
  to authenticated
  using (
    'all' = any(visible_to)
    or auth.email() = any(visible_to)
    or (
      'founder' = any(visible_to)
      and exists (
        select 1 from public.user_profiles
        where id = auth.uid() and role = 'founder'
      )
    )
  );

-- Écriture : fondateur uniquement
create policy "Écriture documents — fondateur uniquement"
  on public.documents for all
  to authenticated
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and role = 'founder'
    )
  );

-- ── 3. Index ─────────────────────────────────────────────────
create index if not exists documents_status_idx on public.documents(status);
create index if not exists documents_sort_idx   on public.documents(sort_order);

-- ── 4. Seed ──────────────────────────────────────────────────
insert into public.documents
  (title, type, format, date_label, size_label, status, priority, pdf_path, founder_exempt, sort_order)
values
  ('Pacte d''actionnaires V3',                                  'Gouvernance',  'PDF',     'Mai 2026',  '0,1 Mo', 'sign',      true,  '/docs/legal/pacte-actionnaires-v3.pdf',                          false, 10),
  ('Statuts consolidés (post-augmentation)',                    'Corporate',    'PDF',     'Fév. 2026', '0,5 Mo', 'sign',      true,  '/docs/legal/statuts-final-2026.pdf',                             false, 20),
  ('Décision de l''associé unique',                             'Corporate',    'PDF',     'Fév. 2026', '1,0 Mo', 'validated', false, '/docs/legal/decision-associe-unique.pdf',                        false, 30),
  ('Décision du Président — Constatation augmentation capital', 'Corporate',    'PDF',     'Fév. 2026', '0,2 Mo', 'validated', false, '/docs/legal/decision-president-augmentation-capital.pdf',        false, 40),
  ('Closing Binder Final',                                      'Closing',      'PDF',     'Fév. 2026', '0,8 Mo', 'validated', false, '/docs/legal/closing-binder-final.pdf',                           false, 50),
  ('Cap Table Officielle',                                      'Actionnariat', 'PDF',     'Fév. 2026', '2,4 Mo', 'validated', false, '/docs/legal/cap-table-officielle.pdf',                           false, 60),
  ('Registre des mouvements de titres',                         'Registres',    'PDF',     'Fév. 2026', '0,2 Mo', 'validated', false, '/docs/legal/registre-mouvements-titres.pdf',                     false, 70),
  ('Note de réconciliation des flux',                           'Finance',      'PDF',     'Fév. 2026', '0,3 Mo', 'validated', false, '/docs/legal/note-reconciliation-flux.pdf',                       false, 80),
  ('Attestation de réception des fonds',                        'Finance',      'PDF',     'Fév. 2026', '2,4 Mo', 'validated', false, '/docs/legal/attestation-reception-fonds.pdf',                    false, 90),
  ('Déclaration des bénéficiaires effectifs (RBE)',             'Compliance',   'PDF',     'Fév. 2026', '1,4 Mo', 'validated', false, '/docs/legal/declaration-beneficiaires.pdf',                      false, 100),
  ('Mémo d''alignement juridique',                              'Juridique',    'PDF',     'Fév. 2026', '0,2 Mo', 'validated', false, '/docs/legal/memo-alignement-juridique.pdf',                      false, 110),
  ('Statuts originaux — RETBAA Holding (2023)',                 'Corporate',    'PDF',     'Fév. 2023', '0,4 Mo', 'validated', false, '/docs/legal/statuts-originaux-2023.pdf',                         false, 120),
  ('Pièce d''identité',                                         'KYC',          'JPG/PDF', '—',         '—',      'upload',    false, null,                                                             false, 200),
  ('Justificatif de domicile',                                  'KYC',          'JPG/PDF', '—',         '—',      'upload',    false, null,                                                             false, 210),
  ('Déclaration d''origine des fonds',                          'KYC',          'PDF',     '—',         '0,3 Mo', 'upload',    false, '/docs/legal/kyc-declaration-origine-fonds.pdf',                  true,  220),
  ('Déclaration statut PPE',                                    'KYC',          'PDF',     '—',         '0,3 Mo', 'upload',    false, '/docs/legal/kyc-declaration-statut-pep.pdf',                     true,  230),
  ('Attestation fiscale et résidence fiscale',                  'KYC',          'PDF',     '—',         '0,3 Mo', 'upload',    false, '/docs/legal/kyc-attestation-fiscale.pdf',                        true,  240);

-- Comptes individuels — ciblés par email
insert into public.documents
  (title, type, format, date_label, size_label, status, pdf_path, sort_order, visible_to)
values
  ('Compte individuel — Massata NIANG',    'Associés', 'PDF', 'Fév. 2026', '1,3 Mo', 'validated', '/docs/legal/comptes-associes/compte-massata-niang.pdf',     300, array['all']),
  ('Compte individuel — Barthélemy FAYE',  'Associés', 'PDF', 'Fév. 2026', '1,2 Mo', 'validated', '/docs/legal/comptes-associes/compte-barthelemy-faye.pdf',   310, array['founder', 'barthelemy@retbaa.com']),
  ('Compte individuel — Pape Amadou NGOM', 'Associés', 'PDF', 'Fév. 2026', '1,2 Mo', 'validated', '/docs/legal/comptes-associes/compte-pape-amadou-ngom.pdf', 320, array['founder', 'pape.amadou.ngom@retbaa.com']),
  ('Compte individuel — Cathy MUIZA',      'Associés', 'PDF', 'Fév. 2026', '1,9 Mo', 'validated', '/docs/legal/comptes-associes/compte-cathy-muiza.pdf',       330, array['founder', 'cathy@retbaa.com']),
  ('Compte individuel — Raphaël PERDRIX',  'Associés', 'PDF', 'Fév. 2026', '1,4 Mo', 'validated', '/docs/legal/comptes-associes/compte-raphael-perdrix.pdf',   340, array['founder', 'raphael@retbaa.com']);

-- ── 5. Trigger updated_at ────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists documents_updated_at on public.documents;
create trigger documents_updated_at
  before update on public.documents
  for each row execute procedure public.set_updated_at();

-- ── Notes d'utilisation ───────────────────────────────────────
-- Ajouter un doc : insert into documents (title, type, status, ...) values (...)
-- Valider un doc : update documents set status = 'validated' where title = '...';
-- Cibler un investisseur : update documents set visible_to = array['founder','email@retbaa.com'] where id = X;
