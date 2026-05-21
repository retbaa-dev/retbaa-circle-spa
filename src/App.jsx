import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import './i18n/index.js'
import InvitePage from './pages/InvitePage'
import PendingPage from './pages/PendingPage'
import AdminPage from './pages/AdminPage'
import ProspectGatePage from './pages/ProspectGatePage'
import AuthCallback from './pages/AuthCallback'
import LoginPage from './pages/LoginPage'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import ObservateurDashboard from './pages/ObservateurDashboard'
import CataloguePage from './pages/CataloguePage'
import DocumentsPage from './pages/DocumentsPage'
import InsightsPage from './pages/InsightsPage'
import InnerCirclePage from './pages/InnerCirclePage'
import Tranche2Page from './pages/Tranche2Page'
import MonInvestissementPage from './pages/MonInvestissementPage'
import PodcastPage from './pages/PodcastPage'
import BienvenueOnboarding from './pages/BienvenueOnboarding'
import AnalyticsPage from './pages/AnalyticsPage'
import { track } from './utils/tracker'
import './index.css'

// Placeholder pages pour navigation carousel
function PlaceholderPage({ title, subtitle, onBack }) {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 40px', textAlign: 'center' }}>
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          fontFamily: 'Manrope, sans-serif', fontSize: '10px',
          color: '#EFC0D4', letterSpacing: '0.2em', textTransform: 'uppercase',
          fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer',
          marginBottom: '48px',
        }}
      >
        ← Retour au tableau de bord
      </button>
      <div style={{
        fontFamily: 'Newsreader, serif', fontSize: '42px', fontWeight: 300,
        color: '#1A3A6B', fontStyle: 'italic', marginBottom: '12px',
      }}>
        {title}
      </div>
      <div style={{
        fontFamily: 'Newsreader, serif', fontStyle: 'italic',
        fontSize: '14px', color: '#9CA3AF',
      }}>
        {subtitle}
      </div>
    </div>
  )
}

// ── Mode preview : ?preview=massata&token=retbaa-dev-2026 ──
const PREVIEW_USERS = {
  massata: 'Massata',
  barthelemy: 'Barthélemy',
  pape: 'Pape Amadou',
  cathy: 'Cathy',
  raphael: 'Raphaël',
}
const PREVIEW_SECRET = 'retbaa-dev-2026'

function getPreviewUser() {
  try {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    const params = new URLSearchParams(window.location.search)
    const key = params.get('preview')?.toLowerCase()
    const token = params.get('token')
    if (!isLocalhost && token !== PREVIEW_SECRET) return null
    return key ? (PREVIEW_USERS[key] || null) : null
  } catch {
    return null
  }
}

// Route /observateur
function ObservateurRoute() {
  const [prospectDone, setProspectDone] = useState(() => {
    return !!sessionStorage.getItem('retbaa_prospect')
  })
  if (!prospectDone) {
    return <ProspectGatePage onAccess={() => setProspectDone(true)} />
  }
  return <Navigate to="/" replace />
}

// ── App racine ──────────────────────────────────────────────────────────────
export default function App() {
  const previewUser = getPreviewUser()

  if (previewUser) {
    return (
      <BrowserRouter>
        <PreviewApp userName={previewUser} />
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Callback auth Supabase (magic link + Google OAuth) */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Onboarding investisseur — sans auth */}
        <Route path="/bienvenue" element={<BienvenueOnboarding />} />

        {/* Invitation unique */}
        <Route path="/invite/:token" element={<InvitePage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminPage />} />

        {/* Observateur */}
        <Route path="/observateur" element={<ObservateurRoute />} />

        {/* App investisseurs (gère son propre auth gate) */}
        <Route path="/*" element={<InvestisseurApp />} />
      </Routes>
    </BrowserRouter>
  )
}

// ── PreviewApp — dashboard sans auth (mode ?preview=xxx) ───────────────────
function PreviewApp({ userName }) {
  const [activePage, setActivePage] = useState('dashboard')
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const handleSetActivePage = (page) => {
    setActivePage(page)
    if (isMobile) setSidebarOpen(false)
    track(userName || 'anonymous', page)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9F9F9' }}>
      {isMobile && sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(10,20,40,0.65)', backdropFilter: 'blur(2px)', zIndex: 99 }}
          onClick={() => setSidebarOpen(false)} />
      )}
      <div style={{
        position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100,
        transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
        transition: 'transform 0.25s ease',
        width: '288px',
      }}>
        <Sidebar
          activePage={activePage}
          setActivePage={handleSetActivePage}
          onLogout={() => window.location.href = '/'}
          userName={userName}
          isMobile={isMobile}
          observateur={false}
          isAdmin={false}
        />
      </div>
      <div style={{ flex: 1, marginLeft: isMobile ? 0 : '288px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header userName={userName} activePage={activePage} isMobile={isMobile} onMenuClick={() => setSidebarOpen(o => !o)} />
        <main style={{ flex: 1, padding: isMobile ? '80px 0 0' : '80px 0 0' }}>
          {activePage === 'dashboard' && <Dashboard userName={userName} setActivePage={handleSetActivePage} />}
          {activePage === 'documents' && <DocumentsPage userName={userName} />}
          {activePage === 'insights' && <InsightsPage />}
          {activePage === 'catalogue' && <CataloguePage />}
          {activePage === 'investissement' && <MonInvestissementPage userName={userName} setActivePage={handleSetActivePage} />}
          {activePage === 'tranche2' && <Tranche2Page />}
          {activePage === 'inner-circle' && <InnerCirclePage />}
          {activePage === 'podcast' && <PodcastPage userName={userName} />}
          {activePage === 'roadmap' && <PlaceholderPage title="Roadmap" subtitle="Feuille de route produit" onBack={() => handleSetActivePage('dashboard')} />}
        </main>
        <Footer />
      </div>
    </div>
  )
}

// ── InvestisseurApp — app principale avec Supabase auth ────────────────────
const ADMIN_EMAILS = ['massata@retbaa.com', 'massata+1@retbaa.com']

const LINKED_NAMES = {
  cathy: 'Cathy',
  barthelemy: 'Barthélemy',
  pape: 'Pape Amadou',
  raphael: 'Raphaël',
  massata: 'Massata',
}

function InvestisseurApp() {
  const previewUser = getPreviewUser()
  const { user, profile, isLoaded, isSignedIn, role, signOut } = useAuth()

  // Tous les hooks AVANT tout return conditionnel (règle des hooks React)
  const [activePage, setActivePage] = useState('dashboard')
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // Nom affiché : profil Supabase > email > preview
  const userName = previewUser
    || profile?.full_name
    || user?.email?.split('@')[0]
    || ''

  const goToDashboard = () => setActivePage('dashboard')
  const isObservateur = !!sessionStorage.getItem('retbaa_prospect')

  // founder = admin (accès total + analytics)
  const isAdmin = isSignedIn && (role === 'founder' || ADMIN_EMAILS.includes(user?.email))

  // assistant : accès délégué, lecture seule, sans données financières
  const isAssistant = role === 'assistant'
  const linkedUserName = isAssistant ? (LINKED_NAMES[profile?.linked_to] ?? '') : null

  // ── Chargement auth ──
  if (!isLoaded) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#F9F9F9' }}>
        <div style={{ fontFamily: 'Newsreader, serif', fontSize: '18px', fontStyle: 'italic', color: '#1A3A6B', opacity: 0.5 }}>
          Chargement…
        </div>
      </div>
    )
  }

  // ── Non connecté → page login magic link ──
  if (!isSignedIn && !previewUser) {
    return <LoginPage />
  }

  // ── Compte en attente de validation ──
  if (isSignedIn && profile?.role === 'pending') {
    return <PendingPage />
  }

  const handleLogout = async () => {
    sessionStorage.removeItem('retbaa_prospect')
    await signOut()
    window.location.href = '/'
  }

  const handleSetActivePage = (page) => {
    setActivePage(page)
    if (isMobile) setSidebarOpen(false)
    track(userName || 'anonymous', page)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9F9F9' }}>

      {/* Overlay mobile */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(10,20,40,0.65)', backdropFilter: 'blur(2px)' }}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100,
        transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
        transition: 'transform 0.25s ease',
        width: '288px',
      }}>
        <Sidebar
          activePage={activePage}
          setActivePage={handleSetActivePage}
          onLogout={handleLogout}
          userName={userName}
          isMobile={isMobile}
          observateur={isObservateur}
          isAdmin={isAdmin}
          isAssistant={isAssistant}
        />
      </div>

      {/* Main content */}
      <div style={{
        marginLeft: isMobile ? 0 : '288px',
        width: isMobile ? '100%' : 'auto',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative',
      }}>
        <Header activePage={activePage} userName={userName} isMobile={isMobile} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main style={{ flex: 1, padding: '0', backgroundColor: '#F9F9F9', overflow: 'hidden', minWidth: 0 }}>
          {activePage === 'dashboard' && (
            isObservateur
              ? <ObservateurDashboard />
              : <Dashboard userName={isAssistant ? linkedUserName : userName} onNavigate={handleSetActivePage} isAssistant={isAssistant} />
          )}
          {activePage === 'products' && <CataloguePage userName={userName} />}
          {activePage === 'documents' && <DocumentsPage userName={isAssistant ? linkedUserName : userName} isAssistant={isAssistant} />}
          {activePage === 'insights' && <InsightsPage />}
          {(activePage === 'innercircle' || activePage === 'inner-circle') && (
            isAssistant
              ? <PlaceholderPage title="Accès restreint" subtitle="Cette section est réservée aux investisseurs" onBack={goToDashboard} />
              : <InnerCirclePage />
          )}
          {activePage === 'tranche2' && <Tranche2Page userName={isAssistant ? linkedUserName : userName} />}
          {(activePage === 'investissement' || activePage === 'mon-investissement') && (
            <MonInvestissementPage userName={isAssistant ? linkedUserName : userName} isAssistant={isAssistant} setActivePage={handleSetActivePage} />
          )}
          {activePage === 'podcast' && <PodcastPage userName={isAssistant ? linkedUserName : userName} />}
          {activePage === 'analytics' && (
            isAdmin
              ? <AnalyticsPage />
              : <PlaceholderPage title="Accès restreint" subtitle="Cette section est réservée à l'administration" onBack={goToDashboard} />
          )}
          {activePage === 'roadmap' && <PlaceholderPage title="Roadmap" subtitle="Feuille de route produit" onBack={goToDashboard} />}
          {activePage === 'calendar' && <PlaceholderPage title="Calendrier" subtitle="Événements & jalons" onBack={goToDashboard} />}
        </main>

        <Footer />
      </div>
    </div>
  )
}
