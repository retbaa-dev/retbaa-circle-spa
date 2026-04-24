import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import './i18n/index.js'
import App from './App.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const frFR = {
  socialButtonsBlockButton: 'Continuer avec {{provider|titleize}}',
  dividerText: 'ou',
  formFieldLabel__emailAddress: 'Adresse e-mail',
  formFieldInputPlaceholder__emailAddress: 'Entrez votre adresse e-mail',
  formButtonPrimary: 'Continuer',
  signIn: {
    start: {
      title: 'Bienvenue',
      subtitle: 'Connectez-vous pour accéder à votre espace privé.',
      actionText: 'Pas encore de compte ?',
      actionLink: 'Demander un accès',
    },
  },
}

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
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/" localization={frFR}>
      <App />
    </ClerkProvider>
  </StrictMode>,
)
