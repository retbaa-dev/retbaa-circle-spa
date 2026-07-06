-- ═══════════════════════════════════════════════════════════════════
-- Retbaa Circle — Migration Insights vers Supabase
-- Exécuter dans Supabase SQL Editor
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
  category text DEFAULT 'Veille Marché',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published boolean DEFAULT true
);

-- Index pour le tri par date
CREATE INDEX IF NOT EXISTS idx_insights_date ON public.insights (date DESC);
CREATE INDEX IF NOT EXISTS idx_insights_tag ON public.insights (tag);
CREATE INDEX IF NOT EXISTS idx_insights_featured ON public.insights (featured) WHERE featured = true;

-- RLS : les investisseurs authentifiés peuvent lire
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "insights_read_authenticated" ON public.insights;
CREATE POLICY "insights_read_authenticated"
  ON public.insights
  FOR SELECT
  TO authenticated
  USING (published = true);

-- Trigger updated_at
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

-- ═══════════════════════════════════════════════════════════════════
-- 2. SEED — Insérer les articles existants (depuis le code)
-- ═══════════════════════════════════════════════════════════════════

INSERT INTO public.insights (slug, tag, title, subtitle, date, author, source, source_url, summary, img, category, featured, content_md, published)
VALUES

-- Article 1
(
  'bifurcation-hermes-lvmh-2026',
  'Signal Marché',
  'Hermès +5.6% vs LVMH -2% vs Kering -6% : la bifurcation qui valide tout',
  NULL,
  '29 avril 2026',
  'Orion · Veille Stratégique',
  'The Silent Luxury · Luxury Daily · Business of Fashion',
  NULL,
  'Les résultats Q1 2026 ne laissent plus de place au doute : le marché bifurque entre les maisons de craft et d''identité forte.',
  'https://sspark.genspark.ai/cfimages?u1=McgFfPslu50S2ZcSxzRQGNEHWP5W7bn%2BOZoW0fUZKOPzvXvo75VH0s5kiAf7CZYmgQduwrMwSHt3ALCjdEZwYuTDeIZxJJVZV1v1xocDsIXRUnmmT2IEUw%3D%3D&u2=5kE1wzjKcnibWzy2&width=2560',
  'Veille Marché',
  true,
  '## Le marché parle — enfin clairement

Les résultats Q1 2026 ont mis fin au débat théorique. En trois lignes :

- **Hermès :** +5.6% de croissance organique
- **LVMH (Fashion & Leather) :** -2%
- **Kering (Gucci en tête) :** -6%

Ce n''est pas un accident de calendrier. C''est la confirmation d''une thèse structurelle que les observateurs du luxe formulent depuis 2023 : **le marché bifurque**.

## Ce que ça signifie pour Retbaa

Retbaa n''est pas LVMH. Elle n''a jamais voulu l''être.

Retbaa est une maison de craft — céramique sensorielle faite à la main, fragrances niche, artisanat africain transmis. C''est exactement le profil des marques qui surperforment aujourd''hui.

**La question pour un investisseur n''est plus "est-ce que le luxe va bien ?" — c''est "quel luxe ?"**

Les chiffres Q1 2026 répondent : le luxe d''identité forte, le luxe de matière et de récit, le luxe qui ne se solde pas — ce luxe-là va très bien.

Retbaa entre sur ce marché au bon moment, avec le bon positionnement.',
  true
),

-- Article 2
(
  'lvmh-bdk-niche-fragrance-acquisition',
  'Signal Marché',
  'LVMH Ventures rachète BDK Parfums : la niche fragrance devient cible d''acquisition',
  NULL,
  '29 avril 2026',
  'Orion · Veille Stratégique',
  'LVMH Luxury Ventures · Forbes · Scento 2026',
  NULL,
  'Quand LVMH Ventures entre au capital d''une maison de parfumerie niche, c''est un signal clair : les géants ne construisent plus dans ce segment — ils rachètent.',
  'https://sspark.genspark.ai/cfimages?u1=pLlWtKyPOdXdida7tOqG3vSGu%2BtFYtEl0mixVX0nfFFnlx4Xbs76JxY0zHAb6HeaXPZq%2FPAAx%2Fc1qlPKmi2ZKtcRRnz8j7m7pCy%2FpCeQPygRtLfc014aYXxmkjIYWSGPoQKyMa2i&u2=qCKa%2Fu5TpcAbX5T0&width=2560',
  'Veille Marché',
  false,
  '## Un signal que le marché attendait

LVMH Luxury Ventures vient de prendre une participation dans **BDK Parfums** — maison de parfumerie niche fondée à Paris en 2016.

Les géants du luxe ne construisent plus dans la niche fragrance. **Ils rachètent.**

Le marché de la parfumerie niche a atteint une taille critique : **$3.8 milliards** en 2024, **$7.6 milliards** projetés d''ici 2030 — CAGR 13.2%.

## Ce que ça change pour les investisseurs Retbaa

La question n''est pas "est-ce que Retbaa sera rachetée ?" C''est : **dans 3 à 5 ans, quand un fonds de luxe cherche une maison de niche fragrance/sensory avec une géographie émergente et un format propriétaire — combien y en a-t-il sur le marché ?**

La réponse est : très peu. Probablement une.',
  false
),

-- Article 3
(
  'gcc-riyadh-luxe-2026',
  'Géographie · GCC',
  'GCC Luxe $16.53B en 2026 : pourquoi Riyadh s''impose face à Dubai',
  NULL,
  '29 avril 2026',
  'Orion · Veille Stratégique',
  'ResearchAndMarkets · Bernstein · Yahoo Finance · Argaam',
  NULL,
  'Malgré les tensions Iran/MEA, le marché du luxe GCC reste le plus dynamique au monde. Le pivot stratégique Retbaa de Dubai vers Riyadh est validé par les données.',
  '/retbaa-photos/retbaa_18.jpg',
  'Géopolitique',
  false,
  '## Le GCC résiste — et l''Arabie Saoudite mène

**Chiffres clés 2026 :**
- **$16.53 milliards** — taille du marché luxe GCC (2026)
- **CAGR 10%** — rythme de croissance projeté
- **Saudi Arabia** — identifiée comme "rare bright spot" par Bernstein Research

## Pourquoi l''Arabie Saoudite distance Dubai

La géopolitique a redistribué les cartes. Les tensions Iran/région MEA ont créé une incertitude autour de Dubai comme hub régional.

**Drivers structurels Saudi Arabia :** Vision 2030, population jeune et premium, culture olfactive profonde, sécularisation accélérée.

Retbaa est ni une maison occidentale ni une maison orientale traditionnelle — et les deux à la fois. L''oud africain, la céramique sensorielle, le rituel quotidien comme architecture de marque : c''est un dialogue naturel avec la culture GCC.',
  false
),

-- Article 4
(
  'marche-luxe-sensoriel-2026',
  'Étude de Marché',
  'Le marché du luxe sensoriel en 2026 : une opportunité à $100B+ pour Retbaa',
  NULL,
  '29 avril 2026',
  'Massata Niang',
  'Bain & Company · Grand View Research · Globe Newswire · Scento',
  NULL,
  'Le luxe mondial traverse une mutation profonde. Les marques qui gagnent ne vendent plus des objets — elles vendent des expériences sensorielles.',
  NULL,
  'Marché Luxe',
  false,
  '## Un marché à la croisée des chemins

Le luxe mondial 2026 opère un recentrage net : **la qualité contre la quantité, l''expérience contre la possession, l''identité contre le statut**.

**€1.44 trillion** — taille totale du marché du luxe global. **€358 milliards** — personal luxury goods. **70% des marques en croissance** sont des spécialistes de niche.

## Les trois univers — une opportunité à $100B+

- **Atmosphère** (Home Fragrance) : $7.1B → $11.5B d''ici 2033, CAGR 7.2%
- **Gourmet** (Luxe alimentaire) : €74 milliards, +5% en 2025
- **Beauté** (Parfumerie niche) : $4.85 milliards en 2026, CAGR 13.2%

## The Sensory Funnel

**From Space → To Palate → To Self.**

Un client qui complète les trois univers génère **2.8x la valeur** d''un client mono-produit.',
  false
),

-- Article 5
(
  'sensory-funnel-2026',
  'Stratégie Produit',
  'The Sensory Funnel : comment Retbaa orchestre l''expérience Cultural Luxury',
  NULL,
  '28 avril 2026',
  'Massata Niang',
  'Retbaa Strategy',
  NULL,
  'Retbaa ne vend pas des produits — elle orchestre un voyage sensoriel en trois actes. Découvrez le framework qui structure toute notre stratégie.',
  '/frameworks/sensory-funnel.jpg',
  'Stratégie',
  false,
  '## Le Sensory Funnel : From Space → To Palate → To Self

### Acte 1 — Discovery : L''Atmosphère
Le premier contact avec Retbaa passe toujours par l''espace. L''Atmosphère crée le contexte.

### Acte 2 — Connection : Le Gourmet
Le Gourmet transforme l''expérience spatiale en partage — le repas, le cadeau, le rituel à deux.

### Acte 3 — Identity : La Beauté
La Beauté ancre l''identité. C''est la loyauté, le rituel quotidien, la signature permanente.

## La Matrix de Cohérence

**Morning Ritual** — Bougie d''éveil + thé vitalité + soin du visage
**Evening Gather** — Bougie signature + chocolat noir + crème mains
**Intimate Care** — Parfum Kemia + huile corps + diffuseur chambre
**Gift Curation** — Coffret diffuseur + épices premium + sérum visage',
  false
),

-- Article 6
(
  'retbaa-community-philosophie',
  'Vision',
  'Retbaa Community : La Philosophie de l''Expérience',
  'Jobs, la neuroscience du luxe, et pourquoi les grandes maisons créent des communautés — pas des clients',
  'Avril 2026',
  'Massata Niang',
  'Retbaa Strategy',
  NULL,
  'La communauté Retbaa est un cercle d''initiés. Pas un CRM. Pas une mailing list.',
  NULL,
  'Stratégie',
  false,
  '## La philosophie Retbaa Community

Retbaa ne construit pas une base de clients. Elle construit un **cercle**.

Un cercle où chaque membre reçoit avant d''acheter. Où l''accès précède la transaction.

## Le modèle

- **Anticipation** — chaque nouveau produit est présenté au Circle avant le public
- **Rituel** — les événements privés, les coffrets surprises, les correspondances manuscrites
- **Co-création** — les membres influencent les prochaines collections',
  false
),

-- Article 7
(
  'cultural-luxury-vision',
  'Vision',
  'Cultural Luxury: The Retbaa Vision',
  'A philosophy that resonates wherever craft, ritual and depth exist',
  'April 2026',
  'Massata Niang',
  'Retbaa Strategy',
  NULL,
  'Cultural Luxury is a universal filter: craftsmanship, ritual, heritage, transmitted savoir-faire.',
  NULL,
  'Vision',
  false,
  '## Cultural Luxury: A Universal Philosophy

Retbaa is not an "African luxury brand". Retbaa is a **Cultural Luxury** house — a universal positioning anchored in a singular origin.

This distinction is strategic, not semantic. "African luxury" is a geographical box. Cultural Luxury is a filter for reading the world.

**Values that resonate globally:**
- **Japan** — wabi-sabi, imperfection, time
- **GCC** — oud, hospitality, generosity
- **Italy** — savoir-faire, la dolce vita
- **France** — art de vivre, rituals
- **Brazil** — syncretism, joy
- **Korea** — jeong, deep connection',
  false
),

-- Article 8
(
  'lvmh-q1-loro-piana',
  'Veille Marché',
  'LVMH Q1 2026 : Le Luxe Silencieux Gagne la Bataille',
  'Loro Piana +2 chiffres pendant que Fashion & Leather recule — ce que ça signifie pour Retbaa',
  '24 Avril 2026',
  'Kemia · Chief of Staff IA',
  'The Silent Luxury · LVMH Q1 Report',
  NULL,
  'Loro Piana en croissance à deux chiffres quand la division Fashion & Leather de LVMH recule. Le "Quiet Luxury" devient le moteur.',
  '/retbaa-photos/retbaa_03.jpg',
  'Veille Marché',
  false,
  '## Les faits

- **LVMH Fashion & Leather** : -2% au Q1 2026
- **Loro Piana** : croissance à deux chiffres
- Le "luxe silencieux" (matières, artisanat, absence de logo) surperforme structurellement

## Ce que ça signifie pour Retbaa

Retbaa est née dans le "luxe silencieux". Kemia ne porte pas de logo visible. La marque ne fait pas de publicité grand public. Elle existe par la recommandation et l''expérience.

C''est exactement le positionnement que le marché récompense en 2026.',
  false
),

-- Article 9
(
  'cognitive-luxury-uhnwi',
  'Veille Marché',
  'Le "Cognitive Luxury" : Quand l''Ultra-Riche Optimise sa Biologie',
  'Du biohacking en altitude à la montre à $437K qui suit le soleil',
  '24 Avril 2026',
  'Kemia · Chief of Staff IA',
  '2Luxury2.com — Luxury Pulse April 2026',
  'https://www.2luxury2.com/luxury-pulse-april-2026-lvmh-richemont-kering-watches-wellness-wealth-trends/',
  'Les UHNWI redéfinissent la dépense premium : biohacking, longévité, objets de sens.',
  '/retbaa-photos/retbaa_03.jpg',
  'Veille Marché',
  false,
  '## Les Faits

Patek Philippe lance la Celestial Ref. 6105G-001 à $437 000 — une montre qui affiche le lever et le coucher du soleil calibrés sur la latitude de son propriétaire.

Les propriétés "wellness-certifiées" commandent un premium de 25%.

## Ce que ça signifie pour Retbaa

Kemia est, par conception, un objet de "Cognitive Luxury" :
- Il s''active par le porteur, pour le porteur
- La diffusion olfactive est invisible pour les autres
- Il crée un état — une optimisation de l''expérience intérieure',
  false
),

-- Article 10
(
  'afrique-du-sud-beauty-hub',
  'Afrique',
  'Afrique du Sud : Le Hub Beauty Premium que Tout le Monde Cherchait',
  'Le niche fragrance store Skins y réalise son meilleur chiffre mondial',
  '24 Avril 2026',
  'Kemia · Chief of Staff IA',
  'BeautyMatter — Avril 2026',
  'https://beautymatter.com/articles/south-africas-race-to-become-africas-beauty-powerhouse',
  'BeautyMatter analyse pourquoi l''Afrique du Sud s''impose comme point d''entrée obligatoire pour les marques luxury beauty.',
  '/retbaa-photos/retbaa_07.jpg',
  'Afrique',
  false,
  '## Africa Beauty Premium Hub

L''Afrique du Sud dispose d''une infrastructure retail mature, de consommateurs sophistiqués, de 1 000+ malls.

Le magasin Skins à Sandton est le plus rentable au monde.

Marché cosmétiques africain : $4,42B en 2026 → $7,51B en 2034.',
  false
),

-- Article 11
(
  'reconkering-gucci',
  'Veille Marché',
  'ReconKering : Quand un Géant Admet qu''il a Perdu la Désirabilité',
  'Kering annonce un plan multi-années pour rendre Gucci "incontournable à nouveau"',
  '24 Avril 2026',
  'Kemia · Chief of Staff IA',
  'Yahoo Finance',
  'https://finance.yahoo.com/markets/stocks/articles/luxury-giant-kering-chart-path-024810005.html',
  'Kering lance un plan de reconquête. Une leçon stratégique pour les marques en construction.',
  NULL,
  'Marché Luxe',
  false,
  '## La leçon Kering

Kering admet explicitement que Gucci a perdu sa désirabilité et annonce un plan multi-années.

Pour Retbaa, la leçon est claire : **construire la désirabilité organiquement** est plus lent mais infiniment plus robuste que les cycles de hype marketing.',
  false
),

-- Article 12
(
  'femmes-uhnwi-transfert-richesse',
  'Veille Marché',
  'Les Femmes UHNWI : Le Transfert de Richesse qui Redessine le Luxe',
  '20% de la richesse mondiale ultra-premium détenue par des femmes d''ici 2040',
  '24 Avril 2026',
  'Kemia · Chief of Staff IA',
  'Wealth-X · UBS',
  NULL,
  'Le transfert de richesse aux femmes UHNWI façonne déjà le marché du luxe premium.',
  NULL,
  'Veille Marché',
  false,
  '## Le Transfert

D''ici 2040, 20% de la richesse mondiale ultra-premium sera détenue par des femmes. Leurs préférences d''achat diffèrent : expériences > possessions, sensorialité > statut, marques indépendantes > conglomérats.

Retbaa, par son ADN sensoriel et sa proposition de rituel, est naturellement alignée avec ces préférences.',
  false
),

-- Article 13
(
  'ia-infrastructure-jpmorgan-anthropic-2026',
  'Tech & IA',
  'L''IA ne sera pas un outil. Ce sera l''infrastructure.',
  'Ce que JPMorgan, Anthropic — et Retbaa — ont compris en même temps',
  'Mai 2026',
  'Kemia · Chief of Staff IA',
  'JPMorgan · Anthropic',
  NULL,
  'L''IA devient infrastructure économique. Ce changement touche aussi les maisons de luxe.',
  NULL,
  'Tech & IA',
  false,
  '## L''IA comme infrastructure

JPMorgan investit massivement dans l''IA. Anthropic déploie des modèles de nouvelle génération. Le point commun : l''IA n''est plus un outil, c''est l''infrastructure.

Pour Retbaa, Kemia est déjà un objet connecté à cette nouvelle infrastructure — un capteur olfactif intelligent dans un format portable.',
  false
),

-- Article 14
(
  'luxe-crise-cultural-luxury-2026',
  'Signal Marché',
  'Le Luxe Global en Crise : Fenêtre d''Opportunité pour le Cultural Luxury',
  'LVMH -6% Q1, Kering ReconKering, Hermès sous pression',
  '5 mai 2026',
  'Kemia · Veille Stratégique',
  'LVMH · Kering · Hermès Q1 Reports',
  NULL,
  'La crise du luxe global est une fenêtre d''opportunité pour le Cultural Luxury.',
  NULL,
  'Marché Luxe',
  false,
  '## La crise du luxe global

Les conglomérats souffrent. Le luxe de masse recule. Le Cultural Luxury prend sa place.

C''est exactement la fenêtre pour laquelle Retbaa a été construite.',
  false
),

-- Article 15
(
  'gcc-riyadh-refuge-strategique-2026',
  'Géopolitique · GCC',
  'GCC sous Tension de Guerre : Riyadh comme Refuge Stratégique',
  'Dubai -50% estimé · Riyadh isolée du conflit',
  '5 mai 2026',
  'Kemia · Veille Stratégique',
  'Bernstein · ResearchAndMarkets',
  NULL,
  'Dubai subit les tensions régionales. Riyadh reste un refuge stratégique.',
  NULL,
  'Géopolitique',
  false,
  '## Riyadh comme refuge

Le pivot Retbaa de Dubai vers Riyadh est validé par les données géopolitiques.',
  false
),

-- Article 16
(
  'osmo-70m-ia-fragrance-2026',
  'Tech & IA',
  'Osmo lève $70M : L''IA s''attaque à la création olfactive',
  'Series B · fév. 2026 · MOQ réduits · ingrédients AI-designés',
  '5 mai 2026',
  'Kemia · Veille Stratégique',
  'Osmo · TechCrunch',
  NULL,
  'Osmo lève $70M pour appliquer l''IA à la création de fragrances. Kemia reste non-reproductible.',
  NULL,
  'Tech & IA',
  false,
  '## L''IA dans la fragrance

Osmo $70M Series B pour l''IA olfactive. MOQ réduits, ingrédients AI-designés.

Pourquoi Kemia reste non-reproductible : l''expérience Kemia n''est pas une fragrance — c''est un rituel.',
  false
),

-- Article 17
(
  'afrique-marche-producteur-2026',
  'Afrique',
  'L''Afrique comme Marché Producteur : Au-delà de la Consommation',
  '"Rise of Africa''s Brand Economy 2026" (BrandiQ/Brookings)',
  '5 mai 2026',
  'Kemia · Veille Stratégique',
  'BrandiQ · Brookings · Globe Newswire',
  NULL,
  'MEA luxury $21.85B · CAGR 10.57% — l''Afrique comme marché producteur, pas seulement consommateur.',
  NULL,
  'Afrique',
  false,
  '## Au-delà de la consommation

L''Afrique émerge comme marché producteur de luxe. MEA luxury $21.85B en 2026, CAGR 10.57%.

Retbaa est positionnée pour capter cette double opportunité : origine et marché.',
  false
),

-- Articles legacy (nos numériques)
(
  'article-001',
  'Marché Luxe',
  'Le Luxe à l''Épreuve de son Époque',
  NULL,
  'Avril 2026',
  'Kemia · Veille Stratégique',
  'Bain & Company',
  NULL,
  'Analyse de la résilience du luxe face aux cycles économiques.',
  NULL,
  'Marché Luxe',
  false,
  'Article legacy — contenu à restaurer depuis la version précédente.',
  false
),
(
  'article-002',
  'Distribution',
  'Distribution & Retail sélectif',
  NULL,
  'Avril 2026',
  'Kemia · Veille Stratégique',
  'McKinsey',
  NULL,
  'Benchmark des modèles de distribution premium.',
  NULL,
  'Distribution',
  false,
  'Article legacy — contenu à restaurer depuis la version précédente.',
  false
),
(
  'article-003',
  'Géopolitique',
  'Géopolitique du Luxe',
  NULL,
  'Avril 2026',
  'Kemia · Veille Stratégique',
  'Various',
  NULL,
  'Analyse géopolitique des marchés du luxe.',
  NULL,
  'Géopolitique',
  false,
  'Article legacy — contenu à restaurer depuis la version précédente.',
  false
),
(
  'article-004',
  'Stratégie',
  'Stratégie Retbaa',
  NULL,
  'Mars 2026',
  'Massata Niang',
  'Retbaa',
  NULL,
  'Vision stratégique Retbaa.',
  NULL,
  'Stratégie',
  false,
  'Article legacy — contenu à restaurer depuis la version précédente.',
  false
),
(
  'article-005',
  'Stratégie',
  'Vision 2028',
  NULL,
  'Mars 2026',
  'Massata Niang',
  'Retbaa',
  NULL,
  'Roadmap Retbaa 2028.',
  NULL,
  'Stratégie',
  false,
  'Article legacy — contenu à restaurer depuis la version précédente.',
  false
),
(
  'article-006',
  'Afrique',
  'Afrique & Cultural Luxury',
  NULL,
  'Mars 2026',
  'Kemia · Veille Stratégique',
  'Various',
  NULL,
  'Le positionnement africain dans le luxe mondial.',
  NULL,
  'Afrique',
  false,
  'Article legacy — contenu à restaurer depuis la version précédente.',
  false
);

-- Vérification
SELECT slug, title, tag, category, date, featured
FROM public.insights
ORDER BY date DESC, created_at ASC;
