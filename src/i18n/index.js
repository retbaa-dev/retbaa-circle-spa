// i18n/index.js
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  fr: {
    translation: {
      nav: {
        dashboard: 'Tableau de bord',
        documents: 'Mes Documents',
        insights: 'Retbaa Insights',
        products: 'Nos Produits',
        opportunities: 'Offres & Projets',
      },
      dashboard: {
        welcome: 'Bienvenue,',
        invested: 'Capital investi',
        share: 'Votre participation',
        documents: 'Documents',
        pending_signature: 'en attente de signature',
        closing_status: 'Statut Closing',
        tranche1: 'Tranche 1 — Clôturée',
        tranche2: 'Tranche 2 — En cours',
        latest_news: 'Dernières actualités',
        view_all: 'Voir tout',
        download: 'Télécharger',
        sign: 'Signer →',
        upload: 'Déposer',
        received: 'Reçu',
        validated: 'Validé',
        pending: 'En attente',
      },
      login: {
        welcome: 'Bienvenue',
        subtitle: 'Connectez-vous pour accéder à votre espace privé.',
        email: 'Adresse email',
        password: 'Clé d\'accès (Mot de passe)',
        submit: 'Accéder à mon espace',
        forgot: 'Mot de passe oublié ?',
        request: 'Demander un accès investisseur',
        left_desc: 'Les grandes maisons ont toujours été bâties par quelques-uns qui ont vu juste trop tôt. Vous êtes ici parce que vous faites partie de ceux-là.',
        regulated: 'ACCÈS SÉCURISÉ · INVESTISSEURS RETBAA CIRCLE.',
        encryption: 'VOS DONNÉES SONT PROTÉGÉES ET CONFIDENTIELLES.',
      },
      footer: {
        tagline: 'Sensory Odyssey',
        legal: 'Mentions légales',
        privacy: 'Confidentialité',
        contact: 'Contact',
        rights: '© 2026 Retbaa. Tous droits réservés.',
      }
    }
  },
  en: {
    translation: {
      nav: {
        dashboard: 'Dashboard',
        documents: 'My Documents',
        insights: 'Retbaa Insights',
        products: 'Our Products',
        opportunities: 'Offers & Projects',
      },
      dashboard: {
        welcome: 'Welcome,',
        invested: 'Invested capital',
        share: 'Your shareholding',
        documents: 'Documents',
        pending_signature: 'awaiting signature',
        closing_status: 'Closing Status',
        tranche1: 'Tranche 1 — Closed',
        tranche2: 'Tranche 2 — Ongoing',
        latest_news: 'Latest news',
        view_all: 'View all',
        download: 'Download',
        sign: 'Sign →',
        upload: 'Upload',
        received: 'Received',
        validated: 'Validated',
        pending: 'Pending',
      },
      login: {
        welcome: 'Welcome',
        subtitle: 'Sign in to access your private space.',
        email: 'Email address',
        password: 'Password',
        submit: 'Access my space',
        forgot: 'Forgot password?',
        request: 'Request investor access',
        left_desc: 'The greatest houses were always built by a few who saw it clearly too early. You are here because you are one of them.',
        regulated: 'SECURE ACCESS · RETBAA CIRCLE INVESTORS.',
        encryption: 'YOUR DATA IS PROTECTED AND CONFIDENTIAL.',
        error: 'Incorrect credentials. Please check your email and password.',
      },
      footer: {
        tagline: 'Sensory Odyssey',
        legal: 'Legal notice',
        privacy: 'Privacy',
        contact: 'Contact',
        rights: '© 2026 Retbaa. All rights reserved.',
      }
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    lng: (() => {
      // Priorité : localStorage → sinon 'fr' par défaut (pas le navigateur)
      try { return localStorage.getItem('i18nextLng') || 'fr' } catch { return 'fr' }
    })(),
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false }
  })

export default i18n
