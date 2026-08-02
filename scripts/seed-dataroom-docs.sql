-- Seed table dataroom_docs — Retbaa Circle
-- Exécuter dans : app.supabase.com → SQL Editor

-- Nettoyage préalable (idempotent)
delete from public.dataroom_docs where id > 0;

-- Documents Preview (preview_only = true — visible, non téléchargeable sans validation)
insert into public.dataroom_docs (title, type, channel, pdf_path, preview_only, sort_order) values
  ('Pitch Deck — Retbaa Holding',             'Présentation',  'holding',  '/docs/dataroom/Retbaa_PitchDeck_VF.pdf',              true,  10),
  ('Dossier d''investissement — SPV Les Adresses', 'Présentation', 'spv', '/docs/dataroom/SPV_Retbaa_Espaces_I.pdf',             true,  20),
  ('Étude de marché — Luxe Africain 2026',    'Recherche',     'all',      '/docs/dataroom/Retbaa_Etude_Marche_Luxe_2026.pdf',    true,  30),
  ('Étude HBR — Le Luxe en 2026',             'Recherche',     'all',      '/docs/dataroom/luxe_etude_HBR_2026.pdf',              true,  40),
  ('Note — Retbaa joue au Go',                'Stratégie',     'all',      '/docs/dataroom/Kemia_Note_Retbaa_Joue_Au_Go.pdf',     true,  50),
  ('Note — Espaces vides et luxe',            'Stratégie',     'all',      '/docs/dataroom/Orion_Espaces_Vides_Luxe.pdf',         true,  60),
  ('Note — Stratégie d''encerclement B2B',    'Stratégie',     'all',      '/docs/dataroom/Solin_Strategie_Encerclement_B2B.pdf', true,  70);

-- Documents Accès complet (preview_only = false — débloqués après validation)
insert into public.dataroom_docs (title, type, channel, pdf_path, preview_only, sort_order) values
  ('Statuts consolidés (post-augmentation)',  'Juridique',     'all',      '/docs/dataroom/statuts-final-2026.pdf',               false, 100),
  ('Cap Table officielle',                    'Actionnariat',  'all',      '/docs/dataroom/cap-table-officielle.pdf',             false, 110),
  ('Closing Binder Final',                    'Juridique',     'all',      '/docs/dataroom/closing-binder-final.pdf',             false, 120),
  ('Business Plan 2026–2028',                 'Finance',       'all',      '/docs/dataroom/business-plan-2026.pdf',               false, 130),
  ('Bilan 2025',                              'Finance',       'all',      '/docs/dataroom/bilan-2025.pdf',                       false, 140);

-- Note : Business Plan et Bilan 2025 sont placeholders — uploader les PDFs dans /public/docs/dataroom/
-- puis mettre à jour pdf_path si les noms de fichiers diffèrent
