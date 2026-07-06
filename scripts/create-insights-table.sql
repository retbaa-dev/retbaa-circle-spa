-- ═══════════════════════════════════════════════════════════════════
-- Retbaa Circle — Migration Insights vers Supabase
-- Table + seed des 23 articles existants
-- ═══════════════════════════════════════════════════════════════════

-- 1. Créer la table insights
CREATE TABLE IF NOT EXISTS public.insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  tag text NOT NULL DEFAULT 'Veille Marché',
  title text NOT NULL,
  subtitle text,
  date text NOT NULL,
  author text NOT NULL DEFAULT 'Kemia · Veille Stratégique',
  source text,
  source_url text,
  summary text NOT NULL,
  img text,
  content_md text,
  featured boolean DEFAULT false,
  category text DEFAULT 'Article',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published boolean DEFAULT true
);

-- Index pour le tri par date
CREATE INDEX IF NOT EXISTS idx_insights_date ON public.insights (date DESC);
CREATE INDEX IF NOT EXISTS idx_insights_tag ON public.insights (tag);
CREATE INDEX IF NOT EXISTS idx_insights_featured ON public.insights (featured) WHERE featured = true;

-- RLS : les investisseurs authentifiés peuvent lire, seul le service role écrit
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insights_read_authenticated"
  ON public.insights
  FOR SELECT
  TO authenticated
  USING (published = true);

-- 2. Trigger updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS insights_updated_at ON public.insights;
CREATE TRIGGER insights_updated_at
  BEFORE UPDATE ON public.insights
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
