-- =============================================================
-- Migration : table `documents` — Retbaa Circle
-- Rend les documents gérables depuis Supabase
-- sans redéploiement pour chaque ajout/modification
--
-- Exécuter dans : app.supabase.com → SQL Editor
-- Projet : lufozqtrwrmowzojxcoi
-- =============================================================

-- ── 1. Création de la table ──────────────────────────────────
create table if not exists public.documents (
  id            serial primary key,
  title         text not null,
  type          text not null,           -- 'Gouvernance', 'Corporate', 'KYC', 'Finance', 'Associés', etc.
  format        text default 'PDF',
  date_label    text default '—',        -- label affiché (ex: "Fév. 2026")
  size_label    text default '—',        -- label affiché (ex: "0,5 Mo")
  status        text not null            -- 'sign' | 'upload' | 'validated' | 'pending'
                check (status in ('sign', 'upload', 'validated', 'pending')),
  priority      boolean default false,
  pdf_path      text,                    -- chemin public ex: /docs/legal/pacte.pdf
  founder_exempt boolean default false,  -- dispensé de ce doc si fondateur
  sort_order    integer default 100,
  visible_to    text[] default array['all'],  -- 'all' ou ['RC-0001', 'RC-9921', ...]
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── 2. RLS ───────────────────────────────────────────────────
alter table public.documents enable row level security;

-- Lecture : tout investisseur authentifié voit les docs "all"
-- + les docs spécifiques à son ref investisseur
create policy "Lecture documents — investisseurs authentifiés"
  on public.documents for select
  to authenticated
  using (
    'all' = any(visible_to)
    or (
      exists (
        select 1 from public.user_profiles up
        where up.id = auth.uid()
        and up.investor_ref = any(visible_to)
      )
    )
  );

-- Écriture : fondateur uniquement (role = 'founder')
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
create index if not exists documents_sort_idx on public.documents(sort_order);

-- ── 4. Seed — documents actuels (migration depuis code statique) ──
insert into public.documents
  (title, type, format, date_label, size_label, status, priority, pdf_path, founder_exempt, sort_order)
values
  -- À signer
  ('Pacte d''actionnaires V3',                        'Gouvernance', 'PDF', 'Mai 2026',  '0,1 Mo', 'sign',      true,  '/docs/legal/pacte-actionnaires-v3.pdf',                          false, 10),
  ('Statuts consolidés (post-augmentation)',          'Corporate',   'PDF', 'Fév. 2026', '0,5 Mo', 'sign',      true,  '/docs/legal/statuts-final-2026.pdf',                             false, 20),
  -- Validés
  ('Décision de l''associé unique',                   'Corporate',   'PDF', 'Fév. 2026', '1,0 Mo', 'validated', false, '/docs/legal/decision-associe-unique.pdf',                        false, 30),
  ('Décision du Président — Constatation augmentation capital', 'Corporate', 'PDF', 'Fév. 2026', '0,2 Mo', 'validated', false, '/docs/legal/decision-president-augmentation-capital.pdf', false, 40),
  ('Closing Binder Final',                            'Closing',     'PDF', 'Fév. 2026', '0,8 Mo', 'validated', false, '/docs/legal/closing-binder-final.pdf',                           false, 50),
  ('Cap Table Officielle',                            'Actionnariat','PDF', 'Fév. 2026', '2,4 Mo', 'validated', false, '/docs/legal/cap-table-officielle.pdf',                           false, 60),
  ('Registre des mouvements de titres',               'Registres',   'PDF', 'Fév. 2026', '0,2 Mo', 'validated', false, '/docs/legal/registre-mouvements-titres.pdf',                     false, 70),
  ('Note de réconciliation des flux',                 'Finance',     'PDF', 'Fév. 2026', '0,3 Mo', 'validated', false, '/docs/legal/note-reconciliation-flux.pdf',                       false, 80),
  ('Attestation de réception des fonds',              'Finance',     'PDF', 'Fév. 2026', '2,4 Mo', 'validated', false, '/docs/legal/attestation-reception-fonds.pdf',                    false, 90),
  ('Déclaration des bénéficiaires effectifs (RBE)',   'Compliance',  'PDF', 'Fév. 2026', '1,4 Mo', 'validated', false, '/docs/legal/declaration-beneficiaires.pdf',                      false, 100),
  ('Mémo d''alignement juridique',                    'Juridique',   'PDF', 'Fév. 2026', '0,2 Mo', 'validated', false, '/docs/legal/memo-alignement-juridique.pdf',                      false, 110),
  ('Statuts originaux — RETBAA Holding (2023)',       'Corporate',   'PDF', 'Fév. 2023', '0,4 Mo', 'validated', false, '/docs/legal/statuts-originaux-2023.pdf',                         false, 120),
  -- KYC
  ('Pièce d''identité',                               'KYC',         'JPG/PDF', '—', '—',  'upload', false, null,                                                                       false, 200),
  ('Justificatif de domicile',                        'KYC',         'JPG/PDF', '—', '—',  'upload', false, null,                                                                       false, 210),
  ('Déclaration d''origine des fonds',                'KYC',         'PDF',     '—', '0,3 Mo', 'upload', false, '/docs/legal/kyc-declaration-origine-fonds.pdf',                        true,  220),
  ('Déclaration statut PPE',                          'KYC',         'PDF',     '—', '0,3 Mo', 'upload', false, '/docs/legal/kyc-declaration-statut-pep.pdf',                           true,  230),
  ('Attestation fiscale et résidence fiscale',        'KYC',         'PDF',     '—', '0,3 Mo', 'upload', false, '/docs/legal/kyc-attestation-fiscale.pdf',                              true,  240);

-- Comptes individuels (visible_to = ref investisseur spécifique)
insert into public.documents
  (title, type, format, date_label, size_label, status, priority, pdf_path, sort_order, visible_to)
values
  ('Compte individuel — Massata NIANG',      'Associés', 'PDF', 'Fév. 2026', '1,3 Mo', 'validated', false, '/docs/legal/comptes-associes/compte-massata-niang.pdf',      300, array['all']),
  ('Compte individuel — Barthélemy FAYE',    'Associés', 'PDF', 'Fév. 2026', '1,2 Mo', 'validated', false, '/docs/legal/comptes-associes/compte-barthelemy-faye.pdf',    310, array['RC-9921']),
  ('Compte individuel — Pape Amadou NGOM',   'Associés', 'PDF', 'Fév. 2026', '1,2 Mo', 'validated', false, '/docs/legal/comptes-associes/compte-pape-amadou-ngom.pdf',  320, array['RC-0042']),
  ('Compte individuel — Cathy MUIZA',        'Associés', 'PDF', 'Fév. 2026', '1,9 Mo', 'validated', false, '/docs/legal/comptes-associes/compte-cathy-muiza.pdf',       330, array['RC-0078']),
  ('Compte individuel — Raphaël PERDRIX',    'Associés', 'PDF', 'Fév. 2026', '1,4 Mo', 'validated', false, '/docs/legal/comptes-associes/compte-raphael-perdrix.pdf',   340, array['RC-0093']);

-- ── 5. Helper : updated_at auto ──────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger documents_updated_at
  before update on public.documents
  for each row execute procedure public.set_updated_at();

-- ── Notes d'utilisation ───────────────────────────────────────
-- Ajouter un document :
--   insert into documents (title, type, status, pdf_path, ...) values (...)
--
-- Changer le statut d'un doc (ex: passage à 'validated') :
--   update documents set status = 'validated' where title = 'Pacte d''actionnaires V3';
--
-- Rendre un doc visible uniquement pour Barthélemy :
--   update documents set visible_to = array['RC-9921'] where id = X;
--
-- Pour que DocumentsPage.jsx utilise cette table au lieu du code statique,
-- remplacer `allDocs` par un useEffect + supabase.from('documents').select(*)
-- (voir commentaire dans DocumentsPage.jsx)
