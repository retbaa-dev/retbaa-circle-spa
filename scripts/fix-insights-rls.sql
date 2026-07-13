-- ═══════════════════════════════════════════════════════════════════
-- FIX RLS Insights — Autoriser l'accès anon pour articles publiés
-- Exécuter dans Supabase SQL Editor
-- Diagnostic: La page Insights affichait le fallback car RLS bloquait les anon
-- ═══════════════════════════════════════════════════════════════════

-- 1. Supprimer la policy restrictive actuelle
DROP POLICY IF EXISTS "insights_read_authenticated" ON public.insights;

-- 2. Créer une policy pour les utilisateurs anon — lire articles publiés
CREATE POLICY "insights_read_anon"
  ON public.insights
  FOR SELECT
  TO anon
  USING (published = true);

-- 3. Créer une policy pour les utilisateurs authentifiés — lire articles publiés
CREATE POLICY "insights_read_authenticated"
  ON public.insights
  FOR SELECT
  TO authenticated
  USING (published = true);

-- 4. Vérifier que les policies sont créées
SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'insights'
ORDER BY policyname;
