-- fix-bilan-2025.sql — Alignement noms fichiers Bilan 2025
-- À exécuter dans Supabase SQL Editor (projet lufozqtrwrmowzojxcoi)

-- 1. Supprimer l'ancienne entrée avec le mauvais chemin
DELETE FROM dataroom_docs WHERE pdf_path = '/docs/dataroom/bilan-2025.pdf';

-- 2. Insérer les 3 vrais fichiers
INSERT INTO dataroom_docs (title, category, access_level, pdf_path, preview_only, sort_order)
VALUES
  ('Bilan 2025 — Groupe Retbaa',   'Finance', 'all', '/docs/dataroom/Bilan_2025_Groupe_Retbaa.pdf',  false, 141),
  ('Bilan 2025 — Retbaa Retail',   'Finance', 'all', '/docs/dataroom/Bilan_2025_Retbaa_Retail.pdf',  false, 142),
  ('Bilan 2025 — Retbaa SASU',     'Finance', 'all', '/docs/dataroom/Bilan_2025_Retbaa_SASU.pdf',    false, 143)
ON CONFLICT DO NOTHING;
