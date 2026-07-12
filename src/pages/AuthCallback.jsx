// pages/AuthCallback.jsx — Retbaa Circle
// Gère le retour depuis auth.retbaa.com (token en query params) OU magic link direct
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const AUTH_TIMEOUT_MS = 8000

export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    let timeout

    async function handleCallback() {
      // 1. Vérifier si auth.retbaa.com a passé access_token en query params
      const params = new URLSearchParams(window.location.search)
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')

      if (accessToken && refreshToken) {
        // Créer la session depuis les tokens passés par auth.retbaa.com
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
        if (sessionError) {
          setError(sessionError.message)
          return
        }
        if (data?.session) {
          navigate('/', { replace: true })
          return
        }
      }

      // 2. Fallback — magic link direct (Supabase gère via URL hash/detectSessionInUrl)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
          navigate('/', { replace: true })
        }
      })

      supabase.auth.getSession().then(({ data: { session }, error: err }) => {
        if (err) { setError(err.message); return }
        if (session) navigate('/', { replace: true })
      })

      timeout = setTimeout(() => {
        setError('Lien expiré ou déjà utilisé. Veuillez demander un nouveau lien.')
      }, AUTH_TIMEOUT_MS)

      return () => subscription.unsubscribe()
    }

    const cleanup = handleCallback()
    return () => {
      clearTimeout(timeout)
      cleanup?.then?.(fn => fn?.())
    }
  }, [navigate])

  if (error) return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#F9F9F9', fontFamily: 'Manrope, sans-serif', gap: '16px',
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#ba1a1a' }}>error</span>
      <p style={{ fontSize: '14px', color: '#ba1a1a', maxWidth: '360px', textAlign: 'center', lineHeight: 1.6 }}>
        Lien invalide ou expiré. Veuillez demander un nouveau lien de connexion.
      </p>
      <a href="/" style={{
        fontFamily: 'Manrope, sans-serif', fontSize: '10px',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: '#EFC0D4', fontWeight: 700, textDecoration: 'none',
      }}>← Retour à la connexion</a>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9F9F9' }}>
      <div style={{ fontFamily: 'Newsreader, serif', fontSize: '18px', fontStyle: 'italic', color: '#1A3A6B', opacity: 0.5 }}>
        Connexion en cours…
      </div>
    </div>
  )
}
