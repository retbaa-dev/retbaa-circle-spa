// pages/AuthCallback.jsx — Retbaa Circle
// Gère le retour du magic link et du Google OAuth Supabase
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    // Supabase detectSessionInUrl: true gère automatiquement l'échange
    // du code PKCE (magic link) et le token OAuth (Google).
    // Il suffit d'écouter le changement d'état.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Connexion réussie → dashboard
        navigate('/', { replace: true })
      } else if (event === 'TOKEN_REFRESHED') {
        navigate('/', { replace: true })
      }
    })

    // Fallback : si la session est déjà active (rechargement de page)
    supabase.auth.getSession().then(({ data: { session }, error: err }) => {
      if (err) {
        setError(err.message)
        return
      }
      if (session) {
        navigate('/', { replace: true })
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  if (error) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#F9F9F9', fontFamily: 'Manrope, sans-serif',
        gap: '16px',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#ba1a1a' }}>error</span>
        <p style={{ fontSize: '14px', color: '#ba1a1a', maxWidth: '360px', textAlign: 'center', lineHeight: 1.6 }}>
          Lien invalide ou expiré. Veuillez demander un nouveau lien de connexion.
        </p>
        <a href="/" style={{
          fontFamily: 'Manrope, sans-serif', fontSize: '10px',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: '#EFC0D4', fontWeight: 700, textDecoration: 'none',
        }}>
          ← Retour à la connexion
        </a>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#F9F9F9',
    }}>
      <div style={{
        fontFamily: 'Newsreader, serif', fontSize: '18px',
        fontStyle: 'italic', color: '#1A3A6B', opacity: 0.5,
      }}>
        Connexion en cours…
      </div>
    </div>
  )
}
