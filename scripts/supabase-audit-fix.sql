-- ═══════════════════════════════════════════════════════════════════
-- Retbaa Circle — Script d'audit et de correction Supabase
-- À exécuter dans : Supabase Dashboard → SQL Editor
-- Date : 2026-05-28
-- ═══════════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────────
-- 1. AUDIT : Vérifier que la table user_profiles existe et a les
--            bonnes colonnes
-- ──────────────────────────────────────────────────────────────────
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_profiles'
ORDER BY ordinal_position;


-- ──────────────────────────────────────────────────────────────────
-- 2. AUDIT : Vérifier les RLS policies sur user_profiles
-- ──────────────────────────────────────────────────────────────────
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'user_profiles';


-- ──────────────────────────────────────────────────────────────────
-- 3. FIX : Activer RLS sur user_profiles si ce n'est pas fait
-- ──────────────────────────────────────────────────────────────────
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;


-- ──────────────────────────────────────────────────────────────────
-- 4. FIX : Créer les RLS policies si elles n'existent pas
--    - Chaque user ne peut lire que son propre profil
--    - Le service role (backend) peut tout lire
-- ──────────────────────────────────────────────────────────────────

-- Policy SELECT : un user ne lit que son propre profil
DROP POLICY IF EXISTS "user_profiles_select_own" ON public.user_profiles;
CREATE POLICY "user_profiles_select_own"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy UPDATE : un user ne modifie que son propre profil
DROP POLICY IF EXISTS "user_profiles_update_own" ON public.user_profiles;
CREATE POLICY "user_profiles_update_own"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Note : INSERT et DELETE sont gérés par le service role uniquement


-- ──────────────────────────────────────────────────────────────────
-- 5. AUDIT : Vérifier que has_app_access() existe
-- ──────────────────────────────────────────────────────────────────
SELECT routine_name, routine_type, data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'has_app_access';


-- ──────────────────────────────────────────────────────────────────
-- 6. FIX : Créer has_app_access() si elle n'existe pas
--    Vérifie si le user courant a accès à une app donnée
--    via la table app_access (id, user_id, app_name, granted_at)
-- ──────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.has_app_access(app_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  has_access boolean;
  user_role text;
BEGIN
  -- 1. Vérifier le rôle (founder = accès total sans vérification)
  SELECT role INTO user_role
  FROM public.user_profiles
  WHERE id = auth.uid();

  IF user_role = 'founder' THEN
    RETURN true;
  END IF;

  -- 2. Vérifier dans la table app_access
  SELECT EXISTS(
    SELECT 1
    FROM public.app_access
    WHERE user_id = auth.uid()
      AND app_access.app_name = has_app_access.app_name
  ) INTO has_access;

  RETURN COALESCE(has_access, false);
END;
$$;

-- Donner les droits d'exécution aux utilisateurs authentifiés
GRANT EXECUTE ON FUNCTION public.has_app_access(text) TO authenticated;


-- ──────────────────────────────────────────────────────────────────
-- 7. AUDIT : Vérifier la table app_access
-- ──────────────────────────────────────────────────────────────────
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'app_access'
ORDER BY ordinal_position;


-- ──────────────────────────────────────────────────────────────────
-- 8. FIX : Créer la table app_access si elle n'existe pas
-- ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.app_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_name text NOT NULL,
  granted_at timestamptz DEFAULT now(),
  granted_by uuid REFERENCES auth.users(id),
  UNIQUE(user_id, app_name)
);

ALTER TABLE public.app_access ENABLE ROW LEVEL SECURITY;

-- Seul le service role peut gérer app_access
-- Les users peuvent lire leurs propres accès
CREATE POLICY "app_access_read_own" ON public.app_access
  FOR SELECT USING (auth.uid() = user_id);


-- ──────────────────────────────────────────────────────────────────
-- 9. Accorder l'accès Circle à tous les investisseurs existants
--    (founders ont accès automatique — on n'en a pas besoin)
-- ──────────────────────────────────────────────────────────────────
INSERT INTO public.app_access (user_id, app_name)
SELECT id, 'circle'
FROM public.user_profiles
WHERE role IN ('ops', 'partner', 'pending')
  AND id NOT IN (
    SELECT user_id FROM public.app_access WHERE app_name = 'circle'
  )
ON CONFLICT (user_id, app_name) DO NOTHING;

-- Vérifier le résultat
SELECT up.email, up.role, aa.app_name, aa.granted_at
FROM public.user_profiles up
LEFT JOIN public.app_access aa ON aa.user_id = up.id AND aa.app_name = 'circle'
ORDER BY up.role, up.email;


-- ──────────────────────────────────────────────────────────────────
-- 10. RAPPEL : Redirect URLs (à faire dans le Dashboard Supabase)
--     Authentication → URL Configuration → Redirect URLs
--     Ajouter :
--       https://retbaa-circle-spa.vercel.app/**
--       https://circle.retbaa.com/**
--     (non faisable via SQL — nécessite le Management API ou le dashboard)
-- ──────────────────────────────────────────────────────────────────
SELECT 'Script terminé — vérifier les résultats ci-dessus' AS status;
