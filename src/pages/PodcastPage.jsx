// pages/PodcastPage.jsx — Retbaa Circle — Design Stitch
import { useState, useRef, useEffect } from 'react'
import { trackPodcast } from '../utils/tracker'

const episodes = [
  {
    id: 1,
    number: 'EP. 01',
    title: 'The Numbers Behind the Vision',
    subtitle: 'Financial Results & 2026–2028 Projections',
    description: 'A candid conversation about Retbaa\'s 2025 financial performance, the fundraising strategy, and what the trajectory to 1.5M€ by 2028 actually looks like — quarter by quarter.',
    duration: '10 min',
    date: 'April 2026',
    src: '/podcasts/podcast_ep1_en.mp3',
    topics: ['2025 Results', '22.7% EBITDA', 'Tranche 2', '2028 Projections', 'Exit Scenario'],
  },
  {
    id: 2,
    number: 'EP. 02',
    title: 'The Right Place at the Right Time',
    subtitle: 'Why West Africa & the Gulf Are Where Luxury Is Being Reinvented',
    description: 'The market forces that make this moment unique for Retbaa — the MEA luxury boom, the Gulf\'s prescriptive power, the 40M-strong diaspora, Gen Z, and why the big houses coming to Africa is good news.',
    duration: '12 min',
    date: 'April 2026',
    src: '/podcasts/podcast_ep2_en.mp3',
    topics: ['MEA Market', 'Gulf Strategy', 'Diaspora', 'Gen Z', 'Quiet Luxury', 'First-Mover'],
  },
  {
    id: 3,
    number: 'EP. 03',
    title: 'The Abidjan Flagship',
    subtitle: 'Retbaa\'s Most Important Physical Milestone',
    description: 'Why Abidjan, why Q4 2026, and what the flagship actually unlocks — for the brand, for the region, and for valuation. Plus: the Retbaa Moments activation program across West Africa.',
    duration: '11 min',
    date: 'April 2026',
    src: '/podcasts/podcast_ep3_en.mp3',
    topics: ['Abidjan', 'Retail Strategy', 'Q4 2026', 'Retbaa Moments', 'Valuation'],
  },
  {
    id: 4,
    number: 'EP. 04',
    title: 'The Unnamed',
    subtitle: 'Why Community IS the Strategy',
    description: 'From Apple\'s evangelists to Aesop\'s free handwash ritual — how great brands build believers before buyers. And how Retbaa\'s "Unnamed" ambassador program applies these lessons to build a moat no competitor can purchase.',
    duration: '11 min',
    date: 'April 2026',
    src: '/podcasts/podcast_ep4_en.mp3',
    topics: ['Community', 'Ambassadors', 'Kapferer', 'Apple', 'Aesop', 'Le Labo'],
  },
  {
    id: 5,
    number: 'EP. 05',
    title: 'The Go Board',
    subtitle: 'How Retbaa Plays a Different Game',
    description: 'The game of Go has 2,500 years of strategic wisdom. Retbaa plays by its rules — encircling empty spaces, letting conditions ripen, building coexistence. Five principles that explain why Retbaa\'s strategy is harder to copy than any product.',
    duration: '11 min',
    date: 'April 2026',
    src: '/podcasts/podcast_ep5_en.mp3',
    topics: ['Strategy', 'Go', 'Empty Spaces', 'B2B', 'Moat', 'Long Game'],
  },
  {
    id: 6,
    number: 'EP. 06',
    title: 'Cultural Luxury: The Retbaa Thesis',
    subtitle: 'Why a Philosophy Travels Further Than a Label',
    description: 'Retbaa does not say "we come from Africa." It says: we share the same way of inhabiting the world. A conversation on what Cultural Luxury really means, why the moment is now, and how Kemia embodies a philosophy that resonates from Tokyo to Riyadh, from São Paulo to Scandinavia.',
    duration: '5 min',
    date: 'April 2026',
    src: '/podcasts/podcast_ep6_en.mp3',
    topics: ['Cultural Luxury', 'Kemia', 'Global Markets', 'Japan', 'GCC', 'Philosophy'],
  },
  {
    id: 7,
    number: 'EP. 07',
    title: 'The Sensory Funnel',
    subtitle: 'How Retbaa Architects a Luxury Experience in Three Acts',
    description: 'From a candle that transforms a room to a perfume that becomes a signature — Retbaa\'s Sensory Funnel explains how three universes (Atmosphère, Gourmet, Beauté) create a natural journey from discovery to commitment. This episode breaks down the framework that shapes every product decision, every campaign, and every partnership at Retbaa.',
    duration: '9 min',
    date: 'April 2026',
    src: '/podcasts/podcast_ep7_en.mp3',
    topics: ['Sensory Funnel', 'Product Strategy', 'Atmosphère', 'Gourmet', 'Beauté', 'Cultural Luxury', 'Cross-sell'],
  },
]

function AudioPlayer({ src, title, userName = '' }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => {
      setCurrentTime(audio.currentTime)
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0)
    }
    const onLoad = () => { setDuration(audio.duration); setLoading(false) }
    const onEnded = () => setPlaying(false)
    const onWaiting = () => setLoading(true)
    const onPlaying = () => setLoading(false)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onLoad)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('playing', onPlaying)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onLoad)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('playing', onPlaying)
    }
  }, [src])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else {
      audio.play(); setPlaying(true)
      // Track l'écoute
      if (typeof trackPodcast === 'function') trackPodcast(userName || 'anonymous', title)
    }
  }

  const seek = (e) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    audio.currentTime = pct * audio.duration
  }

  const skip = (sec) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + sec))
  }

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div style={{
      background: '#1A3A6B', borderRadius: '4px', padding: '28px 32px',
    }}>
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Waveform décorative */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '20px', height: '32px' }}>
        {Array.from({ length: 48 }).map((_, i) => {
          const barPct = (i / 48) * 100
          const filled = barPct <= progress
          const height = [20, 28, 16, 32, 24, 12, 28, 20, 32, 16, 24, 28, 20, 12, 32, 24, 16, 28, 20, 32,
            24, 16, 28, 20, 32, 12, 24, 28, 16, 32, 20, 24, 28, 16, 12, 32, 20, 24, 28, 32,
            16, 20, 28, 24, 12, 32, 20, 16][i] || 20
          return (
            <div key={i} style={{
              flex: 1, height: `${height}px`,
              background: filled ? '#EFC0D4' : 'rgba(255,255,255,0.15)',
              borderRadius: '2px',
              transition: 'background 0.1s',
            }} />
          )
        })}
      </div>

      {/* Barre de progression cliquable */}
      <div
        onClick={seek}
        style={{
          height: '4px', background: 'rgba(255,255,255,0.15)',
          borderRadius: '2px', cursor: 'pointer', marginBottom: '12px',
          position: 'relative',
        }}
      >
        <div style={{
          height: '100%', width: `${progress}%`,
          background: '#EFC0D4', borderRadius: '2px',
          transition: 'width 0.1s linear',
        }} />
      </div>

      {/* Temps */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>{fmt(currentTime)}</span>
        <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>{fmt(duration)}</span>
      </div>

      {/* Contrôles */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button onClick={() => skip(-15)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>replay_10</span>
        </button>

        <button
          onClick={togglePlay}
          style={{
            width: '56px', height: '56px',
            background: '#EFC0D4', border: 'none',
            borderRadius: '50%', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.15s, opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {loading ? (
            <span className="material-symbols-outlined" style={{ fontSize: '26px', color: '#1A3A6B' }}>hourglass_empty</span>
          ) : (
            <span className="material-symbols-outlined" style={{ fontSize: '26px', color: '#1A3A6B' }}>
              {playing ? 'pause' : 'play_arrow'}
            </span>
          )}
        </button>

        <button onClick={() => skip(15)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>forward_10</span>
        </button>
      </div>

      {/* Bouton Télécharger */}
      <a
        href={src}
        download={title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.mp3'}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '10px 20px',
          background: 'rgba(239,192,212,0.15)',
          border: '1px solid rgba(239,192,212,0.3)',
          borderRadius: '4px',
          fontFamily: 'Manrope, sans-serif',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#EFC0D4',
          textDecoration: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(239,192,212,0.25)'
          e.currentTarget.style.borderColor = 'rgba(239,192,212,0.5)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(239,192,212,0.15)'
          e.currentTarget.style.borderColor = 'rgba(239,192,212,0.3)'
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
        Télécharger l'épisode
      </a>
    </div>
  )
}

export default function PodcastPage({ userName }) {
  const [activeEp, setActiveEp] = useState(episodes[0])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9F9F9', fontFamily: 'Manrope, sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '64px 48px' }} className="podcast-main-padding">

        {/* ── Hero ── */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em',
            textTransform: 'uppercase', color: '#EFC0D4', marginBottom: '16px',
          }}>
            RETBAA CIRCLE · AUDIO EXCLUSIVE
          </div>
          <h1 style={{
            fontFamily: 'Newsreader, serif', fontStyle: 'italic',
            fontSize: '64px', fontWeight: 300, color: '#1A3A6B',
            margin: '0 0 20px', lineHeight: 1,
          }}>
            Circle Insider
          </h1>
          <p style={{
            fontSize: '15px', color: '#43474F', lineHeight: 1.7,
            maxWidth: '520px', margin: 0,
          }}>
            A private podcast for Retbaa's investor circle. Candid conversations about strategy, 
            market moves, and what's coming next — beyond the slide decks.
          </p>
        </div>

        {/* ── Layout : player + liste ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px', alignItems: 'start' }} className="podcast-grid">

          {/* ── Épisode actif ── */}
          <div>
            {/* Card épisode */}
            <div style={{
              background: '#ffffff', borderRadius: '4px',
              boxShadow: '0px 20px 40px rgba(0,27,63,0.04)',
              overflow: 'hidden', marginBottom: '16px',
            }}>
              {/* Header épisode */}
              <div style={{ padding: '36px 36px 0' }}>
                <div style={{
                  fontSize: '9px', fontWeight: 700, letterSpacing: '0.25em',
                  textTransform: 'uppercase', color: '#EFC0D4', marginBottom: '12px',
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <span>{activeEp.number}</span>
                  <span style={{ color: '#E0E0E0' }}>·</span>
                  <span style={{ color: '#9CA3AF' }}>{activeEp.date}</span>
                  <span style={{ color: '#E0E0E0' }}>·</span>
                  <span style={{ color: '#9CA3AF' }}>{activeEp.duration}</span>
                </div>
                <h2 style={{
                  fontFamily: 'Newsreader, serif', fontStyle: 'italic',
                  fontSize: '32px', fontWeight: 300, color: '#1A3A6B',
                  margin: '0 0 8px', lineHeight: 1.2,
                }}>
                  {activeEp.title}
                </h2>
                <p style={{
                  fontSize: '13px', fontWeight: 600, color: '#795465',
                  margin: '0 0 16px', letterSpacing: '0.02em',
                }}>
                  {activeEp.subtitle}
                </p>
                <p style={{
                  fontSize: '13px', color: '#43474F', lineHeight: 1.7,
                  margin: '0 0 24px',
                }}>
                  {activeEp.description}
                </p>

                {/* Topics */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                  {activeEp.topics.map(t => (
                    <span key={t} style={{
                      padding: '4px 10px',
                      background: 'rgba(239,192,212,0.15)',
                      borderRadius: '2px',
                      fontSize: '9px', fontWeight: 700,
                      color: '#795465', letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Player */}
              <div style={{ padding: '0 36px 36px' }}>
                <AudioPlayer src={activeEp.src} title={activeEp.title} userName={userName} />
              </div>
            </div>

            {/* Hosts */}
            <div style={{
              background: '#ffffff', borderRadius: '4px', padding: '24px 32px',
              boxShadow: '0px 10px 30px rgba(0,27,63,0.03)',
              display: 'flex', gap: '32px',
            }} className="hosts-card">
              {[
                { name: 'Alex', role: 'Host', initials: 'AX' },
                { name: 'Kemia', role: 'Strategic Analyst, Retbaa', initials: 'KM' },
              ].map(h => (
                <div key={h.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'rgba(239,192,212,0.2)',
                    border: '2px solid #EFC0D4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontFamily: 'Newsreader, serif', fontSize: '13px', color: '#795465', fontWeight: 600 }}>{h.initials}</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', fontWeight: 700, color: '#1A3A6B' }}>{h.name}</div>
                    <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', color: '#9CA3AF' }}>{h.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Sidebar : liste épisodes ── */}
          <div style={{
            background: '#ffffff', borderRadius: '4px', padding: '28px',
            boxShadow: '0px 20px 40px rgba(0,27,63,0.04)',
          }}>
            <div style={{
              fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '20px',
            }}>
              ALL EPISODES
            </div>

            {episodes.map(ep => (
              <div
                key={ep.id}
                onClick={() => setActiveEp(ep)}
                style={{
                  padding: '16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: activeEp.id === ep.id ? 'rgba(239,192,212,0.12)' : 'transparent',
                  borderLeft: activeEp.id === ep.id ? '3px solid #EFC0D4' : '3px solid transparent',
                  transition: 'all 0.15s',
                  marginBottom: '8px',
                }}
                onMouseEnter={e => { if (activeEp.id !== ep.id) e.currentTarget.style.background = '#FAFAFA' }}
                onMouseLeave={e => { if (activeEp.id !== ep.id) e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{
                  fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em',
                  textTransform: 'uppercase', color: '#EFC0D4', marginBottom: '6px',
                }}>
                  {ep.number} · {ep.duration}
                </div>
                <div style={{
                  fontFamily: 'Manrope, sans-serif', fontSize: '12px',
                  fontWeight: 600, color: '#1A3A6B', lineHeight: 1.4,
                  marginBottom: '4px',
                }}>
                  {ep.title}
                </div>
                <div style={{ fontSize: '10px', color: '#9CA3AF' }}>{ep.date}</div>
              </div>
            ))}

            {/* Teaser prochain épisode */}
            <div style={{
              marginTop: '16px', padding: '16px',
              background: 'rgba(26,58,107,0.03)',
              borderRadius: '4px',
              borderLeft: '3px solid rgba(239,192,212,0.3)',
            }}>
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '6px' }}>
                COMING NEXT
              </div>
              <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', fontWeight: 600, color: '#43474F', lineHeight: 1.4, fontStyle: 'italic' }}>
                Season 2 coming soon — new episodes in the making.
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .podcast-main-padding { padding: 32px 16px !important; }
          .podcast-grid { grid-template-columns: 1fr !important; }
          .hosts-card { flex-direction: column !important; gap: 16px !important; }
        }
      `}</style>
    </div>
  )
}
