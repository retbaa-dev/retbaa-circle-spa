// InnerCirclePage.jsx — Retbaa Circle — Design Stitch fidèle
import { useState } from 'react'

const posts = [
  {
    id: 1,
    date: '7 Avril 2026',
    tag: 'EXCLUSIVE · INNER CIRCLE',
    category: 'Private Log',
    title: 'Dubai, le repositionnement, et ce que j\'ai appris cette semaine',
    body: 'La situation géopolitique nous a forcés à ralentir sur Dubai. Mais ralentir ne veut pas dire reculer. J\'ai passé les 3 dernières semaines à retravailler nos fondamentaux — l\'accord avec Galeries Lafayette Dubai Mall tient, et je comprends maintenant mieux pourquoi nous devions prendre ce recul avant d\'accélérer. La patience est une arme.',
    comments: 4,
  },
  {
    id: 2,
    date: '28 Mars 2026',
    tag: 'EXCLUSIVE · INNER CIRCLE',
    category: 'Market Narratives',
    title: 'Pourquoi Retbaa joue au Go, pas aux échecs',
    body: 'Quand on m\'a demandé notre stratégie de distribution, j\'ai répondu : "On joue au Go". Ne pas attaquer frontalement. Occuper les espaces vides. Abidjan, Londres, Riyad — des pierres sur le plateau, pas des charges de cavalerie. L\'encerclement progressif est la seule stratégie valable quand on n\'a pas les ressources des géants.',
    comments: 12,
  },
  {
    id: 3,
    date: '15 Mars 2026',
    tag: 'EXCLUSIVE · INNER CIRCLE',
    category: 'Art of Ownership',
    title: 'L\'architecture invisible du luxe africain',
    body: 'Le luxe n\'est pas un prix. C\'est une préservation — du temps, du savoir-faire, de l\'identité. Ce que Retbaa construit, c\'est ça. Pas une marque africaine qui copie le modèle européen. Une maison qui pose ses propres règles, qui occupe les espaces que les grandes maisons n\'ont pas jugé dignes de défendre.',
    comments: 28,
  },
]

const categories = ['All Letters', 'Market Narratives', 'Art of Ownership', 'Private Log']

export default function InnerCirclePage() {
  const [activeCategory, setActiveCategory] = useState('All Letters')

  const filtered = activeCategory === 'All Letters'
    ? posts
    : posts.filter(p => p.category === activeCategory)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9F9F9', fontFamily: 'Manrope, sans-serif' }}>

      {/* ── Hero ── */}
      <div style={{
        background: '#1A3A6B',
        padding: '64px 64px 56px',
        display: 'grid',
        gridTemplateColumns: '1fr 280px',
        gap: '48px',
        alignItems: 'center',
      }}>
        <div>
          <div style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em',
            textTransform: 'uppercase', color: '#EFC0D4', marginBottom: '20px',
          }}>
            DIRECT ACCESS
          </div>
          <h1 style={{
            fontFamily: 'Newsreader, serif', fontStyle: 'italic',
            fontSize: '52px', fontWeight: 300, color: '#ffffff',
            lineHeight: 1.1, margin: '0 0 24px',
          }}>
            Le fil privé<br />du fondateur
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '2px', background: '#EFC0D4' }} />
            <span style={{
              fontSize: '10px', fontWeight: 700, letterSpacing: '0.25em',
              textTransform: 'uppercase', color: 'rgba(239,192,212,0.7)',
            }}>
              MASSATA NIANG
            </span>
          </div>
        </div>
        <div style={{
          height: '220px', overflow: 'hidden', borderRadius: '2px',
        }}>
          <img
            src="/massata-portrait.jpg"
            alt="Massata Niang — Fondateur Retbaa"
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              objectPosition: 'center top',
            }}
          />
        </div>
      </div>

      {/* ── Corps : sidebar + fil ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '240px 1fr',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '48px 32px',
        gap: '48px',
      }} className="inner-circle-grid">

        {/* Sidebar */}
        <aside>
          <div style={{
            fontFamily: 'Newsreader, serif', fontStyle: 'italic',
            fontSize: '22px', color: '#1A3A6B', marginBottom: '24px',
          }}>
            Archive
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '36px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', width: '100%',
                  borderLeft: activeCategory === cat ? '3px solid #1A3A6B' : '3px solid transparent',
                  fontFamily: 'Manrope, sans-serif', fontSize: '12px',
                  fontWeight: activeCategory === cat ? 700 : 400,
                  color: activeCategory === cat ? '#1A3A6B' : '#9CA3AF',
                  transition: 'all 0.15s',
                }}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Concierge — ligne directe fondateur */}
          <div style={{
            background: '#1A3A6B',
            borderRadius: '4px',
            padding: '20px',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {/* Décoration */}
            <div style={{
              position: 'absolute', top: 0, right: 0,
              width: '60px', height: '60px',
              background: 'rgba(239,192,212,0.12)',
              borderRadius: '0 0 0 60px',
            }} />
            <div style={{
              fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: '#EFC0D4', marginBottom: '10px',
            }}>
              LIGNE DIRECTE FONDATEUR
            </div>
            {/* Avatar Massata */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <img
                src="/massata-portrait.jpg"
                alt="Massata Niang"
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', border: '2px solid #EFC0D4' }}
              />
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#ffffff' }}>Massata Niang</div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>Fondateur & CEO</div>
              </div>
            </div>
            <p style={{
              fontSize: '11px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: '0 0 16px',
            }}>
              Une question, une idée, un retour ? Écrivez directement à Massata.
            </p>
            <a
              href="mailto:massata@retbaa.com?subject=[Retbaa Circle] Message d'un investisseur"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                width: '100%', padding: '10px',
                background: '#EFC0D4',
                borderRadius: '4px',
                fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                color: '#1A3A6B', cursor: 'pointer', textDecoration: 'none',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>mail</span>
              Écrire à Massata
            </a>
          </div>
        </aside>

        {/* Fil articles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {filtered.map(post => (
            <article key={post.id} style={{
              background: '#ffffff',
              borderRadius: '4px',
              padding: '40px',
              boxShadow: '0px 20px 40px rgba(0,27,63,0.04)',
            }}>
              {/* Méta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{
                  fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em',
                  textTransform: 'uppercase', color: '#EFC0D4',
                }}>
                  {post.date}
                </span>
                <span style={{
                  padding: '3px 8px',
                  background: 'rgba(239,192,212,0.15)',
                  fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: '#795465',
                  borderRadius: '2px',
                }}>
                  {post.tag}
                </span>
              </div>

              {/* Titre */}
              <h2 style={{
                fontFamily: 'Newsreader, serif', fontStyle: 'italic',
                fontSize: '26px', fontWeight: 300, color: '#1A3A6B',
                margin: '0 0 16px', lineHeight: 1.3,
              }}>
                {post.title}
              </h2>

              {/* Corps */}
              <p style={{
                fontSize: '14px', color: '#43474F',
                lineHeight: 1.8, margin: '0 0 28px',
              }}>
                {post.body}
              </p>

              {/* Footer */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '24px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(239,192,212,0.15)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9CA3AF' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chat_bubble</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em' }}>
                    {post.comments} COMMENTS
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9CA3AF', cursor: 'pointer' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>share</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em' }}>SHARE</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .inner-circle-grid {
            grid-template-columns: 1fr !important;
            padding: 24px 16px !important;
            gap: 32px !important;
          }
          .inner-circle-grid aside {
            order: 2;
          }
          .inner-circle-grid > div:last-child {
            order: 1;
          }
        }
      `}</style>
    </div>
  )
}
