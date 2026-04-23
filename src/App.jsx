import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './i18n/index.js'
import ProspectGatePage from './pages/ProspectGatePage'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Footer from './components/Footer'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import ObservateurDashboard from './pages/ObservateurDashboard'
import CataloguePage from './pages/CataloguePage'
import DocumentsPage from './pages/DocumentsPage'
import InsightsPage from './pages/InsightsPage'
import InnerCirclePage from './pages/InnerCirclePage'
import Tranche2Page from './pages/Tranche2Page'
import MonInvestissementPage from './pages/MonInvestissementPage'
import PodcastPage from './pages/PodcastPage'
import AnalyticsPage from './pages/AnalyticsPage'
import { track } from './utils/tracker'
import './index.css'

// Placeholder pages for carousel navigation
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

// Preview bypass: ?preview=massata (ou autre shortName investisseur)
const PREVIEW_USERS = {
  massata: 'Massata',
  barthelemy: 'Barthélemy',
  pape: 'Pape Amadou',
  cathy: 'Cathy',
  raphael: 'Raphaël',
}

function getPreviewUser() {
  try {
    const params = new URLSearchParams(window.location.search)
    const key = params.get('preview')?.toLowerCase()
    return key ? (PREVIEW_USERS[key] || null) : null
  } catch {
    return null
  }
}

// Route /observateur : ProspectGatePage
function ObservateurRoute() {
  const [prospectDone, setProspectDone] = useState(() => {
    return !!sessionStorage.getItem('retbaa_prospect')
  })

  const handleProspectAccess = (data) => {
    setProspectDone(true)
  }

  if (!prospectDone) {
    return <ProspectGatePage onAccess={handleProspectAccess} />
  }

  // Après remplissage formulaire → redirect vers dashboard observateur
  return <Navigate to="/" replace />
}

// Main App avec routing
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route observateur : /observateur */}
        <Route path="/observateur" element={<ObservateurRoute />} />
        
        {/* Route investisseurs : / (root) */}
        <Route path="/*" element={<InvestisseurApp />} />
      </Routes>
    </BrowserRouter>
  )
}

// App investisseurs (login + dashboard)
function InvestisseurApp() {
  const previewUser = getPreviewUser()

  const [loggedIn, setLoggedIn] = useState(() => {
    // Mode observateur : si prospect déjà rempli, accès dashboard observateur
    const prospectDone = !!sessionStorage.getItem('retbaa_prospect')
    if (prospectDone) return true
    
    // Mode investisseur : si preview ou session active
    if (previewUser) return true
    return localStorage.getItem('retbaa_session') === 'true'
  })

  const [userName, setUserName] = useState(() => {
    // Mode observateur
    const prospectData = sessionStorage.getItem('retbaa_prospect')
    if (prospectData) {
      try {
        const data = JSON.parse(prospectData)
        return `${data.prenom} ${data.nom}`
      } catch {}
    }
    
    // Mode investisseur
    if (previewUser) return previewUser
    return localStorage.getItem('retbaa_user') || ''
  })

  const [activePage, setActivePage] = useState('dashboard')

  const handleLogin = (name) => {
    setUserName(name)
    setLoggedIn(true)
    localStorage.setItem('retbaa_session', 'true')
    localStorage.setItem('retbaa_user', name)
  }

  // Si pas logged in → afficher LoginPage
  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  const handleLogout = () => {
    setLoggedIn(false)
    setUserName('')
    localStorage.removeItem('retbaa_session')
    localStorage.removeItem('retbaa_user')
    sessionStorage.removeItem('retbaa_prospect')
  }

  const goToDashboard = () => setActivePage('dashboard')

  // Détection mode observateur
  const isObservateur = !!sessionStorage.getItem('retbaa_prospect')

  // ── Responsive : détection mobile ──
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // ── Tracking : log chaque changement de page ──
  const handleSetActivePage = (page) => {
    setActivePage(page)
    if (isMobile) setSidebarOpen(false)
    track(userName || 'anonymous', page)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9F9F9' }}>

      {/* ── Overlay mobile ── */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 90,
            background: 'rgba(0,27,63,0.4)',
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* ── Sidebar ── */}
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
        />
      </div>

      {/* ── Main content ── */}
      <div style={{
        marginLeft: isMobile ? 0 : '288px',
        width: isMobile ? '100%' : 'auto',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative',
      }}>
        <Header
          activePage={activePage}
          userName={userName}
          isMobile={isMobile}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        <main style={{ flex: 1, padding: '0', backgroundColor: '#F9F9F9' }}>
          {activePage === 'dashboard' && (
            isObservateur 
              ? <ObservateurDashboard />
              : <Dashboard userName={userName} onNavigate={handleSetActivePage} />
          )}
          {activePage === 'products' && <CataloguePage userName={userName} />}
          {activePage === 'documents' && <DocumentsPage userName={userName} />}
          {activePage === 'insights' && <InsightsPage />}
          {(activePage === 'innercircle' || activePage === 'inner-circle') && <InnerCirclePage />}
          {activePage === 'tranche2' && <Tranche2Page userName={userName} />}
          {(activePage === 'investissement' || activePage === 'mon-investissement') && <MonInvestissementPage userName={userName} />}
          {activePage === 'podcast' && <PodcastPage />}
          {activePage === 'analytics' && <AnalyticsPage />}
          {/* Placeholder pages for other nav items */}
          {activePage === 'roadmap' && <PlaceholderPage title="Roadmap" subtitle="Feuille de route produit" onBack={goToDashboard} />}
          {activePage === 'calendar' && <PlaceholderPage title="Calendrier" subtitle="Événements & jalons" onBack={goToDashboard} />}
        </main>

        <Footer />
      </div>
    </div>
  )
}
