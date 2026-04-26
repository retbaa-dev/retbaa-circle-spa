// pages/BienvenueOnboarding.jsx — Retbaa Circle — Onboarding investisseur
// L'investisseur entre son email → reçoit un magic link par email
import { useState } from 'react'

const NAVY = '#1A3A6B'
const ROSE = '#EFC0D4'
const ROSE_DARK = '#795465'
const BG = '#f9f6f0'

export default function BienvenueOnboarding() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error | fallback
  const [magicLink, setMagicLink] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    setErrorMsg('')
    setMagicLink('')

    try {
      const res = await fetch('/api/onboarding/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setErrorMsg(data.error || 'Une erreur est survenue.')
        return
      }

      if (data.fallback && data.magicLink) {
        // Email Clerk indisponible → afficher le lien directement
        setMagicLink(data.magicLink)
        setStatus('fallback')
      } else {
        setStatus('success')
      }
    } catch (err) {
      setStatus('error')
      setErrorMsg('Impossible de contacter le serveur. Réessayez.')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: BG,
      fontFamily: 'Manrope, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Logo / Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{
          fontFamily: 'Newsreader, serif',
          fontSize: '28px',
          fontStyle: 'italic',
          color: NAVY,
          letterSpacing: '0.02em',
          marginBottom: '8px',
        }}>
          Retbaa Circle
        </div>
        <div style={{
          width: '40px',
          height: '2px',
          background: ROSE,
          margin: '0 auto',
        }} />
      </div>

      {/* Card */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        border: `1px solid rgba(26,58,107,0.1)`,
        padding: '48px 40px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 4px 24px rgba(26,58,107,0.06)',
      }}>

        {status === 'idle' || status === 'loading' || status === 'error' ? (
          <>
            <h1 style={{
              fontFamily: 'Newsreader, serif',
              fontSize: '26px',
              fontStyle: 'italic',
              color: NAVY,
              marginBottom: '12px',
              fontWeight: 400,
            }}>
              Accédez à votre espace
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#6b6b6b',
              marginBottom: '32px',
              lineHeight: 1.6,
            }}>
              Entrez votre adresse email. Si elle est enregistrée dans notre cercle d'investisseurs, vous recevrez un lien de connexion direct — sans mot de passe.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: NAVY,
                  fontWeight: 600,
                  marginBottom: '8px',
                }}>
                  Adresse email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  disabled={status === 'loading'}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: `1.5px solid rgba(26,58,107,0.2)`,
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontFamily: 'Manrope, sans-serif',
                    color: NAVY,
                    backgroundColor: status === 'loading' ? '#f5f5f5' : 'white',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = NAVY}
                  onBlur={e => e.target.style.borderColor = 'rgba(26,58,107,0.2)'}
                />
              </div>

              {status === 'error' && (
                <div style={{
                  background: 'rgba(180,30,30,0.07)',
                  border: '1px solid rgba(180,30,30,0.2)',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  color: '#b41e1e',
                  marginBottom: '16px',
                }}>
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading' || !email.trim()}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: status === 'loading' ? '#6b7fa3' : NAVY,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: 'Manrope, sans-serif',
                  letterSpacing: '0.05em',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                }}
              >
                {status === 'loading' ? 'Envoi en cours…' : 'Recevoir mon lien d\'accès'}
              </button>
            </form>
          </>
        ) : status === 'success' ? (
          /* Succès — email envoyé */
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '20px' }}>✉️</div>
            <h2 style={{
              fontFamily: 'Newsreader, serif',
              fontSize: '24px',
              fontStyle: 'italic',
              color: NAVY,
              marginBottom: '12px',
              fontWeight: 400,
            }}>
              Lien envoyé
            </h2>
            <p style={{ fontSize: '14px', color: '#6b6b6b', lineHeight: 1.6, marginBottom: '24px' }}>
              Un lien de connexion vous a été envoyé à <strong style={{ color: NAVY }}>{email}</strong>.<br />
              Il est valable <strong>24 heures</strong>.
            </p>
            <p style={{ fontSize: '13px', color: '#9b9b9b', lineHeight: 1.5 }}>
              Vérifiez vos spams si vous ne le recevez pas dans les 2 minutes. Vous pouvez fermer cette page.
            </p>
          </div>
        ) : status === 'fallback' ? (
          /* Fallback — lien affiché directement */
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '20px' }}>🔑</div>
            <h2 style={{
              fontFamily: 'Newsreader, serif',
              fontSize: '24px',
              fontStyle: 'italic',
              color: NAVY,
              marginBottom: '12px',
              fontWeight: 400,
            }}>
              Votre lien d'accès
            </h2>
            <p style={{ fontSize: '14px', color: '#6b6b6b', lineHeight: 1.6, marginBottom: '24px' }}>
              Cliquez sur le lien ci-dessous pour accéder à votre espace. Valable 24h.
            </p>
            <a
              href={magicLink}
              style={{
                display: 'block',
                padding: '14px 20px',
                backgroundColor: NAVY,
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                marginBottom: '16px',
              }}
            >
              Accéder à Retbaa Circle →
            </a>
            <p style={{ fontSize: '12px', color: '#9b9b9b' }}>
              Lien personnel — ne pas partager.
            </p>
          </div>
        ) : null}

      </div>

      {/* Footer */}
      <div style={{
        marginTop: '32px',
        fontSize: '12px',
        color: '#aaaaaa',
        textAlign: 'center',
      }}>
        Vous n'avez pas encore d'accès ?{' '}
        <a href="mailto:massata@retbaa.com" style={{ color: ROSE_DARK, textDecoration: 'none' }}>
          Contactez Massata
        </a>
      </div>
    </div>
  )
}
