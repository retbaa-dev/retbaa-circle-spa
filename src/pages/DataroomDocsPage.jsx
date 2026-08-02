// pages/DataroomDocsPage.jsx — Documents dataroom pour les prospects
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

function LockedCard({ doc }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(26,58,107,0.08)',
      borderRadius: '8px',
      padding: '24px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      opacity: 0.7,
    }}>
      <span
        className="material-symbols-outlined"
        style={{ fontSize: '28px', color: '#9CA3AF', flexShrink: 0, marginTop: '2px' }}
      >
        lock
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'Newsreader, serif',
          fontStyle: 'italic',
          fontSize: '18px',
          color: '#1A3A6B',
          marginBottom: '6px',
        }}>
          {doc.name || doc.title || 'Document'}
        </div>
        {doc.description && (
          <p style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '13px',
            color: '#6B7280',
            margin: '0 0 10px',
            lineHeight: 1.5,
          }}>
            {doc.description}
          </p>
        )}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          background: 'rgba(156,163,175,0.12)',
          borderRadius: '4px',
          fontFamily: 'Manrope, sans-serif',
          fontSize: '11px',
          fontWeight: 600,
          color: '#6B7280',
          letterSpacing: '0.05em',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span>
          Document disponible après validation de votre accès
        </div>
      </div>
    </div>
  )
}

function DocCard({ doc }) {
  const hasFile = doc.file_url || doc.url
  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(26,58,107,0.08)',
      borderRadius: '8px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <span
          className="material-symbols-outlined"
          style={{ fontSize: '28px', color: '#EFC0D4', flexShrink: 0, marginTop: '2px' }}
        >
          description
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'Newsreader, serif',
            fontStyle: 'italic',
            fontSize: '18px',
            color: '#1A3A6B',
            marginBottom: '6px',
          }}>
            {doc.name || doc.title || 'Document'}
          </div>
          {doc.description && (
            <p style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '13px',
              color: '#6B7280',
              margin: 0,
              lineHeight: 1.5,
            }}>
              {doc.description}
            </p>
          )}
        </div>
      </div>

      {/* Aperçu PDF inline si disponible */}
      {hasFile && doc.preview_only && (
        <div style={{ marginTop: '4px' }}>
          <iframe
            src={doc.file_url || doc.url}
            title={doc.name || doc.title}
            style={{
              width: '100%',
              height: '360px',
              border: '1px solid rgba(26,58,107,0.08)',
              borderRadius: '4px',
            }}
          />
        </div>
      )}

      {hasFile && (
        <a
          href={doc.file_url || doc.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            background: '#EFC0D4',
            borderRadius: '4px',
            fontFamily: 'Manrope, sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#704C5D',
            textDecoration: 'none',
            alignSelf: 'flex-start',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
          Ouvrir
        </a>
      )}
    </div>
  )
}

export default function DataroomDocsPage({ isProspect }) {
  const { user } = useAuth()
  const [docs, setDocs]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [prospectStatus, setProspectStatus] = useState(null)

  useEffect(() => {
    // Charger les docs
    supabase
      .from('dataroom_docs')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setDocs(data)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    // Charger le statut du prospect pour savoir s'il est approuvé
    if (!isProspect || !user?.email) return
    supabase
      .from('dataroom_prospects')
      .select('status')
      .eq('email', user.email)
      .maybeSingle()
      .then(({ data }) => {
        setProspectStatus(data?.status ?? null)
      })
  }, [isProspect, user?.email])

  const isApproved = prospectStatus === 'approved'

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FAF7F2',
      padding: '48px 32px',
    }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        {/* Titre */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontFamily: 'Newsreader, serif',
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: '36px',
            color: '#1A3A6B',
            marginBottom: '8px',
          }}>
            Dataroom
          </h1>
          <p style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '14px',
            color: '#6B7280',
            margin: 0,
          }}>
            Documents mis à disposition dans le cadre de votre analyse.
          </p>
          {isProspect && !isApproved && prospectStatus !== null && (
            <div style={{
              marginTop: '16px',
              padding: '12px 16px',
              background: 'rgba(239,192,212,0.2)',
              borderLeft: '3px solid #EFC0D4',
              borderRadius: '0 4px 4px 0',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '13px',
              color: '#704C5D',
            }}>
              Certains documents seront disponibles une fois votre accès validé par l'équipe Retbaa.
            </div>
          )}
        </div>

        {/* Contenu */}
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 0',
            fontFamily: 'Newsreader, serif',
            fontStyle: 'italic',
            fontSize: '16px',
            color: '#1A3A6B',
            opacity: 0.4,
          }}>
            Chargement…
          </div>
        ) : docs.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 0',
            fontFamily: 'Manrope, sans-serif',
            fontSize: '14px',
            color: '#9CA3AF',
          }}>
            Aucun document disponible pour le moment.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {docs.map(doc => {
              // Si preview_only = false ET prospect pas encore approuvé → carte verrouillée
              if (isProspect && !doc.preview_only && !isApproved) {
                return <LockedCard key={doc.id} doc={doc} />
              }
              return <DocCard key={doc.id} doc={doc} />
            })}
          </div>
        )}
      </div>
    </div>
  )
}
