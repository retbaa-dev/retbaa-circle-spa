// components/AppShell.jsx — Layout principal Retbaa Circle
// Gère sidebar + header + footer, utilise le routing URL (useNavigate/useLocation)
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header  from './Header'
import Footer  from './Footer'
import { track } from '../utils/tracker'

export default function AppShell({ children, userName, onLogout, isAdmin, isAssistant, isObservateur, isProspect }) {
  const navigate   = useNavigate()
  const location   = useLocation()
  const [isMobile,    setIsMobile]    = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // Ferme la sidebar mobile à chaque changement de page
  useEffect(() => {
    if (isMobile) setSidebarOpen(false)
  }, [location.pathname, isMobile])

  const handleNavigate = (path) => {
    navigate(path)
    track(userName || 'anonymous', path)
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
          activePath={location.pathname}
          onNavigate={handleNavigate}
          onLogout={onLogout}
          userName={userName}
          isMobile={isMobile}
          observateur={isObservateur}
          isAdmin={isAdmin}
          isAssistant={isAssistant}
          isProspect={isProspect}
        />
      </div>

      {/* Main */}
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
          activePath={location.pathname}
          userName={userName}
          isMobile={isMobile}
          onMenuClick={() => setSidebarOpen(o => !o)}
        />

        <main style={{ flex: 1, backgroundColor: '#F9F9F9', overflow: 'hidden', minWidth: 0 }}>
          {children}
        </main>

        <Footer />
      </div>
    </div>
  )
}
