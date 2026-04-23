// pages/LoginPage.jsx — Stitch Design System v2 — Retbaa Circle
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// Credentials investisseurs (mock — à remplacer par auth backend)
const USERS = {
  'pape.amadou.ngom@retbaa-circle.fr':   { password: 'eq3Y-XQc8-Rp2j', name: 'Pape Amadou' },
  'barthelemy@retbaa-circle.fr':          { password: 'THKc-uptF-c9o5', name: 'Barthélemy' },
  'cathy@retbaa-circle.fr':              { password: '8uy3-nsPV-vud4', name: 'Cathy' },
  'raphael@retbaa-circle.fr':            { password: 'aBZS-6S4u-HHf6', name: 'Raphaël' },
  'massata.niang@retbaa-circle.fr':      { password: 'MyTk-JWQ7-ZTGY', name: 'Massata' },
}

export default function LoginPage({ onLogin }) {
  const { t, i18n } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailFocus, setEmailFocus] = useState(false)
  const [passwordFocus, setPasswordFocus] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const user = USERS[email.toLowerCase().trim()]
    if (user && user.password === password) {
      onLogin(user.name)
    } else {
      setError(t('login.error', 'Identifiants incorrects. Vérifiez votre email et mot de passe.'))
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundColor: '#f9f9f9',
        fontFamily: 'Manrope, sans-serif',
        position: 'relative',
      }}
    >
      {/* ── Subtle Background Geometry ── */}
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

      {/* ── Fixed Top Nav ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: '64px', padding: '0 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        zIndex: 50,
        backdropFilter: 'blur(8px)',
      }}>
        {/* Language toggle */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {['en', 'fr'].map((lang) => (
            <button
              key={lang}
              onClick={() => i18n.changeLanguage(lang)}
              style={{
                fontSize: '10px',
                fontFamily: 'Manrope, sans-serif',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: i18n.language === lang ? '700' : '400',
                color: i18n.language === lang ? '#1A3A6B' : '#c4c6d0',
                borderBottom: i18n.language === lang ? '2px solid #EFC0D4' : '2px solid transparent',
                paddingBottom: '4px',
                background: 'none',
                border: 'none',
                borderBottom: i18n.language === lang ? '2px solid #EFC0D4' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
        {/* Tagline */}
        <span style={{
          fontSize: '10px',
          fontFamily: 'Newsreader, serif',
          letterSpacing: '0.2em',
          color: '#9CA3AF',
          fontStyle: 'italic',
        }}
          className="hidden md:block"
        >
          Portail Investisseurs · Retbaa Circle
        </span>
      </nav>

      {/* ── Main Split Card ── */}
      <main style={{
        position: 'relative', zIndex: 10,
        width: '100%', maxWidth: '1200px',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        minHeight: '680px',
        backgroundColor: '#ffffff',
        boxShadow: '0px 32px 80px rgba(26,58,107,0.12)',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
        className="login-grid"
      >

        {/* ══ LEFT COLUMN — Branding & Photo ══ */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#1A3A6B',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 56px 48px',
        }}>
          {/* Background Image + overlays */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <img
              src="/retbaa-photos/retbaa_01.jpg"
              alt="Retbaa — Sensory Odyssey"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />
            {/* Deep blue overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundColor: '#1A3A6B',
              opacity: 0.78,
            }} />
            {/* Rose tint top */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(160deg, rgba(239,192,212,0.12) 0%, transparent 50%)',
            }} />
            {/* Bottom fade */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px',
              background: 'linear-gradient(to top, rgba(13,31,60,0.85), transparent)',
            }} />
          </div>

          {/* Logo area */}
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div
              style={{
                fontFamily: 'Newsreader, serif',
                fontSize: '26px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                marginBottom: '10px',
              }}
            >
              Retbaa Circle
            </div>
            <p style={{
              fontSize: '9px',
              fontFamily: 'Manrope, sans-serif',
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              color: '#EFC0D4',
              marginTop: '8px',
              fontWeight: 700,
            }}>
              Portail Investisseurs
            </p>
          </div>

          {/* Tagline hero */}
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h2 style={{
              fontFamily: 'Newsreader, serif',
              fontSize: '46px',
              fontStyle: 'italic',
              fontWeight: 300,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              margin: 0,
            }}>
              Sensory<br />Odyssey.
            </h2>
            {/* Traduction FR en dessous */}
            <p style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '11px',
              color: 'rgba(239,192,212,0.6)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              margin: '8px 0 0',
              fontStyle: 'normal',
            }}>
              Un voyage sensoriel
            </p>
            {/* Rose gold rule */}
            <div style={{
              width: '56px', height: '2px',
              backgroundColor: '#EFC0D4',
              marginTop: '28px',
            }} />
            <p style={{
              marginTop: '24px',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '13px',
              color: 'rgba(171,199,255,0.85)',
              maxWidth: '280px',
              lineHeight: 1.75,
              letterSpacing: '0.04em',
            }}>
              {t('login.left_desc', 'Les grandes maisons ont toujours été bâties par quelques-uns qui ont vu juste trop tôt. Vous êtes ici parce que vous faites partie de ceux-là.')}
            </p>
          </div>

          {/* Security badges */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', gap: '12px' }}>
            {[
              { icon: 'lock', label: '256-bit' },
              { icon: 'verified_user', label: 'KYC' },
            ].map(({ icon, label }) => (
              <div key={icon} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 12px',
                border: '1px solid rgba(239,192,212,0.25)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '2px',
              }}>
                <span className="material-symbols-outlined" style={{ color: '#EFC0D4', fontSize: '14px' }}>
                  {icon}
                </span>
                <span style={{ color: 'rgba(239,192,212,0.7)', fontSize: '9px', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ══ RIGHT COLUMN — Login Form ══ */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px 80px',
          backgroundColor: '#ffffff',
        }}
          className="login-form-col"
        >
          {/* Heading */}
          <div style={{ marginBottom: '48px' }}>
            <h3 style={{
              fontFamily: 'Newsreader, serif',
              fontSize: '32px',
              fontStyle: 'italic',
              fontWeight: 300,
              color: '#1A3A6B',
              marginBottom: '8px',
              lineHeight: 1.2,
            }}>
              {t('login.welcome', 'Bienvenue')}
            </h3>
            <p style={{
              fontSize: '13px',
              fontFamily: 'Manrope, sans-serif',
              color: '#43474F',
              letterSpacing: '0.03em',
              lineHeight: 1.6,
            }}>
              {t('login.subtitle', 'Connectez-vous pour accéder à votre espace privé.')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>

            {/* Email field */}
            <div style={{ position: 'relative' }}>
              <label style={{
                display: 'block',
                fontSize: '10px',
                fontFamily: 'Manrope, sans-serif',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#1A3A6B',
                fontWeight: 700,
                marginBottom: '10px',
              }}>
                {t('login.email', 'Adresse email')}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                  required
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: emailFocus ? '2px solid #EFC0D4' : '1px solid rgba(196,198,208,0.7)',
                    outline: 'none',
                    padding: '12px 0',
                    fontSize: '14px',
                    fontFamily: 'Manrope, sans-serif',
                    color: '#1A1C1C',
                    transition: 'border-color 0.25s',
                  }}
                  placeholder=""
                />
              </div>
            </div>

            {/* Password field */}
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{
                  fontSize: '10px',
                  fontFamily: 'Manrope, sans-serif',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#1A3A6B',
                  fontWeight: 700,
                }}>
                  {t('login.password', "Mot de passe")}
                </label>
                <a href="#" style={{
                  fontSize: '10px',
                  fontFamily: 'Manrope, sans-serif',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#c4c6d0',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={(e) => e.target.style.color = '#EFC0D4'}
                  onMouseLeave={(e) => e.target.style.color = '#c4c6d0'}
                >
                  {t('login.forgot', 'Mot de passe oublié ?')}
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
                required
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: passwordFocus ? '2px solid #EFC0D4' : '1px solid rgba(196,198,208,0.7)',
                  outline: 'none',
                  padding: '12px 0',
                  fontSize: '14px',
                  fontFamily: 'Manrope, sans-serif',
                  color: '#1A1C1C',
                  transition: 'border-color 0.25s',
                }}
                placeholder=""
              />
            </div>

            {/* CTA Buttons */}
            <div style={{ paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Message d'erreur */}
              {error && (
                <div style={{
                  padding: '10px 14px',
                  background: 'rgba(239,192,212,0.15)',
                  borderLeft: '2px solid #EFC0D4',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '12px',
                  color: '#1A3A6B',
                }}>
                  {error}
                </div>
              )}
              {/* Primary: Rose Gold */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#EFC0D4',
                  color: '#1A3A6B',
                  padding: '18px 32px',
                  fontSize: '11px',
                  fontFamily: 'Manrope, sans-serif',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0px 8px 24px rgba(239,192,212,0.35)',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E5B4CA'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0px 12px 32px rgba(239,192,212,0.45)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#EFC0D4'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0px 8px 24px rgba(239,192,212,0.35)'
                }}
              >
                {t('login.submit', 'Accéder à mon espace')}
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  arrow_forward
                </span>
              </button>

              {/* Secondary: Border rose */}
              <button
                type="button"
                style={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  color: '#1A3A6B',
                  padding: '18px 32px',
                  fontSize: '11px',
                  fontFamily: 'Manrope, sans-serif',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  border: '1px solid #EFC0D4',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239,192,212,0.08)'
                  e.currentTarget.style.borderColor = '#E5B4CA'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderColor = '#EFC0D4'
                }}
              >
                {t('login.request', 'Demander un accès investisseur')}
              </button>
            </div>
          </form>

          {/* Bottom Trust Block */}
          <div style={{
            marginTop: '56px',
            paddingTop: '28px',
            borderTop: '1px solid rgba(196,198,208,0.25)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '44px', height: '44px',
                overflow: 'hidden',
                border: '1px solid rgba(239,192,212,0.3)',
                flexShrink: 0,
                borderRadius: '2px',
              }}>
                <img
                  src="/retbaa-photos/retbaa_01.jpg"
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)', opacity: 0.45 }}
                />
              </div>
              <div>
                <p style={{
                  fontSize: '9px',
                  fontFamily: 'Manrope, sans-serif',
                  letterSpacing: '0.1em',
                  color: '#c4c6d0',
                  lineHeight: 1.8,
                  margin: 0,
                }}>
                  <span style={{ color: '#EFC0D4', fontWeight: 700 }}>
                    {t('login.regulated', "ACCÈS SÉCURISÉ · INVESTISSEURS RETBAA CIRCLE.")}
                  </span>
                  <br />
                  {t('login.encryption', 'VOS DONNÉES SONT PROTÉGÉES ET CONFIDENTIELLES.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Fixed Footer ── */}
      <footer style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '20px 48px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 50,
        gap: '16px',
      }}
        className="login-footer"
      >
        <p style={{
          fontSize: '10px',
          fontFamily: 'Manrope, sans-serif',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#c4c6d0',
          margin: 0,
        }}>
          © 2026 Retbaa Circle.{' '}
          <span style={{ color: '#EFC0D4', fontWeight: 700 }}>Espace Privé.</span>
        </p>
        <div style={{ display: 'flex', gap: '28px' }}>
          {['Confidentialité', 'Gouvernance', 'Réglementaire'].map((link) => (
            <a
              key={link}
              href="#"
              style={{
                fontSize: '10px',
                fontFamily: 'Manrope, sans-serif',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#c4c6d0',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.color = '#EFC0D4'}
              onMouseLeave={(e) => e.target.style.color = '#c4c6d0'}
            >
              {link}
            </a>
          ))}
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .login-grid {
            grid-template-columns: 1fr !important;
          }
          .login-form-col {
            padding: 40px 32px !important;
          }
          .login-footer {
            flex-direction: column !important;
            padding: 16px 24px !important;
            gap: 8px !important;
          }
        }
      `}</style>
    </div>
  )
}
