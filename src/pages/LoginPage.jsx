// pages/LoginPage.jsx — Retbaa Circle
// Auth Supabase native : magic link + Google OAuth
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleMagicLink = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: window.location.origin,
      },
    })
    setLoading(false)
    if (err) {
      setError(err.message)
    } else {
      setSent(true)
    }
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  // ── styles ──────────────────────────────────────────────────────────────
  const s = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F9F6F0',
      fontFamily: 'Manrope, sans-serif',
      padding: '24px',
    },
    card: {
      width: '100%',
      maxWidth: '400px',
      backgroundColor: '#fff',
      boxShadow: '0 8px 40px rgba(26,58,107,0.10)',
      padding: '48px 40px 40px',
    },
    logo: {
      fontFamily: 'Newsreader, serif',
      fontStyle: 'italic',
      fontWeight: 300,
      fontSize: '28px',
      color: '#1A3A6B',
      marginBottom: '4px',
    },
    tagline: {
      fontFamily: 'Manrope, sans-serif',
      fontSize: '9px',
      fontWeight: 700,
      letterSpacing: '0.35em',
      textTransform: 'uppercase',
      color: '#EFC0D4',
      marginBottom: '40px',
    },
    label: {
      display: 'block',
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: '#1A3A6B',
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '11px 14px',
      fontFamily: 'Manrope, sans-serif',
      fontSize: '14px',
      color: '#1A3A6B',
      background: '#F9F6F0',
      border: 'none',
      borderBottom: '2px solid #EFC0D4',
      outline: 'none',
      boxSizing: 'border-box',
      marginBottom: '24px',
    },
    btnPrimary: {
      width: '100%',
      padding: '13px',
      fontFamily: 'Manrope, sans-serif',
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: '#fff',
      background: '#1A3A6B',
      border: 'none',
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.6 : 1,
      marginBottom: '16px',
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px',
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      background: 'rgba(26,58,107,0.1)',
    },
    dividerText: {
      fontSize: '10px',
      color: 'rgba(26,58,107,0.35)',
      letterSpacing: '0.1em',
    },
    btnGoogle: {
      width: '100%',
      padding: '12px',
      fontFamily: 'Manrope, sans-serif',
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      color: '#1A3A6B',
      background: '#fff',
      border: '1.5px solid rgba(26,58,107,0.2)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    },
    error: {
      fontSize: '12px',
      color: '#ba1a1a',
      marginBottom: '16px',
      padding: '10px 14px',
      background: 'rgba(186,26,26,0.06)',
      borderLeft: '3px solid #ba1a1a',
    },
    success: {
      textAlign: 'center',
      padding: '16px 0',
    },
    successTitle: {
      fontFamily: 'Newsreader, serif',
      fontStyle: 'italic',
      fontSize: '22px',
      color: '#1A3A6B',
      marginBottom: '8px',
    },
    successText: {
      fontSize: '13px',
      color: '#6B7280',
      lineHeight: '1.6',
    },
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Logo */}
        <div style={s.logo}>Retbaa Circle</div>
        <div style={s.tagline}>Portail Investisseurs · Espace Privé</div>

        {sent ? (
          <div style={s.success}>
            <div style={{ fontSize: '36px', marginBottom: '16px' }}>✉️</div>
            <div style={s.successTitle}>Lien envoyé</div>
            <div style={s.successText}>
              Vérifiez votre boîte mail.<br />
              Cliquez sur le lien pour accéder à votre espace.
            </div>
          </div>
        ) : (
          <form onSubmit={handleMagicLink}>
            {error && <div style={s.error}>{error}</div>}

            <label style={s.label}>Adresse e-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              required
              autoFocus
              style={s.input}
            />

            <button type="submit" disabled={loading} style={s.btnPrimary}>
              {loading ? 'Envoi…' : 'Recevoir un lien de connexion'}
            </button>

            <div style={s.divider}>
              <div style={s.dividerLine} />
              <span style={s.dividerText}>ou</span>
              <div style={s.dividerLine} />
            </div>

            <button type="button" onClick={handleGoogle} style={s.btnGoogle}>
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuer avec Google
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
