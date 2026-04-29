import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth, useUser, useClerk, SignIn } from '@clerk/clerk-react'
import './i18n/index.js'
import InvitePage from './pages/InvitePage'
import PendingPage from './pages/PendingPage'
import AdminPage from './pages/AdminPage'
import ProspectGatePage from './pages/ProspectGatePage'
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

// Preview bypass: ?preview=massata — DÉSACTIVÉ EN PRODUCTION
// Uniquement actif sur localhost ou avec token secret
const PREVIEW_USERS = {
  massata: 'Massata',
  barthelemy: 'Barthélemy',
  pape: 'Pape Amadou',
  cathy: 'Cathy',
  raphael: 'Raphaël',
}

const PREVIEW_SECRET = 'retbaa-dev-2026' // token requis: ?preview=massata&token=retbaa-dev-2026

function getPreviewUser() {
  try {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    const params = new URLSearchParams(window.location.search)
    const key = params.get('preview')?.toLowerCase()
    const token = params.get('token')
    // En production : token secret requis
    if (!isLocalhost && token !== PREVIEW_SECRET) return null
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
  // Si mode preview → bypass total de Clerk, pas d'auth nécessaire
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
        {/* Route onboarding investisseur — sans auth */}
        <Route path="/bienvenue" element={<BienvenueOnboarding />} />

        {/* Route invitation unique */}
        <Route path="/invite/:token" element={<InvitePage />} />

        {/* Route admin */}
        <Route path="/admin" element={<AdminPage />} />

        {/* Route observateur */}
        <Route path="/observateur" element={<ObservateurRoute />} />

        {/* Route investisseurs : / (root) */}
        <Route path="/*" element={<InvestisseurApp />} />
      </Routes>
    </BrowserRouter>
  )
}

// PreviewApp — dashboard sans Clerk (mode ?preview=xxx)
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
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(26,58,107,0.4)', zIndex: 99 }}
          onClick={() => setSidebarOpen(false)} />
      )}
      <div style={{
        position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100,
        transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
        transition: 'transform 0.25s ease',
        width: isMobile ? '100vw' : '288px',
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
        <Header
          userName={userName}
          activePage={activePage}
          isMobile={isMobile}
          onMenuClick={() => setSidebarOpen(o => !o)}
        />
        <main style={{ flex: 1, padding: isMobile ? '80px 0 0' : '80px 0 0' }}>
          {activePage === 'dashboard' && <Dashboard userName={userName} setActivePage={handleSetActivePage} />}
          {activePage === 'documents' && <DocumentsPage userName={userName} />}
          {activePage === 'insights' && <InsightsPage />}
          {activePage === 'catalogue' && <CataloguePage />}
          {activePage === 'investissement' && (
            <MonInvestissementPage userName={userName} setActivePage={handleSetActivePage} />
          )}
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

// Page de login Clerk avec design Retbaa
function ClerkLoginPage() {
  return (
    <div
      className="login-wrapper min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundColor: '#f9f9f9',
        fontFamily: 'Manrope, sans-serif',
        position: 'relative',
      }}
    >
      {/* Background Geometry */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '60%', height: '100%',
          backgroundColor: 'rgba(26,58,107,0.04)',
          transform: 'skewX(-12deg) translateX(80px)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, #EFC0D4, transparent)',
          opacity: 0.6,
        }} />
      </div>

      {/* Top Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: '64px', padding: '0 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        zIndex: 50,
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{
          fontFamily: 'Newsreader, serif',
          fontSize: '20px',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: '#1A3A6B',
          fontStyle: 'italic',
        }}>
          Retbaa Circle
        </div>
        <span style={{
          fontSize: '10px',
          fontFamily: 'Newsreader, serif',
          letterSpacing: '0.2em',
          color: '#9CA3AF',
          fontStyle: 'italic',
        }}>
          Portail Investisseurs · Espace Privé
        </span>
      </nav>

      {/* Main layout */}
      <main className="login-main" style={{
        position: 'relative', zIndex: 10,
        width: '100%', maxWidth: '1100px',
        display: 'grid',
        gridTemplateColumns: 'var(--login-cols, 1fr 1fr)',
        minHeight: '640px',
        backgroundColor: '#ffffff',
        boxShadow: '0px 32px 80px rgba(26,58,107,0.12)',
        borderRadius: '4px',
        overflow: 'hidden',
        margin: '80px auto 40px',
      }}>
        <style>{`
          @media (max-width: 768px) {
            :root { --login-cols: 1fr !important; }
            .login-branding { display: none !important; }
            .login-form-col { padding: 40px 28px !important; }
            .login-main {
              margin: 0 !important;
              min-height: 100vh !important;
              border-radius: 0 !important;
              box-shadow: none !important;
            }
            .login-wrapper {
              background: linear-gradient(160deg, #1A3A6B 0%, #0d1f3c 100%) !important;
              min-height: 100vh !important;
            }
            .login-form-col {
              background: #fff !important;
              margin: 64px 20px 20px !important;
              border-radius: 8px !important;
              box-shadow: 0 16px 48px rgba(26,58,107,0.2) !important;
            }
          }
        `}</style>
        {/* Left branding column */}
        <div className="login-branding" style={{
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#1A3A6B',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 56px 48px',
        }}>
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <img
              src="/retbaa-photos/retbaa_01.jpg"
              alt="Retbaa"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />
            <div style={{ position: 'absolute', inset: 0, backgroundColor: '#1A3A6B', opacity: 0.78 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(239,192,212,0.12) 0%, transparent 50%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: 'linear-gradient(to top, rgba(13,31,60,0.85), transparent)' }} />
          </div>

          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ fontFamily: 'Newsreader, serif', fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '10px' }}>
              Retbaa Circle
            </div>
            <p style={{ fontSize: '9px', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.45em', textTransform: 'uppercase', color: '#EFC0D4', marginTop: '8px', fontWeight: 700 }}>
              Portail Investisseurs
            </p>
          </div>

          <div style={{ position: 'relative', zIndex: 10 }}>
            <h2 style={{ fontFamily: 'Newsreader, serif', fontSize: '46px', fontStyle: 'italic', fontWeight: 300, color: '#ffffff', lineHeight: 1.1, letterSpacing: '-0.01em', margin: 0 }}>
              Sensory<br />Odyssey.
            </h2>
            <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: 'rgba(239,192,212,0.6)', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '8px 0 0' }}>
              Un voyage sensoriel
            </p>
            <div style={{ width: '56px', height: '2px', backgroundColor: '#EFC0D4', marginTop: '28px' }} />
            <p style={{ marginTop: '24px', fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: 'rgba(171,199,255,0.85)', maxWidth: '280px', lineHeight: 1.75, letterSpacing: '0.04em' }}>
              Les grandes maisons ont toujours été bâties par quelques-uns qui ont vu juste trop tôt. Vous êtes ici parce que vous faites partie de ceux-là.
            </p>
          </div>

          <div style={{ position: 'relative', zIndex: 10, display: 'flex', gap: '12px' }}>
            {[{ icon: 'lock', label: '256-bit' }, { icon: 'verified_user', label: 'KYC' }].map(({ icon, label }) => (
              <div key={icon} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', border: '1px solid rgba(239,192,212,0.25)', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                <span className="material-symbols-outlined" style={{ color: '#EFC0D4', fontSize: '14px' }}>{icon}</span>
                <span style={{ color: 'rgba(239,192,212,0.7)', fontSize: '9px', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Clerk SignIn component */}
        <div className="login-form-col" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '48px 40px',
          backgroundColor: '#ffffff',
        }}>
          {/* Titre custom au-dessus du composant Clerk */}
          <div style={{ width: '100%', maxWidth: '380px', marginBottom: '32px' }}>
            <p style={{ fontSize: '9px', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#EFC0D4', fontWeight: 700, marginBottom: '10px' }}>
              Retbaa Circle
            </p>
            <h1 style={{ fontFamily: 'Newsreader, serif', fontSize: '36px', fontStyle: 'italic', fontWeight: 300, color: '#1A3A6B', margin: 0, lineHeight: 1.15 }}>
              Bienvenue
            </h1>
            <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#9CA3AF', marginTop: '8px', lineHeight: 1.6 }}>
              Connectez-vous pour accéder à votre espace privé.
            </p>
          </div>
          {/* CSS ciblé Clerk — sans toucher aux inputs */}
          <style>{`
            .cl-card, .cl-cardBox, .cl-rootBox {
              background-image: none !important;
              box-shadow: none !important;
              border: none !important;
            }
            .cl-formButtonPrimary {
              background-color: #EFC0D4 !important;
              background-image: none !important;
              color: #1A3A6B !important;
            }
          `}</style>
          <SignIn
            appearance={{
              layout: {
                socialButtonsPlacement: 'bottom',
                showOptionalFields: false,
              },
              variables: {
                colorPrimary: '#1A3A6B',
                colorText: '#1A3A6B',
                colorBackground: '#ffffff',
                colorInputBackground: '#ffffff',
                colorNeutral: '#1A3A6B',
                borderRadius: '4px',
                fontFamily: 'Manrope, sans-serif',
              },
              cssOverrides: `
                * { background-image: none !important; }
                .cl-card, .cl-cardBox, .cl-rootBox, .cl-main, .cl-internal-b3fm57 {
                  background: #ffffff !important;
                  background-image: none !important;
                  box-shadow: none !important;
                  border: none !important;
                }
              `,
              elements: {
                rootBox: { width: '100%', maxWidth: '380px', backgroundColor: 'transparent' },
                card: { boxShadow: 'none', border: 'none', padding: 0, backgroundColor: '#ffffff', width: '100%', maxWidth: '100%', backgroundImage: 'none' },
                cardBox: { boxShadow: 'none', border: 'none', backgroundColor: '#ffffff', backgroundImage: 'none' },
                main: { backgroundColor: '#ffffff', backgroundImage: 'none' },
                headerTitle: { display: 'none' },
                headerSubtitle: { display: 'none' },
                header: { display: 'none' },
                formFieldLabel: { fontFamily: 'Manrope, sans-serif', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1A3A6B', fontWeight: 700 },
                formFieldInput: { fontFamily: 'Manrope, sans-serif', fontSize: '14px', color: '#1A1C1C', border: 'none', borderBottom: '1px solid rgba(196,198,208,0.7)', borderRadius: 0, boxShadow: 'none', backgroundColor: '#ffffff', padding: '12px 0', backgroundImage: 'none' },
                formButtonPrimary: { backgroundColor: '#EFC0D4', color: '#1A3A6B', fontFamily: 'Manrope, sans-serif', fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 700, borderRadius: '4px', boxShadow: '0px 8px 24px rgba(239,192,212,0.35)', backgroundImage: 'none' },
                footerActionLink: { color: '#1A3A6B', fontFamily: 'Manrope, sans-serif' },
                identityPreviewText: { fontFamily: 'Manrope, sans-serif' },
                formFieldInputShowPasswordButton: { color: '#1A3A6B' },
                footer: { display: 'none' },
                socialButtons: { display: 'flex' },
                socialButtonsBlockButton: { 
                  border: '1px solid rgba(196,198,208,0.5)', 
                  borderRadius: '4px',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '12px',
                  color: '#1A3A6B',
                  fontWeight: 600,
                  backgroundColor: '#ffffff',
                  backgroundImage: 'none',
                },
                dividerRow: { display: 'flex' },
                dividerText: { fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#9CA3AF' },
              },
            }}
          />
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '20px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 50,
      }}>
        <p style={{ fontSize: '10px', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c4c6d0', margin: 0 }}>
          © 2026 Retbaa Circle. <span style={{ color: '#EFC0D4', fontWeight: 700 }}>Espace Privé.</span>
        </p>
      </footer>
    </div>
  )
}

// App investisseurs (login + dashboard)
function InvestisseurApp() {
  const previewUser = getPreviewUser()
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const clerk = useClerk()

  // ── Tous les hooks AVANT tout return conditionnel (règle des hooks React) ──
  const [activePage, setActivePage] = useState('dashboard')
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // Dériver le nom depuis Clerk ou mode preview
  const userName = previewUser
    || (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : null)
    || user?.firstName
    || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0]
    || ''

  const goToDashboard = () => setActivePage('dashboard')
  const isObservateur = !!sessionStorage.getItem('retbaa_prospect')
  const isAdmin = user?.publicMetadata?.role === 'admin' || userName?.toLowerCase().includes('massata')

  // Rôle assistant : accès délégué, lecture seule, sans données financières
  const isAssistant = user?.publicMetadata?.role === 'assistant'
  // linkedTo: 'cathy' → 'Cathy' pour le lookup dans les données investisseurs
  const LINKED_NAMES = { cathy: 'Cathy', barthelemy: 'Barthélemy', pape: 'Pape Amadou', raphael: 'Raphaël', massata: 'Massata' }
  const linkedUserName = isAssistant
    ? (LINKED_NAMES[user?.publicMetadata?.linkedTo] ?? '')
    : null

  // Chargement Clerk
  if (!isLoaded) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#F9F9F9' }}>
        <div style={{ fontFamily: 'Newsreader, serif', fontSize: '18px', fontStyle: 'italic', color: '#1A3A6B', opacity: 0.5 }}>
          Chargement…
        </div>
      </div>
    )
  }

  // Pas connecté (et pas en mode preview) → page login Clerk
  if (!isSignedIn && !previewUser) {
    return <ClerkLoginPage />
  }

  // Compte en attente de validation
  if (isSignedIn && user?.publicMetadata?.status === 'pending') {
    return <PendingPage />
  }

  const handleLogout = async () => {
    sessionStorage.removeItem('retbaa_prospect')
    try {
      await clerk.signOut()
    } catch (e) {
      // fallback
      window.location.href = '/'
    }
  }

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
        width: isMobile ? '100vw' : '288px',
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

        <main style={{ flex: 1, padding: '0', backgroundColor: '#F9F9F9', overflow: 'hidden', minWidth: 0 }}>
          {activePage === 'dashboard' && (
            isObservateur
              ? <ObservateurDashboard />
              : <Dashboard
                  userName={isAssistant ? linkedUserName : userName}
                  onNavigate={handleSetActivePage}
                  isAssistant={isAssistant}
                />
          )}
          {activePage === 'products' && <CataloguePage userName={userName} />}
          {activePage === 'documents' && <DocumentsPage userName={isAssistant ? linkedUserName : userName} isAssistant={isAssistant} />}
          {activePage === 'insights' && <InsightsPage />}
          {/* Inner Circle : bloqué pour les assistants */}
          {(activePage === 'innercircle' || activePage === 'inner-circle') && (
            isAssistant
              ? <PlaceholderPage title="Accès restreint" subtitle="Cette section est réservée aux investisseurs" onBack={goToDashboard} />
              : <InnerCirclePage />
          )}
          {/* Tranche 2 : visible pour les assistants (incite l'investisseur à augmenter) */}
          {activePage === 'tranche2' && <Tranche2Page userName={isAssistant ? linkedUserName : userName} />}
          {(activePage === 'investissement' || activePage === 'mon-investissement') && (
            <MonInvestissementPage
              userName={isAssistant ? linkedUserName : userName}
              isAssistant={isAssistant}
              setActivePage={handleSetActivePage}
            />
          )}
          {activePage === 'podcast' && <PodcastPage userName={isAssistant ? linkedUserName : userName} />}
          {activePage === 'analytics' && (isAdmin ? <AnalyticsPage /> : <PlaceholderPage title="Accès restreint" subtitle="Cette section est réservée à l'administration" onBack={goToDashboard} />)}
          {activePage === 'roadmap' && <PlaceholderPage title="Roadmap" subtitle="Feuille de route produit" onBack={goToDashboard} />}
          {activePage === 'calendar' && <PlaceholderPage title="Calendrier" subtitle="Événements & jalons" onBack={goToDashboard} />}
        </main>

        <Footer />
      </div>
    </div>
  )
}
