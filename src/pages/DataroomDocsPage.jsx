// pages/DataroomDocsPage.jsx — Documents dataroom catégorisés avec viewer inline
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import DataroomFAQ from '../components/DataroomFAQ'

// Icônes et couleurs par catégorie
const CATEGORY_META = {
  'Investissement':      { icon: 'account_balance', color: '#1A3A6B', bg: 'rgba(26,58,107,0.08)'  },
  'Juridique':           { icon: 'gavel',            color: '#7C3AED', bg: 'rgba(124,58,237,0.08)' },
  'Financier':           { icon: 'bar_chart',        color: '#065F46', bg: 'rgba(6,95,70,0.08)'    },
  'Recherche & Marché':  { icon: 'travel_explore',   color: '#92400E', bg: 'rgba(146,64,14,0.08)'  },
  'Stratégie':           { icon: 'lightbulb',        color: '#B45309', bg: 'rgba(180,83,9,0.08)'   },
  'Général':             { icon: 'folder',           color: '#6B7280', bg: 'rgba(107,114,128,0.08)'},
}

function PdfViewer({ doc, onClose }) {
  const url = doc.file_url || doc.url
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: 'rgba(13,31,60,0.85)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header viewer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px',
        backgroundColor: '#0D1F3C',
        borderBottom: '1px solid rgba(239,192,212,0.2)',
        flexShrink: 0,
      }}>
        <div>
          <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '18px', color: '#fff' }}>
            {doc.title}
          </div>
          <div style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
            {doc.category} · Lecture seule
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.1)', border: 'none',
            color: '#fff', cursor: 'pointer',
            width: '36px', height: '36px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', flexShrink: 0,
          }}
        >
          ✕
        </button>
      </div>

      {/* PDF iframe — sans toolbar pour éviter le téléchargement */}
      <div style={{ flex: 1, overflow: 'hidden', backgroundColor: '#1A1A2E' }}>
        <iframe
          src={`${url}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
          title={doc.title}
          style={{ width: '100%', height: '100%', border: 'none' }}
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
    </div>
  )
}

function DocCard({ doc, isLocked, onPreview }) {
  const meta = CATEGORY_META[doc.category] || CATEGORY_META['Général']

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(26,58,107,0.08)',
      borderRadius: '8px',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      opacity: isLocked ? 0.6 : 1,
      transition: 'box-shadow 0.15s',
      cursor: isLocked ? 'default' : 'pointer',
    }}
    onClick={!isLocked ? onPreview : undefined}
    onMouseEnter={e => { if (!isLocked) e.currentTarget.style.boxShadow = '0 4px 16px rgba(26,58,107,0.1)' }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Icône catégorie */}
      <div style={{
        width: '44px', height: '44px', borderRadius: '8px',
        background: isLocked ? 'rgba(156,163,175,0.1)' : meta.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span className="material-symbols-outlined" style={{
          fontSize: '22px',
          color: isLocked ? '#9CA3AF' : meta.color,
        }}>
          {isLocked ? 'lock' : meta.icon}
        </span>
      </div>

      {/* Infos doc */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'Georgia, serif', fontStyle: 'italic',
          fontSize: '16px', color: isLocked ? '#9CA3AF' : '#1A3A6B',
          marginBottom: '4px', whiteSpace: 'nowrap',
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {doc.title}
        </div>
        {doc.description && (
          <div style={{
            fontSize: '12px', color: '#9CA3AF',
            lineHeight: 1.5, overflow: 'hidden',
            display: '-webkit-box', WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
          }}>
            {doc.description}
          </div>
        )}
      </div>

      {/* Statut / action */}
      {isLocked ? (
        <div style={{
          flexShrink: 0, fontSize: '11px', letterSpacing: '0.1em',
          textTransform: 'uppercase', color: '#9CA3AF',
          fontWeight: 600, whiteSpace: 'nowrap',
        }}>
          Accès restreint
        </div>
      ) : (
        <div style={{
          flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: '4px',
          fontSize: '11px', letterSpacing: '0.1em',
          textTransform: 'uppercase', color: meta.color,
          fontWeight: 700,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>visibility</span>
          Consulter
        </div>
      )}
    </div>
  )
}

function CategorySection({ category, docs, isProspect, isApproved, onPreview }) {
  const meta = CATEGORY_META[category] || CATEGORY_META['Général']
  return (
    <div style={{ marginBottom: '40px' }}>
      {/* Header section */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid rgba(26,58,107,0.08)',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: meta.color }}>
          {meta.icon}
        </span>
        <div style={{
          fontFamily: 'system-ui', fontSize: '11px',
          fontWeight: 700, letterSpacing: '0.25em',
          textTransform: 'uppercase', color: meta.color,
        }}>
          {category}
        </div>
        <div style={{
          marginLeft: 'auto', fontSize: '11px',
          color: '#9CA3AF', letterSpacing: '0.05em',
        }}>
          {docs.length} document{docs.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Cartes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {docs.map(doc => {
          const isLocked = isProspect && !doc.preview_only && !isApproved
          return (
            <DocCard
              key={doc.id}
              doc={doc}
              isLocked={isLocked}
              onPreview={() => onPreview(doc)}
            />
          )
        })}
      </div>
    </div>
  )
}

// Véhicules d'investissement avec leur sous-titre
const VEHICLES = {
  'Retbaa Holding':    { subtitle: 'Equity direct · 30 000 € = 1 %',          icon: 'account_balance', color: '#1A3A6B' },
  'Les Adresses':      { subtitle: 'SPV patrimonial · TRI cible 13–15 %',      icon: 'location_city',   color: '#065F46' },
  'Retbaa Manufacture':{ subtitle: 'Filière industrielle · Horizon 7–10 ans',  icon: 'factory',         color: '#7C3AED' },
}

function InvestissementSection({ docs, isProspect, isApproved, onPreview }) {
  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        marginBottom: '20px', paddingBottom: '12px',
        borderBottom: '1px solid rgba(26,58,107,0.08)',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#1A3A6B' }}>account_balance</span>
        <div style={{ fontFamily: 'system-ui', fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#1A3A6B' }}>
          Investissement
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '11px', color: '#9CA3AF', letterSpacing: '0.05em' }}>
          3 véhicules
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {Object.entries(VEHICLES).map(([vehicle, meta]) => {
          const vehicleDocs = docs.filter(d => d.vehicle === vehicle)
          const isComingSoon = vehicle === 'Retbaa Manufacture'

          return (
            <div key={vehicle} style={{
              background: '#fff',
              border: `1px solid ${isComingSoon ? 'rgba(156,163,175,0.2)' : 'rgba(26,58,107,0.1)'}`,
              borderRadius: '10px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              opacity: isComingSoon ? 0.7 : 1,
            }}>
              {/* Header véhicule */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '8px', flexShrink: 0,
                  background: isComingSoon ? 'rgba(156,163,175,0.1)' : `${meta.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: isComingSoon ? '#9CA3AF' : meta.color }}>
                    {meta.icon}
                  </span>
                </div>
                <div>
                  <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '16px', color: isComingSoon ? '#9CA3AF' : '#1A3A6B', marginBottom: '4px' }}>
                    {vehicle}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', lineHeight: 1.4 }}>
                    {meta.subtitle}
                  </div>
                </div>
              </div>

              <div style={{ height: '1px', background: 'rgba(26,58,107,0.06)' }} />

              {/* Documents du véhicule */}
              {isComingSoon ? (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 14px',
                  background: 'rgba(156,163,175,0.08)',
                  borderRadius: '6px',
                  fontSize: '12px', color: '#9CA3AF', fontStyle: 'italic',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>schedule</span>
                  Dossier en préparation
                </div>
              ) : vehicleDocs.length === 0 ? (
                <div style={{ fontSize: '12px', color: '#9CA3AF', fontStyle: 'italic' }}>Aucun document</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {vehicleDocs.map(doc => {
                    const isLocked = isProspect && !doc.preview_only && !isApproved
                    return (
                      <div
                        key={doc.id}
                        onClick={!isLocked ? () => onPreview(doc) : undefined}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '10px 12px',
                          background: isLocked ? 'rgba(156,163,175,0.06)' : `${meta.color}08`,
                          borderRadius: '6px',
                          cursor: isLocked ? 'default' : 'pointer',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { if (!isLocked) e.currentTarget.style.background = `${meta.color}15` }}
                        onMouseLeave={e => { e.currentTarget.style.background = isLocked ? 'rgba(156,163,175,0.06)' : `${meta.color}08` }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: isLocked ? '#9CA3AF' : meta.color, flexShrink: 0 }}>
                          {isLocked ? 'lock' : 'description'}
                        </span>
                        <span style={{
                          flex: 1, fontSize: '13px',
                          color: isLocked ? '#9CA3AF' : '#374151',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {doc.title.replace(/^[^—]+—\s*/, '')}
                        </span>
                        {!isLocked && (
                          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: meta.color, flexShrink: 0 }}>
                            visibility
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Ordre d'affichage des catégories
const CATEGORY_ORDER = ['Financier', 'Juridique', 'Recherche & Marché', 'Stratégie', 'Général']

export default function DataroomDocsPage({ isProspect }) {
  const { user } = useAuth()
  const [docs, setDocs]                     = useState([])
  const [loading, setLoading]               = useState(true)
  const [prospectStatus, setProspectStatus] = useState(null)
  const [viewerDoc, setViewerDoc]           = useState(null)

  useEffect(() => {
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
    if (!isProspect || !user?.email) return
    supabase
      .from('dataroom_prospects')
      .select('status')
      .eq('email', user.email)
      .maybeSingle()
      .then(({ data }) => setProspectStatus(data?.status ?? null))
  }, [isProspect, user?.email])

  const isApproved = prospectStatus === 'approved'

  // Grouper par catégorie (hors Investissement, traité séparément)
  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = docs.filter(d => (d.category || 'Général') === cat)
    if (items.length > 0) acc[cat] = items
    return acc
  }, {})
  docs.forEach(d => {
    const cat = d.category || 'Général'
    if (cat !== 'Investissement' && !grouped[cat])
      grouped[cat] = docs.filter(x => (x.category || 'Général') === cat)
  })

  const totalAccessible = docs.filter(d => !(isProspect && !d.preview_only && !isApproved)).length
  const totalLocked     = docs.length - totalAccessible

  return (
    <>
      {viewerDoc && <PdfViewer doc={viewerDoc} onClose={() => setViewerDoc(null)} />}

      <div style={{ minHeight: '100vh', backgroundColor: '#FAF7F2', padding: '48px 32px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          {/* En-tête */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{
              fontSize: '9px', letterSpacing: '0.4em', textTransform: 'uppercase',
              color: '#EFC0D4', fontWeight: 700, marginBottom: '12px',
            }}>
              RETBAA CIRCLE · ESPACE CONFIDENTIEL
            </div>
            <h1 style={{
              fontFamily: 'Georgia, serif', fontWeight: 300, fontStyle: 'italic',
              fontSize: '36px', color: '#1A3A6B', margin: '0 0 12px',
            }}>
              Dataroom
            </h1>
            <p style={{ fontFamily: 'system-ui', fontSize: '14px', color: '#6B7280', margin: 0 }}>
              {totalAccessible} document{totalAccessible > 1 ? 's' : ''} disponible{totalAccessible > 1 ? 's' : ''}
              {totalLocked > 0 && ` · ${totalLocked} en accès restreint`}
            </p>

            {isProspect && !isApproved && prospectStatus !== null && (
              <div style={{
                marginTop: '16px', padding: '12px 16px',
                background: 'rgba(239,192,212,0.2)',
                borderLeft: '3px solid #EFC0D4',
                borderRadius: '0 4px 4px 0',
                fontFamily: 'system-ui', fontSize: '13px', color: '#704C5D',
              }}>
                Les documents en accès restreint seront disponibles après validation de votre dossier par l'équipe Retbaa.
              </div>
            )}
          </div>

          {/* Contenu */}
          {loading ? (
            <div style={{
              textAlign: 'center', padding: '80px 0',
              fontFamily: 'Georgia, serif', fontStyle: 'italic',
              fontSize: '16px', color: '#1A3A6B', opacity: 0.4,
            }}>
              Chargement…
            </div>
          ) : docs.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '80px 0',
              fontFamily: 'system-ui', fontSize: '14px', color: '#9CA3AF',
            }}>
              Aucun document disponible pour le moment.
            </div>
          ) : (
            <>
              {/* Section Investissement — 3 véhicules en cards */}
              <InvestissementSection
                docs={docs.filter(d => d.category === 'Investissement')}
                isProspect={isProspect}
                isApproved={isApproved}
                onPreview={setViewerDoc}
              />

              {/* Autres catégories */}
              {Object.entries(grouped).map(([cat, items]) => (
                <CategorySection
                  key={cat}
                  category={cat}
                  docs={items}
                  isProspect={isProspect}
                  isApproved={isApproved}
                  onPreview={setViewerDoc}
                />
              ))}

              {/* FAQ Dataroom */}
              <DataroomFAQ />
            </>
          )}
        </div>
      </div>
    </>
  )
}
