// pages/ProspectDashboard.jsx — Dashboard simplifié pour les prospects dataroom
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProspectDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const cards = [
    {
      path: '/insights',
      icon: 'insights',
      title: 'Insights',
      desc: 'Actualités et analyses sur Retbaa',
    },
    {
      path: '/podcast',
      icon: 'mic',
      title: 'Podcast',
      desc: 'Tous les épisodes disponibles',
    },
    {
      path: '/dataroom-docs',
      icon: 'folder_open',
      title: 'Dataroom',
      desc: 'Documents et informations investisseur',
    },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FAF7F2',
      padding: '48px 32px',
      fontFamily: 'Manrope, sans-serif',
    }}>
      {/* En-tête */}
      <div style={{ maxWidth: '720px', margin: '0 auto 48px' }}>
        <h1 style={{
          fontFamily: 'Newsreader, serif',
          fontWeight: 300,
          fontStyle: 'italic',
          fontSize: '36px',
          color: '#1A3A6B',
          marginBottom: '12px',
          lineHeight: 1.25,
        }}>
          Bienvenue dans votre espace dataroom
        </h1>
        {user?.email && (
          <p style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '14px',
            color: '#6B7280',
            margin: 0,
          }}>
            Connecté en tant que <strong style={{ color: '#1A3A6B' }}>{user.email}</strong>
          </p>
        )}
        <div style={{
          marginTop: '24px',
          padding: '16px 20px',
          background: 'rgba(239,192,212,0.2)',
          borderLeft: '3px solid #EFC0D4',
          borderRadius: '0 4px 4px 0',
        }}>
          <p style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '13px',
            color: '#704C5D',
            margin: 0,
            lineHeight: 1.6,
          }}>
            Cet espace vous donne accès aux ressources publiques de Retbaa ainsi qu'aux documents de la dataroom.
            Pour toute question, n'hésitez pas à contacter l'équipe via le bouton en bas de la barre latérale.
          </p>
        </div>
      </div>

      {/* Cartes */}
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
      }}>
        {cards.map(({ path, icon, title, desc }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              background: '#fff',
              border: '1px solid rgba(26,58,107,0.08)',
              borderRadius: '8px',
              padding: '28px 24px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s, transform 0.15s',
              boxShadow: '0 2px 8px rgba(0,27,63,0.04)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,27,63,0.10)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,27,63,0.04)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '28px', color: '#EFC0D4', display: 'block', marginBottom: '14px' }}
            >
              {icon}
            </span>
            <div style={{
              fontFamily: 'Newsreader, serif',
              fontStyle: 'italic',
              fontSize: '20px',
              color: '#1A3A6B',
              marginBottom: '6px',
            }}>
              {title}
            </div>
            <div style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '12px',
              color: '#6B7280',
              lineHeight: 1.5,
            }}>
              {desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
