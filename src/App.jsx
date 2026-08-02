import { lazy, Suspense, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { supabase } from './lib/supabase'
import './i18n/index.js'
import './index.css'

// ── Pages légères — import direct ───────────────────────────────────────────
import InvitePage           from './pages/InvitePage'
import PendingPage          from './pages/PendingPage'
import AdminPage            from './pages/AdminPage'
import ProspectGatePage     from './pages/ProspectGatePage'
import AuthCallback         from './pages/AuthCallback'
import LoginPage            from './pages/LoginPage'
import AppShell             from './components/AppShell'

// ── Dataroom prospects (public) — lazy ─────────────────────────────────────
const DataroomLanding       = lazy(() => import('./pages/dataroom/DataroomLanding'))
const DataroomDocsPage      = lazy(() => import('./pages/DataroomDocsPage'))

// ── Pages lourdes — lazy ────────────────────────────────────────────────────
const Dashboard             = lazy(() => import('./pages/Dashboard'))
const InsightsPage          = lazy(() => import('./pages/InsightsPage'))
const InnerCirclePage       = lazy(() => import('./pages/InnerCirclePage'))
const PodcastPage           = lazy(() => import('./pages/PodcastPage'))
const Tranche2Page          = lazy(() => import('./pages/Tranche2Page'))
const MonInvestissementPage = lazy(() => import('./pages/MonInvestissementPage'))
const BienvenueOnboarding   = lazy(() => import('./pages/BienvenueOnboarding'))
const AnalyticsPage         = lazy(() => import('./pages/AnalyticsPage'))
const CataloguePage         = lazy(() => import('./pages/CataloguePage'))
const DocumentsPage         = lazy(() => import('./pages/DocumentsPage'))
const ObservateurDashboard  = lazy(() => import('./pages/ObservateurDashboard'))
const ArticlePage           = lazy(() => import('./pages/ArticlePage'))
const ProspectDashboard     = lazy(() => import('./pages/ProspectDashboard'))

// ── Splash screen animé ─────────────────────────────────────────────────────
function SplashScreen({ message = 'Retbaa Circle' }) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase]       = useState(0)

  const PHASES = [
    'Chargement de votre espace…',
    'Vérification de vos accès…',
    'Préparation du contenu…',
    'Presque prêt…',
  ]

  useEffect(() => {
    // Progression fluide non-linéaire
    const steps = [
      { target: 30,  delay: 80  },
      { target: 60,  delay: 150 },
      { target: 80,  delay: 300 },
      { target: 92,  delay: 500 },
      { target: 100, delay: 200 },
    ]
    let current = 0
    let timer

    function next() {
      if (current >= steps.length) return
      const { target, delay } = steps[current++]
      const startVal = current === 1 ? 0 : steps[current - 2].target
      const diff = target - startVal
      const step = diff / 20
      let val = startVal
      timer = setInterval(() => {
        val = Math.min(val + step, target)
        setProgress(Math.round(val))
        setPhase(Math.floor((val / 100) * (PHASES.length - 1)))
        if (val >= target) {
          clearInterval(timer)
          next()
        }
      }, delay / 20)
    }
    next()
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: '#0D1F3C',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
    }}>
      {/* Logo */}
      <div style={{
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '13px', letterSpacing: '0.4em',
        textTransform: 'uppercase', color: '#EFC0D4',
        fontWeight: 300, marginBottom: '12px',
      }}>
        RETBAA
      </div>
      <div style={{
        fontFamily: 'Georgia, serif', fontSize: '32px',
        fontWeight: 300, fontStyle: 'italic',
        color: '#ffffff', marginBottom: '8px',
      }}>
        Circle
      </div>
      <div style={{
        width: '32px', height: '1px',
        background: '#EFC0D4', margin: '0 auto 48px',
      }} />

      {/* Barre de progression */}
      <div style={{
        width: '240px', height: '2px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '1px', marginBottom: '20px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${progress}%`,
          background: 'linear-gradient(90deg, #EFC0D4, #ffffff)',
          borderRadius: '1px',
          transition: 'width 0.05s linear',
        }} />
      </div>

      {/* Message de phase */}
      <div style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '11px', letterSpacing: '0.15em',
        color: 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase',
        minHeight: '20px',
      }}>
        {PHASES[phase]}
      </div>
    </div>
  )
}

function PageLoader() {
  return <SplashScreen />
}

// ── Mode preview : ?preview=massata&token=XXX ───────────────────────────────
const PREVIEW_USERS = {
  massata:    'Massata',
  barthelemy: 'Barthélemy',
  pape:       'Pape Amadou',
  cathy:      'Cathy',
  raphael:    'Raphaël',
}
const PREVIEW_SECRET = import.meta.env.VITE_PREVIEW_TOKEN || 'retbaa-preview-2026'

function getPreviewUser() {
  try {
    if (!PREVIEW_SECRET) return null
    const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname)
    const params = new URLSearchParams(window.location.search)
    const key    = params.get('preview')?.toLowerCase()
    const token  = params.get('token')
    if (!isLocalhost && token !== PREVIEW_SECRET) return null
    return key ? (PREVIEW_USERS[key] ?? null) : null
  } catch { return null }
}

function getPreviewRole() {
  try {
    const params = new URLSearchParams(window.location.search)
    return params.get('role') || null
  } catch { return null }
}

// ── Composant racine ────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Onboarding (public) */}
        <Route path="/bienvenue" element={
          <Suspense fallback={<PageLoader />}><BienvenueOnboarding /></Suspense>
        } />

        {/* Dataroom landing — public */}
        <Route path="/dataroom" element={
          <Suspense fallback={<PageLoader />}><DataroomLanding /></Suspense>
        } />

        {/* Dataroom access — redirige vers /dataroom-docs */}
        <Route path="/dataroom/access" element={<Navigate to="/dataroom-docs" replace />} />

        {/* Invitation investisseur */}
        <Route path="/invite/:token" element={<InvitePage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminPage />} />

        {/* Observateur — gate prospect */}
        <Route path="/observateur" element={<ObservateurGate />} />

        {/* App principale — tout ce qui reste */}
        <Route path="/*" element={<AuthGate />} />
      </Routes>
    </BrowserRouter>
  )
}

// ── Gate observateur ────────────────────────────────────────────────────────
function ObservateurGate() {
  const done = !!sessionStorage.getItem('retbaa_prospect')
  if (!done) {
    return <ProspectGatePage onAccess={() => {
      sessionStorage.setItem('retbaa_prospect', '1')
      window.location.replace('/')
    }} />
  }
  return <Navigate to="/" replace />
}

// ── Gate auth — redirige vers login si non connecté ─────────────────────────
function AuthGate() {
  const previewUser = getPreviewUser()
  const previewRole = getPreviewRole()
  const { user, profile, isLoaded, isSignedIn, role, signOut } = useAuth()

  // ── Détection prospect ──────────────────────────────────────────────────
  const [isProspect,      setIsProspect]      = useState(false)
  const [prospectChecked, setProspectChecked] = useState(false)

  useEffect(() => {
    // Pas besoin de vérifier pour founder/assistant
    if (!isLoaded) return
    if (!isSignedIn || !user?.email) {
      setProspectChecked(true)
      return
    }
    if (role === 'founder' || role === 'assistant') {
      setProspectChecked(true)
      return
    }
    supabase
      .from('dataroom_prospects')
      .select('id, status')
      .eq('email', user.email)
      .maybeSingle()
      .then(({ data }) => {
        setIsProspect(!!data)
        setProspectChecked(true)
      })
  }, [isLoaded, isSignedIn, user?.email, role])

  // ── Loading — attendre TOUJOURS que la détection prospect soit terminée ──
  // IMPORTANT : ne jamais afficher "accès refusé" avant que prospectChecked = true
  if (!isLoaded || !prospectChecked) {
    return <SplashScreen />
  }

  if (!isSignedIn && !previewUser) return <LoginPage />

  // Accès non autorisé — sauf si c'est un prospect
  if (isSignedIn && role === 'no_access' && !isProspect) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#FAF7F2' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontFamily: 'Newsreader, serif', fontSize: '32px', fontWeight: 300, color: '#1A3A6B', fontStyle: 'italic', marginBottom: '12px' }}>
            Accès non autorisé
          </div>
          <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px', color: '#6B7280', marginBottom: '32px' }}>
            Votre compte n'a pas accès à Retbaa Circle.
          </div>
          <button onClick={signOut} style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '12px', fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#1A3A6B', background: 'none', border: '1px solid #1A3A6B',
            padding: '10px 24px', cursor: 'pointer',
          }}>
            Se déconnecter
          </button>
        </div>
      </div>
    )
  }

  if (isSignedIn && role === 'pending') return <PendingPage />

  const LINKED_NAMES = { cathy: 'Cathy', barthelemy: 'Barthélemy', pape: 'Pape Amadou', raphael: 'Raphaël', massata: 'Massata' }
  const isAdmin     = (isSignedIn && role === 'founder') || previewRole === 'founder'
  const isAssistant = role === 'assistant'
  const isObservateur = !!sessionStorage.getItem('retbaa_prospect')

  const userName = previewUser
    || profile?.full_name
    || user?.email?.split('@')[0]
    || ''

  const linkedUserName = isAssistant ? (LINKED_NAMES[profile?.linked_to] ?? '') : null
  const effectiveName  = isAssistant ? linkedUserName : userName

  const handleLogout = async () => {
    sessionStorage.removeItem('retbaa_prospect')
    await signOut()
    window.location.href = '/'
  }

  return (
    <AppShell
      userName={userName}
      onLogout={handleLogout}
      isAdmin={isAdmin}
      isAssistant={isAssistant}
      isObservateur={isObservateur}
      isProspect={isProspect}
    >
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={
            isProspect
              ? <ProspectDashboard />
              : isObservateur
              ? <ObservateurDashboard />
              : <Dashboard userName={effectiveName} isAssistant={isAssistant} />
          } />
          <Route path="/insights"            element={<InsightsPage />} />
          <Route path="/insights/:slug"      element={<ArticlePage />} />
          <Route path="/produits"            element={<CataloguePage userName={userName} />} />
          <Route path="/documents"           element={<DocumentsPage userName={effectiveName} isAssistant={isAssistant} />} />
          <Route path="/investissement"      element={<MonInvestissementPage userName={effectiveName} isAssistant={isAssistant} />} />
          <Route path="/tranche2"            element={<Tranche2Page userName={effectiveName} />} />
          <Route path="/podcast"             element={<PodcastPage userName={effectiveName} />} />
          <Route path="/mon-espace"          element={<ProspectDashboard />} />
          <Route path="/dataroom-docs"       element={
            <Suspense fallback={<PageLoader />}>
              <DataroomDocsPage isProspect={isProspect} isApproved={role === 'founder' || role === 'assistant'} />
            </Suspense>
          } />
          <Route path="/inner-circle"        element={
            isAssistant
              ? <RestrictedPage />
              : <InnerCirclePage />
          } />
          <Route path="/analytics"           element={
            isAdmin
              ? <AnalyticsPage />
              : <RestrictedPage />
          } />
          {/* Compat anciens liens internes */}
          <Route path="/catalogue"           element={<Navigate to="/produits" replace />} />
          <Route path="/mon-investissement"  element={<Navigate to="/investissement" replace />} />
          <Route path="/innercircle"         element={<Navigate to="/inner-circle" replace />} />
          {/* 404 → dashboard */}
          <Route path="*"                    element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppShell>
  )
}

function RestrictedPage() {
  return (
    <div style={{ maxWidth: '600px', margin: '80px auto', padding: '40px', textAlign: 'center' }}>
      <div style={{ fontFamily: 'Newsreader, serif', fontSize: '32px', fontWeight: 300, color: '#1A3A6B', fontStyle: 'italic', marginBottom: '12px' }}>
        Accès restreint
      </div>
      <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px', color: '#9CA3AF' }}>
        Cette section est réservée aux investisseurs.
      </div>
    </div>
  )
}

