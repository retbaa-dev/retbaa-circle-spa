import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

const ACCESS_LEVELS = [
  { label: 'Public', key: 'public', depth: 'Réponses éditoriales', desc: 'Positionnement, marché, articles publics, vocabulaire non confidentiel.' },
  { label: 'NDA signé', key: 'nda', depth: 'Réponses documentaires', desc: 'Synthèse Tier 1, études de marché, logique des véhicules, sans chiffres sensibles non publics.' },
  { label: 'Approuvé', key: 'approved', depth: 'Réponses investisseur', desc: 'Dataroom Tier 2, projections, risques, comparaisons de véhicules, traçabilité des sources.' },
  { label: 'Fondateur', key: 'founder', depth: 'Réponses complètes', desc: 'Tier 3, cap table, closing binder, notes internes et arbitrages confidentiels.' },
]

const STARTERS = [
  'Quelle est la thèse d’investissement Retbaa en 5 points ?',
  'Quels sont les principaux risques à examiner ?',
  'Quel véhicule correspond à un horizon 5 ans ?',
  'Quels documents dois-je lire avant un échange avec Massata ?',
]

function normalizeAccess(access) {
  if (access === 'Fondateur') return 'founder'
  if (access === 'Approuvé') return 'approved'
  if (access === 'NDA signé') return 'nda'
  return 'public'
}

export default function KemiaAdvisorPanel({ access = 'Public' }) {
  const { session } = useAuth()
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const currentKey = normalizeAccess(access)

  const ask = async (q = question) => {
    const clean = q.trim()
    if (!clean || loading) return
    setQuestion(clean)
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams(window.location.search)
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          question: clean,
          preview: {
            token: params.get('token'),
            role: params.get('role'),
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur advisor')
      setAnswer(data)
    } catch (e) {
      setError(e.message || 'Impossible de joindre Kemia Advisor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section style={{
      background: '#0D1F3C', color: '#fff', borderRadius: '12px',
      padding: '28px', margin: '0 0 40px', position: 'relative', overflow: 'hidden',
      boxShadow: '0 24px 50px rgba(13,31,60,0.18)',
    }}>
      <div style={{ position: 'absolute', right: '-60px', bottom: '-80px', fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: '220px', color: 'rgba(239,192,212,0.06)', lineHeight: 1 }}>
        K
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontFamily: 'Manrope, sans-serif', fontSize: '10px', letterSpacing: '0.24em',
          textTransform: 'uppercase', color: '#EFC0D4', fontWeight: 800, marginBottom: '8px',
        }}>
          Agent IA confidentiel · Kemia
        </div>
        <h2 style={{
          fontFamily: 'Newsreader, serif', fontSize: '30px', fontWeight: 300,
          fontStyle: 'italic', margin: '0 0 10px', color: '#fff',
        }}>
          Poser une question, selon votre niveau d’accès
        </h2>
        <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, maxWidth: '720px', margin: '0 0 22px' }}>
          Kemia répond avec le niveau de profondeur autorisé : public, NDA, investisseur approuvé ou fondateur. Les questions sensibles doivent rester sourcées et peuvent nécessiter un échange humain.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {ACCESS_LEVELS.map(level => {
            const active = level.key === currentKey
            return (
              <div key={level.label} style={{
                padding: '14px', borderRadius: '8px',
                background: active ? 'rgba(239,192,212,0.16)' : 'rgba(255,255,255,0.06)',
                border: active ? '1px solid rgba(239,192,212,0.45)' : '1px solid rgba(255,255,255,0.08)',
              }}>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: active ? '#EFC0D4' : 'rgba(255,255,255,0.55)', fontWeight: 800, marginBottom: '8px' }}>
                  {level.label}
                </div>
                <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: '17px', color: '#fff', marginBottom: '6px' }}>
                  {level.depth}
                </div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.62)', lineHeight: 1.5 }}>
                  {level.desc}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
          {STARTERS.map(s => (
            <button key={s} onClick={() => ask(s)} style={{
              border: '1px solid rgba(239,192,212,0.35)', background: 'rgba(255,255,255,0.05)',
              color: '#F7E8EF', borderRadius: '999px', padding: '8px 12px', cursor: 'pointer',
              fontFamily: 'Manrope, sans-serif', fontSize: '11px',
            }}>
              {s}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch' }}>
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Ex. Quels documents lire pour comprendre le risque principal ?"
            rows={3}
            style={{
              flex: 1, resize: 'vertical', minHeight: '74px',
              border: '1px solid rgba(255,255,255,0.14)', borderRadius: '8px',
              background: 'rgba(255,255,255,0.06)', color: '#fff', padding: '12px 14px',
              fontFamily: 'Manrope, sans-serif', fontSize: '13px', lineHeight: 1.5, outline: 'none',
            }}
          />
          <button onClick={() => ask()} disabled={loading || !question.trim()} style={{
            width: '120px', border: 'none', borderRadius: '8px', cursor: loading || !question.trim() ? 'default' : 'pointer',
            background: loading || !question.trim() ? 'rgba(255,255,255,0.12)' : '#EFC0D4', color: '#0D1F3C',
            fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase',
          }}>
            {loading ? 'Analyse…' : 'Demander'}
          </button>
        </div>

        {error && <div style={{ marginTop: '14px', color: '#FCA5A5', fontFamily: 'Manrope, sans-serif', fontSize: '12px' }}>{error}</div>}

        {answer && (
          <div style={{ marginTop: '18px', padding: '18px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#EFC0D4', fontWeight: 800, marginBottom: '10px' }}>
              Réponse · niveau {answer.accessLevel}
            </div>
            <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'Manrope, sans-serif', fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.82)' }}>
              {answer.answer}
            </div>
            {answer.sources?.length > 0 && (
              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.48)', marginBottom: '8px' }}>
                  Sources consultées
                </div>
                {answer.sources.map(src => (
                  <div key={src} style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.66)', marginBottom: '4px' }}>• {src}</div>
                ))}
              </div>
            )}
            {answer.requiresHumanFollowup && (
              <div style={{ marginTop: '12px', fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#EFC0D4' }}>
                À confirmer avec Massata ou les documents juridiques avant décision.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
