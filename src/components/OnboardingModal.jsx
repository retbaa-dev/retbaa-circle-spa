// components/OnboardingModal.jsx — Modale onboarding prospect en 3 étapes
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function OnboardingModal({ onClose }) {
  const [step, setStep]           = useState(1) // 1: email, 2: nda, 3: confirmation
  const [email, setEmail]         = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [ndaChecked, setNdaChecked] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)

  // ── Styles partagés ─────────────────────────────────────────────────────
  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '14px',
    color: '#1A3A6B',
    background: '#FAF7F2',
    border: '1px solid rgba(26,58,107,0.2)',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  }

  const btnPrimary = {
    width: '100%',
    padding: '13px 24px',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#FAF7F2',
    background: '#1A3A6B',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  }

  // ── Étape 1 : Email ──────────────────────────────────────────────────────
  function handleEmailSubmit(e) {
    e.preventDefault()
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Veuillez entrer une adresse email valide.')
      return
    }
    setError(null)
    setStep(2)
  }

  // ── Étape 2 : NDA + submit ───────────────────────────────────────────────
  async function handleNdaSubmit(e) {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim()) {
      setError('Veuillez renseigner votre prénom et nom.')
      return
    }
    if (!ndaChecked) {
      setError("Veuillez accepter les termes de confidentialité.")
      return
    }
    setError(null)
    setLoading(true)

    try {
      // INSERT prospect
      const { error: insertErr } = await supabase
        .from('dataroom_prospects')
        .upsert({
          email:         email.toLowerCase().trim(),
          first_name:    firstName.trim(),
          last_name:     lastName.trim(),
          status:        'pending',
          nda_signed_at: new Date().toISOString(),
        }, { onConflict: 'email' })

      if (insertErr && insertErr.code !== '23505') throw insertErr

      // Magic link
      const { error: otpErr } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase().trim(),
        options: { shouldCreateUser: true },
      })
      if (otpErr) throw otpErr

      setStep(3)
    } catch (err) {
      console.error('OnboardingModal error:', err)
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  // ── Rendu ────────────────────────────────────────────────────────────────
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(13,31,60,0.8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        maxWidth: '480px',
        width: '100%',
        padding: '40px',
        position: 'relative',
        boxShadow: '0 24px 64px rgba(13,31,60,0.3)',
      }}>
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'rgba(26,58,107,0.06)', border: 'none',
            color: '#6B7280', cursor: 'pointer',
            width: '32px', height: '32px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
          }}
          aria-label="Fermer"
        >
          ✕
        </button>

        {/* Logo / marque */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '9px', letterSpacing: '0.4em',
            textTransform: 'uppercase', color: '#EFC0D4',
            fontWeight: 700, marginBottom: '4px',
          }}>
            RETBAA
          </div>
          <div style={{
            fontFamily: 'Georgia, serif', fontSize: '22px',
            fontWeight: 300, fontStyle: 'italic', color: '#1A3A6B',
          }}>
            Circle
          </div>
          <div style={{ width: '24px', height: '1px', background: '#EFC0D4', margin: '8px auto 0' }} />
        </div>

        {/* ── Étape 1 ── */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <h2 style={{
              fontFamily: 'Georgia, serif', fontStyle: 'italic',
              fontSize: '20px', fontWeight: 300, color: '#1A3A6B',
              margin: '0 0 8px', textAlign: 'center',
            }}>
              Accéder à ce document
            </h2>
            <p style={{
              fontFamily: 'system-ui, sans-serif', fontSize: '13px',
              color: '#6B7280', textAlign: 'center', margin: '0 0 28px',
              lineHeight: 1.6,
            }}>
              Pour accéder à ce document, créez votre espace Retbaa Circle.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block', fontFamily: 'system-ui, sans-serif',
                fontSize: '11px', fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: '#1A3A6B', marginBottom: '6px',
              }}>
                Adresse email
              </label>
              <input
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={inputStyle}
                autoFocus
                required
              />
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: '6px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                fontSize: '12px', color: '#DC2626',
                marginBottom: '16px',
              }}>
                {error}
              </div>
            )}

            <button type="submit" style={btnPrimary}>
              Continuer →
            </button>

            <p style={{
              fontFamily: 'system-ui, sans-serif', fontSize: '11px',
              color: '#9CA3AF', textAlign: 'center', margin: '16px 0 0',
              lineHeight: 1.5,
            }}>
              Vos informations restent confidentielles et ne seront jamais partagées.
            </p>
          </form>
        )}

        {/* ── Étape 2 ── */}
        {step === 2 && (
          <form onSubmit={handleNdaSubmit}>
            <h2 style={{
              fontFamily: 'Georgia, serif', fontStyle: 'italic',
              fontSize: '20px', fontWeight: 300, color: '#1A3A6B',
              margin: '0 0 8px', textAlign: 'center',
            }}>
              Accord de confidentialité
            </h2>

            {/* Texte NDA */}
            <div style={{
              padding: '16px',
              background: '#FAF7F2',
              border: '1px solid rgba(26,58,107,0.1)',
              borderRadius: '8px',
              marginBottom: '24px',
            }}>
              <p style={{
                fontFamily: 'Georgia, serif', fontStyle: 'italic',
                fontSize: '13px', color: '#374151',
                margin: 0, lineHeight: 1.7,
              }}>
                En accédant aux documents Retbaa Circle, vous vous engagez à ne pas divulguer,
                reproduire ou transmettre les informations confidentielles qui vous sont partagées.
                Ces documents sont strictement réservés à votre usage personnel à des fins d'évaluation.
                Tout manquement à cet engagement engage votre responsabilité.
              </p>
            </div>

            {/* Prénom + Nom */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{
                  display: 'block', fontFamily: 'system-ui, sans-serif',
                  fontSize: '11px', fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: '#1A3A6B', marginBottom: '6px',
                }}>
                  Prénom
                </label>
                <input
                  type="text"
                  placeholder="Prénom"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  style={inputStyle}
                  autoFocus
                  required
                />
              </div>
              <div>
                <label style={{
                  display: 'block', fontFamily: 'system-ui, sans-serif',
                  fontSize: '11px', fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: '#1A3A6B', marginBottom: '6px',
                }}>
                  Nom
                </label>
                <input
                  type="text"
                  placeholder="Nom de famille"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            {/* Checkbox NDA */}
            <label style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              marginBottom: '20px', cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                checked={ndaChecked}
                onChange={e => setNdaChecked(e.target.checked)}
                style={{
                  width: '16px', height: '16px', marginTop: '2px',
                  accentColor: '#1A3A6B', flexShrink: 0, cursor: 'pointer',
                }}
              />
              <span style={{
                fontFamily: 'system-ui, sans-serif', fontSize: '12px',
                color: '#374151', lineHeight: 1.5,
              }}>
                J'accepte les termes de confidentialité et m'engage à respecter l'accord ci-dessus.
              </span>
            </label>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: '6px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                fontSize: '12px', color: '#DC2626',
                marginBottom: '16px',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ ...btnPrimary, opacity: loading ? 0.6 : 1, cursor: loading ? 'wait' : 'pointer' }}
            >
              {loading ? 'Envoi en cours…' : 'Accéder à la dataroom →'}
            </button>

            <button
              type="button"
              onClick={() => { setStep(1); setError(null) }}
              style={{
                display: 'block', width: '100%', marginTop: '12px',
                padding: '10px', background: 'none', border: 'none',
                fontFamily: 'system-ui, sans-serif', fontSize: '12px',
                color: '#9CA3AF', cursor: 'pointer', textAlign: 'center',
              }}
            >
              ← Retour
            </button>
          </form>
        )}

        {/* ── Étape 3 — Confirmation ── */}
        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'rgba(26,58,107,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <span style={{ fontSize: '28px' }}>✉️</span>
            </div>
            <h2 style={{
              fontFamily: 'Georgia, serif', fontStyle: 'italic',
              fontSize: '20px', fontWeight: 300, color: '#1A3A6B',
              margin: '0 0 12px',
            }}>
              Lien envoyé
            </h2>
            <p style={{
              fontFamily: 'system-ui, sans-serif', fontSize: '14px',
              color: '#6B7280', margin: '0 0 8px', lineHeight: 1.6,
            }}>
              Lien envoyé à <strong style={{ color: '#1A3A6B' }}>{email}</strong>.
            </p>
            <p style={{
              fontFamily: 'system-ui, sans-serif', fontSize: '13px',
              color: '#9CA3AF', margin: '0 0 28px', lineHeight: 1.6,
            }}>
              Cliquez sur le lien pour accéder à vos documents.
              Vérifiez également vos spams.
            </p>
            <button
              onClick={onClose}
              style={{
                ...btnPrimary,
                background: 'transparent',
                color: '#1A3A6B',
                border: '1px solid rgba(26,58,107,0.3)',
              }}
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
