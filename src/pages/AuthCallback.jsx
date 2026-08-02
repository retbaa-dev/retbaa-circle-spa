// pages/AuthCallback.jsx — Retbaa Circle
// Gère le retour depuis auth.retbaa.com (token en query params) OU magic link direct
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const AUTH_TIMEOUT_MS = 10000

// Détermine où rediriger après connexion selon l'origine
function getRedirectTarget() {
  try {
    const params = new URLSearchParams(window.location.search)
    // Supabase passe parfois next= dans le magic link
    const next = params.get('next')
    if (next) return next
    // Si l'utilisateur venait de la dataroom
    const ref = document.referrer || ''
    if (ref.includes('/dataroom')) return '/dataroom-docs'
    // Fallback : lire le localStorage (DataroomLanding le sauvegarde)
    const stored = localStorage.getItem('retbaa_auth_redirect')
    if (stored) { localStorage.removeItem('retbaa_auth_redirect'); return stored }
  } catch {}
  return '/'
}

export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('Connexion en cours…')

  useEffect(() => {
    let timeout

    async function handleCallback() {
      // 1. Vérifier si auth.retbaa.com a passé access_token en query params
      const params = new URLSearchParams(window.location.search)
      const accessToken  = params.get('access_token')
      const refreshToken = params.get('refresh_token')

      if (accessToken && refreshToken) {
        setStatus('Vérification de vos accès…')
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
        if (sessionError) { setError(sessionError.message); return }
        if (data?.session) {
          await resolveAndRedirect(data.session.user?.email)
          return
        }
      }

      // 2. Fallback — magic link direct (Supabase gère via URL hash/detectSessionInUrl)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
          clearTimeout(timeout)
          setStatus('Préparation de votre espace…')
          await resolveAndRedirect(session.user?.email)
        }
      })

      const { data: { session }, error: err } = await supabase.auth.getSession()
      if (err) { setError(err.message); return }
      if (session) {
        clearTimeout(timeout)
        setStatus('Préparation de votre espace…')
        await resolveAndRedirect(session.user?.email)
        subscription.unsubscribe()
        return
      }

      timeout = setTimeout(() => {
        subscription.unsubscribe()
        setError('Lien expiré ou déjà utilisé. Veuillez demander un nouveau lien.')
      }, AUTH_TIMEOUT_MS)

      return () => { subscription.unsubscribe() }
    }

    // Détecte si le user est un prospect pour rediriger vers /dataroom-docs
    async function resolveAndRedirect(email) {
      if (!email) { navigate('/', { replace: true }); return }
      try {
        const { data } = await supabase
          .from('dataroom_prospects')
          .select('id')
          .eq('email', email)
          .maybeSingle()
        if (data) {
          navigate('/dataroom-docs', { replace: true })
          return
        }
      } catch {}
      navigate(getRedirectTarget(), { replace: true })
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
      backgroundColor: '#0D1F3C', fontFamily: 'system-ui, sans-serif', gap: '20px',
    }}>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontStyle: 'italic', color: '#fff', marginBottom: '8px' }}>Retbaa Circle</div>
      <div style={{ width: '32px', height: '1px', background: '#EFC0D4', margin: '0 auto' }} />
      <span style={{ fontSize: '32px', marginTop: '16px' }}>⚠️</span>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', maxWidth: '360px', textAlign: 'center', lineHeight: 1.7 }}>
        {error}
      </p>
      <a href="/dataroom" style={{
        fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase',
        color: '#EFC0D4', fontWeight: 700, textDecoration: 'none',
      }}>← Retour à la dataroom</a>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#0D1F3C', fontFamily: 'system-ui, sans-serif', gap: '16px',
    }}>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontStyle: 'italic', color: '#fff' }}>Retbaa Circle</div>
      <div style={{ width: '32px', height: '1px', background: '#EFC0D4', margin: '0 auto' }} />
      <div style={{ width: '200px', height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px', marginTop: '32px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: '60%', background: 'linear-gradient(90deg, #EFC0D4, #fff)', borderRadius: '1px', animation: 'slide 1.2s ease-in-out infinite' }} />
      </div>
      <style>{`@keyframes slide { 0%{transform:translateX(-100%)} 100%{transform:translateX(250%)} }`}</style>
      <div style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>
        {status}
      </div>
    </div>
  )
}
