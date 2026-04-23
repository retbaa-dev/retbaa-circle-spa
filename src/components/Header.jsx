// components/Header.jsx — Stitch Design System — top-bar fine + mobile hamburger + FR/EN switch
import { useTranslation } from 'react-i18next'

const PAGE_LABELS = {
  dashboard:    'Tableau de bord',
  insights:     'Insights',
  products:     'Produits',
  catalogue:    'Produits',
  documents:    'Documents',
  'inner-circle': 'Inner Circle',
  'tranche2':   'Tranche 2',
  'mon-investissement': 'Mon Investissement',
  podcast:      'Podcast',
}

export default function Header({ activePage, userName, isMobile, onMenuClick }) {
  const { i18n } = useTranslation()
  const pageTitle = PAGE_LABELS[activePage] || 'Tableau de bord'

  const initials = userName
    ? userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(255,255,255,0.90)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(239,192,212,0.30)',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: isMobile ? '0 20px' : '0 40px',
    }}>

      {/* Gauche : hamburger (mobile) + titre */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {isMobile && (
          <button
            onClick={onMenuClick}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '6px', display: 'flex', alignItems: 'center',
              color: '#1A3A6B',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>menu</span>
          </button>
        )}
        {isMobile && (
          <span style={{
            fontFamily: 'Newsreader, serif', fontStyle: 'italic',
            fontSize: '18px', fontWeight: 400, color: '#1A3A6B',
          }}>
            Retbaa Circle
          </span>
        )}
        {!isMobile && (
          <span style={{
            fontFamily: 'Newsreader, serif', fontStyle: 'italic',
            fontSize: '20px', fontWeight: 400, color: '#1A3A6B',
          }}>
            {pageTitle}
          </span>
        )}
      </div>

      {/* Droite : switch FR/EN + avatar + nom */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* FR/EN switch */}
        <div style={{ display: 'flex', gap: isMobile ? '12px' : '16px', alignItems: 'center' }}>
          {['en', 'fr'].map((lang) => (
            <button
              key={lang}
              onClick={() => i18n.changeLanguage(lang)}
              style={{
                fontSize: isMobile ? '9px' : '10px',
                fontFamily: 'Manrope, sans-serif',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: i18n.language === lang ? '700' : '400',
                color: i18n.language === lang ? '#1A3A6B' : '#c4c6d0',
                background: 'none',
                border: 'none',
                borderBottom: i18n.language === lang ? '2px solid #EFC0D4' : '2px solid transparent',
                paddingBottom: '2px',
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Avatar + nom */}
        {userName && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px',
              borderRadius: '50%',
              border: '2px solid #EFC0D4',
              background: 'rgba(239,192,212,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{
                fontFamily: 'Newsreader, serif', fontSize: '13px',
                fontWeight: 600, color: '#704C5D',
              }}>
                {initials}
              </span>
            </div>
            {!isMobile && (
              <span style={{
                fontFamily: 'Manrope, sans-serif', fontSize: '12px',
                fontWeight: 600, color: '#1A3A6B',
              }}>
                {userName}
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
