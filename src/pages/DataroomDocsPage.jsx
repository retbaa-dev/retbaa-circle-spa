// pages/DataroomDocsPage.jsx — Navigation libre + onboarding à la demande
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useDataroomDocs } from '../hooks/queries/useDataroomDocs'
import { useAuth } from '../hooks/useAuth'
import OnboardingModal from '../components/OnboardingModal'
import ErrorBoundary from '../components/ErrorBoundary'
import DataroomFAQ from '../components/DataroomFAQ'
import { trackDocView, trackDocClose } from '../lib/tracking'

// ── Icônes et couleurs par catégorie ────────────────────────────────────────
const CATEGORY_META = {
  'Investissement':     { icon: 'account_balance', color: '#1A3A6B', bg: 'rgba(26,58,107,0.08)'  },
  'Juridique':          { icon: 'gavel',            color: '#7C3AED', bg: 'rgba(124,58,237,0.08)' },
  'Financier':          { icon: 'bar_chart',        color: '#065F46', bg: 'rgba(6,95,70,0.08)'    },
  'Recherche & Marché': { icon: 'travel_explore',   color: '#92400E', bg: 'rgba(146,64,14,0.08)'  },
  'Stratégie':          { icon: 'lightbulb',        color: '#B45309', bg: 'rgba(180,83,9,0.08)'   },
  'Général':            { icon: 'folder',           color: '#6B7280', bg: 'rgba(107,114,128,0.08)'},
}

// ── Logique d'accès par tier ─────────────────────────────────────────────────
function getDocAccess(doc, ndaSigned, isApproved, isInvestor) {
  const tier = doc.doc_tier || 1
  if (tier === 1) return ndaSigned ? 'open' : 'nda_required'
  if (tier === 2) return isApproved ? 'open' : 'pending_approval'
  if (tier === 3) return isInvestor ? 'open' : 'investor_only'
  return 'open'
}

// ── PDF Viewer inline ────────────────────────────────────────────────────────
function PdfViewer({ doc, onClose, viewerEmail = null }) {
  const url = doc.pdf_path || doc.file_url || doc.url
  const openedAt = useRef(Date.now())
  const [fallback, setFallback] = useState(false)

  const handleClose = () => {
    const seconds = Math.round((Date.now() - openedAt.current) / 1000)
    trackDocClose({ docId: doc.id, viewerEmail, durationSeconds: seconds })
    onClose()
  }

  // URL absolue pour l'iframe
  const absoluteUrl = url
    ? (url.startsWith('http') ? url : `${window.location.origin}${url}`)
    : null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: 'rgba(13,31,60,0.92)',
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
            {doc.category || doc.type} · Lecture seule
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {absoluteUrl && (
            <a
              href={absoluteUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontWeight: 700,
              }}
            >
              Ouvrir ↗
            </a>
          )}
          <button
            onClick={handleClose}
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
      </div>

      {/* PDF viewer */}
      <div style={{ flex: 1, overflow: 'hidden', backgroundColor: '#1A1A2E', position: 'relative' }}>
        {!absoluteUrl ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.4)', fontFamily: 'Manrope, sans-serif' }}>
            Document non disponible
          </div>
        ) : fallback ? (
          /* Fallback : lien direct si l'iframe ne charge pas */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px' }}>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Manrope, sans-serif', fontSize: '14px' }}>
              Le document ne peut pas s'afficher en ligne.
            </div>
            <a
              href={absoluteUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#1A3A6B', color: '#fff', padding: '12px 24px',
                borderRadius: '6px', textDecoration: 'none',
                fontFamily: 'Manrope, sans-serif', fontSize: '13px', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}
            >
              Ouvrir dans un nouvel onglet
            </a>
          </div>
        ) : (
          <iframe
            src={absoluteUrl}
            title={doc.title}
            style={{ width: '100%', height: '100%', border: 'none' }}
            onError={() => setFallback(true)}
          />
        )}
      </div>
    </div>
  )
}

// ── TierBadge ────────────────────────────────────────────────────────────────
function TierBadge({ access }) {
  const configs = {
    open:             { label: 'Accessible',    bg: 'rgba(6,95,70,0.1)',     color: '#065F46' },
    nda_required:     { label: 'NDA requis',    bg: 'rgba(156,163,175,0.1)', color: '#6B7280' },
    pending_approval: { label: 'En attente',    bg: 'rgba(245,158,11,0.1)',  color: '#B45309' },
    investor_only:    { label: 'Investisseurs', bg: 'rgba(26,58,107,0.1)',   color: '#1A3A6B' },
  }
  const c = configs[access] || configs.nda_required
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '3px 8px', borderRadius: '4px',
      background: c.bg, fontSize: '10px', fontWeight: 700,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      color: c.color, whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      {access !== 'open' && '🔒 '}{c.label}
    </span>
  )
}

// ── Carte document ───────────────────────────────────────────────────────────
function DocCard({ doc, access, onOpenClick, onNdaRequired, onRestrictedClick }) {
  const meta = CATEGORY_META[doc.category] || CATEGORY_META['Général']

  function handleClick() {
    if (access === 'open') {
      onOpenClick(doc)
    } else if (access === 'nda_required') {
      onNdaRequired()
    } else {
      onRestrictedClick()
    }
  }

  const iconName = access === 'open' ? meta.icon : 'lock'
  const iconColor = access === 'open' ? meta.color : (
    access === 'pending_approval' ? '#B45309' :
    access === 'investor_only'    ? '#1A3A6B' :
    '#9CA3AF'
  )
  const iconBg = access === 'open' ? meta.bg : (
    access === 'pending_approval' ? 'rgba(245,158,11,0.08)' :
    access === 'investor_only'    ? 'rgba(26,58,107,0.08)' :
    'rgba(156,163,175,0.1)'
  )

  const tooltipText = access === 'nda_required'
    ? 'Signez le NDA pour accéder'
    : access === 'pending_approval'
    ? "En attente d'approbation"
    : access === 'investor_only'
    ? 'Réservé aux investisseurs'
    : null

  return (
    <div
      onClick={handleClick}
      title={tooltipText || undefined}
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
        background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '22px', color: iconColor }}>
          {iconName}
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
          <TierBadge access={access} />
        </div>
        {(doc.summary || doc.description) && (
          <div style={{
            fontSize: '13px', color: '#6B7280',
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {doc.summary || doc.description}
          </div>
        )}
      </div>

      {/* Action */}
      <div style={{
        flexShrink: 0, alignSelf: 'center',
        display: 'flex', alignItems: 'center', gap: '4px',
        fontSize: '11px', letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: iconColor,
        fontWeight: 700,
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
          {access === 'open' ? 'visibility' : 'lock'}
        </span>
      </div>
    </div>
  )
}

// ── Section catégorie ────────────────────────────────────────────────────────
function CategorySection({ category, docs, ndaSigned, isApproved, isInvestor, onOpenClick, onNdaRequired, onRestrictedClick }) {
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
            access={getDocAccess(doc, ndaSigned, isApproved, isInvestor)}
            onOpenClick={onOpenClick}
            onNdaRequired={onNdaRequired}
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

function InvestissementSection({ docs, ndaSigned, isApproved, isInvestor, onOpenClick, onNdaRequired, onRestrictedClick }) {
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
                    const access = getDocAccess(doc, ndaSigned, isApproved, isInvestor)

                    const iconColor = access === 'open' ? meta.color : (
                      access === 'pending_approval' ? '#B45309' :
                      access === 'investor_only'    ? '#1A3A6B' :
                      '#9CA3AF'
                    )

                    function handleClick() {
                      if (access === 'open') {
                        onOpenClick(doc)
                      } else if (access === 'nda_required') {
                        onNdaRequired()
                      } else {
                        onRestrictedClick()
                      }
                    }

                    return (
                      <div
                        key={doc.id}
                        onClick={handleClick}
                        title={
                          access === 'nda_required'     ? 'Signez le NDA pour accéder' :
                          access === 'pending_approval' ? "En attente d'approbation" :
                          access === 'investor_only'    ? 'Réservé aux investisseurs' :
                          undefined
                        }
                        style={{
                          padding: '14px 16px',
                          background: access === 'open' ? `${meta.color}08` : 'rgba(156,163,175,0.06)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'background 0.15s',
                          border: `1px solid ${access === 'open' ? `${meta.color}20` : 'rgba(156,163,175,0.15)'}`,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = access === 'open' ? `${meta.color}15` : 'rgba(156,163,175,0.12)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = access === 'open' ? `${meta.color}08` : 'rgba(156,163,175,0.06)' }}
                      >
                        {/* Titre + icône action */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: doc.summary ? '8px' : 0 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '15px', color: iconColor, flexShrink: 0 }}>
                            {access === 'open' ? 'description' : 'lock'}
                          </span>
                          <span style={{
                            flex: 1, fontSize: '13px', fontWeight: 600,
                            color: access === 'open' ? '#1A3A6B' : '#9CA3AF',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {doc.title.replace(/^[^—]+—\s*/, '')}
                          </span>
                          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: iconColor, flexShrink: 0 }}>
                            {access === 'open' ? 'visibility' : 'lock'}
                          </span>
                        </div>
                        {/* Résumé */}
                        {doc.summary && (
                          <div style={{
                            fontSize: '12px', color: '#6B7280', lineHeight: 1.55,
                            display: '-webkit-box', WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical', overflow: 'hidden',
                          }}>
                            {doc.summary}
                          </div>
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
export default function DataroomDocsPage({ isProspect = false, isApproved: isApprovedProp = false, isAuthenticated: isAuthProp = false }) {
  const { user, isSignedIn } = useAuth()
  const [viewerDoc, setViewerDoc] = useState(null)
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Mode preview (isAuthProp=true) OU vraiment connecté
  const isAuthenticated = isAuthProp || isSignedIn || false

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

  // TEST MODE : tout utilisateur connecté ou preview = approuvé
  const isApproved = isApprovedProp || isAuthenticated || prospectStatus === 'approved'

  // Accès tier — NDA et investisseur
  const ndaSigned = !!localStorage.getItem('retbaa_nda_signed')
  const isInvestor = isSignedIn && !isProspect

  // ── TanStack Query — fetch docs dataroom ──────────────────────────────────
  const { data: docs = [], isLoading: loading } = useDataroomDocs()

  useEffect(() => {
    if (!isProspect || !user?.email) return
    supabase
      .from('dataroom_prospects')
      .select('status')
      .eq('email', user.email)
      .maybeSingle()
      .then(({ data }) => setProspectStatus(data?.status ?? null))
  }, [isProspect, user?.email])

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

  const totalAccessible = docs.filter(d => getDocAccess(d, ndaSigned, isApproved, isInvestor) === 'open').length
  const totalRestricted = docs.length - totalAccessible

  function handleDocClick(doc) {
    setViewerDoc(doc)
    trackDocView({
      docId: doc.id,
      docTitle: doc.title,
      viewerEmail: user?.email ?? null,
      isProspect: isProspect || false,
    }).catch(() => {})
  }

  function handleNdaRequired() {
    // Scrolle vers le haut pour signer le NDA ou ouvre l'onboarding
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setShowOnboarding(true)
  }

  function handleRestrictedClick() {
    setShowOnboarding(true)
  }

  // ── Bannière contextuelle ────────────────────────────────────────────────
  function ContextualBanner() {
    if (isInvestor) {
      return (
        <div style={{
          marginTop: '16px', padding: '14px 18px',
          background: 'rgba(26,58,107,0.06)',
          borderLeft: '3px solid #1A3A6B',
          borderRadius: '0 6px 6px 0',
          fontFamily: 'system-ui', fontSize: '13px', color: '#1A3A6B',
          lineHeight: 1.6, display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>verified</span>
          Accès complet — bienvenue dans l'espace investisseur.
        </div>
      )
    }
    if (isApproved && ndaSigned) {
      return (
        <div style={{
          marginTop: '16px', padding: '14px 18px',
          background: 'rgba(6,95,70,0.06)',
          borderLeft: '3px solid #065F46',
          borderRadius: '0 6px 6px 0',
          fontFamily: 'system-ui', fontSize: '13px', color: '#065F46',
          lineHeight: 1.6, display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check_circle</span>
          Votre accès a été validé — documents financiers disponibles.
        </div>
      )
    }
    if (ndaSigned && !isApproved) {
      return (
        <div style={{
          marginTop: '16px', padding: '14px 18px',
          background: 'rgba(239,192,212,0.2)',
          borderLeft: '3px solid #EFC0D4',
          borderRadius: '0 6px 6px 0',
          fontFamily: 'system-ui', fontSize: '13px', color: '#704C5D',
          lineHeight: 1.6, display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>hourglass_empty</span>
          Dossier en cours d'examen — les documents financiers seront disponibles après approbation.
        </div>
      )
    }
    // Pas de NDA signé
    return (
      <div style={{
        marginTop: '16px', padding: '14px 18px',
        background: 'rgba(26,58,107,0.06)',
        borderLeft: '3px solid #1A3A6B',
        borderRadius: '0 6px 6px 0',
        fontFamily: 'system-ui', fontSize: '13px', color: '#374151',
        lineHeight: 1.6, display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>info</span>
        Signez le NDA pour accéder aux documents Tier 1. Cliquez sur un document pour commencer.
      </div>
    )
  }

  return (
    <>
      {viewerDoc && <PdfViewer doc={viewerDoc} onClose={() => setViewerDoc(null)} viewerEmail={user?.email ?? null} />}
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
              {docs.length} document{docs.length > 1 ? 's' : ''} · {totalAccessible} accessible{totalAccessible > 1 ? 's' : ''} · {totalRestricted} restreint{totalRestricted > 1 ? 's' : ''}
            </p>

            {/* Bannière contextuelle */}
            <ContextualBanner />
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
              <ErrorBoundary>
                <InvestissementSection
                  docs={docs.filter(d => d.category === 'Investissement')}
                  ndaSigned={ndaSigned}
                  isApproved={isApproved}
                  isInvestor={isInvestor}
                  onOpenClick={handleDocClick}
                  onNdaRequired={handleNdaRequired}
                  onRestrictedClick={handleRestrictedClick}
                />
              </ErrorBoundary>

              {/* Autres catégories */}
              {Object.entries(grouped).map(([cat, items]) => (
                <ErrorBoundary key={cat}>
                  <CategorySection
                    category={cat}
                    docs={items}
                    ndaSigned={ndaSigned}
                    isApproved={isApproved}
                    isInvestor={isInvestor}
                    onOpenClick={handleDocClick}
                    onNdaRequired={handleNdaRequired}
                    onRestrictedClick={handleRestrictedClick}
                  />
                </ErrorBoundary>
              ))}

              {/* FAQ Dataroom */}
              <ErrorBoundary>
                <DataroomFAQ />
              </ErrorBoundary>
            </>
          )}
        </div>
      </div>
    </>
  )
}
