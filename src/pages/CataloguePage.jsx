// pages/CataloguePage.jsx — Retbaa Circle — Stitch Design System v3
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { collections } from '../data/catalogue.js'

// Tier styles
const TIER_STYLES = {
  icon: { bg: '#1A3A6B', text: '#fff', label: { fr: 'Icons', en: 'Icons' } },
  hero: { bg: '#C8A96E', text: '#fff', label: { fr: 'Héros', en: 'Heroes' } },
  challenger: { bg: 'transparent', text: '#1A3A6B', border: '#EFC0D4', label: { fr: 'Challengers', en: 'Challengers' } },
}

// Tier images
const TIER_IMAGES = {
  icon: '/retbaa-photos/retbaa_02.jpg',
  hero: '/retbaa-photos/retbaa_04.jpg',
  challenger: '/retbaa-photos/retbaa_06.jpg',
}

function TierPill({ tier, lang }) {
  const s = TIER_STYLES[tier]
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: '2px',
      fontSize: '9px', fontFamily: 'Manrope, sans-serif', fontWeight: 700,
      letterSpacing: '0.15em', textTransform: 'uppercase',
      background: s.bg, color: s.text,
      border: s.border ? `1px solid ${s.border}` : 'none',
    }}>
      {s.label[lang]}
    </span>
  )
}

function TierSummaryCard({ tier, count, lang }) {
  const [hovered, setHovered] = useState(false)
  const messages = {
    icon: {
      fr: "Les Icons incarnent l'identité et la puissance commerciale de Retbaa. Ce sont les produits à forte marge, forte visibilité et fort potentiel d'export.",
      en: "Icons embody Retbaa's identity and commercial strength. High margin, high visibility, high export potential.",
    },
    hero: {
      fr: 'Les Héros génèrent le volume et la récurrence. Produits testés, validés par le marché, socle de la croissance.',
      en: 'Heroes generate volume and repeat purchases. Market-validated products, core of growth.',
    },
    challenger: {
      fr: 'Les Challengers explorent les prochains relais de croissance. Ils valident de nouvelles niches et anticipent les tendances.',
      en: 'Challengers explore the next growth drivers. They validate new niches and anticipate trends.',
    },
  }

  const bgMap = { icon: '#1A3A6B', hero: '#FDFAF4', challenger: '#FFF9FB' }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: bgMap[tier],
        borderRadius: '4px',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0px 8px 28px rgba(26,58,107,0.10)' : '0px 2px 8px rgba(26,58,107,0.04)',
      }}
    >
      {/* Image band */}
      <div style={{ height: '130px', overflow: 'hidden', position: 'relative' }}>
        <img
          src={TIER_IMAGES[tier]}
          alt={tier}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.4s',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to bottom, transparent 30%, ${bgMap[tier]}DD)`,
        }} />
      </div>

      {/* Content */}
      <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <TierPill tier={tier} lang={lang} />
            <div style={{
              fontFamily: 'Newsreader, serif',
              fontSize: '36px', fontWeight: 300, lineHeight: 1.1,
              color: tier === 'icon' ? '#fff' : '#1A3A6B',
              marginTop: '10px',
            }}>
              {count}
            </div>
            <div style={{
              fontFamily: 'Manrope, sans-serif', fontSize: '10px',
              color: tier === 'icon' ? 'rgba(255,255,255,0.5)' : '#9CA3AF',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px', fontWeight: 600,
            }}>
              {lang === 'fr' ? 'références' : 'references'}
            </div>
          </div>
        </div>
        <p style={{
          fontFamily: 'Manrope, sans-serif', fontSize: '12px', lineHeight: 1.65,
          color: tier === 'icon' ? 'rgba(255,255,255,0.75)' : '#43474F',
          margin: 0,
        }}>
          {messages[tier][lang]}
        </p>
      </div>
    </div>
  )
}

function ProductRow({ product, lang }) {
  const name = product.name[lang] || product.name.fr
  const formats = product.formats?.join(' · ')
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      padding: '11px 0',
      borderBottom: '1px solid #F9F9F9',
    }}>
      <div style={{
        width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
        background: product.colorHex || '#1A3A6B',
        opacity: 0.7,
      }} />
      <div style={{ flex: 1 }}>
        <span style={{
          fontFamily: 'Manrope, sans-serif', fontSize: '13px',
          color: '#1A1C1C', fontWeight: 400,
        }}>{name}</span>
        {product.notes && (
          <span style={{ fontSize: '12px', color: '#9CA3AF', marginLeft: '8px', fontStyle: 'italic', fontFamily: 'Newsreader, serif' }}>
            — {product.notes[lang] || product.notes.fr}
          </span>
        )}
      </div>
      {formats && (
        <span style={{
          fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#C4C6D0',
          letterSpacing: '0.04em',
        }}>{formats}</span>
      )}
      <TierPill tier={product.tier} lang={lang} />
    </div>
  )
}

function CollectionBlock({ collection, lang, activeFilter }) {
  const [open, setOpen] = useState(true)
  const allProducts = collection.subcategories?.flatMap(s => s.products) || collection.products || []
  const filtered = activeFilter === 'all' ? allProducts : allProducts.filter(p => p.tier === activeFilter)
  const total = allProducts.length

  if (filtered.length === 0) return null

  return (
    <div style={{ marginBottom: '40px' }}>
      {/* Header collection */}
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', background: 'none', border: 'none',
        cursor: 'pointer', textAlign: 'left',
        padding: '20px 0 16px',
        borderTop: '2px solid #1A3A6B',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '20px' }}>{collection.icon}</span>
          <div>
            <h3 style={{
              fontFamily: 'Newsreader, serif', fontSize: '22px',
              fontWeight: 400, color: '#1A3A6B', margin: 0, letterSpacing: '0.01em',
            }}>
              {collection.name[lang]}
            </h3>
            <p style={{
              fontFamily: 'Manrope, sans-serif', fontSize: '12px',
              color: '#9CA3AF', margin: '3px 0 0', fontStyle: 'italic',
            }}>
              {collection.tagline[lang]}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{
            fontFamily: 'Newsreader, serif', fontSize: '26px',
            fontWeight: 300, color: '#C4C6D0',
          }}>{total}</span>
          <span style={{ color: '#1A3A6B', fontSize: '18px', transition: 'transform 0.2s', transform: open ? 'rotate(90deg)' : 'none', display: 'inline-block' }}>›</span>
        </div>
      </button>

      {open && (
        <div>
          <p style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '13px',
            color: '#43474F', lineHeight: 1.7, margin: '0 0 24px',
            maxWidth: '580px', borderLeft: '2px solid #EFC0D4', paddingLeft: '16px',
          }}>
            {collection.description[lang]}
          </p>

          {collection.subcategories?.map((sub, i) => {
            const subFiltered = activeFilter === 'all' ? sub.products : sub.products.filter(p => p.tier === activeFilter)
            if (!subFiltered.length) return null
            return (
              <div key={i} style={{ marginBottom: '28px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px',
                }}>
                  <span style={{
                    fontFamily: 'Manrope, sans-serif', fontSize: '11px',
                    fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: '#1A3A6B',
                  }}>{sub.name[lang]}</span>
                  <span style={{ color: '#C4C6D0', fontSize: '10px' }}>——</span>
                  <span style={{
                    fontFamily: 'Newsreader, serif', fontSize: '12px',
                    color: '#9CA3AF', fontStyle: 'italic',
                  }}>{sub.tagline[lang]}</span>
                </div>
                {subFiltered.map((p, j) => <ProductRow key={j} product={p} lang={lang} />)}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function CataloguePage() {
  const { i18n } = useTranslation()
  const lang = 'fr' // toujours français
  const [activeFilter, setActiveFilter] = useState('all')

  const allProducts = collections.flatMap(c =>
    c.subcategories?.flatMap(s => s.products) || c.products || []
  )
  const counts = {
    icon: allProducts.filter(p => p.tier === 'icon').length,
    hero: allProducts.filter(p => p.tier === 'hero').length,
    challenger: allProducts.filter(p => p.tier === 'challenger').length,
  }

  const filters = [
    { key: 'all', label: lang === 'fr' ? 'Vue globale' : 'All' },
    { key: 'icon', label: 'Icons' },
    { key: 'hero', label: lang === 'fr' ? 'Héros' : 'Heroes' },
    { key: 'challenger', label: 'Challengers' },
  ]

  return (
    <div style={{ background: '#F9F9F9', minHeight: '100vh' }}>

      {/* ─── HERO — image retbaa_02.jpg ─── */}
      <div style={{
        position: 'relative',
        minHeight: '280px',
        display: 'flex', alignItems: 'flex-end',
        overflow: 'hidden',
      }}>
        <img
          src="/retbaa-photos/retbaa_02.jpg"
          alt="Architecture Produits Retbaa"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center',
          }}
        />
        {/* Blue overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(13,31,60,0.93) 0%, rgba(26,58,107,0.88) 55%, rgba(26,58,107,0.70) 100%)',
        }} />
        {/* Liseré rose */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: '3px',
          background: 'linear-gradient(to bottom, transparent, #EFC0D4 40%, transparent)',
        }} />

        <div style={{
          position: 'relative', zIndex: 10,
          maxWidth: '1100px', margin: '0 auto', width: '100%',
          padding: '48px 40px 40px',
        }}>
          <p style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '10px',
            color: 'rgba(255,255,255,0.45)', letterSpacing: '0.2em',
            textTransform: 'uppercase', margin: '0 0 8px', fontWeight: 600,
          }}>
            {lang === 'fr' ? 'Retbaa Circle · Portail Investisseurs' : 'Retbaa Circle · Investor Portal'}
          </p>
          <h1 style={{
            fontFamily: 'Newsreader, serif', fontSize: '42px',
            fontWeight: 300, color: '#fff', margin: 0, letterSpacing: '-0.01em',
          }}>
            {lang === 'fr' ? 'Architecture Produits' : 'Product Architecture'}
          </h1>
          <p style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '14px',
            color: 'rgba(255,255,255,0.60)', margin: '10px 0 0', lineHeight: 1.65,
            maxWidth: '500px',
          }}>
            {lang === 'fr'
              ? `Vision de la hiérarchisation du portefeuille Retbaa — 3 univers, 3 niveaux stratégiques, ${allProducts.length} références.`
              : `Overview of Retbaa's product portfolio hierarchy — 3 universes, 3 strategic tiers, ${allProducts.length} references.`}
          </p>

          {/* Métriques rapides */}
          <div style={{
            display: 'flex', gap: '36px', marginTop: '32px',
            paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.10)',
            flexWrap: 'wrap',
          }}>
            {[
              { label: lang === 'fr' ? 'Univers' : 'Universes', value: '3' },
              { label: lang === 'fr' ? 'Références totales' : 'Total SKUs', value: allProducts.length },
              { label: lang === 'fr' ? 'Fabriqué en France' : 'Made in France', value: '100%' },
              { label: lang === 'fr' ? 'Origine Afrique' : 'African Origin', value: '100%' },
            ].map((m, i) => (
              <div key={i}>
                <div style={{
                  fontFamily: 'Newsreader, serif', fontSize: '28px',
                  fontWeight: 300, color: '#EFC0D4',
                }}>{m.value}</div>
                <div style={{
                  fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                  color: 'rgba(255,255,255,0.40)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600,
                }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '44px 40px 60px' }}>

        {/* ─── 3 Tiers avec images ─── */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '2px', height: '16px', background: '#EFC0D4' }} />
            <h2 style={{
              fontFamily: 'Newsreader, serif', fontSize: '20px',
              fontWeight: 400, color: '#1A3A6B', margin: 0,
              letterSpacing: '0.02em',
            }}>
              {lang === 'fr' ? 'Hiérarchisation stratégique' : 'Strategic Hierarchy'}
            </h2>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px',
          }}
            className="tier-grid"
          >
            <TierSummaryCard tier="icon" count={counts.icon} lang={lang} />
            <TierSummaryCard tier="hero" count={counts.hero} lang={lang} />
            <TierSummaryCard tier="challenger" count={counts.challenger} lang={lang} />
          </div>
        </div>

        {/* ─── Filtres ─── */}
        <div style={{
          display: 'flex', gap: '8px', marginBottom: '32px',
          paddingBottom: '16px',
          borderBottom: '1px solid #EEEEEE',
          flexWrap: 'wrap', alignItems: 'center',
        }}>
          <span style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '10px',
            color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase',
            marginRight: '8px', fontWeight: 600,
          }}>
            {lang === 'fr' ? 'Filtrer :' : 'Filter:'}
          </span>
          {filters.map(f => (
            <button key={f.key} onClick={() => setActiveFilter(f.key)} style={{
              padding: '7px 18px', borderRadius: '2px', cursor: 'pointer',
              border: activeFilter === f.key ? '1px solid #1A3A6B' : '1px solid #EEEEEE',
              background: activeFilter === f.key ? '#1A3A6B' : '#ffffff',
              color: activeFilter === f.key ? '#fff' : '#43474F',
              fontFamily: 'Manrope, sans-serif', fontSize: '11px',
              fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
              transition: 'all 0.15s',
            }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* ─── Collections ─── */}
        {collections.map(col => (
          <CollectionBlock key={col.id} collection={col} lang={lang} activeFilter={activeFilter} />
        ))}

        {/* ─── Footer catalogue ─── */}
        <div style={{
          marginTop: '48px', padding: '28px 32px',
          background: '#ffffff',
          borderTop: '2px solid #EFC0D4',
          borderRadius: '4px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '16px',
          boxShadow: '0px 2px 12px rgba(0,27,63,0.04)',
        }}>
          <div>
            <p style={{
              fontFamily: 'Newsreader, serif', fontSize: '22px',
              fontWeight: 400, color: '#1A3A6B', margin: '0 0 4px',
              fontStyle: 'italic',
            }}>
              Le Recueil 2026
            </p>
            <p style={{
              fontFamily: 'Manrope, sans-serif', fontSize: '12px',
              color: '#9CA3AF', margin: 0,
            }}>
              {lang === 'fr'
                ? 'Catalogue complet de la collection — accès investisseurs'
                : 'Full collection catalogue — investor access'}
            </p>
          </div>
          <a
            href="https://heyzine.com/flip-book/Retbaa_LeRecueil2026"
            target="_blank" rel="noopener noreferrer"
            style={{
              padding: '12px 28px', background: '#EFC0D4', color: '#1A3A6B',
              fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none',
              borderRadius: '4px', transition: 'opacity 0.15s',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {lang === 'fr' ? 'Voir le catalogue' : 'View catalogue'}
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .tier-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
