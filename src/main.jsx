import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './hooks/useAuth'
import './index.css'
import './i18n/index.js'
import App from './App.jsx'

const rootEl = document.getElementById('root')

// Error boundary global pour capturer les erreurs React
window.onerror = (msg, src, line, col, err) => {
  rootEl.innerHTML = `<div style="padding:40px;font-family:monospace;color:red;font-size:12px">
    <b>Erreur:</b> ${msg}<br><b>Source:</b> ${src}:${line}<br><pre>${err?.stack?.slice(0,500)}</pre>
  </div>`
}

window.addEventListener('unhandledrejection', (e) => {
  rootEl.innerHTML = `<div style="padding:40px;font-family:monospace;color:orange;font-size:12px">
    <b>Promise rejetée:</b> ${String(e.reason).slice(0,500)}
  </div>`
})

createRoot(rootEl).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
