// pages/InsightsPage.jsx — Retbaa Circle — Revue éditoriale investisseurs
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import InvestorActions from '../components/InvestorActions'


const isLikelyGeneratedImage = (src) => {
  if (!src) return false
  const value = String(src).toLowerCase()
  return [
    'genspark.ai',
    'sspark',
    'cfimages',
    'oaidalleapiprodscus',
    'dall-e',
    'midjourney',
    'replicate.delivery',
    'fal.media',
  ].some(marker => value.includes(marker))
}

const editorialImage = (src) => isLikelyGeneratedImage(src) ? null : src

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
  const [imageFailed, setImageFailed] = useState(false)
  const modalImage = imageFailed ? null : editorialImage(article.img)

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
        {modalImage && (
          <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
            <img src={modalImage} alt={article.title} onError={() => setImageFailed(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
          {!modalImage && (
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
            {renderMarkdown(article.content_md)}
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


// ─── FALLBACK — articles statiques (snapshot Supabase du 12/07/2026) ─
const FALLBACK_ARTICLES = [
  {
    id: 'luxe-sous-tension-s1-2026',
    tag: 'Signal Marché',
    title: 'Luxe sous tension : ce que les résultats S1 2026 disent de la résilience du secteur',
    date: '6 juillet 2026',
    author: 'Kemia',
    source: '',
    sourceUrl: null,
    summary: 'Les semestriels S1 2026 confirment une bifurcation structurante entre LVMH et Hermès.',
    img: null,
    content: '## Contexte\n\nLes trois grands conglomérats du luxe publient leurs résultats semestriels.',
    category: 'Signal Marché',
    featured: false,
  }
]


const FILTERS = ['Tout', 'Marché', 'Maisons', 'Afrique & GCC', 'Stratégie', 'Tech & Tendances']


const normalizeInsightCategory = (value) => {
  const raw = String(value || '').trim()
  if (!raw || raw === 'Article') return 'Veille Marché'

  const lower = raw.toLowerCase()
  if (lower.includes('signal')) return 'Signal Marché'
  if (lower.includes('veille')) return 'Veille Marché'
  if (lower.includes('afrique')) return 'Afrique'
  if (lower.includes('luxe') || lower.includes('marché')) return 'Marché Luxe'
  if (lower.includes('stratég') || lower.includes('strateg')) return 'Stratégie'
  if (lower.includes('géopolit') || lower.includes('geopolit') || lower.includes('gcc')) return 'Géopolitique'
  if (lower.includes('tech') || lower.includes('ia')) return 'Tech & IA'
  if (lower.includes('distribution') || lower.includes('retail')) return 'Distribution'
  if (lower.includes('vision')) return 'Vision'

  return raw
}

const insightFamily = (article) => {
  const haystack = [article.category, article.tag, article.title, article.summary].filter(Boolean).join(' ').toLowerCase()

  if (/(maison|hermès|hermes|lvmh|kering|richemont|bulgari|burberry|saint laurent|lacroix|maxhosa|kenneth|magugu|adama|osei-duro|mode africaine|histoire)/i.test(haystack)) return 'Maisons'
  if (/(afrique|africain|gcc|riyad|riyadh|dubai|dubaï|saudi|abidjan|dakar|tourisme|hôtellerie|hotellerie)/i.test(haystack)) return 'Afrique & GCC'
  if (/(stratég|strateg|distribution|retail|cultural luxury|retbaa insights|go|b2b|funnel|vision)/i.test(haystack)) return 'Stratégie'
  if (/(tech|ia|ai|phygital|gen z|tendance|consommateur)/i.test(haystack)) return 'Tech & Tendances'
  if (/(marché|market|signal|veille|résultat|resultat|financier|m&a|luxe|croissance|ebitda)/i.test(haystack)) return 'Marché'

  return 'Marché'
}

const matchesSearch = (article, query) => {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return [article.title, article.subtitle, article.summary, article.tag, article.category, article.author]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(q)
}


const CATEGORY_COVER = {
  'Signal Marché': { bg: '#0D1F3C', accent: '#EFC0D4', label: 'SIGNAL' },
  'Veille Marché': { bg: '#102B52', accent: '#C8A46A', label: 'VEILLE' },
  'Marché Luxe': { bg: '#F4EFE7', accent: '#1A3A6B', label: 'LUXE' },
  'Stratégie': { bg: '#1A3A6B', accent: '#EFC0D4', label: 'STRATÉGIE' },
  'Géopolitique': { bg: '#27364A', accent: '#D8B66A', label: 'GÉO' },
  'Tech & IA': { bg: '#111827', accent: '#9BC7D4', label: 'TECH' },
  'Distribution': { bg: '#795465', accent: '#F4EFE7', label: 'RETAIL' },
  'Afrique': { bg: '#5A3825', accent: '#EFC0D4', label: 'AFRIQUE' },
  'Vision': { bg: '#FAF7F2', accent: '#1A3A6B', label: 'VISION' },
}

function EditorialCover({ article, variant = 'card', hovered = false }) {
  const [imageFailed, setImageFailed] = useState(false)
  const img = imageFailed ? null : editorialImage(article.img)
  const meta = CATEGORY_COVER[article.category] || CATEGORY_COVER[article.tag] || { bg: '#FAF7F2', accent: '#1A3A6B', label: 'RETBAA' }
  const isFeatured = variant === 'featured'

  if (img) {
    return (
      <>
        <img
          src={img}
          alt={article.title}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 1.2s ease',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            position: 'absolute', inset: 0,
          }}
          onError={() => setImageFailed(true)}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(26,58,107,0.18) 0%, transparent 65%)' }} />
      </>
    )
  }

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `
        radial-gradient(circle at 18% 18%, ${meta.accent}24 0, transparent 28%),
        linear-gradient(135deg, ${meta.bg} 0%, ${meta.bg} 56%, #FAF7F2 180%)
      `,
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: '18px', border: `1px solid ${meta.accent}55` }} />
      <div style={{ position: 'absolute', top: '26px', left: '28px', right: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: isFeatured ? '10px' : '8px', letterSpacing: '0.28em', color: meta.accent, fontWeight: 800 }}>
          RETBAA CIRCLE
        </span>
        <span style={{ width: '32px', height: '1px', background: meta.accent, opacity: 0.8 }} />
      </div>
      <div style={{
        position: 'absolute', left: '28px', right: '28px', bottom: isFeatured ? '34px' : '26px',
        fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontWeight: 300,
        color: meta.accent, fontSize: isFeatured ? '48px' : '30px', lineHeight: 0.95,
        opacity: 0.95,
      }}>
        {meta.label}
      </div>
      <div style={{
        position: 'absolute', right: isFeatured ? '-28px' : '-18px', bottom: isFeatured ? '-54px' : '-34px',
        fontFamily: 'Newsreader, serif', fontSize: isFeatured ? '190px' : '116px',
        color: meta.accent, opacity: 0.08, fontStyle: 'italic', lineHeight: 1,
      }}>
        R
      </div>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
        backgroundSize: '18px 18px',
        mixBlendMode: 'screen', opacity: 0.45,
      }} />
    </div>
  )
}

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
        <EditorialCover article={article} variant="featured" hovered={hovered} />
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
        <EditorialCover article={article} hovered={hovered} />
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
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Charger les articles depuis Supabase via supabase-js (clé depuis env vars)
  useEffect(() => {
    let mounted = true
    let retryTimer = null
    let retryCount = 0

    async function loadArticles() {
      try {
        const { data, error } = await supabase
          .from('insights')
          .select('id, title, slug, content_type, tags, content_short, content_long, author, status, published_at, img, source_url, featured')
          .eq('status', 'published')
          .order('published_at', { ascending: false })

        if (error) throw error

        if (mounted) {
          if (data && data.length > 0) {
            const mapped = data.map(a => ({
              id: a.slug || a.id,
              tag: (Array.isArray(a.tags) && a.tags[0]) || a.content_type || 'Veille Marché',
              title: a.title,
              subtitle: '',
              date: a.published_at
                ? new Date(a.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                : '',
              author: a.author || 'Kemia',
              source: '',
              sourceUrl: a.source_url || null,
              summary: a.content_short || '',
              img: editorialImage(a.img),
              content_md: a.content_long || '',
              category: normalizeInsightCategory((Array.isArray(a.tags) && a.tags[0]) || a.content_type),
              featured: !!a.featured,
            }))
            setArticles(mapped)

            setLoading(false)
          } else {
            // Retry une fois si vide (cold start Supabase)
            if (retryCount < 1) {
              retryCount++
              retryTimer = setTimeout(loadArticles, 2000)
            } else {
              setArticles(FALLBACK_ARTICLES)
              setLoading(false)
            }
          }
        }
      } catch {
        if (mounted) {
          setArticles(FALLBACK_ARTICLES)
          setLoading(false)
        }
      }
    }

    loadArticles()
    return () => {
      mounted = false
      if (retryTimer) clearTimeout(retryTimer)
    }
  }, [])
  const filteredArticles = articles.filter(article => {
    const familyMatch = activeFilter === 'Tout' || insightFamily(article) === activeFilter
    return familyMatch && matchesSearch(article, searchQuery)
  })

  const featuredArticle = filteredArticles.find(a => a.featured) || filteredArticles[0]
  const gridArticles = filteredArticles.filter(a => a.id !== featuredArticle?.id)

  // Documents de référence (articles avec PDF uniquement)
  const docsRef = articles.filter(a => a.pdf).map(a => ({
    title: a.title,
    subtitle: a.subtitle,
    date: a.date,
    pdf: a.pdf,
    tag: a.tag || a.category,
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

      {/* ─── BARRE DE FILTRES + RECHERCHE ─────────────────── */}
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
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px 18px' }}>
          <div style={{ position: 'relative', maxWidth: '520px' }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: '#9CA3AF' }}>search</span>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher une analyse, une maison, un marché…"
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '12px 14px 12px 42px',
                border: '1px solid rgba(26,58,107,0.12)', borderRadius: '4px',
                fontFamily: 'Manrope, sans-serif', fontSize: '13px',
                color: '#1A3A6B', outline: 'none', background: '#FAF7F2',
              }}
            />
          </div>
        </div>
      </section>

      {/* ─── CONTENU PRINCIPAL ─────────────────────────────── */}
      <div className="insights-main-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '56px 48px 80px' }}>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '120px 0' }}>
            <div style={{
              width: '32px', height: '32px', border: '3px solid rgba(239,192,212,0.2)',
              borderTopColor: '#EFC0D4', borderRadius: '50%',
              animation: 'insights-spin 0.8s linear infinite',
              margin: '0 auto 16px',
            }} />
            <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#9CA3AF' }}>
              Chargement des articles…
            </p>
            <style>{`@keyframes insights-spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {/* Article featured */}
        {!loading && featuredArticle && filteredArticles.length > 0 && (
          <FeaturedArticle article={featuredArticle} onOpen={() => setSelectedArticle(featuredArticle)} />
        )}

        {!loading && <InvestorActions />}

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
              {activeFilter === 'Tout' ? 'Toutes les études' : `Dossier · ${activeFilter}`}
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
        {!loading && filteredArticles.length === 0 && (
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
