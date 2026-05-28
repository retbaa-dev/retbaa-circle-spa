// InnerCirclePage.jsx — Retbaa Circle — Design Stitch fidèle
import { useState, useRef } from 'react'

const posts = [
  {
    id: 6,
    date: '26 Avril 2026',
    tag: 'EXCLUSIVE · INNER CIRCLE',
    category: 'Strategic Letters',
    episodeLabel: 'LETTER 03 / 03',
    title: 'What We\'re Building',
    body: `Welcome back.

Last time, I talked about Cultural Luxury — the filter we use to decide which markets are worth entering.

Today, the question is: how do we actually execute on that?

We are building a strategic command center for Retbaa. Real-time market intelligence. Automated prospecting. A unified pipeline across B2C, B2B, and institutional channels.

The AI works around the clock. I step in for the decisions that matter.

The full document is attached to this letter. Eleven pages. The market map, the entry strategy, the risk framework — including everything we learned from Dubai.

Read it when you have a quiet moment. It's worth it.

Thank you for being part of this.

Massata.`,
    hasAudio: true,
    audioSrc: '/podcasts/podcast_ep3_en.mp3',
    audioDuration: '~11 min',
    hasPdf: true,
    pdfLabel: 'Note Stratégique — Sales Intelligence System v1.0',
    pdfPath: '/docs/Retbaa_Etude_Marche_Luxe_2026.pdf',
    comments: 0,
  },
  {
    id: 5,
    date: '26 Avril 2026',
    tag: 'EXCLUSIVE · INNER CIRCLE',
    category: 'Strategic Letters',
    episodeLabel: 'LETTER 02 / 03',
    title: 'Cultural Luxury',
    body: `Welcome back.

Last time, I told you Retbaa plays a different game. Today, I want to tell you what that game is called.

I call it Cultural Luxury.

Not "we come from Africa." But: "we share the same values — sensoriality, ritual, authentic craft."

That filter changes everything.

It opens Japan — wabi-sabi, ceramics, the ritual of scent. An identity almost identical to Kemia's.

It opens Saudi Arabia — oud, olfactory hospitality, the gifted object as an act of culture.

It opens Scandinavia, Italy, Korea, Brazil.

And it very clearly closes the markets where people buy logos rather than meaning.

This is how we think about global expansion. Not geography. Not diaspora. Culture.

Next letter: what we're actually building to make this happen.`,
    hasAudio: true,
    audioSrc: '/podcasts/podcast_ep2_en.mp3',
    audioDuration: '~12 min',
    hasPdf: false,
    comments: 0,
  },
  {
    id: 4,
    date: '26 Avril 2026',
    tag: 'EXCLUSIVE · INNER CIRCLE',
    category: 'Strategic Letters',
    episodeLabel: 'LETTER 01 / 03',
    title: 'A Different Game',
    body: `Dear investors,

Welcome to the Retbaa Inner Circle.

A few weeks ago, while reviewing the latest AI sales tools — I had a thought that stayed with me: none of these were built for what we do.

Not because they're bad. Because they were designed for a world where selling is about volume, automation, and reaching strangers at scale.

Retbaa plays a different game.

We don't sell a product to people who don't know us. We share a way of experiencing the world — with people who already recognize it.

The question isn't "how do we reach more people." The question is "how do we find the right people, in the right markets, at the right moment."

That's what this series of letters is about.

See you in the next one.`,
    hasAudio: true,
    audioSrc: '/podcasts/podcast_ep1_en.mp3',
    audioDuration: '~10 min',
    hasPdf: false,
    comments: 0,
  },
  {
    id: 1,
    body: `Chers investisseurs,

Il y a quelques semaines, en regardant des outils de vente IA — SalesCloser, Apollo, Gong — j'ai eu une pensée qui ne m'a pas quitté : aucun de ces outils n'a été conçu pour ce que nous faisons.

Pas parce qu'ils sont mauvais. Parce qu'ils sont pensés pour un monde où la vente est une question de volume, de séquences automatisées, de "dark funnel". Retbaa joue une autre partie.

Nous ne vendons pas un produit à des inconnus. Nous partageons une façon d'habiter le monde avec des gens qui la reconnaissent — à Tokyo, à Riyad, à Varsovie, à Lagos. Ce que j'appelle le Cultural Luxury : non pas "nous venons d'Afrique", mais "nous partageons les mêmes valeurs — la sensorialité, le rituel, l'artisanat authentique."

Ce filtre change tout. Il ouvre le Japon (wabi-sabi, céramique, rituel du parfum — ADN quasi-identique à Kemia). Il ouvre l'Arabie Saoudite (oud, hospitalité olfactive, l'objet offert comme acte de culture). Il ouvre la Scandinavie, l'Italie, la Corée. Il ferme les marchés où l'on achète des logos, pas des significations.

J'ai donc décidé de ne pas acheter ces outils. J'ai décidé d'en construire un — propriétaire, calibré pour Retbaa, pensé pour aller global depuis le premier jour.

sales.retbaa.com sera la troisième brique de notre écosystème, après ops et trade. Pas un CRM de plus. Une tour de contrôle commerciale et stratégique — Intelligence & Prospection, Engagement Multicanal, Pipeline & Closing, et surtout : Market Intelligence en temps réel sur 15 marchés simultanément.

L'IA travaille 24h/24. Je n'interviens que sur les décisions qualifiées.

J'ai rédigé une note stratégique complète — 11 pages, 9 parties — qui pose la doctrine, la carte des marchés, les phases d'entrée, le framework d'exécution et la gestion des risques (y compris les "Cygnes Noirs" comme Dubai). Elle vous est partagée en exclusivité.

Ce document est vivant. Je le mettrai à jour à chaque pivot stratégique majeur.

Massata`,
    hasPdf: true,
    pdfLabel: 'Note Stratégique — Sales Intelligence System v1.0',
    pdfPath: '/docs/Retbaa_Sales_Intelligence_Note_Strategique_v1.pdf',
    hasAudio: true,
    audioSrc: '/podcasts/inner_circle_letter_avril2026.mp3',
    audioDuration: '~3 min',
    comments: 0,
  },
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

const categories = ['All Letters', 'Strategic Letters', 'Market Narratives', 'Art of Ownership', 'Private Log']

// ── Mini player audio inline ──
function LetterPlayer({ src, duration }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState('0:00')

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else { audioRef.current.play(); setPlaying(true) }
  }

  const onTimeUpdate = () => {
    if (!audioRef.current) return
    const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100
    setProgress(isNaN(pct) ? 0 : pct)
    const m = Math.floor(audioRef.current.currentTime / 60)
    const s = Math.floor(audioRef.current.currentTime % 60).toString().padStart(2, '0')
    setCurrentTime(`${m}:${s}`)
  }

  const seek = (e) => {
    if (!audioRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = pct * audioRef.current.duration
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      padding: '16px 20px',
      background: '#1A3A6B',
      borderRadius: '2px',
      marginBottom: '28px',
    }}>
      <audio ref={audioRef} src={src} onTimeUpdate={onTimeUpdate} onEnded={() => setPlaying(false)} />
      <button onClick={toggle} style={{
        width: '38px', height: '38px', borderRadius: '50%',
        background: '#EFC0D4', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#1A3A6B' }}>
          {playing ? 'pause' : 'play_arrow'}
        </span>
      </button>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(239,192,212,0.7)', marginBottom: '8px' }}>
          Écouter la lettre — voix de Massata · {duration}
        </div>
        <div onClick={seek} style={{ height: '3px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', cursor: 'pointer', position: 'relative' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: '#EFC0D4', borderRadius: '2px', transition: 'width 0.1s linear' }} />
        </div>
      </div>
      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontVariantNumeric: 'tabular-nums', minWidth: '32px' }}>
        {currentTime}
      </span>
    </div>
  )
}

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
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
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
                {post.episodeLabel && (
                  <span style={{
                    padding: '3px 8px',
                    background: 'rgba(26,58,107,0.08)',
                    fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: '#1A3A6B',
                    borderRadius: '2px',
                  }}>
                    {post.episodeLabel}
                  </span>
                )}
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
              {post.body.includes('\n') ? (
                <div style={{ fontSize: '14px', color: '#43474F', lineHeight: 1.8, margin: '0 0 28px' }}>
                  {post.body.split('\n\n').map((para, i) => (
                    <p key={i} style={{ margin: '0 0 16px' }}>{para}</p>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '14px', color: '#43474F', lineHeight: 1.8, margin: '0 0 28px' }}>
                  {post.body}
                </p>
              )}

              {/* Player audio */}
              {post.hasAudio && (
                <LetterPlayer src={post.audioSrc} duration={post.audioDuration} />
              )}

              {/* Pièce jointe PDF */}
              {post.hasPdf && (
                <a
                  href={post.pdfPath}
                  download
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '16px 20px',
                    background: 'rgba(26,58,107,0.04)',
                    border: '1px solid rgba(26,58,107,0.12)',
                    borderRadius: '2px',
                    marginBottom: '28px',
                    textDecoration: 'none',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,58,107,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(26,58,107,0.04)'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#1A3A6B', flexShrink: 0 }}>
                    picture_as_pdf
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#1A3A6B', marginBottom: '2px' }}>
                      {post.pdfLabel}
                    </div>
                    <div style={{ fontSize: '10px', color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      Document PDF confidentiel · Retbaa Circle
                    </div>
                  </div>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#EFC0D4' }}>
                    download
                  </span>
                </a>
              )}

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
