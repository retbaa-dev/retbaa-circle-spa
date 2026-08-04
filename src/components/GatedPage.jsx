// src/components/GatedPage.jsx — Placeholder pour pages verrouillées
// Affiché quand un visiteur non-auth tente d'accéder à une section privée
import { useNavigate } from 'react-router-dom'

const SECTIONS = {
  '/investissement':  { icon: 'trending_up',    label: 'Mon Investissement',   desc: 'Suivi de votre participation, tableaux de bord financiers et reporting trimestriel.' },
  '/documents':       { icon: 'folder_open',     label: 'Documents',            desc: 'Accès aux rapports, contrats et documents légaux de votre investissement.' },
  '/tranche2':        { icon: 'savings',         label: 'Tranche 2',            desc: 'Informations sur la prochaine tranche d\'investissement ouverte aux membres.' },
  '/produits':        { icon: 'inventory_2',     label: 'Catalogue Produits',   desc: 'Découvrez l\'ensemble de la gamme Retbaa — Atmosphère, Gourmet, Beauté.' },
}

export default function GatedPage({ path }) {
  const navigate = useNavigate()
  const section = SECTIONS[path] || {
    icon: 'lock',
    label: 'Section privée',
    desc: 'Cette section est réservée aux membres du cercle Retbaa.',
  }

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      fontFamily: 'Manrope, sans-serif',
    }}>
      <div style={{ maxWidth: '560px', width: '100%', textAlign: 'center' }}>

        {/* Icône section */}
        <div style={{
          width: '72px', height: '72px',
          borderRadius: '50%',
          background: 'rgba(26,58,107,0.06)',
          border: '1px solid rgba(26,58,107,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#1A3A6B' }}>
            {section.icon}
          </span>
        </div>

        {/* Titre */}
        <div style={{
          fontFamily: 'Newsreader, serif',
          fontStyle: 'italic',
          fontSize: '28px',
          color: '#1A3A6B',
          marginBottom: '12px',
          lineHeight: 1.3,
        }}>
          {section.label}
        </div>

        {/* Description section */}
        <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.7, marginBottom: '32px' }}>
          {section.desc}
        </p>

        {/* Séparateur */}
        <div style={{
          width: '40px', height: '2px',
          background: '#C4A96A',
          margin: '0 auto 32px',
        }} />

        {/* Explication portail */}
        <p style={{
          fontSize: '13px', color: '#9CA3AF', lineHeight: 1.7,
          marginBottom: '40px',
          padding: '0 16px',
        }}>
          Retbaa Circle est un portail privé réservé aux investisseurs et aux prospects qualifiés.
          Accédez à l'ensemble du contenu en rejoignant le cercle selon votre profil.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '12px',
          maxWidth: '360px', margin: '0 auto',
        }}>
          {/* CTA Prospect */}
          <button
            onClick={() => navigate('/dataroom')}
            style={{
              padding: '14px 24px',
              background: '#1A3A6B',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>person_search</span>
            Je suis un prospect
          </button>

          {/* CTA Investisseur */}
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '14px 24px',
              background: 'transparent',
              color: '#1A3A6B',
              border: '1px solid rgba(26,58,107,0.3)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>login</span>
            J'ai déjà un accès investisseur
          </button>
        </div>

        {/* Note de bas */}
        <p style={{ marginTop: '32px', fontSize: '11px', color: '#D1D5DB', letterSpacing: '0.05em' }}>
          Accès soumis à validation — Retbaa Circle
        </p>

      </div>
    </div>
  )
}
