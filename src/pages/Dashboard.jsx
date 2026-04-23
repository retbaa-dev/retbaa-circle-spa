// pages/Dashboard.jsx — Retbaa Circle — Stitch Design System v4
// Complete redesign: Stitch-faithful + personalized hero + functional carousel
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import Timeline from '../components/Timeline'
import { CAP_TABLE as CAP_TABLE_DATA, COMPANY_INFO } from '../data/captable.js'

// ─── CAP TABLE — données officielles post-closing Tranche 1 (5 fév 2026) ───
const CAP_TABLE = [
  { name: 'Massata NIANG',    shortName: 'Massata',      invested: 1000,   shares: 100000, pct: 86.9565, founder: true  },
  { name: 'Barthélemy FAYE',  shortName: 'Barthélemy',   invested: 150000, shares: 6250,   pct: 5.4348,  founder: false },
  { name: 'Pape Amadou NGOM', shortName: 'Pape Amadou',  invested: 150000, shares: 6250,   pct: 5.4348,  founder: false },
  { name: 'Cathy MUIZA',      shortName: 'Cathy',        invested: 30000,  shares: 1250,   pct: 1.087,   founder: false },
  { name: 'Raphaël PERDRIX',  shortName: 'Raphaël',      invested: 30000,  shares: 1250,   pct: 1.087,   founder: false },
]

// Prix de souscription officiel : 24 € / action (post-closing 5 fév 2026)
const PRIX_SOUSCRIPTION = 24

// ─── DOCUMENTS ───────────────────────────────────────────────
const docs = [
  { id: 1, title: "Pacte d'actionnaires V2", type: 'Gouvernance', date: 'Fév. 2026', status: 'sign', pdf: '/docs/governance/pacte-actionnaires.pdf' },
  { id: 2, title: 'Statuts post-augmentation', type: 'Corporate', date: 'Fév. 2026', status: 'sign', pdf: '/docs/governance/statuts.pdf' },
  { id: 3, title: 'Registre des titres', type: 'Registres', date: 'Fév. 2026', status: 'sign', pdf: '/docs/governance/registre-titres.pdf' },
  { id: 4, title: 'Bulletin de souscription', type: 'Souscription', date: 'Fév. 2026', status: 'sign', pdf: '/docs/governance/bulletin-souscription.pdf' },
  { id: 5, title: 'Décision du Président', type: 'Corporate', date: 'Fév. 2026', status: 'sign', pdf: '/docs/governance/decision-president.pdf' },
  { id: 6, title: "Pièce d'identité", type: 'KYC', date: '—', status: 'upload', pdf: null },
]

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
    cta: 'Explore',
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
    cta: 'Listen',
    ctaIcon: 'play_circle',
    bg: '#EFC0D4',
    accent: '#1A3A6B',
    tagColor: '#795465',
    textColor: '#1A3A6B',
    subtitleColor: '#795465',
    previewBorder: 'rgba(26,58,107,0.2)',
    previewColor: 'rgba(26,58,107,0.7)',
  },
  {
    id: 'inner-circle',
    icon: 'diamond',
    tag: 'Private',
    title: 'Retbaa Inner Circle',
    subtitle: 'Espace exclusif investisseurs',
    preview: 'Message privé de Massata — 2 avr. 2026',
    cta: 'Enter',
    ctaIcon: 'lock_open',
    bg: '#001026',
    accent: '#EFC0D4',
    tagColor: 'rgba(239,192,212,0.6)',
    textColor: '#fff',
    subtitleColor: '#EFC0D4',
    previewBorder: 'rgba(239,192,212,0.3)',
    previewColor: 'rgba(255,255,255,0.8)',
  },
]

// ─── CAROUSEL CARD (Stitch-faithful, Lucide-free) ────────────
function CarouselCard({ block, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        minWidth: '380px',
        flexShrink: 0,
        background: block.bg,
        borderRadius: '4px',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'transform 0.5s ease',
        transform: hovered ? 'scale(0.99)' : 'scale(1)',
        boxShadow: '0px 20px 40px rgba(0,27,63,0.06)',
        scrollSnapAlign: 'start',
      }}
    >
      {/* Top row: icon + tag */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <span className="material-symbols-outlined" style={{ color: block.accent, fontSize: '36px' }}>
            {block.icon}
          </span>
          <span style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '10px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: block.tagColor, fontWeight: 700,
          }}>
            {block.tag}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: 'Newsreader, serif', fontSize: '30px', fontWeight: 400,
          color: block.textColor, margin: '0 0 8px', lineHeight: 1.15,
        }}>
          {block.title}
        </h3>

        {/* Subtitle */}
        <p style={{
          fontFamily: 'Manrope, sans-serif', fontSize: '11px',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: block.subtitleColor, fontWeight: 500, margin: '0 0 24px',
        }}>
          {block.subtitle}
        </p>

        {/* Preview quote */}
        <div style={{
          borderLeft: `1px solid ${block.previewBorder}`,
          paddingLeft: '16px', paddingTop: '4px', paddingBottom: '4px',
        }}>
          <p style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '13px',
            fontStyle: 'italic', lineHeight: 1.65,
            color: block.previewColor, margin: 0,
          }}>
            {block.preview}
          </p>
        </div>
      </div>

      {/* CTA */}
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
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
            {block.ctaIcon}
          </span>
        </button>
      </div>
    </div>
  )
}

// ─── KPI CARD (Stitch bento style) ───────────────────────────
function KpiCard({ label, value, sub, icon, subIcon, subColor }) {
  return (
    <div style={{
      background: '#ffffff',
      borderLeft: '4px solid #EFC0D4',
      borderRadius: '0 4px 4px 0',
      padding: '32px',
      display: 'flex', flexDirection: 'column', gap: '16px',
      boxShadow: '0px 10px 30px rgba(239,192,212,0.15)',
    }}>
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
        color: value.startsWith && value.startsWith('0') ? '#EFC0D4' : '#1A3A6B',
        lineHeight: 1.1,
      }}>
        {value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {subIcon && (
          <span className="material-symbols-outlined" style={{ fontSize: '12px', color: subColor || '#9CA3AF' }}>
            {subIcon}
          </span>
        )}
        <span style={{
          fontFamily: 'Manrope, sans-serif', fontSize: '10px',
          textTransform: 'uppercase', fontWeight: 700,
          color: subColor || '#9CA3AF',
        }}>
          {sub}
        </span>
      </div>
    </div>
  )
}

export default function Dashboard({ userName = 'Investisseur', setActivePage }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'fr' // toujours français par défaut
  const [footerModal, setFooterModal] = useState(null)

  // Greeting logic: Massata = Bonjour, others = Bienvenue
  const greeting = userName === 'Massata'
    ? 'Bonjour,'
    : (lang === 'fr' ? 'Bienvenue,' : 'Welcome,')

  // Cap table data for current user (founder sees all)
  const isFounder = userName === 'Massata'
  // Trouver le profil de l'utilisateur connecté par shortName
  const myRow = CAP_TABLE.find(r => r.shortName === userName) || CAP_TABLE[0]

  const navigate = (page) => {
    if (setActivePage) setActivePage(page)
  }

  return (
    <div style={{ background: '#F9F9F9', minHeight: '100vh' }}>

      {/* ─── HERO — Stitch style: fond #F9F9F9, grid 2 colonnes ─── */}
      <section style={{
        background: '#F9F9F9',
        padding: '48px 48px 40px',
      }} className="hero-padding">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'center',
          gap: '24px',
        }} className="hero-grid">

          {/* Left: greeting text */}
          <div>
            <h1 style={{
              fontFamily: 'Newsreader, serif',
              fontSize: '60px', fontWeight: 300, fontStyle: 'italic',
              color: '#1A3A6B', margin: '0 0 16px', lineHeight: 1.1,
              letterSpacing: '-0.01em',
            }} className="hero-title">
              {greeting}<br />{userName}.
            </h1>
            <p style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '13px',
              color: '#64748B',
              margin: 0,
              maxWidth: '28rem',
              lineHeight: 1.65,
            }}>
              Bienvenue dans votre espace investisseur Retbaa Circle. Retrouvez ici vos documents, votre participation et les dernières actualités du portefeuille.
            </p>
          </div>

          {/* Right: badge statut */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#ffffff',
              border: '1px solid rgba(239,192,212,0.4)',
              borderRadius: '4px', padding: '12px 20px',
              boxShadow: '0px 4px 16px rgba(239,192,212,0.15)',
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#4ADE80',
                boxShadow: '0 0 0 3px rgba(74,222,128,0.25)',
                animation: 'pulse-dot 2s ease-in-out infinite',
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: 'Manrope, sans-serif', fontSize: '11px',
                color: '#1A3A6B', letterSpacing: '0.08em', fontWeight: 600,
              }}>
                Closing Tranche 1 · Clôturé
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── KPI BAR — 4 blocs Stitch (fond blanc collé sous le hero) ─── */}
      <section style={{ background: '#ffffff', boxShadow: '0px 20px 40px rgba(0,27,63,0.06)' }}>
        <div style={{
          maxWidth: '1400px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        }} className="kpi-grid">
          <KpiCard
            label={lang === 'fr' ? 'Valorisation post-money' : 'Post-money valuation'}
            value={isFounder
              ? `3 M€`
              : myRow?.invested ? `${(myRow.invested/1000).toFixed(0)} K€` : '—'
            }
            sub={isFounder ? lang === 'fr' ? 'Pre-money : 2,4 M€ · Tranche 1 : 360 K€' : 'Pre-money: €2.4M · Tranche 1: €360K' : 'Tranche 1'}
            icon="account_balance"
            subIcon={isFounder ? null : "arrow_upward"}
            subColor="#9CA3AF"
          />
          <KpiCard
            label={lang === 'fr' ? 'Participation' : 'Shareholding %'}
            value={myRow?.pct ? `${myRow.pct.toFixed(2).replace('.', ',')} %` : '—'}
            sub={lang === 'fr' ? 'Post-augmentation' : 'Post-raise'}
            icon="pie_chart"
          />
          <KpiCard
            label={lang === 'fr' ? 'Documents' : 'Documents'}
            value="03"
            sub={lang === 'fr' ? 'Signature requise' : 'Signature Required'}
            icon="description"
            subIcon="error"
            subColor="#ba1a1a"
          />
          <KpiCard
            label={lang === 'fr' ? 'Statut closing' : 'Closing Status'}
            value="Stage 4/5"
            sub="ETA: 12 Déc"
            icon="verified"
            subIcon="schedule"
            subColor="#9CA3AF"
          />
        </div>
      </section>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 48px 64px' }} className="dashboard-main-padding">

        {/* ─── CAROUSEL — 3 blocs éditoriaux avec navigation ─── */}
        <section style={{ marginBottom: '56px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px',
          }}>
            <div style={{ width: '2px', height: '16px', background: '#EFC0D4', flexShrink: 0 }} />
            <span style={{
              fontFamily: 'Manrope, sans-serif', fontSize: '10px',
              color: '#1A3A6B', letterSpacing: '0.2em', textTransform: 'uppercase',
              fontWeight: 700,
            }}>
              {lang === 'fr' ? 'Espaces exclusifs' : 'Exclusive Spaces'}
            </span>
          </div>

          {/* Carrousel avec flèches + dots */}
          {(() => {
            const [carIdx, setCarIdx] = useState(0)
            const total = carouselBlocks.length
            const prev = () => setCarIdx(i => (i - 1 + total) % total)
            const next = () => setCarIdx(i => (i + 1) % total)
            return (
              <div style={{ position: 'relative', padding: '0 48px' }} className="carousel-container">
                {/* Flèche gauche */}
                <button onClick={prev} className="carousel-arrow carousel-arrow-left" style={{
                  position: 'absolute', left: '0', top: '50%',
                  transform: 'translateY(-50%)', zIndex: 10,
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: '#ffffff', border: '1px solid rgba(239,192,212,0.4)',
                  boxShadow: '0 2px 12px rgba(0,27,63,0.1)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#EFC0D4'}
                  onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#1A3A6B' }}>chevron_left</span>
                </button>

                {/* Carte active */}
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

                {/* Flèche droite */}
                <button onClick={next} className="carousel-arrow carousel-arrow-right" style={{
                  position: 'absolute', right: '0', top: '50%',
                  transform: 'translateY(-50%)', zIndex: 10,
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: '#ffffff', border: '1px solid rgba(239,192,212,0.4)',
                  boxShadow: '0 2px 12px rgba(0,27,63,0.1)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#EFC0D4'}
                  onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#1A3A6B' }}>chevron_right</span>
                </button>

                {/* Dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
                  {carouselBlocks.map((_, i) => (
                    <button key={i} onClick={() => setCarIdx(i)} style={{
                      width: i === carIdx ? '24px' : '8px',
                      height: '8px',
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

        {/* ─── CORPS : Gouvernance (Documents + Actualités) + Droite (Timeline + Mon investissement) ─── */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: '1fr 360px',
          gap: '48px', marginBottom: '56px',
        }} className="dashboard-grid">

          {/* ── Colonne gauche ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

            {/* Documents — Required Governance style Stitch */}
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
                  {lang === 'fr' ? 'Gouvernance requise' : 'Required Governance'}
                </h2>
                <button
                  onClick={() => navigate('documents')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                    color: '#795465', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700,
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#EFC0D4'}
                  onMouseLeave={e => e.currentTarget.style.color = '#795465'}
                >
                  {lang === 'fr' ? 'Voir tous les documents' : 'View All'}
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                </button>
              </div>

              {/* Liste docs — cards simples, pas de tableau */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {docs.map(doc => (
                  <div key={doc.id} style={{
                    background: '#ffffff', borderRadius: '4px',
                    padding: '16px 20px',
                    boxShadow: '0px 2px 8px rgba(0,27,63,0.04)',
                    display: 'flex', alignItems: 'center', gap: '16px',
                    transition: 'box-shadow 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0px 4px 16px rgba(239,192,212,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0px 2px 8px rgba(0,27,63,0.04)'}
                  >
                    {/* Icône fichier */}
                    <div style={{
                      width: '36px', height: '36px', flexShrink: 0,
                      background: 'rgba(26,58,107,0.06)', borderRadius: '4px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#1A3A6B' }}>description</span>
                    </div>

                    {/* Infos */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', fontWeight: 600, color: '#1A3A6B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {doc.title}
                      </div>
                      <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', color: '#9CA3AF', marginTop: '2px' }}>
                        {doc.type} · {doc.date}
                      </div>
                    </div>

                    {/* Badge statut + action */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                      <span style={{
                        padding: '3px 8px', borderRadius: '2px',
                        fontSize: '8px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                        fontFamily: 'Manrope, sans-serif',
                        background: doc.status === 'sign' ? 'rgba(186,26,26,0.06)' : 'rgba(239,192,212,0.15)',
                        color: doc.status === 'sign' ? '#ba1a1a' : '#795465',
                        border: doc.status === 'sign' ? '1px solid rgba(186,26,26,0.15)' : 'none',
                        whiteSpace: 'nowrap',
                      }}>
                        {doc.status === 'sign' ? (lang === 'fr' ? 'À signer' : 'To sign') : (lang === 'fr' ? 'Signé' : 'Signed')}
                      </span>
                      {doc.pdf ? (
                        <a href={doc.pdf} target="_blank" rel="noopener noreferrer" style={{ color: '#1A3A6B', display: 'flex', alignItems: 'center' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#EFC0D4'}
                          onMouseLeave={e => e.currentTarget.style.color = '#1A3A6B'}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>open_in_new</span>
                        </a>
                      ) : (
                        <span style={{ color: '#E0E0E0', display: 'flex', alignItems: 'center' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>lock</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Lien bas — flèche vers page Documents complète */}
              <button
                onClick={() => navigate('documents')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  marginTop: '16px', padding: '12px 20px', width: '100%',
                  background: 'none', border: '1px solid rgba(239,192,212,0.4)',
                  borderRadius: '4px', cursor: 'pointer',
                  fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                  fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: '#795465', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,192,212,0.1)'; e.currentTarget.style.borderColor = '#EFC0D4' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'rgba(239,192,212,0.4)' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>folder_open</span>
                {lang === 'fr' ? 'Accéder à tous les documents' : 'View all documents'}
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
              </button>
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
                  {lang === 'fr' ? 'Actualités Retbaa' : 'Curated Weekly Updates'}
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
                      }}>
                        {item.tag}
                      </span>
                      <h4 className="news-title" style={{
                        fontFamily: 'Newsreader, serif', fontSize: '22px', fontWeight: 400,
                        color: '#1A3A6B', lineHeight: 1.3, margin: 0,
                        transition: 'color 0.2s',
                      }}>
                        {item.title}
                      </h4>
                      <p style={{
                        fontFamily: 'Manrope, sans-serif', fontSize: '13px',
                        color: '#43474F', lineHeight: 1.7, margin: '0 0 10px',
                      }}>
                        {item.summary}
                      </p>
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
              {/* 3rd news item full-width */}
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
            {/* Récap investissement */}
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
                {lang === 'fr' ? 'Mon investissement' : 'My Investment'}
              </div>
              {[
                {
                  label: lang === 'fr' ? 'Capital investi' : 'Capital invested',
                  val: myRow?.invested ? `${myRow.invested.toLocaleString('fr-FR')} €` : '—',
                },
                {
                  label: lang === 'fr' ? "Nb. d'actions" : 'Shares held',
                  val: myRow?.shares ? myRow.shares.toLocaleString('fr-FR') : '—',
                },
                {
                  label: lang === 'fr' ? 'Prix / action' : 'Price / share',
                  val: `${PRIX_SOUSCRIPTION.toFixed(2).replace('.', ',')} €`
                },
                {
                  label: lang === 'fr' ? 'Participation' : 'Stake',
                  val: myRow?.pct ? `${myRow.pct} %` : '—',
                },
              ].map((row, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  paddingBottom: '12px', marginBottom: '12px',
                  borderBottom: i < 3 ? '1px solid #F3F3F4' : 'none',
                }}>
                  <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#43474F' }}>{row.label}</span>
                  <span style={{ fontFamily: 'Newsreader, serif', fontSize: '15px', color: '#1A1C1C', fontWeight: 400 }}>{row.val}</span>
                </div>
              ))}

              {/* Cap table view for Massata (founder) */}
              {isFounder && (
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #F3F3F4' }}>
                  <div style={{
                    fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                    color: '#795465', letterSpacing: '0.15em', textTransform: 'uppercase',
                    fontWeight: 700, marginBottom: '12px',
                  }}>
                    Cap Table — Vue fondateur
                  </div>
                  {CAP_TABLE.map((row, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: i < CAP_TABLE.length - 1 ? '1px solid rgba(243,243,244,0.8)' : 'none',
                    }}>
                      <div>
                        <span style={{
                          fontFamily: 'Manrope, sans-serif', fontSize: '11px',
                          color: row.founder ? '#1A3A6B' : '#43474F',
                          fontWeight: row.founder ? 700 : 400,
                        }}>
                          {row.shortName}{row.founder ? ' ★' : ''}
                        </span>
                        <span style={{
                          fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                          color: '#9CA3AF', marginLeft: '6px',
                        }}>
                          {row.shares?.toLocaleString('fr-FR')} actions
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontFamily: 'Newsreader, serif', fontSize: '13px',
                          color: '#1A3A6B', fontWeight: 400,
                        }}>
                          {row.pct.toFixed(2).replace('.', ',')} %
                        </div>
                        <div style={{
                          fontFamily: 'Manrope, sans-serif', fontSize: '9px',
                          color: '#9CA3AF',
                        }}>
                          {row.invested ? row.invested.toLocaleString('fr-FR') + ' €' : '—'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>


      </div>

      {/* ─── FOOTER Stitch ─── */}
      <footer style={{
        width: '100%', padding: '64px 48px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '32px',
        borderTop: '4px solid #EFC0D4',
        background: '#1A3A6B', color: '#fff',
      }}>

        {/* Modales footer */}
        {footerModal && (
          <div onClick={() => setFooterModal(null)} style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,27,63,0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}>
            <div onClick={e => e.stopPropagation()} style={{
              background: '#ffffff', borderRadius: '4px',
              maxWidth: '600px', width: '100%',
              maxHeight: '80vh', overflowY: 'auto',
              padding: '40px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <h2 style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: '28px', fontWeight: 300, color: '#1A3A6B', margin: 0 }}>
                  {footerModal === 'privacy' && 'Privacy Policy'}
                  {footerModal === 'terms' && 'Terms of Service'}
                </h2>
                <button onClick={() => setFooterModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>close</span>
                </button>
              </div>
              {footerModal === 'privacy' && (
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#43474F', lineHeight: 1.8 }}>
                  <p><strong style={{ color: '#1A3A6B' }}>Données collectées</strong><br />Le portail Retbaa Circle collecte uniquement les données strictement nécessaires à son fonctionnement : identifiant de session, pages consultées, interactions avec le contenu.</p>
                  <p><strong style={{ color: '#1A3A6B' }}>Finalité</strong><br />Ces données sont utilisées exclusivement par Massata Niang (fondateur, Retbaa SAS) pour comprendre l'engagement des investisseurs avec le portail.</p>
                  <p><strong style={{ color: '#1A3A6B' }}>Conservation</strong><br />Les données sont conservées pour la durée de votre qualité d'actionnaire Retbaa, puis supprimées dans un délai de 90 jours.</p>
                  <p><strong style={{ color: '#1A3A6B' }}>Vos droits</strong><br />Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression. Contactez : massata@retbaa.com</p>
                  <p><strong style={{ color: '#1A3A6B' }}>Cookies</strong><br />Ce portail n'utilise pas de cookies tiers. Seul un cookie de session technique est utilisé pour maintenir votre connexion.</p>
                  <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '24px' }}>Retbaa SAS — Paris · Dakar · Dubai — © 2026</p>
                </div>
              )}
              {footerModal === 'terms' && (
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#43474F', lineHeight: 1.8 }}>
                  <p><strong style={{ color: '#1A3A6B' }}>Accès réservé</strong><br />Le portail Retbaa Circle est strictement réservé aux actionnaires et investisseurs qualifiés de Retbaa SAS. Toute diffusion des informations contenues est interdite sans autorisation écrite.</p>
                  <p><strong style={{ color: '#1A3A6B' }}>Confidentialité</strong><br />L'ensemble des informations financières, stratégiques et opérationnelles présentées sur ce portail constituent des informations confidentielles au sens du Pacte d'Actionnaires signé le 5 février 2026.</p>
                  <p><strong style={{ color: '#1A3A6B' }}>Contenu</strong><br />Les projections financières présentées sont indicatives et ne constituent pas une garantie de rendement. Tout investissement comporte des risques, dont la perte en capital.</p>
                  <p><strong style={{ color: '#1A3A6B' }}>Propriété intellectuelle</strong><br />L'ensemble du contenu (textes, podcasts, visuels, analyses) est la propriété exclusive de Retbaa SAS. Reproduction interdite.</p>
                  <p><strong style={{ color: '#1A3A6B' }}>Droit applicable</strong><br />Les présentes conditions sont régies par le droit français. Tout litige relève de la compétence exclusive des tribunaux de Paris.</p>
                  <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '24px' }}>Retbaa SAS — RCS Paris — © 2026</p>
                </div>
              )}
            </div>
          </div>
        )}

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
              { label: 'Privacy Policy', action: () => setFooterModal('privacy') },
              { label: 'Terms of Service', action: () => setFooterModal('terms') },
              { label: 'Contact', action: () => window.open('mailto:massata@retbaa.com?subject=[Retbaa Circle] Contact', '_blank') },
              { label: 'Press Kit', action: () => window.open('https://retbaa.com', '_blank') },
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

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 3px rgba(74,222,128,0.25); }
          50%       { box-shadow: 0 0 0 6px rgba(74,222,128,0.10); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* Tablet breakpoint */
        @media (max-width: 1024px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
          .kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .carousel-container { padding: 0 32px !important; }
          .carousel-arrow { width: 36px !important; height: 36px !important; }
          .news-grid { grid-template-columns: 1fr !important; }
        }

        /* Mobile breakpoint */
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; text-align: left !important; }
          .hero-padding { padding: 32px 24px 24px !important; }
          .hero-title { font-size: 42px !important; line-height: 1.15 !important; }
          .kpi-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .news-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .carousel-row { gap: 16px !important; }
          .carousel-container { padding: 0 16px !important; }
          .carousel-arrow {
            width: 32px !important;
            height: 32px !important;
            box-shadow: 0 4px 16px rgba(0,27,63,0.18) !important;
          }
          .carousel-arrow-left { left: -8px !important; }
          .carousel-arrow-right { right: -8px !important; }
          .dashboard-main-padding { padding: 24px 16px !important; }
          .docs-table { font-size: 11px !important; }
          .docs-table td { padding: 12px 10px !important; }
        }

        /* Small mobile breakpoint */
        @media (max-width: 480px) {
          .hero-title { font-size: 36px !important; }
          .hero-padding { padding: 24px 20px 20px !important; }
          .kpi-grid { grid-template-columns: 1fr !important; }
        }

        /* Très petit mobile (390px) */
        @media (max-width: 390px) {
          .hero-title { font-size: 32px !important; }
          .carousel-arrow { width: 28px !important; height: 28px !important; }
        }
      `}</style>
    </div>
  )
}
