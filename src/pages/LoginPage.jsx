// pages/LoginPage.jsx — Clerk SignIn (Option B) — Retbaa Circle
import { SignIn } from '@clerk/clerk-react'
import { useTranslation } from 'react-i18next'

const clerkAppearance = {
  layout: {
    logoPlacement: 'none',
    showOptionalFields: false,
    socialButtonsPlacement: 'top',
    socialButtonsVariant: 'blockButton',
  },
  variables: {
    colorPrimary: '#EFC0D4',
    colorPrimaryForeground: '#1A3A6B',
    colorBackground: '#ffffff',
    colorInputBackground: '#ffffff',
    colorInputText: '#1A1C1C',
    colorText: '#1A3A6B',
    colorTextSecondary: '#43474F',
    colorNeutral: '#c4c6d0',
    colorDanger: '#EFC0D4',
    borderRadius: '4px',
    fontFamily: 'Manrope, sans-serif',
    fontSize: '14px',
    fontWeight: { normal: 400, medium: 600, bold: 700 },
    spacingUnit: '18px',
  },
  elements: {
    card: {
      boxShadow: 'none !important',
      border: 'none !important',
      padding: '0 !important',
      backgroundColor: 'transparent !important',
      width: '100% !important',
    },
    rootBox: {
      width: '100% !important',
      boxShadow: 'none !important',
    },
    cardBox: {
      boxShadow: 'none !important',
      border: 'none !important',
      backgroundColor: 'transparent !important',
      width: '100% !important',
    },
    headerTitle: {
      fontFamily: 'Newsreader, serif',
      fontSize: '32px',
      fontStyle: 'italic',
      fontWeight: 300,
      color: '#1A3A6B',
    },
    headerSubtitle: {
      fontFamily: 'Manrope, sans-serif',
      fontSize: '13px',
      color: '#43474F',
      letterSpacing: '0.03em',
    },
    socialButtonsBlockButton: {
      border: '1px solid rgba(196,198,208,0.7)',
      backgroundColor: 'transparent',
      color: '#1A3A6B',
      fontFamily: 'Manrope, sans-serif',
      fontSize: '13px',
      fontWeight: 600,
      letterSpacing: '0.05em',
      borderRadius: '4px',
      '&:hover': {
        backgroundColor: 'rgba(239,192,212,0.08)',
        borderColor: '#EFC0D4',
      },
    },
    dividerLine: { backgroundColor: 'rgba(196,198,208,0.3)' },
    dividerText: {
      color: '#c4c6d0',
      fontSize: '10px',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
    },
    formFieldLabel: {
      fontSize: '10px',
      fontFamily: 'Manrope, sans-serif',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: '#1A3A6B',
      fontWeight: 700,
    },
    formFieldInput: {
      border: 'none',
      borderBottom: '1px solid rgba(196,198,208,0.7)',
      borderRadius: '0',
      backgroundColor: 'transparent',
      padding: '12px 0',
      fontSize: '14px',
      fontFamily: 'Manrope, sans-serif',
      color: '#1A1C1C',
      boxShadow: 'none',
      '&:focus': {
        borderBottom: '2px solid #EFC0D4',
        boxShadow: 'none',
        outline: 'none',
      },
    },
    formButtonPrimary: {
      backgroundColor: '#EFC0D4',
      color: '#1A3A6B',
      fontFamily: 'Manrope, sans-serif',
      fontSize: '11px',
      letterSpacing: '0.28em',
      textTransform: 'uppercase',
      fontWeight: 700,
      borderRadius: '4px',
      boxShadow: '0px 8px 24px rgba(239,192,212,0.35)',
      '&:hover': {
        backgroundColor: '#E5B4CA',
        boxShadow: '0px 12px 32px rgba(239,192,212,0.45)',
      },
    },
    footerActionLink: {
      color: '#EFC0D4',
      fontFamily: 'Manrope, sans-serif',
      fontSize: '12px',
      '&:hover': { color: '#E5B4CA' },
    },
    footerActionText: {
      color: '#c4c6d0',
      fontFamily: 'Manrope, sans-serif',
      fontSize: '12px',
    },
    identityPreviewText: { color: '#1A3A6B' },
    identityPreviewEditButton: { color: '#EFC0D4' },
    formFieldAction: {
      color: '#c4c6d0',
      fontSize: '10px',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      '&:hover': { color: '#EFC0D4' },
    },
    alertText: { color: '#1A3A6B', fontSize: '12px' },
    formResendCodeLink: { color: '#EFC0D4' },
  },
}

export default function LoginPage() {
  const { i18n } = useTranslation()

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundColor: '#f9f9f9',
        fontFamily: 'Manrope, sans-serif',
        position: 'relative',
      }}
    >
      {/* ── Background Geometry ── */}
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

      {/* ── Top Nav ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: '64px', padding: '0 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        zIndex: 50,
        backdropFilter: 'blur(8px)',
      }}>
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
        <span style={{
          fontSize: '10px',
          fontFamily: 'Newsreader, serif',
          letterSpacing: '0.2em',
          color: '#9CA3AF',
          fontStyle: 'italic',
        }} className="hidden md:block">
          Portail Investisseurs · Retbaa Circle
        </span>
      </nav>

      {/* ── Main Split Layout ── */}
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

        {/* ══ LEFT — Branding ══ */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          backgroundColor: '#1A3A6B',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 56px 48px',
        }}>
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <img
              src="/retbaa-photos/retbaa_01.jpg"
              alt="Retbaa — Sensory Odyssey"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />
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
            <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: 'rgba(239,192,212,0.6)', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '8px 0 0', fontStyle: 'normal' }}>
              Un voyage sensoriel
            </p>
            <div style={{ width: '56px', height: '2px', backgroundColor: '#EFC0D4', marginTop: '28px' }} />
            <p style={{ marginTop: '24px', fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: 'rgba(171,199,255,0.85)', maxWidth: '280px', lineHeight: 1.75, letterSpacing: '0.04em' }}>
              Les grandes maisons ont toujours été bâties par quelques-uns qui ont vu juste trop tôt. Vous êtes ici parce que vous faites partie de ceux-là.
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

        {/* ══ RIGHT — Clerk SignIn ══ */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          padding: '64px 80px',
          backgroundColor: '#ffffff',
        }} className="login-form-col">
          <div style={{ width: '100%', maxWidth: '400px' }}>
            <SignIn
              appearance={clerkAppearance}
              routing="hash"
              signUpUrl="/invite"
              afterSignInUrl="/"
            />
          </div>

          {/* Trust Block */}
          <div style={{ width: '100%', maxWidth: '400px', marginTop: '40px', paddingTop: '28px', borderTop: '1px solid rgba(196,198,208,0.25)' }}>
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

      {/* ── Footer ── */}
      <footer style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '20px 48px',
        display: 'flex', flexDirection: 'row',
        justifyContent: 'space-between', alignItems: 'center',
        zIndex: 50, gap: '16px',
      }} className="login-footer">
        <p style={{ fontSize: '10px', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c4c6d0', margin: 0 }}>
          © 2026 Retbaa Circle.{' '}
          <span style={{ color: '#EFC0D4', fontWeight: 700 }}>Espace Privé.</span>
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
        /* Clerk — suppression box/ombre */
        .cl-card, .cl-cardBox, .cl-rootBox {
          box-shadow: none !important;
          border: none !important;
          background: transparent !important;
          width: 100% !important;
        }
        .cl-internal-b3fm6y {
          box-shadow: none !important;
          border: none !important;
        }
        /* Fix label coupé */
        .cl-formFieldLabel {
          overflow: visible !important;
          white-space: nowrap !important;
        }
        @media (max-width: 768px) {
          .login-grid {
            grid-template-columns: 1fr !important;
            margin: 64px 0 80px !important;
            min-height: unset !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            background: transparent !important;
          }
          .login-grid > *:first-child {
            display: none !important;
          }
          .login-form-col {
            padding: 40px 24px !important;
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
          .login-form-col {
            padding: 32px 16px !important;
          }
        }
      `}</style>
    </div>
  )
}
