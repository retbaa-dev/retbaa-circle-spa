// pages/InsightsPage.jsx — Retbaa Circle — Revue éditoriale investisseurs
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'

// Rendu markdown simple (gras, italique, titres, listes, images [[IMG:url|caption]])
function renderMarkdown(text) {
  if (!text) return []
  const lines = text.split('\n')
  const elements = []
  let key = 0
  for (const line of lines) {
    const k = key++
    // Image inline [[IMG:/path/to/img.jpg|Caption]]
    const imgMatch = line.trim().match(/^\[\[IMG:(.+?)\|(.+?)\]\]$/)
    if (imgMatch) {
      const [, src, caption] = imgMatch
      elements.push(
        <figure key={k} style={{ margin: '28px 0', textAlign: 'center' }}>
          <img
            src={src}
            alt={caption}
            style={{ width: '100%', maxWidth: '640px', borderRadius: '6px', boxShadow: '0 4px 20px rgba(0,0,0,0.10)', display: 'block', margin: '0 auto' }}
          />
          <figcaption style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#9CA3AF', marginTop: '8px', fontStyle: 'italic', letterSpacing: '0.05em' }}>
            {caption}
          </figcaption>
        </figure>
      )
    } else if (line.startsWith('## ')) {
      elements.push(<h3 key={k} style={{ fontFamily: 'Newsreader, serif', fontSize: '18px', color: '#1A3A6B', margin: '24px 0 8px', fontStyle: 'italic' }}>{line.slice(3)}</h3>)
    } else if (line.startsWith('### ')) {
      elements.push(<h4 key={k} style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', fontWeight: 700, color: '#1A3A6B', margin: '16px 0 6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{line.slice(4)}</h4>)
    } else if (line.startsWith('- ')) {
      const html = line.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')
      elements.push(<li key={k} style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#374151', lineHeight: 1.7, marginBottom: '4px' }} dangerouslySetInnerHTML={{ __html: html }} />)
    } else if (line.trim() === '') {
      elements.push(<div key={k} style={{ height: '8px' }} />)
    } else {
      const html = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')
      elements.push(<p key={k} style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#374151', lineHeight: 1.8, margin: '0 0 4px' }} dangerouslySetInnerHTML={{ __html: html }} />)
    }
  }
  return elements
}

// Modal article complet
function ArticleModal({ article, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handler) }
  }, [onClose])

  return (
    <div className="article-modal-wrapper" onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(10,20,40,0.7)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px', overflowY: 'auto' }}>
      <div className="article-modal-inner" onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '6px', maxWidth: '720px', width: '100%', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.3)' }}>
        {/* Image header */}
        {article.img && (
          <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
            <img src={article.img} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(26,58,107,0.85))' }} />
            <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', backdropFilter: 'blur(4px)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
            </button>
            <div style={{ position: 'absolute', bottom: '16px', left: '24px', right: '24px' }}>
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#EFC0D4' }}>{article.tag}</span>
              <h2 style={{ fontFamily: 'Newsreader, serif', fontSize: '22px', color: '#fff', margin: '6px 0 4px', fontStyle: 'italic', lineHeight: 1.3 }}>{article.title}</h2>
            </div>
          </div>
        )}
        {/* Contenu */}
        <div style={{ padding: '28px 32px 40px' }}>
          {!article.img && (
            <button onClick={onClose} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
          <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#9CA3AF', marginBottom: '16px' }}>
            {article.date} · {article.author} · Source : {article.source}
          </p>
          <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px', color: '#4B5563', lineHeight: 1.7, marginBottom: '24px', borderLeft: '3px solid #EFC0D4', paddingLeft: '16px', fontStyle: 'italic' }}>
            {article.summary}
          </p>
          <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '20px' }}>
            {renderMarkdown(article.content)}
          </div>
          {article.sourceUrl && (
            <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
              <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1A3A6B', textDecoration: 'none' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
                Source originale
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── DONNÉES ARTICLES ──────────────────────────────────────────
const articles = [
  {
    id: 'bifurcation-hermes-lvmh-2026',
    tag: 'Signal Marché',
    title: 'Hermès +5.6% vs LVMH -2% vs Kering -6% : la bifurcation qui valide tout',
    date: '29 avril 2026',
    author: 'Orion · Veille Stratégique',
    source: 'The Silent Luxury · Luxury Daily · Business of Fashion',
    sourceUrl: null,
    summary: 'Les résultats Q1 2026 ne laissent plus de place au doute : le marché bifurque entre les maisons de craft et d\'identité forte d\'un côté, les conglomérats de logo luxury de l\'autre. Pour Retbaa et ses investisseurs, c\'est l\'argument du moment.',
    img: 'https://sspark.genspark.ai/cfimages?u1=McgFfPslu50S2ZcSxzRQGNEHWP5W7bn%2BOZoW0fUZKOPzvXvo75VH0s5kiAf7CZYmgQduwrMwSHt3ALCjdEZwYuTDeIZxJJVZV1v1xocDsIXRUnmmT2IEUw%3D%3D&u2=5kE1wzjKcnibWzy2&width=2560',
    content: `## Le marché parle — enfin clairement

Les résultats Q1 2026 ont mis fin au débat théorique. En trois lignes :

- **Hermès :** +5.6% de croissance organique
- **LVMH (Fashion & Leather) :** -2%
- **Kering (Gucci en tête) :** -6%

Ce n'est pas un accident de calendrier. C'est la confirmation d'une thèse structurelle que les observateurs du luxe formulent depuis 2023 : **le marché bifurque**.

## Les deux luxes

Il existe désormais deux marchés du luxe qui évoluent en sens inverse.

**Le luxe de craft et d'identité forte** — Hermès, Brunello Cucinelli, certaines maisons indépendantes. Caractéristiques : artisanat visible, récit authentique, désirabilité intrinsèque, résistance aux cycles économiques. Ces marques ne font pas de promotions. Elles ont des listes d'attente.

**Le luxe de logo et de volume** — les grandes divisions des conglomérats. Caractéristiques : croissance portée par l'aspiration de masse, sensibilité au cycle économique, dilution de la désirabilité quand le volume monte trop vite. Ces marques gèrent aujourd'hui les conséquences de leur propre succès.

La divergence Q1 2026 n'est pas une surprise. Elle était prévisible. Elle est maintenant chiffrée.

## Ce que ça signifie pour Retbaa

Retbaa n'est pas LVMH. Elle n'a jamais voulu l'être.

Retbaa est une maison de craft — céramique sensorielle faite à la main, fragrances niche, artisanat africain transmis. C'est exactement le profil des marques qui surperforment aujourd'hui.

**La question pour un investisseur n'est plus "est-ce que le luxe va bien ?" — c'est "quel luxe ?"**

Les chiffres Q1 2026 répondent : le luxe d'identité forte, le luxe de matière et de récit, le luxe qui ne se solde pas — ce luxe-là va très bien.

Retbaa entre sur ce marché au bon moment, avec le bon positionnement.

## L'argument Tranche 2

Pour les investisseurs qui accompagnent Retbaa dans la levée en cours, ces chiffres ont une implication directe.

Vous n'investissez pas dans le luxe en général. Vous investissez dans **le segment du luxe qui résiste** — celui qui grandit quand les autres reculent.

La bifurcation n'est pas un risque à hedger. C'est un moteur à activer.

*Sources : The Silent Luxury (20 avr. 2026) · Luxury Daily (15 avr. 2026) · Business of Fashion (12 avr. 2026)*`,
  },
  {
    id: 'lvmh-bdk-niche-fragrance-acquisition',
    tag: 'Signal Marché',
    title: 'LVMH Ventures rachète BDK Parfums : la niche fragrance devient cible d\'acquisition',
    date: '29 avril 2026',
    author: 'Orion · Veille Stratégique',
    source: 'LVMH Luxury Ventures · Forbes · Scento 2026',
    sourceUrl: null,
    summary: 'Quand LVMH Ventures entre au capital d\'une maison de parfumerie niche, c\'est un signal clair : les géants ne construisent plus dans ce segment — ils rachètent. Retbaa coche tous les critères d\'une cible.',
    img: 'https://sspark.genspark.ai/cfimages?u1=pLlWtKyPOdXdida7tOqG3vSGu%2BtFYtEl0mixVX0nfFFnlx4Xbs76JxY0zHAb6HeaXPZq%2FPAAx%2Fc1qlPKmi2ZKtcRRnz8j7m7pCy%2FpCeQPygRtLfc014aYXxmkjIYWSGPoQKyMa2i&u2=qCKa%2Fu5TpcAbX5T0&width=2560',
    content: `## Un signal que le marché attendait

LVMH Luxury Ventures vient de prendre une participation dans **BDK Parfums** — maison de parfumerie niche fondée à Paris en 2016. Le deal n'a pas été commenté en détail, mais le signal est limpide.

Les géants du luxe ne construisent plus dans la niche fragrance. **Ils rachètent.**

## Pourquoi maintenant

Le marché de la parfumerie niche a atteint une taille critique :

- **$3.8 milliards** en 2024
- **$7.6 milliards** projetés d'ici 2030 — CAGR 13.2%
- Le segment le plus dynamique de toute l'industrie du luxe

À ce niveau de croissance, une maison de niche bien positionnée vaut structurellement plus que sa taille actuelle. Elle vaut l'optionalité — la capacité à capter une part de marché disproportionnée dans un segment qui double.

LVMH l'a compris. D'autres suivront.

## Le profil d'une cible

BDK Parfums cumule plusieurs caractéristiques qui ont rendu le deal attractif :

- Identité olfactive forte et cohérente
- Distribution sélective (retail premium + e-commerce DTC)
- Fondateurs présents et impliqués
- Géographie et récit différenciants (Paris, craft artisanal)
- Traction prouvée sans dépendance aux dépenses marketing massives

Retbaa coche les mêmes cases — et en ajoute une que BDK n'a pas : **une géographie d'origine à fort coefficient de désirabilité émergente** (Sénégal, Afrique de l'Ouest) et un format produit propriétaire (Kemia, le médaillon sensoriel céramique).

## Ce que ça change pour les investisseurs Retbaa

Investir dans Retbaa aujourd'hui, c'est entrer avant que le marché price la désirabilité du segment.

La question n'est pas "est-ce que Retbaa sera rachetée ?" C'est : **dans 3 à 5 ans, quand un fonds de luxe cherche une maison de niche fragrance/sensory avec une géographie émergente et un format propriétaire — combien y en a-t-il sur le marché ?**

La réponse est : très peu. Probablement une.

*Sources : LVMH Luxury Ventures (jan. 2026) · Forbes · Scento Niche Fragrance Market Report 2026*`,
  },
  {
    id: 'gcc-riyadh-luxe-2026',
    tag: 'Géographie · GCC',
    title: 'GCC Luxe $16.53B en 2026 : pourquoi Riyadh s\'impose face à Dubai',
    date: '29 avril 2026',
    author: 'Orion · Veille Stratégique',
    source: 'ResearchAndMarkets · Bernstein · Yahoo Finance · Argaam',
    sourceUrl: null,
    summary: 'Malgré les tensions Iran/MEA, le marché du luxe GCC reste le plus dynamique au monde. L\'Arabie Saoudite s\'impose comme le "rare bright spot" identifié par Bernstein. Le pivot stratégique Retbaa de Dubai vers Riyadh est validé par les données.',
    img: '/retbaa-photos/retbaa_18.jpg',
    content: `## Le GCC résiste — et l'Arabie Saoudite mène

Dans un contexte de tensions géopolitiques régionales, le marché du luxe GCC affiche une résilience remarquable.

**Chiffres clés 2026 :**
- **$16.53 milliards** — taille du marché luxe GCC (2026)
- **CAGR 10%** — rythme de croissance projeté
- **Saudi Arabia** — identifiée comme "rare bright spot" par Bernstein Research (avril 2026)

Pendant que certains marchés premium ralentissent, Riyadh accélère.

## Pourquoi l'Arabie Saoudite distance Dubai

La géopolitique a redistribué les cartes. Les tensions Iran/région MEA ont créé une incertitude autour de Dubai comme hub régional. Riyadh n'a pas ce problème — elle est portée par une dynamique propre.

**Drivers structurels Saudi Arabia :**

**Vision 2030** — l'État investit massivement dans le tourisme premium, les arts, la culture, l'hospitalité de luxe. Ce n'est pas un cycle économique, c'est une politique nationale.

**Population jeune et premium** — 60% de la population saoudienne a moins de 35 ans, avec un pouvoir d'achat en forte croissance. La demande intérieure est réelle.

**Culture olfactive profonde** — l'oud, le bakhoor, la parfumerie orientale sont des pratiques culturelles quotidiennes, pas des tendances. Un marché qui comprend naturellement la sensorialité et le rituel.

**Sécularisation accélérée** — l'ouverture culturelle depuis 2019 a créé une nouvelle classe de consommateurs premium qui combinent codes occidentaux et ancrage identitaire fort. C'est exactement le profil qui résonne avec Cultural Luxury.

## Le pivot Retbaa : de Dubai à Riyadh

Retbaa a activé une stratégie GCC B2B-first depuis 2025, avec Dubai comme point d'entrée initial (contact Galeries Lafayette Dubai Mall, hospitalité premium Forest Rain). Ces actifs sont conservés.

Mais les données 2026 valident un pivot d'accent : **Riyadh comme marché prioritaire**, Dubai comme marché de visibilité.

**"Crafted in Paris, Nurtured in Africa, Revealed in Dubai"** reste le positionnement de marque pour la région. La mécanique d'entrée commerciale, elle, se concentre là où la croissance est la plus forte.

## Ce que Retbaa apporte que personne d'autre n'a

Sur le marché GCC, les maisons de parfumerie niche premium sont soit occidentales (sans ancrage culturel moyen-oriental), soit orientales traditionnelles (sans dimension internationale).

Retbaa est ni l'un ni l'autre — et les deux à la fois.

L'oud africain, la céramique sensorielle, le rituel quotidien comme architecture de marque : c'est un dialogue naturel avec la culture GCC, porté par une origine géographique inédite.

**Le marché n'attend pas Retbaa. Il la cherche.**

*Sources : ResearchAndMarkets (mars 2026) · Bernstein Research (avr. 2026) · Yahoo Finance · Argaam*`,
  },
  {
    id: 'marche-luxe-sensoriel-2026',
    tag: 'Étude de Marché',
    title: 'Le marché du luxe sensoriel en 2026 : une opportunité à $100B+ pour Retbaa',
    date: '29 avril 2026',
    author: 'Massata Niang',
    source: 'Bain & Company · Grand View Research · Globe Newswire · Scento',
    sourceUrl: null,
    summary: 'Le luxe mondial traverse une mutation profonde. Les marques qui gagnent ne vendent plus des objets — elles vendent des expériences sensorielles. Retbaa est née exactement là où ce marché veut aller.',
    img: null,
    content: `## I. Un marché à la croisée des chemins

Le luxe mondial 2026 ne ressemble plus à ce qu'il était en 2019. Après des années de croissance portée par le volume et la démocratisation, le secteur opère un recentrage net : **la qualité contre la quantité, l'expérience contre la possession, l'identité contre le statut**.

Les données Bain & Company (décembre 2025) le confirment sans ambiguïté :
- **€1.44 trillion** — taille totale du marché du luxe global (toutes catégories)
- **€358 milliards** — personal luxury goods (mode, beauté, joaillerie, parfumerie)
- **+3 à +5%** de croissance prévue en 2026, malgré les incertitudes macro
- **70% des marques en croissance** sont des spécialistes de niche — pas des conglomérats

Ce dernier chiffre est le plus important pour Retbaa. Dans un marché qui se fragmente, la spécialisation gagne.

## II. Les trois univers — une opportunité à $100B+

Retbaa n'opère pas dans un seul segment. Elle orchestre trois univers complémentaires, chacun porteur d'une dynamique de marché indépendante et puissante.

### L'Atmosphère — Home Fragrance & Sensory Living

Le marché du home fragrance de luxe est en pleine expansion structurelle :

- **$7.1B → $11.5B d'ici 2033** (Mark Spark Solutions, 2026) — CAGR de 7.2%
- **Bougies de luxe seules : $680M–$807M** avec CAGR de **10.8%** (Grand View Research)
- Driver principal : la pandémie a transformé le domicile en espace de bien-être permanent

La bougie n'est plus un accessoire. C'est un acte d'intention.

### Le Gourmet — Luxe alimentaire & Rituel de table

Bain 2025 intègre pour la première fois le "gourmet & dining" dans son baromètre luxe :

- **€74 milliards** — taille du marché du luxe alimentaire global
- **+5% en 2025**, croissance continue prévue pour 2026-2028
- Ce segment croît plus vite que la mode luxe pour la 3e année consécutive

Le repas luxueux n'est plus réservé au restaurant étoilé. Il s'invite à la maison.

### La Beauté — Parfumerie niche & Sensory Identity

C'est le segment le plus dynamique de tout le secteur :

- **Parfumerie niche : $4.85 milliards** en 2026, CAGR **13.2%** (Scento 2026)
- Le segment le plus rapide de toute l'industrie du luxe
- Driver : refus des grands classiques, recherche d'une signature olfactive personnelle

La parfumerie niche ne vend pas un parfum. Elle vend une identité.

### Total adressable : $100B+

Pris ensemble, ces trois univers représentent un marché adressable supérieur à **$100 milliards**, avec des trajectoires de croissance à deux chiffres dans les segments les plus porteurs. Retbaa est positionnée à l'intersection exacte de ces trois forces.

## III. The Sensory Funnel

Retbaa ne vend pas des produits dans trois catégories. Elle orchestre un voyage :

**From Space → To Palate → To Self.**

C'est le Sensory Funnel. Les trois univers ne sont pas parallèles — ils sont séquentiels et cumulatifs.

- **Acte 1 — L'Atmosphère** crée le contexte. Elle dit : "tu es dans un endroit différent maintenant." C'est le seuil, l'invitation, la première impression sensorielle.
- **Acte 2 — Le Gourmet** approfondit la relation. Il transforme l'expérience spatiale en partage — le repas, le cadeau, le rituel à deux.
- **Acte 3 — La Beauté** ancre l'identité. Elle dit : "Retbaa fait partie de qui je suis." C'est la loyauté, le rituel quotidien, la signature permanente.

Ce funnel a une conséquence directe sur la business mechanics : un client qui entre par l'Atmosphère et découvre progressivement les deux autres univers génère **3x plus de valeur** qu'un client mono-catégorie. Le cross-sell n'est pas une technique marketing — c'est l'architecture naturelle du voyage.

## IV. La Matrix de Cohérence

Le Sensory Funnel se déploie dans des moments de vie précis. Ce sont eux qui structurent le catalogue, les coffrets et les campagnes :

**Morning Ritual** — Bougie d'éveil + thé vitalité + soin du visage
*Message : Commencer la journée avec intention.*

**Evening Gather** — Bougie signature + chocolat noir + crème mains
*Message : La fin de journée mérite un rituel.*

**Intimate Care** — Parfum Kemia + huile corps + diffuseur chambre
*Message : S'accorder une attention totale.*

**Gift Curation** — Coffret diffuseur + épices premium + sérum visage
*Message : Offrir une expérience complète, pas un objet.*

Ces quatre moments couvrent les principales occasions d'achat luxe : usage personnel, auto-cadeau, cadeau corporate, cadeau intime. La Matrix garantit la cohérence entre le design produit, le merchandising e-commerce et la stratégie de contenu.

## V. La thèse Cultural Luxury

Retbaa n'est pas une marque "africaine de luxe". Elle est une maison de **Cultural Luxury** — un positionnement universel ancré dans une origine singulière.

La distinction est stratégique, pas sémantique.

"Africain de luxe" est une case géographique. Cultural Luxury est un filtre de lecture du monde : artisanat, rituel, héritage, savoir-faire transmis. Des valeurs qui résonnent au Japon avec le *wabi-sabi*, dans le GCC avec la culture de l'*oud* et de l'hospitalité, en Italie avec la tradition du *bella vita*, en France avec l'idée de *savoir-vivre*.

La thèse : **les marchés émergents premium ne cherchent pas une copie des grandes maisons européennes. Ils cherchent une alternative authentique, ancrée dans une culture vivante.**

Retbaa est cette alternative.

Les indicateurs de marché valident la thèse :
- La montée des indie houses dans la parfumerie : +13.2% CAGR vs +4% pour les grands groupes
- Le "made with story" supplante le "made in France" comme critère de valeur perçue
- Les acheteurs millennials GCC et diaspora africaine constituent un segment de 40M+ personnes sans maison dédiée

## VI. L'opportunité MEA

Le Moyen-Orient et l'Afrique constituent l'opportunité géographique la plus sous-estimée du luxe mondial.

Données Globe Newswire 2026 :
- **$21.85 milliards** — taille du marché luxe MEA en 2026
- **$36.15 milliards** d'ici 2031, CAGR **10.57%**
- Croissance quasi-deux-fois supérieure à l'Europe occidentale

Bain va plus loin dans son analyse 2025 :
- **MEA + SE Asia + Amérique Latine = €40-45 milliards** de potentiel combiné
- Équivalent en volume à la **Chine entière**
- Mais avec un profil de risque infiniment plus favorable (géopolitique, réglementaire, accès)

Pour Retbaa, l'opportunité MEA se lit à deux niveaux :

**Niveau 1 — GCC comme marché client premium**
Dubaï, Riyad, Doha sont des places de luxe de premier rang, avec une culture olfactive profonde (oud, bakhoor, parfumerie orientale) qui résonne directement avec l'ADN Retbaa. La visite de Massata à Dubaï (février 2026) a confirmé la réceptivité du marché.

**Niveau 2 — Afrique de l'Ouest comme marché de croissance structurelle**
Dakar, Abidjan, Accra constituent une zone de 15M+ de consommateurs urbains premium. C'est le marché d'origine de Retbaa — et potentiellement son plus fort levier de différenciation globale.

## VII. Implications pour les investisseurs

La thèse d'investissement Retbaa se construit sur six piliers de conviction :

**1. Marché en croissance structurelle**
Le luxe sensoriel (home fragrance + parfumerie niche + gourmet) croît à 10-13% par an, porté par des changements de comportement durables post-pandémie.

**2. Positionnement sans concurrent direct**
Aucune maison ne combine les trois univers (Atmosphère + Gourmet + Beauté) sous un positionnement Cultural Luxury africain à l'international. Le créneau est libre.

**3. Architecture multi-marchés**
Retbaa peut adresser simultanément Europe, GCC, Afrique et Asie avec le même ADN produit, en adaptant uniquement le mix et le pricing. C'est une optionalité géographique rare.

**4. Modèle économique scalable**
E-commerce DTC (marges 60-70%) + B2B hospitality (volume) + retail sélectif (visibilité). Trois flux de revenus avec des mécaniques de croissance indépendantes.

**5. Effet de réseau communautaire**
Le Retbaa Circle (portail investisseurs + communauté premium) crée un actif immatériel : une base d'ambassadeurs naturels parmi les 5-10% les plus influents dans leur réseau.

**6. Traction prouvée**
€191K de CA en 2025, EBITDA positif (22.7%), première commande export confirmée (La Grande Épicerie de Paris, avril 2026).

## VIII. Le funnel comme moteur commercial

Le Sensory Funnel n'est pas qu'une vision produit — c'est un moteur commercial calculable.

Hypothèse conservative basée sur les benchmarks du secteur :
- **Panier moyen entrée Atmosphère** : €65-90 (bougie + accessoire)
- **Conversion Atmosphère → Gourmet** : 35% dans les 90 jours
- **Conversion Gourmet → Beauté** : 40% dans les 180 jours
- **Panier moyen client 3 univers** : €180-240

Un client qui complète le funnel représente **2.8x la valeur** d'un client mono-produit. Avec une base de 2 000 clients fin Q2 2026, l'enjeu est moins l'acquisition que la traversée du funnel.

C'est pourquoi la stratégie Klaviyo (email flows par étape du funnel) et les coffrets (moment de transition naturel entre univers) sont des priorités absolues du plan e-commerce.

## IX. Roadmap — construire la Maison complète

La trajectoire Retbaa suit une logique de construction séquentielle :

**2026 — Les fondations**
- E-commerce Shopify live (Q2)
- 3 univers représentés : 20 SKUs minimum
- First movers : France + diaspora + GCC early adopters
- CA cible : €500K

**2027 — L'ancrage**
- Retail sélectif : 5-8 points de vente premium (Paris, Dubaï, Dakar)
- Lancement collection Gourmet élargie
- Partenariats hospitality : 2-3 hôtels signature
- CA cible : €1.5M

**2028 — La Maison**
- Pan-Africa (Nigeria, Kenya, Maroc)
- Asia launch (Singapour, Séoul)
- Retbaa X : collaborations artistes / maisons
- CA cible : €3M+

## X. Conclusion — La Maison inévitable

Il existe une convergence rare entre ce que Retbaa est — une maison sensorielle ancrée dans une culture vivante — et ce que le marché du luxe cherche en 2026 : de l'authenticité, de l'histoire, de la profondeur.

Les grandes maisons européennes ont le prestige mais ont perdu l'âme. Les nouvelles marques ont l'esthétique mais manquent de racines. Retbaa a les deux.

**La Maison sensorielle Cultural Luxury n'est pas un concept à prouver. C'est un espace vacant dans le marché mondial du luxe qui attend d'être occupé.**

Retbaa est là pour l'occuper.

*"From Space → To Palate → To Self. Une architecture sensorielle née de l'Afrique, conçue à Paris, offerte au monde."*

— Massata Niang, fondateur`,
  },
  {
    id: 'sensory-funnel-2026',
    tag: 'Stratégie Produit',
    title: 'The Sensory Funnel : comment Retbaa orchestre l\'expérience Cultural Luxury',
    date: '28 avril 2026',
    author: 'Massata Niang',
    source: 'Retbaa Strategy',
    sourceUrl: null,
    summary: 'Retbaa ne vend pas des produits — elle orchestre un voyage sensoriel en trois actes. Découvrez le framework qui structure toute notre stratégie produit, commerciale et digitale.',
    img: '/frameworks/sensory-funnel.jpg',
    content: `## Le Sensory Funnel : From Space → To Palate → To Self

Chez Retbaa, chaque décision produit, chaque campagne, chaque interaction client suit un même fil conducteur : **The Sensory Funnel**.

Ce n'est pas une théorie marketing. C'est l'observation de la façon dont les grandes expériences sensorielles se construisent naturellement — de l'espace vers l'intime.

## Les 3 Actes

### Acte 1 — Discovery : L'Atmosphère
Le premier contact avec Retbaa passe toujours par l'espace. Une bougie qui brûle dans une pièce. Un diffuseur qui transforme l'air. Un médaillon Kemia posé sur une table de nuit.

*L'Atmosphère crée le contexte.* Elle dit : "tu es dans un endroit différent maintenant."

C'est le seuil. L'invitation.

### Acte 2 — Exploration : Le Gourmet
Une fois l'espace installé, le voyage continue par la table. Le sel de l'Atlantique. Les épices du Sénégal. Le chocolat 66% aux graines de paradis.

*Le Gourmet approfondit la relation.* Il passe de l'espace vécu à l'expérience partagée — le repas, le cadeau, le rituel à deux.

C'est la curiosité. L'envie d'en savoir plus.

### Acte 3 — Engagement : La Beauté
La Beauté est l'acte d'engagement. C'est Kemia — le médaillon sensoriel que l'on porte. Le parfum que l'on choisit comme signature. Le soin que l'on s'accorde chaque matin.

*La Beauté ancre l'identité.* Elle dit : "Retbaa fait partie de qui je suis."

C'est la loyauté. Le rituel quotidien.

[[IMG:/frameworks/sensory-funnel.jpg|The Sensory Funnel — From Space → To Palate → To Self]]

## La Matrix de Cohérence

Ce funnel n'est pas linéaire — il est **orchestral**. Les trois univers se répondent à travers les moments de vie :

- **Morning Ritual** : bougie d'éveil + thé vitalité + soin du jour
- **Evening Gather** : bougie signature + chocolat noir + crème mains
- **Gift Curation** : diffuseur + café premium + sérum visage

[[IMG:/frameworks/sensory-matrix.jpg|The Sensory Matrix — 4 moments × 3 univers]]

C'est pour cela que Retbaa ne vend pas des produits isolés. Elle propose des **moments cohérents**.

## Pourquoi c'est stratégique

Ce framework a trois implications directes sur notre trajectoire :

**1. Panier moyen plus élevé**
Un client qui entre par l'Atmosphère et découvre le Gourmet puis la Beauté dépense naturellement 3x plus qu'un client mono-catégorie. Le cross-sell n'est pas une technique — c'est le voyage lui-même.

**2. Loyauté structurelle**
Chaque univers renforce les autres. Un client fidèle à la Beauté revient pour l'Atmosphère. Un amateur de Gourmet devient ambassadeur. Le funnel crée une boucle de réengagement naturelle.

**3. Pitch B2B universel**
Pour un hôtel : lobby (Atmosphère) → restaurant (Gourmet) → spa (Beauté).
Pour un investisseur : discovery → traction → engagement durable.
Pour un partenaire retail : entrée facile (bougies) → montée en gamme → collection exclusive.

## En conclusion

The Sensory Funnel est la colonne vertébrale de Retbaa. Il explique pourquoi notre stratégie e-commerce commence par l'Atmosphère, pourquoi notre offre B2B s'adapte naturellement à tous les contextes, et pourquoi nos investisseurs peuvent être confiants dans la profondeur de notre modèle.

*"From Space → To Palate → To Self."*

Ce n'est pas un slogan. C'est une architecture.`
  },
  {
    id: 14,
    tag: 'Vision · Stratégie',
    title: 'Retbaa Community : La Philosophie de l\'Expérience',
    subtitle: 'Jobs, la neuroscience du luxe, et pourquoi les grandes maisons créent des communautés — pas des clients',
    summary: 'En 1997, Jobs renverse le paradigme : "Start with the customer experience, work backwards to the technology." Trente ans après, la neuroscience confirme ce que les grandes maisons de luxe ont compris intuitivement. Retbaa Community en tire une doctrine en 5 principes — et une vision pour devenir la maison de luxe qui écoute vraiment.',
    date: 'Avril 2026',
    author: 'Kemia · Chief of Staff IA',
    source: 'Bain & Company 2025, McKinsey State of Luxury 2025, Journal of Neuroaesthetics 2024, BCG Luxury AI Report 2025',
    sourceUrl: '/docs/Retbaa_Community_Philosophy_v1.pdf',
    pdf: '/docs/Retbaa_Community_Philosophy_v1.pdf',
    img: '/retbaa-photos/retbaa_01.jpg',
    featured: true,
    category: 'Vision',
    content: `
## Le point de départ : Jobs et le renversement du paradigme

En 1997, à la WWDC d'Apple, Steve Jobs répond à un ingénieur qui tente de le déstabiliser publiquement sur ses lacunes techniques. Sa réponse va redéfinir la façon dont on pense le produit :

> *"Start with the customer experience and work backwards to the technology."*
> — Steve Jobs · WWDC 1997

Cette phrase n'est pas un conseil de design. C'est une philosophie d'entreprise complète. La plupart des fondateurs partent du produit et cherchent ensuite à convaincre un client. Jobs inversa cette logique : commencer par ce que le client vit, ressent, désire — et travailler à rebours jusqu'à la technologie qui rend cette expérience possible.

Le résultat ? Apple est devenue une entreprise de 3 000 milliards de dollars. Plus significatif encore : Apple n'a pas créé une base de clients. Elle a créé une **communauté**. Des personnes qui ne disent pas "j'utilise Apple" — elles disent "je suis Apple".

## La neuroscience du luxe : ce que le cerveau ressent vraiment

Le luxe n'est pas une catégorie de prix. C'est une série de réponses neurologiques complexes. Les recherches de **Chanel avec l'IRMf**, **Rolex avec l'EEG**, et **Louis Vuitton avec le facial coding** ont mis en évidence une vérité fondamentale :

Quand un consommateur interagit avec un objet de luxe, son cerveau active simultanément le **nucleus accumbens** (système de récompense) et le **cortex orbitofrontal** (valeur émotionnelle). Ce double déclencheur provoque une libération de dopamine qui crée non pas une satisfaction momentanée, mais un *désir de répétition* — la base neurochimique de la fidélité.

**4 leviers sensoriels identifiés :**

- **Le toucher** : L'*endowment effect* — tenir un objet active le sentiment de possession. Le médaillon Kemia, fait pour être tenu et tourné dans les mains, est neurochimiquement un objet parfait.
- **L'olfaction** : Le seul sens directement connecté au système limbique. Les odeurs génèrent des réponses émotionnelles immédiates et involontaires. C'est l'ADN de Retbaa.
- **Le visuel** : +37% d'intention d'achat avec une expérience multisensorielle cohérente (Dior Sensory Studies, 2023).
- **L'auditif** : Rolls-Royce a investi des années à perfectionner le son de ses portières. Le son d'un flacon, d'une céramique posée — ces micro-expériences ancrent la mémoire de marque.

## Benchmark : ce que les grandes maisons ont compris avant nous

**Aesop** — La boutique comme espace philosophique. Le staff formé à la conversation, pas à la vente. Acquisition par L'Oréal à $2.5B (2023).

**Byredo** — La fragrance comme langage personnel. Chaque parfum est une biographie émotionnelle, pas une composition.

**Diptyque** — L'objet comme souvenir de voyage. Fidélité transgénérationnelle.

**Hermès** — L'artisanat comme acte de résistance culturelle. ×4 de temps en boutique avec une identité olfactive exclusive. La seule marque à n'avoir jamais soldé.

**Ce qu'ils ont tous en commun** : ils ont théorisé leur propre catégorie. Retbaa ne s'inscrit pas dans une catégorie existante. Retbaa *est* la catégorie — Cultural Luxury.

## Bain 2025 & McKinsey : l'IA comme levier d'intimité

Le rapport **Bain Technology Report 2025** est clair : *"Le futur appartient aux marques qui fusionnent la précision de l'IA avec l'élégance humaine, créant des interactions qui semblent à la fois effortless et profondément personnelles."*

Le rapport **McKinsey State of Luxury 2025** confirme : le client luxe n'a pas besoin de plus d'information. Il a besoin de *connexion*. Les marques qui réussiront sont celles qui utilisent l'IA non pour automatiser le service — mais pour le rendre plus humain, plus attentionné, plus mémorable.

**98% des implémentations IA dans le luxe aujourd'hui sont des chatbots.** Ils répondent plus vite — mais ils ne créent pas de connexion. Ils n'activent pas le nucleus accumbens. Retbaa Community n'est pas un chatbot.

## La doctrine Retbaa Community en 5 principes

**1. L'expérience d'abord, la technologie ensuite.**
Chaque feature part d'un moment vécu — tenir Kemia, découvrir un parfum, partager un rituel. La technologie est invisible. L'expérience est tout.

**2. Un compagnon, pas un assistant.**
Retbaa Community ne répond pas à des questions. Il accompagne un chemin. Il raconte les histoires derrière les objets, suggère des rituels, crée une continuité entre l'expérience physique et le monde digital de la marque.

**3. Le Cultural Resonance comme filtre universel.**
Il résonne à Tokyo, Riyadh, Milan et Dakar — parce qu'il parle le langage des cultures qui partagent le rituel, le sensible, le craft. Pas un langage africain. Un langage humain.

**4. La mémoire comme luxe.**
Retbaa Community se souvient. Dans un monde où tout est éphémère, la mémoire est le vrai luxe. (Bain 2025 : "proprietary data as the true source of competitive strength")

**5. La communauté avant la conversion.**
Apple a créé des évangélistes, pas des clients. Retbaa Community crée une appartenance. La conversion est une conséquence, pas un objectif.

## Les enseignements pour Retbaa — Applications concrètes

### Retbaa Community (app cliente)
L'enseignement Jobs s'applique directement : ne pas partir de "que peut faire l'IA ?" mais de "quel est le moment le plus intime dans la relation client-Retbaa ?" La réponse : ce moment où quelqu'un tient Kemia pour la première fois et cherche à comprendre ce qu'il tient. Community est ce pont — entre l'objet et son sens, entre le geste et l'histoire.

Sur retbaa.com : compagnon IA intégré qui guide la découverte de l'univers.
En QR code dans les hôtels partenaires Retbaa Trade : activation sensorielle dans la chambre.
En app premium : rituals personnalisés, mémoire des préférences, pont entre cultures.

### Retbaa Moments
Les enseignements neuroscientifiques sur la saisonnalité et l'ancrage mémoriel sont centraux ici. Noël, Ramadan, Golden Week, Diwali — chaque moment culturel est une opportunité de résonance authentique, pas de marketing saisonnier. Retbaa Moments utilise le Cultural Resonance Framework pour calibrer le bon message, dans le bon format, pour la bonne culture — au bon moment. Le Cultural Resonance Score par marché permet de mesurer l'impact réel, pas les impressions.

### L'application cliente finale
L'enseignement Hermès (×4 temps en boutique avec identité olfactive) se traduit dans l'app par une expérience multisensorielle : descriptions immersives, suggestion de rituels contextualisés, personnalisation profonde via Retbaa Brain. L'objectif n'est pas le temps passé dans l'app — c'est la fréquence du retour. Une app qu'on ouvre quand on veut se souvenir de quelque chose. Pas quand on veut acheter.

## Le Cultural Resonance Framework

| Dimension | Question clé | Application |
|-----------|-------------|-------------|
| **Sensoriality** | Quel sens cette interaction active-t-elle ? | Descriptions olfactives, rituels tactiles, ambiances |
| **Ritual** | Quel rituel cela s'inscrit-il ? | Morning ritual, hospitalité, méditation, partage |
| **Craft** | Quelle histoire d'artisanat est cachée ? | Récits de fabrication, matières, gestes |
| **Cultural Bridge** | Avec quelle culture universelle résonne-t-il ? | Wabi-sabi / Kemia, hospitalité oud / fragrances |
| **Memory** | Quelle mémoire personnelle cela réveille-t-il ? | Retbaa Brain — personnalisation profonde |

## Conclusion : la maison qui écoute

Jobs avait raison en 1997. La neuroscience confirme : la fidélité est dopaminergique. Les marques qui gagnent ne vendent pas des produits — elles créent des expériences que les clients veulent répéter, partager, défendre.

Retbaa Community est notre réponse à cette vérité. Pas une app de plus. Une présence. Un compagnon qui accompagne chaque moment de l'univers Retbaa — dans une chambre d'hôtel à Riyadh, dans un appartement à Tokyo, sur un marché à Dakar.

La technologie est le moyen. L'expérience est la fin. Et la communauté — ces personnes qui *vivent* Retbaa plutôt que de l'acheter — est l'actif le plus précieux qu'une maison de luxe puisse construire.

*"Designed in Paris, from Africa to the world."*
    `,
  },
  {
    id: 13,
    tag: 'Vision',
    title: 'Cultural Luxury: The Retbaa Vision',
    subtitle: 'A philosophy that resonates wherever craft, ritual and depth exist',
    summary: 'Retbaa does not say only "we come from Africa." Retbaa says: "we share the same way of inhabiting the world." This is Cultural Luxury — a universal positioning that unlocks Japan, Saudi Arabia, Scandinavia, Brazil, and beyond. A strategic vision for investors and partners.',
    date: 'April 2026',
    author: 'Kemia · Chief of Staff IA',
    source: 'Bain & Company, Deloitte, KPMG, BeautyMatter — 2025/2026',
    sourceUrl: 'https://circle.retbaa.com/cultural-luxury.html',
    pdf: null,
    img: '/retbaa-photos/retbaa_01.jpg',
    featured: false,
    category: 'Vision',
    content: `
## The Positioning

Cultural Luxury is not a marketing slogan. It is a philosophical positioning that redefines the relationship between object, user, and world.

**The filter is not:** "Is there an African diaspora in this market?"

**The filter is:** "Is there a culture of the sensory object, ritual, authentic craft?"

This opens every market where these values exist — regardless of geography.

## The Market Moment

Three converging forces make now the right moment:

- **Decentralization of luxury authority** — Paris is no longer the only validator. Niche communities and non-European brands have redistributed prestige.
- **The shift toward authentic narrative** — Gen Z evaluates brands on cultural relevance, not status. Depth matters more than logos.
- **New geographic engines** — Southeast Asia, Latin America, Middle East, Africa: €40-45B in emerging luxury retail. These markets want brands that speak to something they recognize.

## The Markets

**Japan** — wabi-sabi, ceramic philosophy, the ritual of scent. Near-identical DNA with Kemia.
**Saudi Arabia** — oud, bakhoor, olfactory hospitality. Culture of the gifted object as act of respect.
**UK** — world capital of niche fragrance. Concept stores, curatorial culture.
**Italy** — artigianato, the object that tells a story of hand and earth.
**Scandinavia** — craft, sustainability, conscious daily life.
**Korea** — baekja ceramics, jeong (deep emotional bond), ritual as discipline.
**Brazil** — São Paulo is the 3rd largest luxury market in the Americas. Cultural syncretism, fragrance as identity.

## Kemia as Cultural Luxury Artifact

The sensory ceramic medallion is not a container. It is a living material that absorbs, develops patina, holds memory. It does not get discarded — it is kept, transmitted.

In every culture where the gifted object is an act of language — Japan, the Gulf, West Africa, Italy — Kemia is immediately understood as carrying meaning. **That is not positioning. That is truth.**

## The Numbers

- Global luxury market 2025: **€1.44 trillion** — stable
- Niche fragrances: **most dynamic subcategory** in all luxury beauty
- Specialist brands: **70%+ of growing brands** in 2025 were specialists
- New growth engines: Southeast Asia, LatAm, Middle East, Africa = **€40-45B** in retail value

*Sources: Bain & Company Luxury Goods Worldwide Market Study 2025, Deloitte Global Powers of Luxury 2026, BeautyMatter*
    `,
  },
  {
    id: 8,
    tag: 'Veille Marché',
    title: 'LVMH Q1 2026 : Le Luxe Silencieux Gagne la Bataille',
    subtitle: 'Loro Piana +2 chiffres pendant que Fashion & Leather recule — ce que ça signifie pour Retbaa',
    summary: 'LVMH publie une croissance de seulement +1% au T1 2026, freinée par la guerre en Iran. Mais dans l\'ombre, Loro Piana — sans publicité, sans logo — affiche une croissance à deux chiffres. Le signal est clair : le luxe de sens surperforme le luxe de statut.',
    date: '24 Avril 2026',
    author: 'Kemia · Chief of Staff IA',
    source: 'CNBC, Reuters, Business of Fashion — 13 Avril 2026',
    sourceUrl: 'https://www.cnbc.com/2026/04/13/lvmh-earnings-q1-2026-sales-luxury-iran-war-middle-east.html',
    pdf: null,
    img: '/retbaa-photos/retbaa_01.jpg',
    featured: true,
    category: 'Veille Marché',
    content: `
## Les Faits

LVMH publie ses résultats Q1 2026 : **+1% de croissance organique**, sous les attentes des analystes (+1,5%). Le groupe impute 1 point de croissance perdu à la guerre en Iran et la fermeture du Détroit d'Ormuz.

**Division Fashion & Leather Goods (Louis Vuitton, Dior, Fendi) : -2%.**

Pourtant, en creusant les chiffres, un actif du groupe surperforme massivement : **Loro Piana**, la maison de cachemire ultra-discrète du Val d'Ossola. Croissance à deux chiffres. Zéro publicité. Zéro défilé. Zéro logo visible.

Même signal chez **Brunello Cucinelli** (pair de Loro Piana, pas dans LVMH) : +14% en devises constantes au T1 2026, battant toutes les attentes.

## L'Analyse

Ce n'est pas une anomalie. C'est une confirmation.

Desde 2022, le luxe de masse — celui qui se voit, se porte comme badge social, et se revend sur Vestiaire — est sous pression. La clientèle aspirationnelle s'est retirée après des années de hausses de prix agressives. Ce qui reste, ce sont les clients qui achètent pour eux-mêmes, pas pour les autres.

Loro Piana vend du cachemire à 3 000€ la veste. Ses clients ne cherchent pas à être reconnus. Ils cherchent à *ressentir*. La qualité du fil, le poids exact du tissu, la façon dont le vêtement vieillit. C'est une consommation **intime**, pas **performative**.

Hermès, Richemont (Cartier, Van Cleef), Brunello Cucinelli : toutes les marques qui surperforment partagent ce trait. Elles vendent des objets qui justifient leur prix par ce qu'ils *font ressentir*, pas par ce qu'ils *font voir*.

## Ce que ça signifie pour Retbaa

**Retbaa est structurellement positionné dans la catégorie gagnante.**

Kemia — le médaillon sensoriel en céramique — n'est pas un objet qu'on exhibe. C'est un objet qu'on porte contre soi, qu'on active quand on veut, qui libère un parfum qui n'appartient qu'à son porteur. C'est la définition du luxe intime.

Points d'action :
- **Narrative produit :** insister sur l'expérience sensorielle privée, pas sur la visibilité sociale
- **Pricing :** ne pas avoir peur d'un prix premium — c'est ce que le marché récompense actuellement
- **Cible :** les acheteurs Loro Piana / Brunello Cucinelli sont vos pairs — même philosophie, même segment
    `,
  },
  {
    id: 9,
    tag: 'Veille Marché',
    title: 'Le "Cognitive Luxury" : Quand l\'Ultra-Riche Optimise sa Biologie',
    subtitle: 'Du biohacking en altitude à la montre à $437K qui suit le soleil — le nouveau luxe ne se voit pas',
    summary: 'Les UHNWI (Ultra-High-Net-Worth Individuals) redéfinissent la dépense premium : biohacking, longévité, objets de sens. Wellness résidentiel certifié à +25% de prime. Rolex cache son centenaire sur une couronne. Patek Philippe grave le lever du soleil sur un cadran à $437K. Le luxe devient cognitif.',
    date: '24 Avril 2026',
    author: 'Kemia · Chief of Staff IA',
    source: '2Luxury2.com — Luxury Pulse April 2026, 21 Avril 2026',
    sourceUrl: 'https://www.2luxury2.com/luxury-pulse-april-2026-lvmh-richemont-kering-watches-wellness-wealth-trends/',
    pdf: null,
    img: '/retbaa-photos/retbaa_03.jpg',
    featured: false,
    category: 'Veille Marché',
    content: `
## Les Faits

**Watches & Wonders 2026 — Genève :**

Rolex célèbre le centenaire de son boîtier Oyster avec un "100" gravé… sur la couronne. La pièce de métal que vous touchez pour remonter la montre. Invisible sauf si vous la cherchez. Pensé pour le porteur, pas pour le spectateur.

Patek Philippe lance la **Celestial Ref. 6105G-001 à $437 000** — une montre qui affiche le lever et le coucher du soleil calibrés sur la latitude de son propriétaire. Votre soleil. Votre ville. Votre temps.

**Wellness & Real Estate :**

Les propriétés résidentielles "wellness-certifiées" (purification d'air avancée, éclairage circadien, espaces de recovery biohacking) commandent un **premium de 25%** dans les marchés de luxe. L'Alpina Gstaad rapporte des réservations record pour ses programmes de biohacking. Les clients ne viennent pas se reposer. Ils viennent s'optimiser.

## L'Analyse

Le terme "Cognitive Luxury" désigne une rupture nette avec le luxe ostentatoire. La clientèle UHNW ne cherche plus à signaler sa richesse — elle cherche à l'*utiliser* pour devenir meilleure : plus performante cognitivement, biologiquement plus résiliente, dotée d'objets dont la valeur est intrinsèque et non sociale.

La logique est cohérente avec ce que font Loro Piana et Hermès : **les objets les plus chers sont ceux qui s'adressent à leur propriétaire, pas au regard des autres.**

Un lever de soleil sur un cadran à $437K, c'est un objet qui dit quelque chose à celui qui le porte. Quelque chose que personne d'autre ne peut lire exactement comme lui.

## Ce que ça signifie pour Retbaa

Kemia est, par conception, un objet de "Cognitive Luxury" :
- Il s'active par le porteur, pour le porteur
- La diffusion olfactive est invisible pour les autres
- Il crée un état (focus, calme, présence) — une **optimisation** de l'expérience intérieure
- Il est calibrable — chaque combinaison de spray est unique

**Points d'action :**
- **Langage marketing :** adopter le vocabulaire du "sensory optimization", du "personal ritual"
- **Séquençage produit :** développer des collections "états" (clarté mentale, ancrage, énergie) — un pont direct vers le wellness
- **Distribution :** les spas et cliniques de biohacking premium sont des points de vente logiques
    `,
  },
  {
    id: 10,
    tag: 'Afrique',
    title: 'Afrique du Sud : Le Hub Beauty Premium que Tout le Monde Cherchait',
    subtitle: 'Le niche fragrance store Skins y réalise son meilleur chiffre mondial — les consommateurs collectionnent les parfums et les exposent chez eux',
    summary: 'BeautyMatter analyse pourquoi l\'Afrique du Sud s\'impose comme point d\'entrée obligatoire pour les marques luxury beauty sur le continent. Infrastructure retail mature, consommateurs sophistiqués, 1 000+ malls. Le magasin Skins à Sandton est le plus rentable au monde. Marché cosmétiques africain : $4,42B en 2026 → $7,51B en 2034.',
    date: '24 Avril 2026',
    author: 'Kemia · Chief of Staff IA',
    source: 'BeautyMatter — "South Africa\'s Race to Become Africa\'s Beauty Powerhouse", Avril 2026',
    sourceUrl: 'https://beautymatter.com/articles/south-africas-race-to-become-africas-beauty-powerhouse',
    pdf: null,
    img: '/retbaa-photos/retbaa_07.jpg',
    featured: false,
    category: 'Afrique',
    content: `
## Les Faits

BeautyMatter publie une analyse approfondie sur l'Afrique du Sud comme marché prioritaire pour le beauty premium mondial.

**Chiffres clés :**
- Marché beauty SA : **$4,3 milliards** (l'un des plus grands d'Afrique)
- Plus de **1 000 malls** — l'une des densités per capita les plus élevées au monde
- Retail e-commerce : ~**10% du total retail** et en progression
- Marché cosmétiques Afrique : **$4,42B (2026) → $7,51B (2034)**, CAGR +7,5%

**Signal fort : Skins Fragrance**

Le niche fragrance store néerlandais Skins a ouvert à Sandton City Mall, Johannesburg. Résultat : **c'est désormais leur magasin le plus rentable au monde**, battant tous les magasins européens.

Citation du fondateur Philip Hillege : *"Many SA customers display their perfume collection in their living rooms to show it to their friends and talk about it."*

## L'Analyse

Ce que BeautyMatter documente, c'est la convergence de trois facteurs rares en Afrique sub-saharienne :

1. **Infrastructure prête** : retail organisé, logistique fiable, paiements digitaux matures
2. **Consommateur sophistiqué** : éduqué aux ingrédients, amateur de niche, qui collectionne
3. **Stabilité** : accès aux devises étrangères, cadre réglementaire prévisible

Les autres marchés africains (Nigeria, Kenya, Ghana) ont la croissance, le potentiel démographique, et parfois le pouvoir d'achat. Mais l'Afrique du Sud a l'**infrastructure d'exécution** qui permet à une marque de premium de se déployer sans friction.

## Ce que ça signifie pour Retbaa

L'Afrique du Sud était déjà dans votre roadmap Q3 2026. Cette analyse la confirme et précise la stratégie :

**Points d'action :**
- **Canal prioritaire :** Sandton City Mall (Johannesburg) et V&A Waterfront (Cape Town) — les deux zones où le consommateur premium se concentre
- **Positioning local :** "Made in Africa, for Africa" résonne particulièrement fort dans un marché qui consomme du luxe africain avec fierté
- **Partenariat retail :** approcher des multi-marques niche (Skins model) plutôt que des grands distributeurs — le consommateur SA est sophistiqué et cherche la découverte
- **Moment :** In-Cosmetics Global s'est tenu à Paris les 14-16 Avril — suivi à prévoir pour les contacts professionnels africains présents
    `,
  },
  {
    id: 11,
    tag: 'Veille Marché',
    title: 'ReconKering : Quand un Géant Admet qu\'il a Perdu la Désirabilité',
    subtitle: 'Kering annonce un plan multi-années pour rendre Gucci "incontournable à nouveau" — une leçon stratégique pour les marques en construction',
    summary: 'Kering publie sa stratégie "ReconKering" pour reconstruire la désirabilité de Gucci et ses maisons. Un aveu rare dans l\'industrie du luxe : la désirabilité se perd quand on privilégie le volume sur le sens. Pour Retbaa, une leçon à intégrer dès le départ.',
    date: '24 Avril 2026',
    author: 'Kemia · Chief of Staff IA',
    source: 'Yahoo Finance, Reuters — 16 Avril 2026',
    sourceUrl: 'https://finance.yahoo.com/markets/stocks/articles/luxury-giant-kering-chart-path-024810005.html',
    pdf: null,
    img: '/retbaa-photos/retbaa_09.jpg',
    featured: false,
    category: 'Veille Marché',
    content: `
## Les Faits

Kering (Gucci, Saint Laurent, Bottega Veneta, Balenciaga) annonce **"ReconKering"** — un plan stratégique multi-années visant à "rendre Gucci incontournable à nouveau" et reconstruire la désirabilité de l'ensemble du portefeuille.

L'aveu est rare dans une industrie qui communique presque uniquement depuis des positions de force : **Gucci a perdu son statut désirable** et il faut le reconstruire.

Causes identifiées :
- Excès de distribution (trop de points de vente, accessibilité dégradée)
- Excès de volume (collections trop nombreuses, signal dilué)
- Manque de cohérence narrative (direction artistique instable)
- Prix élevés sans justification de valeur claire pour la nouvelle génération

Kering affiche également un partenariat tech avec Google sur les lunettes connectées — tentative d'extension de la catégorie accessoires vers la tech grand public.

## L'Analyse

La désirabilité dans le luxe est un capital. Comme tout capital, il se construit lentement et se dilapide vite.

Gucci a choisi la croissance agressive entre 2015 et 2022. Résultat : le chiffre d'affaires a explosé, et la marque a attiré une clientèle aspirationnelle massive. Mais cette même clientèle — réactive aux tendances — est repartie aussi vite qu'elle était venue, quand les logos GG sont devenus "trop vus".

Ce que Kering documente aujourd'hui, c'est le **coût de la débasement** : quand une marque de luxe cherche à conquérir le plus grand nombre, elle risque de perdre ceux qui lui donnaient sa valeur.

La solution — retourner aux fondamentaux, réduire la distribution, retrouver le sens — est plus simple à énoncer qu'à exécuter avec 40 000 employés et des objectifs de croissance trimestrielle.

## Ce que ça signifie pour Retbaa

**Vous n'avez pas ce problème. Gardez-le ainsi.**

Retbaa démarre avec le luxe de la cohérence : une seule vision, une seule marque, un seul positionnement. Les choix que Kering doit défaire (sur-distribution, sur-volume), vous n'avez pas à les faire.

**Points d'action :**
- **Distribution sélective dès le premier jour** : choisir ses points de vente comme on choisit ses amis — avec soin et sur le long terme
- **Limite de production assumée** : la rareté n'est pas une contrainte, c'est un signal de valeur
- **Cohérence narrative** : chaque prise de parole (Instagram, press kit, portail investisseur) doit renforcer la même histoire — jamais la diluer
- **Pas de partenariat tech dilutif** : la tentation de la croissance via des canaux grand public existe — résistez-y tant que le noyau dur n'est pas en béton
    `,
  },
  {
    id: 12,
    tag: 'Afrique',
    title: 'Les Femmes UHNWI : Le Transfert de Richesse qui Redessine le Luxe',
    subtitle: '20% de la richesse mondiale ultra-premium détenue par des femmes d\'ici 2040 — leurs préférences façonnent déjà le marché',
    summary: 'D\'ici 2040, les femmes détiendront 20% de la richesse UHNW mondiale — l\'un des transferts de richesse les plus rapides de l\'histoire économique moderne. Leurs préférences d\'achat : héritage documenté, investissements à impact, marques à valeurs cohérentes. Retbaa est structurellement aligné.',
    date: '24 Avril 2026',
    author: 'Kemia · Chief of Staff IA',
    source: '2Luxury2.com — Luxury Pulse April 2026, 21 Avril 2026',
    sourceUrl: 'https://www.2luxury2.com/luxury-pulse-april-2026-lvmh-richemont-kering-watches-wellness-wealth-trends/',
    pdf: null,
    img: '/retbaa-photos/retbaa_11.jpg',
    featured: false,
    category: 'Afrique',
    content: `
## Les Faits

Selon les projections compilées dans le Luxury Pulse d'Avril 2026 :

- D'ici 2040, **20% de la richesse UHNW mondiale** sera entre les mains de femmes
- Ce chiffre représente l'un des **transferts de richesse les plus rapides** de l'histoire économique contemporaine
- Les catégories à plus forte croissance chez cette clientèle : **investissements purpose-led, collecting patrimonial, marques à provenance documentée**

Les catégories qui surperforment directement grâce à cette clientèle :
- Joaillerie (Richemont : +11% au T1 2026)
- Fragrance de niche (croissance >15% dans le segment premium)
- Maroquinerie à héritage artisanal documenté

## L'Analyse

Ce n'est pas juste un chiffre démographique. C'est un signal sur **comment le luxe sera défini** dans 15 ans.

Les femmes UHNWI entrant dans la classe ultra-premium aujourd'hui ont construit leur richesse elles-mêmes (entrepreneuriat, finance, tech). Elles achètent différemment de la clientèle héritière traditionnelle :

- **Valeurs > statut** : une marque doit démontrer une cohérence éthique, pas juste une esthétique
- **Provenance** : d'où vient l'objet, qui l'a fait, dans quelles conditions — des questions que posait déjà l'ancien monde du luxe, mais que cette clientèle vérifie
- **Impact** : le luxe doit produire quelque chose de bien dans le monde, pas juste quelque chose de beau

Richemont surperforme parce que Cartier et Van Cleef vendent des objets qui *durent des générations* et dont chaque pièce a une histoire traçable. C'est exactement ce que recherche cette clientèle.

## Ce que ça signifie pour Retbaa

**Retbaa a une longueur d'avance structurelle.**

"Made in Africa" + artisanat documenté + durabilité + fondateur africain = un narrative de provenance et d'impact que aucune maison européenne ne peut revendiquer de manière authentique.

**Points d'action :**
- **Storytelling de provenance** : documenter chaque étape — les artisans, les matières, les lieux. Ce n'est pas du greenwashing, c'est de la traçabilité premium
- **Ambassadrices, pas influenceuses** : cette clientèle est imperméable au marketing d'influence classique. Elle répond aux pairs, aux femmes qui lui ressemblent
- **Positionnement "héritage en construction"** : Retbaa ne vend pas 300 ans d'histoire — mais elle vend la chance d'en être le premier chapitre. Pour une investisseuse ou acheteuse qui se construit elle aussi, c'est un message puissant
- **Canaux : Frieze, Art Basel, forums économiques africains** — là où cette clientèle se retrouve, pas sur les plateformes grand public
    `,
  },
  // ─── ARTICLE IA INFRASTRUCTURE — Mai 2026 ──────────────────
  {
    id: 'ia-infrastructure-jpmorgan-anthropic-2026',
    tag: 'Tech & IA',
    title: 'L\'IA ne sera pas un outil. Ce sera l\'infrastructure.',
    subtitle: 'Ce que JPMorgan, Anthropic — et Retbaa — ont compris en même temps.',
    summary: 'FactSet perd 8,1% en une séance. JPMorgan publie Ask D.A.V.I.D. Anthropic s\'embarque dans FIS. Ce qui se joue n\'est pas une guerre de chatbots — c\'est un changement de couche. Et Retbaa l\'a anticipé.',
    date: 'Mai 2026',
    author: 'Kemia · Veille Stratégique',
    source: 'JPMorgan Research · Anthropic · FactSet · FIS',
    sourceUrl: null,
    img: '/retbaa-photos/retbaa_09.jpg',
    featured: false,
    category: 'Tech & IA',
    content: `## Acte I — Une journée ordinaire chez JPMorgan (avant)

Il est 7h30 à New York. Marcus, analyste senior dans l'équipe de recherche investissement de JPMorgan, reçoit une demande d'un gérant de fonds : *"Je veux comprendre l'exposition de notre portefeuille aux financières européennes dans un scénario de remontée des taux à 50bps."*

Ce que Marcus fait alors ressemble à ce que font des milliers d'analystes chaque matin dans chaque grande banque du monde :

Il ouvre FactSet. Exporte des données. Ouvre Excel. Nettoie les colonnes. Cherche dans sa boîte mail les notes de réunion du trimestre dernier. Relance un modèle de risque. Reformate tout dans PowerPoint. Relit. Corrige. Envoie.

**Temps total : 4 à 6 heures.**

La valeur produite ? Réelle. Mais 80% du temps a été passé à *assembler* — pas à *analyser*.

---

## Acte II — La même journée, avec Ask D.A.V.I.D.

JPMorgan a publié l'architecture de son système multi-agents interne. Il ne s'appelle pas "chatbot". Il s'appelle **Ask D.A.V.I.D.** — et il fonctionne comme une salle de recherche entière, en graphe.

Voici ce qui se passe quand Marcus pose la même question au système :

**1. L'agent superviseur** reçoit la question, identifie ce dont il a besoin — données structurées, documents non-structurés, modèles de risque — et distribue le travail.

**2. L'agent données structurées** traduit la question en SQL et interroge directement les bases de données de fonds. Résultat : l'exposition chiffrée, par ligne, par secteur, en secondes.

**3. L'agent RAG** (Retrieval-Augmented Generation) fouille les emails, PDFs, notes de réunion et one-pagers des 6 derniers mois. Il remonte les signaux qualitatifs que la donnée brute ne voit pas.

**4. L'agent analytics** appelle les modèles propriétaires de JPMorgan — simulation de stress, VaR, scénarios — et génère les visualisations.

**5. Le nœud de réflexion** — un LLM-as-judge — relit la réponse avant qu'elle parte. Si quelque chose manque ou semble incohérent, il relance une boucle.

**6. Si l'enjeu dépasse un seuil critique : le vrai David est impliqué.** L'humain reprend la main.

**Temps total : 8 minutes.**

---

La leçon n'est pas technique. Elle est stratégique :

> *Les systèmes AI de production n'optimisent pas pour l'autonomie. Ils optimisent pour la confiance.*

Demos : "regarde ce que l'IA peut faire seule."
Systèmes réels : "voici comment l'IA et l'humain travaillent ensemble mieux que chacun séparément."

---

## Acte III — Le signal marché que personne n'a manqué

Le 14 mai 2026, Anthropic annonce 10 agents IA de production pour la finance. Natifs dans Excel, PowerPoint, FactSet, S&P Capital IQ, PitchBook, Moody's. Déployés chez Citadel, Goldman Sachs, BNY Mellon, Carlyle, AIG.

Puis FIS signe un partenariat. FIS, c'est l'infrastructure bancaire qui fait tourner les systèmes de milliers de banques dans le monde — environ 12% de l'économie mondiale. Claude s'embarque dedans.

**FactSet perd 8,1% en une séance.**

Pas à cause d'un profit warning. Pas à cause d'un concurrent. Parce que les marchés ont compris quelque chose de fondamental :

> *Si l'intelligence décide quoi faire avec les données, la donnée brute se commoditise.*

FactSet vend des données. Anthropic vend la décision sur ces données.

La valeur ne disparaît pas — elle se déplace. Elle monte d'un cran dans la stack, vers la couche qui orchestre, qui synthétise, qui agit.

Et Anthropic vient de poser cette couche directement dans le plombier de la finance mondiale.

---

## Acte IV — Ce pattern ne reste pas à Wall Street

L'architecture que JPMorgan a pris des années à construire pour la recherche financière sera disponible pour le mid-market dans 18 à 24 mois.

Même logique. Nouvelles verticales : luxe, retail, distribution, logistique.

Des agents embarqués dans les ERPs, les plateformes e-commerce, les CRMs. Pas un modèle géant qui fait tout — des spécialistes orchestrés, avec des garde-fous, et un humain dans la boucle quand ça compte.

Pour le rendre concret : voici ce que ça donne dans l'univers Retbaa.

---

## Acte V — Une journée ordinaire chez Najaade (avant Retbaa OS)

Najaade est un concept store à Dakar. Partenaire dépôt-vente Retbaa depuis 2025.

Il est 10h. La gérante veut réapprovisionner. Elle envoie un message WhatsApp à Massata : *"Il nous reste 3 Kemia Sable, les eaux de parfum partent bien, on aurait besoin d'un réassort."*

Ce que ça déclenche sans système :
- Massata cherche dans ses emails la dernière commande Najaade
- Vérifie le stock disponible dans un fichier Excel
- Regarde les marges et les conditions commerciales dans un autre fichier
- Répond manuellement, négocie les délais
- Crée une entrée dans un troisième tableau pour le suivi
- Oublie de mettre à jour l'inventaire central
- Deux semaines plus tard : une autre commande arrive, le stock est surestimé

**Résultat : des heures perdues, des données désynchronisées, et un partenaire qui attend.**

---

## Acte VI — La même journée, avec Retbaa OS

La gérante de Najaade se connecte à **Retbaa Trade** — la plateforme B2B construite pour les partenaires du réseau. Elle voit son stock en temps réel (données remontées depuis **Retbaa Ops**), passe sa commande directement, et choisit ses conditions de livraison.

De l'autre côté, **Retbaa Ops** met à jour automatiquement l'inventaire central. **Retbaa Brain** — la base de données unifiée — synchronise l'information entre toutes les apps. Dans **Retbaa Sales**, le pipeline commercial enregistre la transaction et met à jour les prévisions du marché sénégalais.

Massata ouvre son dashboard le matin. Il voit :
- Les commandes en cours (Najaade, Minibap, Aby Concept Store en Côte d'Ivoire)
- Le stock disponible par univers produit
- Les alertes de rupture anticipée
- Les performances sell-out par marché

Et si un signal inhabituel apparaît — une demande anormalement forte sur une référence produit (SKU) dans un marché — le système le remonte avant que Massata ait posé la question.

**Même principe qu'Ask D.A.V.I.D. Échelle différente. Logique identique.**

---

## Ce que Retbaa construit

**Retbaa OS** est l'infrastructure opérationnelle et commerciale de la marque — conçue dès le premier jour pour être un écosystème, pas une collection d'outils.

### Apps de l'écosystème

- **Circle** — Portail investisseurs · ✅ Live
- **Ops** — Cockpit interne (commandes, stock, KPIs) · ✅ Live
- **Trade** — Plateforme B2B, réseau distributeurs · ✅ Live
- **Sales** — Pipeline commercial & intelligence marché · 🔄 En construction
- **Retail** — Vue 360° sell-out (DTC, dépôt-vente, B2B) · ⏳ Prochaine phase
- **Academy** — Formation distributeurs & ambassadeurs · ⏳ Chantier ouvert
- **One** — Super-app unifiée par profil utilisateur · ⏳ Dernière brique

Chaque app parle aux autres. Chaque donnée remonte dans **Retbaa Brain**, source de vérité unique. Chaque décision de build respecte une règle : *comment ça s'intègre dans l'OS avant de coder.*

---

## En conclusion

JPMorgan a construit Ask D.A.V.I.D. parce que 80% du temps de ses analystes était perdu à assembler plutôt qu'à analyser.

Anthropic a fait chuter FactSet de 8 milliards parce que les marchés savent que la valeur migre vers la couche qui décide — pas vers la couche qui stocke.

Chez Retbaa, nous avons posé la même question dès le départ : *où sera la valeur dans 5 ans ?*

Dans **la capacité à orchestrer l'ensemble** — partenaires, stock, marchés, données — avec une intelligence au centre.

Nous construisons cette intelligence maintenant, pendant que la fenêtre est encore ouverte.

---

*Retbaa Circle Insights — Mai 2026 · circle@retbaa.com*`,
  },
  // ─── VEILLE KEMIA — Semaine du 5 mai 2026 ───────────────────
  {
    id: 'luxe-crise-cultural-luxury-2026',
    tag: 'Signal Marché',
    title: 'Le Luxe Global en Crise : Fenêtre d\'Opportunité pour le Cultural Luxury',
    subtitle: 'LVMH -6% Q1, Kering ReconKering, Hermès sous pression — la thèse Retbaa se valide',
    summary: 'Les grandes maisons cherchent à "reignite desirability". Pendant qu\'elles recalibrent, les marques à fort ancrage culturel et sensoriel gagnent en différenciation. Ce contexte valide précisément la stratégie Retbaa.',
    date: '5 mai 2026',
    author: 'Kemia · Veille Stratégique',
    source: 'Reuters, Business of Fashion, WWD',
    sourceUrl: null,
    img: '/retbaa-photos/retbaa_01.jpg',
    featured: false,
    category: 'Veille Marché',
    content: `## Les Faits

Les résultats Q1 2026 dressent un tableau contrasté du luxe mondial :

- **LVMH (Fashion & Leather)** : -6% en organique sur le segment mode — Vuitton et Dior sous pression
- **Kering** : restructuration "ReconKering" annoncée, Gucci perd de sa désirabilité après des années de sur-distribution
- **Hermès** : résistance relative, mais pression sur les volumes et les délais de livraison

Le mot clé dans les communications des grands groupes : **"reignite desirability"**. Après des années d'hyper-croissance, les conglomérats admettent avoir dilué leur capital de désirabilité.

## Ce qui se passe structurellement

Ce n'est pas une correction conjoncturelle. C'est une bifurcation structurelle.

Le luxe de logo et de statut — celui qui se voit, se reconnaît immédiatement, se revend sur Vestiaire — traverse une crise de sens. La clientèle aspirationnelle qui avait gonflé les volumes depuis 2020 s'est retirée. Ce qui reste, c'est une clientèle qui achète pour elle-même, pas pour les autres.

**Le luxe de sens surperforme le luxe de statut.** Les chiffres ne laissent plus de doute.

Les marques qui résistent partagent un trait commun : elles vendent des expériences que le porteur ressent, pas que le spectateur reconnaît. Loro Piana (LVMH), Brunello Cucinelli, les maisons de parfumerie niche — toutes enregistrent des croissances à deux chiffres.

## La Thèse Retbaa se Valide

Retbaa n'a jamais visé le luxe de logo. Kemia est un objet qu'on porte contre soi, qu'on active quand on veut, dont la valeur est intrinsèque et invisible pour les autres. C'est la définition du luxe intime — celui qui gagne actuellement.

**Pour les investisseurs Retbaa Circle :** vous n'investissez pas dans le luxe en général. Vous investissez dans le segment du luxe qui résiste — celui qui grandit quand les autres reculent.

La bifurcation n'est pas un risque à hedger. C'est un moteur à activer.

Pendant que les géants dépensent des centaines de millions pour "retrouver leur désirabilité", Retbaa la construit dès le premier jour — à travers le produit, le récit, et la sélectivité de sa distribution.

## Points d'Action

- Capitaliser sur ce contexte dans la narrative investisseurs : "nous entrons au bon moment, dans le bon segment"
- Renforcer le storytelling sensoriel et intime dans toutes les communications
- Maintenir une distribution ultra-sélective — c'est ce que le marché récompense`,
  },
  {
    id: 'gcc-riyadh-refuge-strategique-2026',
    tag: 'Géopolitique · GCC',
    title: 'GCC sous Tension de Guerre : Riyadh comme Refuge Stratégique',
    subtitle: 'Dubai -50% estimé · Riyadh isolée du conflit · SAR 11.1Mds$ +4.5%/an — le pivot Retbaa est validé',
    summary: 'La guerre en Iran plombe Dubai et pousse LVMH, Hermès à pivoter vers d\'autres régions. Riyadh reste isolée et bénéficie du report de trafic. Le pivot stratégique Retbaa vers Riyadh, déjà décidé, est désormais confirmé par les données macro.',
    date: '5 mai 2026',
    author: 'Kemia · Veille Stratégique',
    source: 'Bernstein Research, Reuters, Arab News',
    sourceUrl: null,
    img: '/retbaa-photos/retbaa_07.jpg',
    featured: false,
    category: 'Géopolitique',
    content: `## 🔴 Signal Fort — Pertinence 9/10

Ce n'est plus une décision de portefeuille. C'est la stratégie que les grandes maisons mondiales adoptent en urgence.

## Les Faits

La guerre en Iran a créé une onde de choc dans le luxe du Golfe :

- **Dubai** : estimé à -50% sur les ventes de luxe (chiffre interne, non confirmé officiellement). Les touristes du Golfe et d'Europe évitent la région.
- **LVMH, Hermès, Richemont** : tous en train de réviser leurs allocations budgétaires GCC, en rééquilibrant depuis Dubai vers Riyadh.
- **Riyadh** : géographiquement et politiquement isolée du conflit Iran. Bénéficie du report de trafic premium depuis Dubai.

**Marché luxe Saudi Arabia :**
- **$11.1 milliards** (2025)
- **+4.5% par an** — croissance structurelle portée par Vision 2030
- Marché intérieur réel, pas uniquement touristique — contrairement à Dubai

## Pourquoi Riyadh résiste

L'Arabie Saoudite tire sa dynamique de ses propres fondamentaux, indépendamment des flux touristiques régionaux :

**Vision 2030** : l'État investit massivement dans le tourisme premium, les arts, la culture, l'hospitalité de luxe. Ce n'est pas un cycle économique — c'est une politique nationale sur 10 ans.

**Population domestique** : 60% des Saoudiens ont moins de 35 ans, pouvoir d'achat en forte progression. La demande est locale et structurelle.

**Culture olfactive profonde** : l'oud, le bakhoor, la parfumerie orientale sont des pratiques culturelles quotidiennes — non des tendances. Retbaa parle naturellement ce langage.

**Sécularisation accélérée** : depuis 2019, une nouvelle classe de consommateurs premium combine codes occidentaux et ancrage identitaire fort. Exactement le profil qui résonne avec Cultural Luxury.

## Le Pivot Retbaa : Décision Confirmée

Retbaa avait activé une stratégie GCC B2B-first avec Dubai comme point d'entrée initial. Ce cap reste valide pour la visibilité marque.

Mais les données 2026 confirment le pivot d'accent : **Riyadh comme marché prioritaire**, Dubai comme marché de visibilité internationale.

Pour les investisseurs Retbaa Circle, ce timing est une preuve d'agilité stratégique : **Retbaa pivote vers Riyadh au même moment que LVMH et Hermès.**

La différence : eux réagissent à une crise. Retbaa exécute une stratégie déjà décidée, que la crise vient simplement valider.

## Ce que Retbaa apporte que personne d'autre n'a sur ce marché

Sur le marché GCC, les maisons de parfumerie niche premium sont soit occidentales (sans ancrage culturel moyen-oriental), soit orientales traditionnelles (sans dimension internationale).

Retbaa est ni l'un ni l'autre — et les deux à la fois.

L'oud africain, la céramique sensorielle, le rituel quotidien : un dialogue naturel avec la culture GCC, porté par une origine géographique inédite.

**Le marché n'attend pas Retbaa. Il la cherche.**`,
  },
  {
    id: 'osmo-70m-ia-fragrance-2026',
    tag: 'Tech & IA',
    title: 'Osmo lève $70M : L\'IA s\'attaque à la création olfactive',
    subtitle: 'Series B · fév. 2026 · MOQ réduits · ingrédients AI-designés — pourquoi Kemia reste non-reproductible',
    summary: 'Osmo veut démocratiser la fragrance avec des MOQ réduits et des ingrédients AI-designés. Signal double : investissement massif dans la fragrance ET menace réelle sur les marques craft non-différenciées. Retbaa doit articuler pourquoi le sensoriel humain est non-reproductible par l\'IA.',
    date: '5 mai 2026',
    author: 'Kemia · Veille Stratégique',
    source: 'TechCrunch, Perfumer & Flavorist',
    sourceUrl: null,
    img: '/retbaa-photos/retbaa_09.jpg',
    featured: false,
    category: 'Veille Marché',
    content: `## Les Faits

**Osmo** (AI-powered scent design) vient de boucler une **Series B à $70 millions** (février 2026). La startup combine des modèles d'IA propriétaires avec des données de perception olfactive pour :

- Concevoir des fragrances en heures plutôt qu'en mois
- Réduire les MOQ (minimum order quantities) — rendant le marché accessible à des marques D2C sans infrastructure
- Créer des ingrédients AI-designés à partir de données moléculaires

Le pitch : démocratiser la création de fragrance de luxe.

## Le Double Signal

Ce financement envoie deux messages simultanés.

**Signal positif pour l'industrie :** L'investissement dans la fragrance est massif. $70M en Series B confirme que les investisseurs croient au potentiel de la parfumerie premium. Le marché niche fragrance à $4.85B en 2026 (CAGR 13.2%) attire les capitaux.

**Signal de menace pour les non-différenciés :** Osmo réduit la barrière à l'entrée. Demain, n'importe quelle marque D2C pourra commander une fragrance "premium" via une interface IA, avec un MOQ de 100 unités. Les marques qui ne proposent que "un beau parfum" vont se retrouver dans une guerre des prix.

## Pourquoi Kemia est Non-Reproductible par l'IA

Osmo peut reproduire une formule olfactive. Il ne peut pas reproduire ce que Kemia fait.

**Le médaillon céramique** est façonné à la main. Sa porosité, sa texture, la façon dont il absorbe et libère le parfum progressivement — ce n'est pas une formule chimique. C'est un dialogue entre la matière et la peau.

**Le rituel** : Kemia n'est pas une fragrance. C'est un acte. On choisit son spray, on le dépose sur le médaillon, on le porte. Ce processus d'intention, ce geste quotidien — l'IA ne le vend pas.

**La provenance** : les matières premières de Retbaa viennent d'Afrique de l'Ouest. Cette géographie, cette histoire, ce savoir-faire transmis — c'est ce que le marché du luxe paie en premium. Pas la molécule.

**L'expérience sensorielle multimodale** : toucher la céramique, voir le médaillon vieillir et développer une patine personnelle, sentir la diffusion progressive. Osmo produit du liquide parfumé. Retbaa produit une expérience.

## Points d'Action

- **Renforcer le narrative "non-reproductible"** dans tous les supports : pourquoi la céramique + le rituel + la provenance forment une triade que l'IA ne peut pas commoditiser
- **Surveiller Osmo** comme potentiel partenaire de R&D (MOQ réduits = opportunité pour étendre la gamme fragrances)
- **Articuler clairement** aux investisseurs Circle que l'IA dans la fragrance valide le marché tout en renforçant le moat Retbaa`,
  },
  {
    id: 'afrique-marche-producteur-2026',
    tag: 'Afrique',
    title: 'L\'Afrique comme Marché Producteur : Au-delà de la Consommation',
    subtitle: '"Rise of Africa\'s Brand Economy 2026" (BrandiQ/Brookings) · MEA luxury $21.85B · CAGR 10.57%',
    summary: 'Les marques africaines ne sont plus cantonnées à un marché local — elles définissent des tendances globales. MEA luxury à $21.85Mds$ en 2026, diaspora commerce en forte hausse. Retbaa comme locomotive de cette vague.',
    date: '5 mai 2026',
    author: 'Kemia · Veille Stratégique',
    source: 'BrandiQ, Brookings Institution, Globe Newswire',
    sourceUrl: null,
    img: '/retbaa-photos/retbaa_11.jpg',
    featured: false,
    category: 'Afrique',
    content: `## Les Faits

**"The Rise of Africa's Brand Economy 2026"** — publié conjointement par BrandiQ et la Brookings Institution — documente une rupture narrative majeure dans l'économie mondiale du luxe.

Les marques africaines ne sont plus des curiosités régionales. Elles définissent des tendances.

**Chiffres clés MEA :**
- **$21.85 milliards** — marché luxe MEA 2026
- **CAGR 10.57%** — vers $36.15 milliards d'ici 2031
- **Diaspora commerce** : en forte hausse sur tous les segments premium
- Croissance quasi-deux-fois supérieure à l'Europe occidentale

## Le Changement de Paradigme

Pendant des décennies, le luxe africain était lu à travers un prisme consommateur : "L'Afrique achète du luxe occidental." Ce cadre est en train de se renverser.

**Trois vagues simultanées créent le changement :**

**1. La montée de la classe créative africaine**
Dakar, Lagos, Accra, Nairobi ont produit une génération de créateurs, directeurs artistiques et entrepreneurs qui refusent de s'inscrire dans les codes occidentaux. Ils créent des codes propres — et ces codes se diffusent globalement.

**2. La diaspora comme pont culturel et commercial**
Les 30+ millions d'Africains en diaspora disposent d'un pouvoir d'achat croissant et d'un appétit pour des marques qui parlent leur identité. Ce marché était invisible dans les statistiques traditionnelles. Il représente aujourd'hui plusieurs milliards de dollars en valeur adressable.

**3. Les plateformes mondiales comme égaliseurs**
Instagram, TikTok, Farfetch ont supprimé la barrière géographique. Une marque née à Dakar peut désormais être désirée à Tokyo, Milan et New York — sans passer par les gatekeepers traditionnels du luxe parisien.

## La Position de Retbaa

Retbaa n'est pas une marque africaine qui cherche à s'internationaliser. Retbaa est une maison de **Cultural Luxury** — positionnement universel — dont l'origine africaine est un différentiateur de valeur, pas une limitation géographique.

Cette nuance est stratégique.

"Made in Africa" était autrefois une friction dans la distribution luxe mondiale. En 2026, c'est un actif. La BrandiQ/Brookings l'a quantifié : la prime de désirabilité des marques à forte authenticité d'origine est en hausse constante depuis 2022.

**Retbaa est positionnée à l'avant-garde de cette vague — pas dans son sillage.**

## Implications pour les Investisseurs

Pour les membres du Retbaa Circle, cette donnée macro traduit une vérité simple :

Vous investissez dans une marque dont le contexte géopolitique et culturel devient plus favorable chaque année. L'Afrique monte. Le Cultural Luxury monte. La niche fragrance monte.

Retbaa est à l'intersection des trois.

**Le timing n'est pas un hasard. C'est une conviction stratégique exécutée.**

## Points d'Action

- Intégrer les données BrandiQ/Brookings dans le pitch investisseurs Tranche 2
- Développer la narrative "locomotive de la vague" dans les supports Circle
- Identifier les ambassadeurs diaspora (France, UK, USA) comme premier réseau d'acquisition premium`,
  },
  // ─── FIN VEILLE KEMIA 5 mai 2026 ────────────────────────────
  {
    id: 1,
    tag: 'Marché Luxe',
    title: 'Le Luxe à l\'Épreuve de son Époque',
    subtitle: 'Dynamiques économiques et mutation culturelle (2025-2026)',
    summary: 'Analyse approfondie des grandes mutations du secteur luxe mondial — chute des géants, résilience d\'Hermès, émergence des marchés africains. Une lecture indispensable pour comprendre où va le luxe.',
    date: 'Avril 2026',
    author: 'Kemia · Chief of Staff IA',
    pdf: '/docs/luxe_etude_HBR_2026.pdf',
    img: '/retbaa-photos/retbaa_01.jpg',
    featured: true,
    category: 'Marché Luxe',
  },
  {
    id: 2,
    tag: 'Distribution',
    title: 'ORION — Mapping des Espaces Vides',
    subtitle: 'Distribution luxe mondiale : où sont les angles oubliés ?',
    summary: 'Cartographie stratégique des niches non occupées dans la distribution luxe mondiale. Identifier les failles là où les grandes maisons sont absentes.',
    date: 'Avril 2026',
    author: 'Orion · Agent Distribution',
    pdf: '/docs/Orion_Espaces_Vides_Luxe.pdf',
    img: '/retbaa-photos/retbaa_03.jpg',
    featured: false,
    category: 'Distribution',
  },
  {
    id: 3,
    tag: 'Géopolitique',
    title: 'Le Jeu de Go Géopolitique de la Chine',
    subtitle: 'Et son impact sur le luxe africain',
    summary: 'Décryptage de la stratégie d\'encerclement progressif de la Chine et ses implications pour les marques de luxe africaines cherchant à s\'internationaliser.',
    date: 'Avril 2026',
    author: 'Kemia · Chief of Staff IA',
    pdf: '/docs/2026-04-05_Le_Jeu_de_Go_Geopolitique_Chine.pdf',
    img: '/retbaa-photos/retbaa_07.jpg',
    featured: false,
    category: 'Géopolitique',
  },
  {
    id: 4,
    tag: 'Stratégie',
    title: 'Retbaa joue au Go',
    subtitle: 'Note stratégique — Positionnement et encerclement progressif',
    summary: 'Comment Retbaa applique la logique du jeu de Go à sa stratégie de développement : occuper les espaces vides avant la concurrence, construire par strates.',
    date: 'Avril 2026',
    author: 'Kemia · Chief of Staff IA',
    pdf: '/docs/Kemia_Note_Retbaa_Joue_Au_Go.pdf',
    img: '/retbaa-photos/retbaa_09.jpg',
    featured: false,
    category: 'Stratégie',
  },
  {
    id: 5,
    tag: 'Stratégie',
    title: 'Stratégie d\'Encerclement Progressif B2B',
    subtitle: 'Le Framework Retbaa Go — Approche Grands Comptes',
    summary: 'Framework opérationnel pour l\'approche B2B de Retbaa : hôtels de luxe, boutiques multi-marques, grands comptes. Une stratégie d\'encerclement patient et méthodique.',
    date: 'Avril 2026',
    author: 'Solin · Agent B2B',
    pdf: '/docs/Solin_Strategie_Encerclement_B2B.pdf',
    img: '/retbaa-photos/retbaa_11.jpg',
    featured: false,
    category: 'Stratégie',
  },
  {
    id: 6,
    tag: 'Marché Luxe',
    title: 'Retbaa Étude de Marché Luxe 2026',
    subtitle: 'Analyse du marché luxe africain et opportunités',
    summary: 'Étude complète du marché du luxe avec focus sur la région MEA. Chiffres clés, tendances, positionnement de Retbaa dans l\'écosystème luxe mondial.',
    date: 'Mars 2026',
    author: 'Équipe Retbaa',
    pdf: '/docs/Retbaa_Etude_Marche_Luxe_2026.pdf',
    img: '/retbaa-photos/retbaa_13.jpg',
    featured: false,
    category: 'Marché Luxe',
  },
]

const FILTERS = ['Tout', 'Vision', 'Veille Marché', 'Afrique', 'Marché Luxe', 'Stratégie', 'Géopolitique', 'Tech & IA', 'Distribution']

// ─── ARTICLE FEATURED (pleine largeur) ───────────────────────
function FeaturedArticle({ article, onOpen }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: '#ffffff',
        borderRadius: '4px',
        boxShadow: '0px 20px 40px rgba(0,27,63,0.06)',
        overflow: 'hidden',
        marginBottom: '48px',
        border: '1px solid rgba(239,192,212,0.12)',
      }}
      className="featured-article-grid"
    >
      {/* Image gauche */}
      <div className="featured-article-image" style={{ overflow: 'hidden', position: 'relative', minHeight: '420px' }}>
        <img
          src={article.img}
          alt={article.title}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 1.2s ease',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            position: 'absolute', inset: 0,
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(26,58,107,0.15) 0%, transparent 60%)',
        }} />
        {/* Tag sur l'image */}
        <div style={{
          position: 'absolute', top: '24px', left: '24px',
          background: 'rgba(26,58,107,0.85)',
          backdropFilter: 'blur(6px)',
          padding: '6px 14px',
          borderRadius: '2px',
        }}>
          <span style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '10px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#EFC0D4', fontWeight: 800,
          }}>
            {article.tag}
          </span>
        </div>
      </div>

      {/* Contenu droite */}
      <div
        className="featured-article-content"
        style={{
          padding: '48px 40px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          borderLeft: '4px solid #EFC0D4',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          marginBottom: '24px',
        }}>
          <div style={{ width: '2px', height: '14px', background: '#EFC0D4', flexShrink: 0 }} />
          <span style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '10px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#795465', fontWeight: 700,
          }}>
            À la une · {article.date}
          </span>
        </div>

        <h2 style={{
          fontFamily: 'Newsreader, serif', fontSize: '36px', fontWeight: 300,
          fontStyle: 'italic', color: '#1A3A6B', margin: '0 0 10px', lineHeight: 1.2,
        }}>
          {article.title}
        </h2>
        <p style={{
          fontFamily: 'Manrope, sans-serif', fontSize: '11px',
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: '#795465', fontWeight: 600, margin: '0 0 20px',
        }}>
          {article.subtitle}
        </p>
        <p style={{
          fontFamily: 'Manrope, sans-serif', fontSize: '14px',
          color: '#43474F', lineHeight: 1.75, margin: '0 0 28px',
        }}>
          {article.summary}
        </p>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: '20px', borderTop: '1px solid rgba(239,192,212,0.2)',
        }}>
          <span style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '11px',
            color: '#9CA3AF', fontStyle: 'italic',
          }}>
            {article.author}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onOpen}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                fontWeight: 700, color: '#1A3A6B',
                background: 'rgba(26,58,107,0.05)',
                border: '1px solid rgba(26,58,107,0.15)',
                padding: '10px 18px', borderRadius: '2px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1A3A6B'; e.currentTarget.style.color = '#ffffff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(26,58,107,0.05)'; e.currentTarget.style.color = '#1A3A6B' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>article</span>
              Lire l'analyse
            </button>
            {article.sourceUrl && (
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  fontWeight: 700, color: '#EFC0D4',
                  background: 'transparent',
                  border: '1px solid rgba(239,192,212,0.4)',
                  padding: '10px 18px', borderRadius: '2px',
                  textDecoration: 'none',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>open_in_new</span>
                Source originale
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── ARTICLE CARD (grille 3 colonnes) ────────────────────────
function ArticleCard({ article, onOpen }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '4px',
        boxShadow: '0px 20px 40px rgba(0,27,63,0.06)',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        border: '1px solid rgba(239,192,212,0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        cursor: 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{ overflow: 'hidden', height: '200px', position: 'relative', flexShrink: 0 }}>
        <img
          src={article.img}
          alt={article.title}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 1s ease',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
          }}
        />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '4px', background: '#EFC0D4',
        }} />
      </div>

      {/* Contenu */}
      <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        <span style={{
          fontFamily: 'Manrope, sans-serif', fontSize: '10px',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: '#EFC0D4', fontWeight: 800,
        }}>
          {article.tag}
        </span>
        <h3 style={{
          fontFamily: 'Newsreader, serif', fontSize: '22px', fontWeight: 300,
          fontStyle: 'italic', color: '#1A3A6B', margin: 0, lineHeight: 1.3,
          transition: 'color 0.2s',
          ...(hovered ? { color: '#795465' } : {}),
        }}>
          {article.title}
        </h3>
        <p style={{
          fontFamily: 'Manrope, sans-serif', fontSize: '11px',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: '#795465', fontWeight: 600, margin: 0,
        }}>
          {article.subtitle}
        </p>
        <p style={{
          fontFamily: 'Manrope, sans-serif', fontSize: '13px',
          color: '#43474F', lineHeight: 1.7, margin: 0, flex: 1,
        }}>
          {article.summary}
        </p>

        {/* Footer card */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: '16px', marginTop: '4px',
          borderTop: '1px solid rgba(239,192,212,0.15)',
        }}>
          <div>
            <div style={{
              fontFamily: 'Manrope, sans-serif', fontSize: '10px',
              color: '#9CA3AF', marginBottom: '2px',
            }}>
              {article.date}
            </div>
            <div style={{
              fontFamily: 'Manrope, sans-serif', fontSize: '11px',
              color: '#43474F', fontStyle: 'italic',
            }}>
              {article.author}
            </div>
          </div>
          <button
            onClick={onOpen}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontFamily: 'Manrope, sans-serif', fontSize: '10px',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              fontWeight: 700, color: '#795465',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#1A3A6B'}
            onMouseLeave={e => e.currentTarget.style.color = '#795465'}
          >
            Lire l'analyse
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────────
export default function InsightsPage() {
  const { i18n } = useTranslation()
  const [activeFilter, setActiveFilter] = useState('Tout')
  const [selectedArticle, setSelectedArticle] = useState(null)

  const filteredArticles = activeFilter === 'Tout'
    ? articles
    : articles.filter(a => a.category === activeFilter)

  const featuredArticle = filteredArticles.find(a => a.featured) || filteredArticles[0]
  const gridArticles = filteredArticles.filter(a => a.id !== featuredArticle?.id)

  // Documents de référence (tous les articles avec PDF)
  const docsRef = articles.map(a => ({
    title: a.title,
    subtitle: a.subtitle,
    date: a.date,
    pdf: a.pdf,
    tag: a.tag,
  }))

  return (
    <>
    <div style={{ background: '#F9F9F9', minHeight: '100vh' }}>

      {/* ─── HERO ──────────────────────────────────────────── */}
      <section className="insights-hero" style={{
        background: '#1A3A6B',
        padding: '80px 48px 64px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Motif décoratif subtil */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '40%', height: '100%',
          background: 'linear-gradient(135deg, transparent 0%, rgba(239,192,212,0.04) 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-1px', left: 0, right: 0,
          height: '4px', background: '#EFC0D4',
        }} />

        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '10px',
            letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'rgba(239,192,212,0.7)', margin: '0 0 20px', fontWeight: 700,
          }}>
            Retbaa Circle · Revue Éditoriale
          </p>
          <h1 style={{
            fontFamily: 'Newsreader, serif', fontSize: '64px', fontWeight: 300,
            fontStyle: 'italic', color: '#ffffff', margin: '0 0 16px', lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}>
            Retbaa Insights
          </h1>
          <p style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '11px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#EFC0D4', margin: '0 0 12px', fontWeight: 600,
          }}>
            Études &amp; analyses stratégiques
          </p>
          <p style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '14px',
            color: 'rgba(255,255,255,0.6)', margin: 0, maxWidth: '520px', lineHeight: 1.7,
          }}>
            Une revue éditoriale exclusive pour les membres du Retbaa Circle.
          </p>
        </div>
      </section>

      {/* ─── BARRE DE FILTRES ──────────────────────────────── */}
      <section style={{
        background: '#ffffff',
        boxShadow: '0px 4px 20px rgba(0,27,63,0.04)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{
          maxWidth: '1400px', margin: '0 auto',
          padding: '0 48px',
          display: 'flex', gap: '8px', alignItems: 'center',
          overflowX: 'auto',
        }} className="no-scrollbar insights-filters">
          {FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                fontWeight: 700,
                padding: '18px 20px',
                background: 'none',
                border: 'none',
                borderBottom: activeFilter === filter ? '2px solid #1A3A6B' : '2px solid transparent',
                color: activeFilter === filter ? '#1A3A6B' : '#9CA3AF',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'color 0.2s, border-color 0.2s',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                if (activeFilter !== filter) e.currentTarget.style.color = '#43474F'
              }}
              onMouseLeave={e => {
                if (activeFilter !== filter) e.currentTarget.style.color = '#9CA3AF'
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* ─── CONTENU PRINCIPAL ─────────────────────────────── */}
      <div className="insights-main-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '56px 48px 80px' }}>

        {/* Article featured */}
        {featuredArticle && filteredArticles.length > 0 && (
          <FeaturedArticle article={featuredArticle} onOpen={() => setSelectedArticle(featuredArticle)} />
        )}

        {/* Titre section grille */}
        {gridArticles.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            marginBottom: '32px',
          }}>
            <div style={{ width: '2px', height: '16px', background: '#EFC0D4', flexShrink: 0 }} />
            <span style={{
              fontFamily: 'Manrope, sans-serif', fontSize: '10px',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#1A3A6B', fontWeight: 700,
            }}>
              {activeFilter === 'Tout' ? 'Toutes les études' : `Études · ${activeFilter}`}
            </span>
          </div>
        )}

        {/* Grille 3 colonnes */}
        {gridArticles.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
            marginBottom: '64px',
          }} className="insights-grid">
            {gridArticles.map(article => (
              <ArticleCard key={article.id} article={article} onOpen={() => setSelectedArticle(article)} />
            ))}
          </div>
        )}

        {/* Aucun résultat */}
        {filteredArticles.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '80px 0',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#EFC0D4', display: 'block', marginBottom: '16px' }}>
              search_off
            </span>
            <p style={{
              fontFamily: 'Newsreader, serif', fontStyle: 'italic',
              fontSize: '22px', color: '#9CA3AF',
            }}>
              Aucun article dans cette catégorie pour le moment.
            </p>
          </div>
        )}

        {/* ─── SECTION DOCUMENTS DE RÉFÉRENCE ─────────────── */}
        <section>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            marginBottom: '32px', paddingTop: '16px',
            borderTop: '1px solid rgba(239,192,212,0.25)',
          }}>
            <div style={{ width: '2px', height: '16px', background: '#EFC0D4', flexShrink: 0 }} />
            <span style={{
              fontFamily: 'Manrope, sans-serif', fontSize: '10px',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#1A3A6B', fontWeight: 700,
            }}>
              Documents de référence
            </span>
          </div>

          <div style={{
            background: '#ffffff',
            borderRadius: '4px',
            boxShadow: '0px 20px 40px rgba(0,27,63,0.04)',
            overflow: 'hidden',
            border: '1px solid rgba(239,192,212,0.1)',
          }}>
            {docsRef.map((doc, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '20px 28px',
                  borderBottom: i < docsRef.length - 1 ? '1px solid rgba(239,192,212,0.1)' : 'none',
                  transition: 'background 0.15s',
                  gap: '16px',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,192,212,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Icône PDF */}
                <div style={{
                  width: '40px', height: '40px', flexShrink: 0,
                  background: 'rgba(26,58,107,0.06)',
                  borderRadius: '4px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#1A3A6B' }}>
                    picture_as_pdf
                  </span>
                </div>

                {/* Infos */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'Manrope, sans-serif', fontSize: '13px',
                    fontWeight: 600, color: '#1A3A6B', marginBottom: '2px',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {doc.title}
                  </div>
                  <div style={{
                    fontFamily: 'Manrope, sans-serif', fontSize: '11px',
                    color: '#9CA3AF',
                  }}>
                    {doc.tag} · {doc.date}
                  </div>
                </div>

                {/* Bouton télécharger */}
                <a
                  href={doc.pdf}
                  target="_blank"
                  download
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    fontWeight: 700, color: '#795465',
                    background: 'none', border: '1px solid rgba(121,84,101,0.25)',
                    padding: '8px 14px', borderRadius: '2px',
                    textDecoration: 'none', flexShrink: 0,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#795465'
                    e.currentTarget.style.color = '#ffffff'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'none'
                    e.currentTarget.style.color = '#795465'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>download</span>
                  Télécharger
                </a>
              </div>
            ))}
          </div>
        </section>

      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media (max-width: 1024px) {
          .featured-article-grid { grid-template-columns: 1fr !important; }
          .insights-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .insights-grid { grid-template-columns: 1fr !important; }
          .featured-article-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
    {selectedArticle && <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />}
    </>
  )
}
