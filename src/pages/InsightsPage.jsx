// pages/InsightsPage.jsx — Retbaa Circle — Revue éditoriale investisseurs
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

// ─── DONNÉES ARTICLES ──────────────────────────────────────────
const articles = [
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

const FILTERS = ['Tout', 'Marché Luxe', 'Stratégie', 'Géopolitique', 'Distribution']

// ─── ARTICLE FEATURED (pleine largeur) ───────────────────────
function FeaturedArticle({ article }) {
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
      <div style={{ overflow: 'hidden', position: 'relative', minHeight: '420px' }}>
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
            <a
              href={article.pdf}
              target="_blank"
              download
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                fontWeight: 700, color: '#1A3A6B',
                background: 'rgba(26,58,107,0.05)',
                border: '1px solid rgba(26,58,107,0.15)',
                padding: '10px 18px', borderRadius: '2px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#1A3A6B'
                e.currentTarget.style.color = '#ffffff'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(26,58,107,0.05)'
                e.currentTarget.style.color = '#1A3A6B'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
              Lire l'étude
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── ARTICLE CARD (grille 3 colonnes) ────────────────────────
function ArticleCard({ article }) {
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
          <a
            href={article.pdf}
            target="_blank"
            download
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontFamily: 'Manrope, sans-serif', fontSize: '10px',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              fontWeight: 700, color: '#795465',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#1A3A6B'}
            onMouseLeave={e => e.currentTarget.style.color = '#795465'}
          >
            Lire l'étude
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────────
export default function InsightsPage() {
  const { i18n } = useTranslation()
  const [activeFilter, setActiveFilter] = useState('Tout')

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
    <div style={{ background: '#F9F9F9', minHeight: '100vh' }}>

      {/* ─── HERO ──────────────────────────────────────────── */}
      <section style={{
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
        }} className="no-scrollbar">
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
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '56px 48px 80px' }}>

        {/* Article featured */}
        {featuredArticle && filteredArticles.length > 0 && (
          <FeaturedArticle article={featuredArticle} />
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
              <ArticleCard key={article.id} article={article} />
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
  )
}
