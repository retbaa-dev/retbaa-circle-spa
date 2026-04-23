// components/Footer.jsx
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer style={{ backgroundColor: '#1A3A6B', borderTop: '2px solid #EFC0D4' }} className="mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <img
            src="/retbaa-logo-white.png"
            alt="Retbaa"
            style={{ height: '28px', width: 'auto' }}
          />
          <span style={{ color: '#EFC0D4', fontSize: '10px', letterSpacing: '2px' }} className="uppercase">
            {t('footer.tagline')}
          </span>
        </div>

        <div className="flex items-center gap-6">
          {['legal', 'privacy', 'contact'].map(item => (
            <a
              key={item}
              href="#"
              style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', letterSpacing: '1px', fontFamily: 'DM Sans, sans-serif' }}
              className="uppercase hover:text-white transition-colors"
            >
              {t(`footer.${item}`)}
            </a>
          ))}
        </div>

        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontFamily: 'DM Sans, sans-serif' }}>
          {t('footer.rights')}
        </div>
      </div>
    </footer>
  )
}
