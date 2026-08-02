// pages/DataroomDocsPage.jsx — Navigation libre + onboarding à la demande
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import OnboardingModal from '../components/OnboardingModal'
import DataroomFAQ from '../components/DataroomFAQ'

// ── Icônes et couleurs par catégorie ────────────────────────────────────────
const CATEGORY_META = {
  'Investissement':     { icon: 'account_balance', color: '#1A3A6B', bg: 'rgba(26,58,107,0.08)'  },
  'Juridique':          { icon: 'gavel',            color: '#7C3AED', bg: 'rgba(124,58,237,0.08)' },
  'Financier':          { icon: 'bar_chart',        color: '#065F46', bg: 'rgba(6,95,70,0.08)'    },
  'Recherche & Marché': { icon: 'travel_explore',   color: '#92400E', bg: 'rgba(146,64,14,0.08)'  },
  'Stratégie':          { icon: 'lightbulb',        color: '#B45309', bg: 'rgba(180,83,9,0.08)'   },
  'Général':            { icon: 'folder',           color: '#6B7280', bg: 'rgba(107,114,128,0.08)'},
}

// ── PDF Viewer inline ────────────────────────────────────────────────────────
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

// ── Badge ────────────────────────────────────────────────────────────────────
function Badge({ type }) {
  if (type === 'preview') {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        padding: '3px 8px', borderRadius: '4px',
        background: 'rgba(6,95,70,0.1)',
        fontSize: '10px', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: '#065F46', whiteSpace: 'nowrap',
        flexShrink: 0,
      }}>
        Aperçu libre
      </span>
    )
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '3px 8px', borderRadius: '4px',
      background: 'rgba(156,163,175,0.15)',
      fontSize: '10px', fontWeight: 700,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      color: '#6B7280', whiteSpace: 'nowrap',
      flexShrink: 0,
    }}>
      🔒 Accès restreint
    </span>
  )
}

// ── Carte document ───────────────────────────────────────────────────────────
function DocCard({ doc, isAuthenticated, isApproved, onPreviewClick, onRestrictedClick }) {
  const meta     = CATEGORY_META[doc.category] || CATEGORY_META['Général']
  const canOpen  = isAuthenticated && isApproved
  const isPreviewOnly = doc.preview_only

  function handleClick() {
    if (!isAuthenticated) {
      // Non connecté → onboarding
      onRestrictedClick()
    } else if (canOpen) {
      // Connecté + approuvé → viewer
      onPreviewClick(doc)
    } else if (!isPreviewOnly) {
      // Connecté mais pas approuvé + doc restreint → onboarding (ou info)
      onRestrictedClick()
    } else {
      // Connecté, aperçu libre
      onPreviewClick(doc)
    }
  }

  return (
    <div
      onClick={handleClick}
      style={{
        background: '#fff',
        border: '1px solid rgba(26,58,107,0.08)',
        borderRadius: '8px',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        cursor: 'pointer',
        transition: 'box-shadow 0.15s, transform 0.1s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(26,58,107,0.1)'
        e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Icône catégorie */}
      <div style={{
        width: '44px', height: '44px', borderRadius: '8px',
        background: isPreviewOnly ? meta.bg : 'rgba(156,163,175,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span className="material-symbols-outlined" style={{
          fontSize: '22px',
          color: isPreviewOnly ? meta.color : '#9CA3AF',
        }}>
          {isPreviewOnly ? meta.icon : 'lock'}
        </span>
      </div>

      {/* Infos doc */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          flexWrap: 'wrap', marginBottom: '6px',
        }}>
          <div style={{
            fontFamily: 'Georgia, serif', fontStyle: 'italic',
            fontSize: '16px', color: '#1A3A6B',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {doc.title}
          </div>
          <Badge type={isPreviewOnly ? 'preview' : 'restricted'} />
        </div>
        {doc.description && (
          <div style={{
            fontSize: '13px', color: '#6B7280',
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: isPreviewOnly ? 3 : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {doc.description}
          </div>
        )}
      </div>

      {/* Action */}
      <div style={{
        flexShrink: 0, alignSelf: 'center',
        display: 'flex', alignItems: 'center', gap: '4px',
        fontSize: '11px', letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: isPreviewOnly ? meta.color : '#9CA3AF',
        fontWeight: 700,
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
          {isPreviewOnly ? 'visibility' : 'lock_open'}
        </span>
        <span style={{ display: 'none' }}>
          {isPreviewOnly ? 'Aperçu' : 'Accéder'}
        </span>
      </div>
    </div>
  )
}

// ── Section catégorie ────────────────────────────────────────────────────────
function CategorySection({ category, docs, isAuthenticated, isApproved, onPreviewClick, onRestrictedClick }) {
  const meta = CATEGORY_META[category] || CATEGORY_META['Général']
  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        marginBottom: '16px', paddingBottom: '12px',
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
        <div style={{ marginLeft: 'auto', fontSize: '11px', color: '#9CA3AF', letterSpacing: '0.05em' }}>
          {docs.length} document{docs.length > 1 ? 's' : ''}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {docs.map(doc => (
          <DocCard
            key={doc.id}
            doc={doc}
            isAuthenticated={isAuthenticated}
            isApproved={isApproved}
            onPreviewClick={onPreviewClick}
            onRestrictedClick={onRestrictedClick}
          />
        ))}
      </div>
    </div>
  )
}

// ── Véhicules d'investissement ───────────────────────────────────────────────
const VEHICLES = {
  'Retbaa Holding':     { subtitle: 'Equity direct · 30 000 € = 1 %',         icon: 'account_balance', color: '#1A3A6B' },
  'Les Adresses':       { subtitle: 'SPV patrimonial · TRI cible 13–15 %',     icon: 'location_city',   color: '#065F46' },
  'Retbaa Manufacture': { subtitle: 'Filière industrielle · Horizon 7–10 ans', icon: 'factory',         color: '#7C3AED' },
}

function InvestissementSection({ docs, isAuthenticated, isApproved, onPreviewClick, onRestrictedClick }) {
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
          const vehicleDocs   = docs.filter(d => d.vehicle === vehicle)
          const isComingSoon  = vehicle === 'Retbaa Manufacture'

          return (
            <div key={vehicle} style={{
              background: '#fff',
              border: `1px solid ${isComingSoon ? 'rgba(156,163,175,0.2)' : 'rgba(26,58,107,0.1)'}`,
              borderRadius: '10px',
              padding: '24px',
              display: 'flex', flexDirection: 'column', gap: '12px',
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
                    const isPreviewOnly = doc.preview_only

                    function handleClick() {
                      if (!isAuthenticated) {
                        onRestrictedClick()
                      } else if (isAuthenticated && isApproved) {
                        onPreviewClick(doc)
                      } else if (!isPreviewOnly) {
                        onRestrictedClick()
                      } else {
                        onPreviewClick(doc)
                      }
                    }

                    return (
                      <div
                        key={doc.id}
                        onClick={handleClick}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '10px 12px',
                          background: isPreviewOnly ? `${meta.color}08` : 'rgba(156,163,175,0.06)',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = isPreviewOnly ? `${meta.color}15` : 'rgba(156,163,175,0.12)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = isPreviewOnly ? `${meta.color}08` : 'rgba(156,163,175,0.06)' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: isPreviewOnly ? meta.color : '#9CA3AF', flexShrink: 0 }}>
                          {isPreviewOnly ? 'description' : 'lock'}
                        </span>
                        <span style={{
                          flex: 1, fontSize: '13px',
                          color: '#374151',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {doc.title.replace(/^[^—]+—\s*/, '')}
                        </span>
                        {isPreviewOnly ? (
                          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: meta.color, flexShrink: 0 }}>
                            visibility
                          </span>
                        ) : (
                          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#9CA3AF', flexShrink: 0 }}>
                            lock_open
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

// ── Ordre d'affichage des catégories ─────────────────────────────────────────
const CATEGORY_ORDER = ['Financier', 'Juridique', 'Recherche & Marché', 'Stratégie', 'Général']

// ── Page principale ──────────────────────────────────────────────────────────
export default function DataroomDocsPage({ isProspect = false, isApproved: isApprovedProp = false }) {
  const { user, isSignedIn } = useAuth()
  const [docs, setDocs]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [viewerDoc, setViewerDoc] = useState(null)
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Authentification : utiliser les props si fournis par App.jsx (utilisateur connecté)
  // sinon fallback sur useAuth directement
  const isAuthenticated = isSignedIn || false

  // Vérifier si l'utilisateur approuvé : prop ou statut prospect
  const [prospectStatus, setProspectStatus] = useState(null)

  useEffect(() => {
    if (!isAuthenticated || !user?.email) return
    supabase
      .from('dataroom_prospects')
      .select('status')
      .eq('email', user.email)
      .maybeSingle()
      .then(({ data }) => setProspectStatus(data?.status ?? null))
  }, [isAuthenticated, user?.email])

  const isApproved = isApprovedProp || prospectStatus === 'approved'

  // Charger tous les docs (public — pas de filtre auth)
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

  // Grouper par catégorie (hors Investissement)
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

  const totalPreview    = docs.filter(d => d.preview_only).length
  const totalRestricted = docs.length - totalPreview

  function handleDocClick(doc) {
    setViewerDoc(doc)
  }

  function handleRestrictedClick() {
    setShowOnboarding(true)
  }

  return (
    <>
      {viewerDoc && <PdfViewer doc={viewerDoc} onClose={() => setViewerDoc(null)} />}
      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}

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
            <p style={{ fontFamily: 'system-ui', fontSize: '14px', color: '#6B7280', margin: '0 0 4px' }}>
              {docs.length} document{docs.length > 1 ? 's' : ''} · {totalPreview} en aperçu libre · {totalRestricted} en accès restreint
            </p>

            {/* Bannière info pour visiteurs non connectés */}
            {!isAuthenticated && (
              <div style={{
                marginTop: '16px', padding: '14px 18px',
                background: 'rgba(26,58,107,0.06)',
                borderLeft: '3px solid #1A3A6B',
                borderRadius: '0 6px 6px 0',
                fontFamily: 'system-ui', fontSize: '13px', color: '#374151',
                lineHeight: 1.6,
              }}>
                Parcourez librement les titres et descriptions. Cliquez sur un document pour créer votre accès.
              </div>
            )}

            {/* Info prospect en attente */}
            {isAuthenticated && isProspect && !isApproved && prospectStatus !== null && (
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
                isAuthenticated={isAuthenticated}
                isApproved={isApproved}
                onPreviewClick={handleDocClick}
                onRestrictedClick={handleRestrictedClick}
              />

              {/* Autres catégories */}
              {Object.entries(grouped).map(([cat, items]) => (
                <CategorySection
                  key={cat}
                  category={cat}
                  docs={items}
                  isAuthenticated={isAuthenticated}
                  isApproved={isApproved}
                  onPreviewClick={handleDocClick}
                  onRestrictedClick={handleRestrictedClick}
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
