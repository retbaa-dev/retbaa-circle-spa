// pages/ObservateurDashboard.jsx — Retbaa Circle — Vue Observateur (Prospect)
// Variante du Dashboard pour les prospects non-investisseurs
import { useState } from 'react'
import Timeline from '../components/Timeline'

const lang = 'fr'

// ─── ACTUALITÉS ──────────────────────────────────────────────
const news = [
  {
    tag: 'Marché Luxe',
    date: '7 Avr 2026',
    title: 'LVMH, Kering, Hermès : les résultats T1 tombent cette semaine',
    summary: "Le secteur luxe sous les projecteurs : LVMH (lundi 13), Kering (mardi 14), Hermès (mercredi 15). Après un T4 2025 difficile pour les géants, le marché attend des signaux sur la reprise chinoise et l'impact des droits de douane américains.",
    analysis: "Si Hermès publie encore une croissance positive, ça confirme que le luxe intégral tient. Retbaa est exactement sur ce positionnement — artisanal, rare, sans compromis.",
    img: '/retbaa-photos/retbaa_11.jpg',
  },
  {
    tag: 'Stratégie',
    date: '31 Mar 2026',
    title: "L'Oréal rachète Kering Beauté (dont Creed) pour 4 Mds€",
    summary: "Plus grosse acquisition de l'histoire de L'Oréal. Kering cède tout son pôle olfactif pour se recentrer sur la mode. Une recomposition majeure du marché de la parfumerie niche.",
    analysis: "La cession de Creed redistribue les cartes dans la parfumerie niche. Le terrain se restructure — une fenêtre s'ouvre pour les acteurs africains du luxe sensoriel comme Retbaa.",
    img: '/retbaa-photos/retbaa_12.jpg',
  },
  {
    tag: 'Opportunité',
    date: '1 Avr 2026',
    title: "Luxe MEA : +10,6% de croissance annuelle attendue d'ici 2031",
    summary: "Le marché du luxe Moyen-Orient & Afrique devrait passer de 19,8 Mds$ à 36,2 Mds$ d'ici 2031. La classe HNW africaine atteindra 198 000 personnes en 2026.",
    analysis: "Retbaa entre sur ce marché au moment exact où il prend de la vitesse. L'avantage du premier entrant — africain et authentique — ne durera pas indéfiniment.",
    img: '/retbaa-photos/retbaa_13.jpg',
  },
]

// ─── CAROUSEL BLOCKS ─────────────────────────────────────────
const carouselBlocks = [
  {
    id: 'insights',
    icon: 'insights',
    tag: 'Editorial',
    title: 'Retbaa Insights',
    subtitle: 'Études & analyses du marché du luxe africain',
    preview: '"The Rise of African Artisanal Perfumery"',
    cta: 'Explorer',
    ctaIcon: 'east',
    bg: '#1A3A6B',
    accent: '#EFC0D4',
    tagColor: '#EFC0D4',
    textColor: '#fff',
    subtitleColor: 'rgba(171,199,255,0.85)',
    previewBorder: 'rgba(239,192,212,0.3)',
    previewColor: 'rgba(255,255,255,0.8)',
  },
  {
    id: 'podcast',
    icon: 'mic',
    tag: 'Audio',
    title: 'Retbaa Podcast',
    subtitle: 'Les coulisses de la marque',
    preview: '"Episode 12: Crafting Scented Memories"',
    cta: 'Écouter',
    ctaIcon: 'play_circle',
    bg: '#EFC0D4',
    accent: '#1A3A6B',
    tagColor: '#795465',
    textColor: '#1A3A6B',
    subtitleColor: '#795465',
    previewBorder: 'rgba(26,58,107,0.2)',
    previewColor: 'rgba(26,58,107,0.7)',
  },
]

// ─── KPI CARD FLOUTÉE ─────────────────────────────────────────
function KpiCardBlurred({ label, icon }) {
  return (
    <div style={{
      background: '#ffffff',
      borderLeft: '4px solid #EFC0D4',
      borderRadius: '0 4px 4px 0',
      padding: '32px',
      display: 'flex', flexDirection: 'column', gap: '16px',
      boxShadow: '0px 10px 30px rgba(239,192,212,0.15)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Contenu flouté */}
      <div style={{ filter: 'blur(6px)', userSelect: 'none', pointerEvents: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '10px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#795465', fontWeight: 700,
          }}>
            {label}
          </span>
          <span className="material-symbols-outlined" style={{
            color: '#EFC0D4', fontSize: '20px',
            background: 'rgba(239,192,212,0.1)',
            padding: '8px', borderRadius: '50%',
          }}>
            {icon}
          </span>
        </div>
        <div style={{
          fontFamily: 'Newsreader, serif', fontSize: '30px', fontWeight: 300,
          color: '#1A3A6B', lineHeight: 1.1, marginTop: '16px',
        }}>
          ██████
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '16px' }}>
          <span style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '10px',
            textTransform: 'uppercase', fontWeight: 700,
            color: '#9CA3AF',
          }}>
            ████████
          </span>
        </div>
      </div>

      {/* Overlay NDA */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(249,249,249,0.7)',
        backdropFilter: 'blur(2px)',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#1A3A6B' }}>lock</span>
        <div style={{
          fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: '#1A3A6B',
          marginTop: '6px', textAlign: 'center',
          fontFamily: 'Manrope, sans-serif',
        }}>
          Accessible après<br />signature NDA
        </div>
      </div>
    </div>
  )
}

// ─── CAROUSEL CARD ────────────────────────────────────────────
function CarouselCard({ block, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        minWidth: '380px', flexShrink: 0,
        background: block.bg, borderRadius: '4px',
        padding: '32px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'transform 0.5s ease',
        transform: hovered ? 'scale(0.99)' : 'scale(1)',
        boxShadow: '0px 20px 40px rgba(0,27,63,0.06)',
        scrollSnapAlign: 'start',
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <span className="material-symbols-outlined" style={{ color: block.accent, fontSize: '36px' }}>{block.icon}</span>
          <span style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '10px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: block.tagColor, fontWeight: 700,
          }}>{block.tag}</span>
        </div>
        <h3 style={{
          fontFamily: 'Newsreader, serif', fontSize: '30px', fontWeight: 400,
          color: block.textColor, margin: '0 0 8px', lineHeight: 1.15,
        }}>{block.title}</h3>
        <p style={{
          fontFamily: 'Manrope, sans-serif', fontSize: '11px',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: block.subtitleColor, fontWeight: 500, margin: '0 0 24px',
        }}>{block.subtitle}</p>
        <div style={{
          borderLeft: `1px solid ${block.previewBorder}`,
          paddingLeft: '16px', paddingTop: '4px', paddingBottom: '4px',
        }}>
          <p style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '13px',
            fontStyle: 'italic', lineHeight: 1.65,
            color: block.previewColor, margin: 0,
          }}>{block.preview}</p>
        </div>
      </div>
      <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'flex-end' }}>
        <button style={{
          display: 'flex', alignItems: 'center',
          gap: hovered ? '16px' : '8px',
          fontFamily: 'Manrope, sans-serif', fontSize: '10px',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          fontWeight: 700, color: block.accent,
          background: 'none', border: 'none', cursor: 'pointer',
          transition: 'gap 0.3s ease',
        }}>
          {block.cta}
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{block.ctaIcon}</span>
        </button>
      </div>
    </div>
  )
}

export default function ObservateurDashboard({ setActivePage }) {
  const [footerModal, setFooterModal] = useState(null)

  const navigate = (page) => {
    if (setActivePage) setActivePage(page)
  }

  const ndaMailto = `mailto:massata@retbaa.com?subject=${encodeURIComponent('Demande NDA Retbaa Circle')}&body=${encodeURIComponent('Bonjour Massata, je souhaite recevoir le NDA pour accéder aux données complètes du portail Retbaa Circle.')}`

  return (
    <div style={{ background: '#F9F9F9', minHeight: '100vh' }}>

      {/* ─── HERO OBSERVATEUR ─── */}
      <section style={{
        background: 'linear-gradient(160deg, #0D2247 0%, #1A3A6B 60%, #2A4A7B 100%)',
        padding: '72px 48px 64px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Décoration cercles */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'rgba(239,192,212,0.06)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-40px', left: '30%',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'rgba(239,192,212,0.04)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 14px',
            background: 'rgba(239,192,212,0.12)',
            border: '1px solid rgba(239,192,212,0.25)',
            borderRadius: '2px',
            marginBottom: '32px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EFC0D4', flexShrink: 0 }} />
            <span style={{
              fontFamily: 'Manrope, sans-serif', fontSize: '9px',
              letterSpacing: '0.25em', textTransform: 'uppercase',
              color: '#EFC0D4', fontWeight: 700,
            }}>Retbaa Circle — Portail Investisseurs</span>
          </div>

          {/* Titre principal */}
          <h1 style={{
            fontFamily: 'Newsreader, serif',
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 300, fontStyle: 'italic',
            color: '#ffffff', margin: '0 0 8px', lineHeight: 1.05,
          }}>
            Pas une marque africaine<br />qui exporte.
          </h1>
          <h2 style={{
            fontFamily: 'Newsreader, serif',
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 300,
            color: 'rgba(239,192,212,0.9)', margin: '0 0 32px', lineHeight: 1.15,
          }}>
            Une maison internationale<br />qui assume ses racines.
          </h2>

          {/* Signature */}
          <p style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '11px',
            letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)', fontWeight: 500, margin: '0 0 48px',
          }}>
            Crafted in Paris · Rooted in Africa · For the World
          </p>

          {/* Chiffres clés marché */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2px', marginBottom: '48px',
          }} className="hero-stats-grid">
            {[
              { value: '$36Bn', label: 'Marché luxe MEA d\'ici 2031', sub: '+10.6% CAGR' },
              { value: '198K', label: 'HNW africains en 2026', sub: '+12% vs 2025' },
              { value: '8-10×', label: 'Multiple de sortie cible', sub: 'Horizon 2029-30' },
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '20px 24px',
                borderLeft: i === 0 ? '2px solid rgba(239,192,212,0.4)' : 'none',
              }}>
                <div style={{
                  fontFamily: 'Newsreader, serif', fontSize: '32px',
                  fontWeight: 300, color: '#EFC0D4', lineHeight: 1,
                }}>{stat.value}</div>
                <div style={{
                  fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                  color: 'rgba(255,255,255,0.6)', marginTop: '6px', lineHeight: 1.4,
                }}>{stat.label}</div>
                <div style={{
                  fontFamily: 'Manrope, sans-serif', fontSize: '9px',
                  color: 'rgba(239,192,212,0.5)', marginTop: '4px',
                  letterSpacing: '0.05em',
                }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Pourquoi Retbaa — 3 points */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px',
            marginBottom: '48px',
          }} className="hero-why-grid">
            {[
              { icon: 'diamond', title: 'Luxe sensoriel', body: 'Olfaction, céramique, expérience multisensorielle. Un territoire que les grandes maisons n\'ont pas encore colonisé.' },
              { icon: 'public', title: 'Positionnement global', body: 'Paris pour l\'excellence. L\'Afrique pour l\'authenticité. Le monde entier comme terrain de jeu.' },
              { icon: 'trending_up', title: 'Momentum', body: 'CA €191K en 2025. Target €500K 2026 → €1M 2027. Pipeline B2B de €800K déjà identifié.' },
            ].map((item, i) => (
              <div key={i} style={{
                borderTop: '1px solid rgba(239,192,212,0.15)',
                paddingTop: '20px',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#EFC0D4', marginBottom: '12px', display: 'block' }}>{item.icon}</span>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#ffffff', marginBottom: '8px', letterSpacing: '0.05em' }}>{item.title}</div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{item.body}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a
              href="mailto:massata@retbaa.com?subject=Demande%20NDA%20Retbaa%20Circle&body=Bonjour%20Massata%2C%20je%20souhaite%20recevoir%20le%20NDA%20pour%20acc%C3%A9der%20aux%20donn%C3%A9es%20compl%C3%A8tes%20du%20portail%20Retbaa%20Circle."
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '14px 28px',
                background: '#EFC0D4', color: '#1A3A6B',
                borderRadius: '4px', textDecoration: 'none',
                fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>description</span>
              Demander le NDA
            </a>
            <a
              href="mailto:massata@retbaa.com?subject=Contact%20Retbaa%20Circle"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '14px 28px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                borderRadius: '4px', textDecoration: 'none',
                fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>mail</span>
              Contacter Massata
            </a>
          </div>
        </div>
      </section>

      {/* ─── KPI BAR — 4 blocs floutés ─── */}
      <section style={{ background: '#ffffff', boxShadow: '0px 20px 40px rgba(0,27,63,0.06)' }}>
        <div style={{
          maxWidth: '1400px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        }} className="kpi-grid">
          <KpiCardBlurred label="Valorisation post-money" icon="account_balance" />
          <KpiCardBlurred label="Participation" icon="pie_chart" />
          <KpiCardBlurred label="Documents" icon="description" />
          <KpiCardBlurred label="Statut closing" icon="verified" />
        </div>
      </section>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 48px 64px' }} className="dashboard-main-padding">

        {/* ─── CAROUSEL ─── */}
        <section style={{ marginBottom: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '2px', height: '16px', background: '#EFC0D4', flexShrink: 0 }} />
            <span style={{
              fontFamily: 'Manrope, sans-serif', fontSize: '10px',
              color: '#1A3A6B', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700,
            }}>
              Espaces accessibles
            </span>
          </div>

          {(() => {
            const [carIdx, setCarIdx] = useState(0)
            const total = carouselBlocks.length
            const prev = () => setCarIdx(i => (i - 1 + total) % total)
            const next = () => setCarIdx(i => (i + 1) % total)
            return (
              <div style={{ position: 'relative' }}>
                <button onClick={prev} style={{
                  position: 'absolute', left: '-16px', top: '50%',
                  transform: 'translateY(-50%)', zIndex: 10,
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: '#ffffff', border: '1px solid rgba(239,192,212,0.4)',
                  boxShadow: '0 2px 12px rgba(0,27,63,0.1)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#EFC0D4'}
                  onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#1A3A6B' }}>chevron_left</span>
                </button>
                <div style={{ overflow: 'hidden', borderRadius: '4px' }}>
                  <div style={{
                    display: 'flex',
                    transform: `translateX(-${carIdx * 100}%)`,
                    transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
                  }} className="carousel-row">
                    {carouselBlocks.map(block => (
                      <div key={block.id} style={{ minWidth: '100%', flexShrink: 0 }}>
                        <CarouselCard block={block} onClick={() => navigate(block.id)} />
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={next} style={{
                  position: 'absolute', right: '-16px', top: '50%',
                  transform: 'translateY(-50%)', zIndex: 10,
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: '#ffffff', border: '1px solid rgba(239,192,212,0.4)',
                  boxShadow: '0 2px 12px rgba(0,27,63,0.1)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#EFC0D4'}
                  onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#1A3A6B' }}>chevron_right</span>
                </button>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
                  {carouselBlocks.map((_, i) => (
                    <button key={i} onClick={() => setCarIdx(i)} style={{
                      width: i === carIdx ? '24px' : '8px', height: '8px',
                      borderRadius: '4px',
                      background: i === carIdx ? '#EFC0D4' : 'rgba(239,192,212,0.3)',
                      border: 'none', cursor: 'pointer', padding: 0,
                      transition: 'all 0.25s ease',
                    }} />
                  ))}
                </div>
              </div>
            )
          })()}
        </section>

        {/* ─── CORPS ─── */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: '1fr 360px',
          gap: '48px', marginBottom: '56px',
        }} className="dashboard-grid">

          {/* ── Colonne gauche ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

            {/* Documents légaux — accès restreint */}
            <div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                paddingBottom: '16px', marginBottom: '24px',
                borderBottom: '2px solid rgba(239,192,212,0.2)',
              }}>
                <h2 style={{
                  fontFamily: 'Newsreader, serif', fontSize: '30px', fontWeight: 300,
                  color: '#1A3A6B', margin: 0,
                }}>
                  Documents légaux
                </h2>
              </div>

              {/* Card accès restreint */}
              <div style={{
                background: '#ffffff',
                borderRadius: '4px',
                padding: '32px',
                boxShadow: '0px 2px 8px rgba(0,27,63,0.04)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center', gap: '16px',
              }}>
                <div style={{
                  width: '56px', height: '56px',
                  background: 'rgba(26,58,107,0.06)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#1A3A6B' }}>lock</span>
                </div>
                <div>
                  <div style={{
                    fontFamily: 'Newsreader, serif', fontSize: '22px', fontWeight: 400,
                    color: '#1A3A6B', marginBottom: '8px',
                  }}>
                    Documents légaux réservés aux investisseurs
                  </div>
                  <div style={{
                    fontFamily: 'Manrope, sans-serif', fontSize: '13px',
                    color: '#9CA3AF', lineHeight: 1.65, maxWidth: '400px',
                  }}>
                    Pacte d'actionnaires, statuts et registre accessibles après entrée au capital.
                  </div>
                </div>
                <a
                  href={ndaMailto}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '12px 24px',
                    background: '#EFC0D4', color: '#1A3A6B',
                    borderRadius: '4px', textDecoration: 'none',
                    fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                    fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
                    marginTop: '8px',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>description</span>
                  Demander le NDA
                </a>
              </div>
            </div>

            {/* ─── ACTUALITÉS ─── */}
            <div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                paddingBottom: '16px', marginBottom: '24px',
                borderBottom: '1px solid #EFC0D4',
              }}>
                <h2 style={{
                  fontFamily: 'Newsreader, serif', fontSize: '30px', fontWeight: 300,
                  color: '#1A3A6B', margin: 0,
                }}>
                  Portfolio Insights
                </h2>
                <span style={{
                  fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: '#795465', fontWeight: 700,
                }}>
                  Actualités Retbaa
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="news-grid">
                {news.slice(0, 2).map((item, i) => (
                  <div key={i} style={{ cursor: 'pointer' }} className="news-card-group"
                    onMouseEnter={e => {
                      const img = e.currentTarget.querySelector('.news-img')
                      const title = e.currentTarget.querySelector('.news-title')
                      if (img) img.style.transform = 'scale(1.05)'
                      if (title) title.style.color = '#795465'
                    }}
                    onMouseLeave={e => {
                      const img = e.currentTarget.querySelector('.news-img')
                      const title = e.currentTarget.querySelector('.news-title')
                      if (img) img.style.transform = 'scale(1)'
                      if (title) title.style.color = '#1A3A6B'
                    }}
                  >
                    <div style={{
                      aspectRatio: '16/9', width: '100%', overflow: 'hidden',
                      marginBottom: '24px', borderBottom: '4px solid #EFC0D4',
                    }}>
                      <img
                        className="news-img"
                        src={item.img} alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1s ease' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <span style={{
                        fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                        color: '#EFC0D4', fontWeight: 800,
                      }}>{item.tag}</span>
                      <h4 className="news-title" style={{
                        fontFamily: 'Newsreader, serif', fontSize: '22px', fontWeight: 400,
                        color: '#1A3A6B', lineHeight: 1.3, margin: 0,
                        transition: 'color 0.2s',
                      }}>{item.title}</h4>
                      <p style={{
                        fontFamily: 'Manrope, sans-serif', fontSize: '13px',
                        color: '#43474F', lineHeight: 1.7, margin: '0 0 10px',
                      }}>{item.summary}</p>
                      {item.analysis && (
                        <div style={{
                          display: 'flex', alignItems: 'flex-start', gap: '8px',
                          borderLeft: '2px solid #EFC0D4', paddingLeft: '10px',
                        }}>
                          <span style={{
                            fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                            fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                            color: '#EFC0D4', flexShrink: 0, marginTop: '1px',
                          }}>Kemia →</span>
                          <span style={{
                            fontFamily: 'Newsreader, serif', fontStyle: 'italic',
                            fontSize: '12px', color: '#795465', lineHeight: 1.6,
                          }}>{item.analysis}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {news[2] && (
                <div style={{
                  marginTop: '32px', display: 'flex', gap: '24px', cursor: 'pointer',
                  paddingTop: '32px', borderTop: '1px solid rgba(239,192,212,0.2)',
                }}>
                  <div style={{ width: '180px', flexShrink: 0, overflow: 'hidden', borderBottom: '3px solid #EFC0D4' }}>
                    <img src={news[2].img} alt={news[2].title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: '120px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
                    <span style={{
                      fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                      letterSpacing: '0.2em', textTransform: 'uppercase',
                      color: '#EFC0D4', fontWeight: 800,
                    }}>{news[2].tag}</span>
                    <div style={{
                      fontFamily: 'Newsreader, serif', fontSize: '20px', fontWeight: 400,
                      color: '#1A3A6B', lineHeight: 1.35,
                    }}>{news[2].title}</div>
                    <p style={{
                      fontFamily: 'Manrope, sans-serif', fontSize: '12px',
                      color: '#43474F', lineHeight: 1.65, margin: '0 0 10px',
                    }}>{news[2].summary}</p>
                    {news[2].analysis && (
                      <div style={{
                        display: 'flex', alignItems: 'flex-start', gap: '8px',
                        borderLeft: '2px solid #EFC0D4', paddingLeft: '10px',
                      }}>
                        <span style={{
                          fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                          fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                          color: '#EFC0D4', flexShrink: 0, marginTop: '1px',
                        }}>Kemia →</span>
                        <span style={{
                          fontFamily: 'Newsreader, serif', fontStyle: 'italic',
                          fontSize: '12px', color: '#795465', lineHeight: 1.6,
                        }}>{news[2].analysis}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Colonne droite ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Timeline lang={lang} />

            {/* Cap table masquée */}
            <div style={{
              background: '#ffffff',
              borderTop: '3px solid #EFC0D4',
              padding: '24px',
              borderRadius: '4px',
              boxShadow: '0px 20px 40px rgba(0,27,63,0.04)',
            }}>
              <div style={{
                fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                color: '#1A3A6B', letterSpacing: '0.2em', textTransform: 'uppercase',
                fontWeight: 700, marginBottom: '20px',
              }}>
                Cap Table
              </div>

              {/* Card confidentielle */}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center', gap: '12px', padding: '20px 16px',
                background: 'rgba(26,58,107,0.03)', borderRadius: '4px',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#1A3A6B' }}>lock</span>
                <div style={{
                  fontFamily: 'Newsreader, serif', fontSize: '16px', fontWeight: 400,
                  color: '#1A3A6B',
                }}>
                  Cap table confidentielle
                </div>
                <div style={{
                  fontFamily: 'Manrope, sans-serif', fontSize: '11px',
                  color: '#9CA3AF', lineHeight: 1.6,
                }}>
                  Accessible aux investisseurs certifiés après signature du NDA.
                </div>
                <a
                  href={`mailto:massata@retbaa.com?subject=${encodeURIComponent('Demande NDA Retbaa')}`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px',
                    background: '#EFC0D4', color: '#1A3A6B',
                    borderRadius: '4px', textDecoration: 'none',
                    fontFamily: 'Manrope, sans-serif', fontSize: '9px',
                    fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                    marginTop: '4px',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>description</span>
                  Demander le NDA
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ─── FOOTER ─── */}
      <footer style={{
        width: '100%', padding: '64px 48px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '32px',
        borderTop: '4px solid #EFC0D4',
        background: '#1A3A6B', color: '#fff',
      }}>
        <div style={{
          width: '100%', maxWidth: '1400px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '24px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: '28px', color: '#EFC0D4' }}>
              Retbaa Circle
            </span>
            <p style={{
              fontFamily: 'Manrope, sans-serif', fontSize: '10px',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: 'rgba(196,198,208,0.7)', margin: 0,
            }}>
              © 2026 Retbaa Circle. An Editorial Monolith.
            </p>
          </div>
          <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '32px 48px', justifyContent: 'center' }}>
            {[
              { label: 'Contact', action: () => window.open('mailto:massata@retbaa.com?subject=[Retbaa Circle] Contact', '_blank') },
              { label: 'Demander le NDA', action: () => window.open(ndaMailto, '_blank') },
            ].map(({ label, action }) => (
              <button key={label} onClick={action} style={{
                fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: 'rgba(196,198,208,0.7)', background: 'none',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = '#EFC0D4'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(196,198,208,0.7)'}
              >{label}</button>
            ))}
          </nav>
        </div>
      </footer>

      {/* Badge observateur discret en bas */}
      <div style={{
        textAlign: 'center', padding: '16px',
        background: '#F0F4FF',
        fontFamily: 'Manrope, sans-serif', fontSize: '10px',
        color: '#9CA3AF', letterSpacing: '0.1em',
      }}>
        Vous consultez en mode Observateur ·{' '}
        <a href="mailto:massata@retbaa.com?subject=Demande%20acc%C3%A8s%20Retbaa%20Circle" style={{ color: '#1A3A6B', textDecoration: 'none', fontWeight: 700 }}>
          Demander l&apos;accès complet →
        </a>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 3px rgba(74,222,128,0.25); }
          50%       { box-shadow: 0 0 0 6px rgba(74,222,128,0.10); }
        }
        @media (max-width: 1024px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
          .kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .news-grid { grid-template-columns: 1fr !important; }
          .dashboard-main-padding { padding: 24px 16px !important; }
          .hero-stats-grid { grid-template-columns: 1fr !important; }
          .hero-why-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .kpi-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
