// pages/dataroom/DataroomAccess.jsx — Retbaa Circle
// Espace dataroom authentifié — Guard OTP, layout simplifié
import { useState, useEffect, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const InsightsPage = lazy(() => import('../InsightsPage'))
const PodcastPage  = lazy(() => import('../PodcastPage'))

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#FAF7F2',
    fontFamily: 'system-ui, sans-serif',
  },
  sidebar: {
    width: '240px',
    flexShrink: 0,
    backgroundColor: '#1A3A6B',
    display: 'flex',
    flexDirection: 'column',
    padding: '40px 0',
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    zIndex: 10,
  },
  sidebarLogo: {
    fontFamily: 'Newsreader, serif',
    fontStyle: 'italic',
    fontWeight: 300,
    fontSize: '20px',
    color: '#FAF7F2',
    padding: '0 28px',
    marginBottom: '4px',
    letterSpacing: '0.01em',
  },
  sidebarTagline: {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '8px',
    fontWeight: 700,
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: '#C4A96A',
    padding: '0 28px',
    marginBottom: '48px',
  },
  navItem: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 28px',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '12px',
    fontWeight: active ? 700 : 400,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: active ? '#FAF7F2' : 'rgba(250,247,242,0.5)',
    background: active ? 'rgba(250,247,242,0.08)' : 'transparent',
    borderLeft: active ? '2px solid #C4A96A' : '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.15s',
    userSelect: 'none',
  }),
  sidebarFooter: {
    marginTop: 'auto',
    padding: '0 28px',
    borderTop: '1px solid rgba(250,247,242,0.1)',
    paddingTop: '20px',
  },
  sidebarEmail: {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '11px',
    color: 'rgba(250,247,242,0.45)',
    marginBottom: '12px',
    wordBreak: 'break-all',
  },
  btnLogout: {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'rgba(250,247,242,0.5)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  main: {
    marginLeft: '240px',
    flex: 1,
    minHeight: '100vh',
    backgroundColor: '#FAF7F2',
  },
  // Docs tab
  docsPage: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '48px 24px',
  },
  pageTitle: {
    fontFamily: 'Newsreader, serif',
    fontSize: '30px',
    fontWeight: 300,
    fontStyle: 'italic',
    color: '#1A3A6B',
    marginBottom: '8px',
  },
  pageSubtitle: {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '13px',
    color: '#9CA3AF',
    marginBottom: '40px',
  },
  docCard: {
    backgroundColor: '#fff',
    border: '1px solid rgba(26,58,107,0.08)',
    padding: '20px 24px',
    marginBottom: '12px',
    cursor: 'pointer',
    transition: 'box-shadow 0.15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
  },
  docTitle: {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '14px',
    fontWeight: 600,
    color: '#1A3A6B',
    marginBottom: '4px',
  },
  docType: {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '11px',
    color: '#9CA3AF',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  docIcon: {
    fontSize: '20px',
    flexShrink: 0,
    opacity: 0.4,
  },
  emptyState: {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '14px',
    color: '#9CA3AF',
    textAlign: 'center',
    padding: '60px 0',
    fontStyle: 'italic',
  },
  // Modal
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(10,20,40,0.65)',
    backdropFilter: 'blur(3px)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  modalCard: {
    backgroundColor: '#fff',
    maxWidth: '480px',
    width: '100%',
    padding: '48px 40px 40px',
    boxShadow: '0 20px 60px rgba(26,58,107,0.18)',
  },
  modalTitle: {
    fontFamily: 'Newsreader, serif',
    fontSize: '22px',
    fontWeight: 300,
    fontStyle: 'italic',
    color: '#1A3A6B',
    marginBottom: '12px',
  },
  modalBody: {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '14px',
    color: '#4B5563',
    lineHeight: 1.7,
    marginBottom: '28px',
  },
  btnPrimary: {
    width: '100%',
    padding: '13px',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#fff',
    background: '#1A3A6B',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '12px',
  },
  btnSecondary: {
    width: '100%',
    padding: '12px',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#1A3A6B',
    background: 'transparent',
    border: '1.5px solid rgba(26,58,107,0.2)',
    cursor: 'pointer',
  },
  toast: {
    position: 'fixed',
    bottom: '32px',
    right: '32px',
    backgroundColor: '#1A3A6B',
    color: '#FAF7F2',
    padding: '14px 20px',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '13px',
    boxShadow: '0 4px 20px rgba(26,58,107,0.25)',
    zIndex: 300,
    maxWidth: '320px',
  },
  loader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    fontFamily: 'Newsreader, serif',
    fontSize: '16px',
    fontStyle: 'italic',
    color: '#1A3A6B',
    opacity: 0.4,
  },
}

const NAV_ITEMS = [
  { key: 'insights',  label: 'Insights',   icon: '📊' },
  { key: 'podcast',   label: 'Podcast',    icon: '🎧' },
  { key: 'documents', label: 'Documents',  icon: '📁' },
]

// ── Documents tab ─────────────────────────────────────────────────────────────
function DocumentsTab({ userEmail }) {
  const [docs, setDocs]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [modalDoc, setModalDoc]   = useState(null)
  const [requesting, setRequesting] = useState(false)
  const [toast, setToast]         = useState(null)

  useEffect(() => {
    supabase
      .from('dataroom_docs')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error('dataroom_docs fetch error:', error)
        setDocs(data || [])
        setLoading(false)
      })
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  const handleRequestAccess = async () => {
    setRequesting(true)
    try {
      const { error } = await supabase
        .from('dataroom_prospects')
        .update({ status: 'access_requested', access_requested_at: new Date().toISOString() })
        .eq('email', userEmail)

      if (error) throw error
      setModalDoc(null)
      showToast('Votre demande d\'accès complet a été enregistrée.')
    } catch (err) {
      console.error(err)
      showToast('Erreur lors de la demande. Réessayez.')
    } finally {
      setRequesting(false)
    }
  }

  if (loading) return <div style={s.loader}>Chargement…</div>

  return (
    <div style={s.docsPage}>
      <div style={s.pageTitle}>Documents</div>
      <div style={s.pageSubtitle}>Accédez aux documents de la dataroom Retbaa Circle</div>

      {docs.length === 0 ? (
        <div style={s.emptyState}>Aucun document disponible pour le moment.</div>
      ) : (
        docs.map(doc => (
          <div
            key={doc.id}
            style={s.docCard}
            onClick={() => setModalDoc(doc)}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(26,58,107,0.10)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <div>
              <div style={s.docTitle}>{doc.title}</div>
              <div style={s.docType}>{doc.type}</div>
            </div>
            <div style={s.docIcon}>📄</div>
          </div>
        ))
      )}

      {/* Modal */}
      {modalDoc && (
        <div style={s.modalOverlay} onClick={() => setModalDoc(null)}>
          <div style={s.modalCard} onClick={e => e.stopPropagation()}>
            <div style={s.modalTitle}>{modalDoc.title}</div>
            <div style={s.modalBody}>
              Ce document est réservé aux investisseurs validés. Pour y accéder,
              demandez la validation de votre profil auprès de l'équipe Retbaa Circle.
            </div>
            <button
              style={{ ...s.btnPrimary, opacity: requesting ? 0.6 : 1 }}
              onClick={handleRequestAccess}
              disabled={requesting}
            >
              {requesting ? 'Envoi…' : 'Demander l\'accès complet'}
            </button>
            <button style={s.btnSecondary} onClick={() => setModalDoc(null)}>
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div style={s.toast}>{toast}</div>}
    </div>
  )
}

// ── Page loader ───────────────────────────────────────────────────────────────
function PageLoader() {
  return <div style={s.loader}>Chargement…</div>
}

// ── Composant principal ───────────────────────────────────────────────────────
export default function DataroomAccess() {
  const navigate              = useNavigate()
  const [activeTab, setActiveTab] = useState('insights')
  const [user, setUser]           = useState(null)
  const [checking, setChecking]   = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/dataroom', { replace: true })
      } else {
        setUser(session.user)
      }
      setChecking(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate('/dataroom', { replace: true })
      else setUser(session.user)
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/dataroom', { replace: true })
  }

  if (checking) return <div style={s.loader}>Chargement…</div>
  if (!user) return null

  return (
    <div style={s.layout}>
      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.sidebarLogo}>Retbaa Circle</div>
        <div style={s.sidebarTagline}>Espace Dataroom</div>

        <nav>
          {NAV_ITEMS.map(item => (
            <div
              key={item.key}
              style={s.navItem(activeTab === item.key)}
              onClick={() => setActiveTab(item.key)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div style={s.sidebarFooter}>
          <div style={s.sidebarEmail}>{user.email}</div>
          <button style={s.btnLogout} onClick={handleLogout}>
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={s.main}>
        <Suspense fallback={<PageLoader />}>
          {activeTab === 'insights'  && <InsightsPage />}
          {activeTab === 'podcast'   && <PodcastPage />}
          {activeTab === 'documents' && <DocumentsTab userEmail={user.email} />}
        </Suspense>
      </div>
    </div>
  )
}
