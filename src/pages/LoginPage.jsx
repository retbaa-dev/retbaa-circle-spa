// pages/LoginPage.jsx — Retbaa Circle — Password + Magic Link + Google OAuth (Supabase)
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const { t, i18n } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailFocus, setEmailFocus] = useState(false)
  const [passwordFocus, setPasswordFocus] = useState(false)
  const [status, setStatus] = useState('idle') // idle | loading | sent | error
  const [errorMsg, setErrorMsg] = useState('')

  // ── Connexion mot de passe ──────────────────────────────────────
  const handlePassword = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password) return
    setStatus('loading')
    setErrorMsg('')

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (error) {
      const msg = error.message?.includes('Invalid login credentials')
        ? 'Email ou mot de passe incorrect. Vérifiez vos identifiants.'
        : error.message || 'Erreur de connexion.'
      setErrorMsg(msg)
      setStatus('error')
    }
    // Si succès : onAuthStateChange dans AuthProvider redirect automatiquement
  }

  // ── Magic Link OTP ──────────────────────────────────────────────
  const handleMagicLink = async () => {
    if (!email.trim()) {
      setErrorMsg('Entrez votre adresse email d\'abord.')
      setStatus('error')
      return
    }
    setStatus('loading')
    setErrorMsg('')

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: false,
      },
    })

    if (error) {
      setErrorMsg(error.message || "Erreur lors de l'envoi du lien.")
      setStatus('error')
    } else {
      setStatus('sent')
    }
  }

  // ── Google OAuth ─────────────────────────────────────────────────
  const handleGoogle = async () => {
    setErrorMsg('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) setErrorMsg(error.message || 'Erreur Google OAuth')
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#f9f9f9', fontFamily: 'Manrope, sans-serif', position: 'relative' }}
    >
      {/* Background Geometry */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '60%', height: '100%',
          backgroundColor: 'rgba(26,58,107,0.04)',
          transform: 'skewX(-12deg) translateX(80px)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, #EFC0D4, transparent)',
          opacity: 0.6,
        }} />
      </div>

      {/* Top Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '64px', padding: '0 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        zIndex: 50, backdropFilter: 'blur(8px)',
      }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {['en', 'fr'].map((lang) => (
            <button key={lang} onClick={() => i18n.changeLanguage(lang)} style={{
              fontSize: '10px', fontFamily: 'Manrope, sans-serif',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              fontWeight: i18n.language === lang ? '700' : '400',
              color: i18n.language === lang ? '#1A3A6B' : '#c4c6d0',
              background: 'none', border: 'none',
              borderBottom: i18n.language === lang ? '2px solid #EFC0D4' : '2px solid transparent',
              paddingBottom: '4px', cursor: 'pointer', transition: 'color 0.2s',
            }}>
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
        <span style={{
          fontSize: '10px', fontFamily: 'Newsreader, serif',
          letterSpacing: '0.2em', color: '#9CA3AF', fontStyle: 'italic',
        }} className="hidden md:block">
          Portail Investisseurs · Retbaa Circle
        </span>
      </nav>

      {/* Main Split Card */}
      <main style={{
        position: 'relative', zIndex: 10,
        width: '100%', maxWidth: '1200px',
        margin: '80px auto 80px',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        minHeight: '680px',
        backgroundColor: '#ffffff',
        boxShadow: '0px 32px 80px rgba(26,58,107,0.12)',
        borderRadius: '4px',
        overflow: 'hidden',
      }} className="login-grid">

        {/* LEFT — Branding */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          backgroundColor: '#1A3A6B',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 56px 48px',
        }}>
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <img src="/retbaa-photos/retbaa_01.jpg" alt="Retbaa"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
            <div style={{ position: 'absolute', inset: 0, backgroundColor: '#1A3A6B', opacity: 0.78 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(239,192,212,0.12) 0%, transparent 50%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: 'linear-gradient(to top, rgba(13,31,60,0.85), transparent)' }} />
          </div>

          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ fontFamily: 'Newsreader, serif', fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '10px' }}>
              Retbaa Circle
            </div>
            <p style={{ fontSize: '9px', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.45em', textTransform: 'uppercase', color: '#EFC0D4', marginTop: '8px', fontWeight: 700 }}>
              Portail Investisseurs
            </p>
          </div>

          <div style={{ position: 'relative', zIndex: 10 }}>
            <h2 style={{ fontFamily: 'Newsreader, serif', fontSize: '46px', fontStyle: 'italic', fontWeight: 300, color: '#ffffff', lineHeight: 1.1, letterSpacing: '-0.01em', margin: 0 }}>
              Sensory<br />Odyssey.
            </h2>
            <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: 'rgba(239,192,212,0.6)', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '8px 0 0' }}>
              Un voyage sensoriel
            </p>
            <div style={{ width: '56px', height: '2px', backgroundColor: '#EFC0D4', marginTop: '28px' }} />
            <p style={{ marginTop: '24px', fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: 'rgba(171,199,255,0.85)', maxWidth: '280px', lineHeight: 1.75, letterSpacing: '0.04em' }}>
              {t('login.left_desc', 'Les grandes maisons ont toujours été bâties par quelques-uns qui ont vu juste trop tôt. Vous êtes ici parce que vous faites partie de ceux-là.')}
            </p>
          </div>

          <div style={{ position: 'relative', zIndex: 10, display: 'flex', gap: '12px' }}>
            {[{ icon: 'lock', label: '256-bit' }, { icon: 'verified_user', label: 'KYC' }].map(({ icon, label }) => (
              <div key={icon} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', border: '1px solid rgba(239,192,212,0.25)', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                <span className="material-symbols-outlined" style={{ color: '#EFC0D4', fontSize: '14px' }}>{icon}</span>
                <span style={{ color: 'rgba(239,192,212,0.7)', fontSize: '9px', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Form */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '64px 80px', backgroundColor: '#ffffff',
        }} className="login-form-col">

          {/* Heading */}
          <div style={{ marginBottom: '36px' }}>
            <h3 style={{ fontFamily: 'Newsreader, serif', fontSize: '32px', fontStyle: 'italic', fontWeight: 300, color: '#1A3A6B', marginBottom: '8px', lineHeight: 1.2 }}>
              {t('login.welcome', 'Bienvenue')}
            </h3>
            <p style={{ fontSize: '13px', fontFamily: 'Manrope, sans-serif', color: '#43474F', letterSpacing: '0.03em', lineHeight: 1.6 }}>
              {t('login.subtitle', 'Connectez-vous pour accéder à votre espace privé.')}
            </p>
          </div>

          {/* ── État : lien envoyé ── */}
          {status === 'sent' ? (
            <div style={{
              padding: '32px', textAlign: 'center',
              border: '1px solid rgba(239,192,212,0.4)',
              borderRadius: '4px', background: 'rgba(239,192,212,0.05)',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#EFC0D4', display: 'block', marginBottom: '16px' }}>
                mark_email_read
              </span>
              <p style={{ fontFamily: 'Newsreader, serif', fontSize: '22px', fontStyle: 'italic', color: '#1A3A6B', marginBottom: '10px' }}>
                Vérifiez votre email
              </p>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#6B7280', lineHeight: 1.7 }}>
                Un lien de connexion sécurisé a été envoyé à<br />
                <strong style={{ color: '#1A3A6B' }}>{email}</strong>
              </p>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#9CA3AF', marginTop: '16px', letterSpacing: '0.05em' }}>
                Le lien expire dans 1 heure · Vérifiez vos spams
              </p>
              <button
                onClick={() => { setStatus('idle'); setPassword('') }}
                style={{
                  marginTop: '24px', background: 'none', border: 'none',
                  fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: '#EFC0D4', fontWeight: 700, cursor: 'pointer',
                }}
              >
                ← Retour à la connexion
              </button>
            </div>
          ) : (
            <>
              {/* Google Button — Coming Soon */}
              <div
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                  padding: '14px 24px', marginBottom: '28px',
                  border: '1px solid rgba(196,198,208,0.35)',
                  borderRadius: '4px', backgroundColor: 'rgba(249,249,249,0.6)',
                  fontFamily: 'Manrope, sans-serif', fontSize: '13px', fontWeight: 600,
                  color: '#C4C6D0', letterSpacing: '0.05em',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.35 }}>
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                <span style={{ opacity: 0.4 }}>Continuer avec Google</span>
                <span style={{
                  marginLeft: '10px',
                  fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: '#1A3A6B', backgroundColor: 'rgba(239,192,212,0.5)',
                  padding: '2px 8px', borderRadius: '20px', opacity: 0.8,
                }}>
                  Bientôt
                </span>
              </div>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(196,198,208,0.4)' }} />
                <span style={{ fontSize: '10px', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c4c6d0' }}>ou</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(196,198,208,0.4)' }} />
              </div>

              {/* ── Formulaire email + mot de passe ── */}
              <form onSubmit={handlePassword} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1A3A6B', fontWeight: 700, marginBottom: '10px' }}>
                    {t('login.email', 'Adresse email')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                    placeholder="prenom@email.com"
                    required
                    style={{
                      width: '100%', background: 'transparent', border: 'none',
                      borderBottom: emailFocus ? '2px solid #EFC0D4' : '1px solid rgba(196,198,208,0.7)',
                      outline: 'none', padding: '12px 0', fontSize: '14px',
                      fontFamily: 'Manrope, sans-serif', color: '#1A1C1C', transition: 'border-color 0.25s',
                    }}
                  />
                </div>

                {/* Mot de passe */}
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1A3A6B', fontWeight: 700, marginBottom: '10px' }}>
                    {t('login.password', "Clé d'accès")}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocus(true)}
                    onBlur={() => setPasswordFocus(false)}
                    placeholder="••••••••"
                    required
                    style={{
                      width: '100%', background: 'transparent', border: 'none',
                      borderBottom: passwordFocus ? '2px solid #EFC0D4' : '1px solid rgba(196,198,208,0.7)',
                      outline: 'none', padding: '12px 0', fontSize: '14px',
                      fontFamily: 'Manrope, sans-serif', color: '#1A1C1C', transition: 'border-color 0.25s',
                    }}
                  />
                </div>

                {/* Erreur */}
                {status === 'error' && errorMsg && (
                  <div style={{ padding: '10px 14px', background: 'rgba(239,192,212,0.15)', borderLeft: '2px solid #EFC0D4', fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: '#1A3A6B', marginTop: '-8px' }}>
                    {errorMsg}
                  </div>
                )}

                {/* CTA principal — Se connecter */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '4px' }}>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    style={{
                      width: '100%', backgroundColor: '#EFC0D4', color: '#1A3A6B',
                      padding: '18px 32px', fontSize: '11px', fontFamily: 'Manrope, sans-serif',
                      letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 700,
                      border: 'none', borderRadius: '4px', cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                      boxShadow: '0px 8px 24px rgba(239,192,212,0.35)', transition: 'all 0.25s ease',
                      opacity: status === 'loading' ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => { if (status !== 'loading') { e.currentTarget.style.backgroundColor = '#E5B4CA'; e.currentTarget.style.transform = 'translateY(-1px)' }}}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#EFC0D4'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    {status === 'loading' ? '…' : t('login.submit', 'Accéder à mon espace')}
                    {status !== 'loading' && <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>}
                  </button>

                  {/* CTA secondaire — Recevoir un lien */}
                  <button
                    type="button"
                    onClick={handleMagicLink}
                    disabled={status === 'loading'}
                    style={{
                      width: '100%', backgroundColor: 'transparent', color: '#1A3A6B',
                      padding: '14px 32px', fontSize: '10px', fontFamily: 'Manrope, sans-serif',
                      letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700,
                      border: '1px solid rgba(196,198,208,0.5)', borderRadius: '4px',
                      cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#EFC0D4'; e.currentTarget.style.backgroundColor = 'rgba(239,192,212,0.05)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(196,198,208,0.5)'; e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#EFC0D4' }}>send</span>
                    Recevoir un lien de connexion
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Trust Block */}
          <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid rgba(196,198,208,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', overflow: 'hidden', border: '1px solid rgba(239,192,212,0.3)', flexShrink: 0, borderRadius: '2px' }}>
                <img src="/retbaa-photos/retbaa_01.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)', opacity: 0.45 }} />
              </div>
              <p style={{ fontSize: '9px', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.1em', color: '#c4c6d0', lineHeight: 1.8, margin: 0 }}>
                <span style={{ color: '#EFC0D4', fontWeight: 700 }}>ACCÈS SÉCURISÉ · INVESTISSEURS RETBAA CIRCLE.</span><br />
                VOS DONNÉES SONT PROTÉGÉES ET CONFIDENTIELLES.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '20px 48px', display: 'flex', flexDirection: 'row',
        justifyContent: 'space-between', alignItems: 'center', zIndex: 50, gap: '16px',
      }} className="login-footer">
        <p style={{ fontSize: '10px', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c4c6d0', margin: 0 }}>
          © 2026 Retbaa Circle.{' '}<span style={{ color: '#EFC0D4', fontWeight: 700 }}>Espace Privé.</span>
        </p>
        <div style={{ display: 'flex', gap: '28px' }}>
          {['Confidentialité', 'Gouvernance', 'Réglementaire'].map((link) => (
            <a key={link} href="#" style={{ fontSize: '10px', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c4c6d0', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.target.style.color = '#EFC0D4'}
              onMouseLeave={(e) => e.target.style.color = '#c4c6d0'}
            >{link}</a>
          ))}
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .login-grid {
            grid-template-columns: 1fr !important;
            margin: 64px 0 80px !important;
            min-height: unset !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            background: transparent !important;
          }
          .login-grid > *:first-child { display: none !important; }
          .login-form-col {
            padding: 40px 32px !important;
            background: transparent !important;
            box-shadow: none !important;
          }
          .login-footer {
            flex-direction: column !important;
            padding: 16px 24px !important;
            gap: 8px !important;
            text-align: center !important;
          }
          .login-footer > div {
            flex-wrap: wrap !important;
            justify-content: center !important;
            gap: 16px !important;
          }
        }
        @media (max-width: 480px) {
          .login-form-col { padding: 32px 24px !important; }
        }
      `}</style>
    </div>
  )
}
