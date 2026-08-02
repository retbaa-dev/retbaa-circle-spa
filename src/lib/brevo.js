// src/lib/brevo.js — Retbaa Circle
// Helper d'envoi d'emails via Brevo (Sendinblue) API v3.
// Les appels se font côté client (fetch direct vers api.brevo.com).
// La clé API est publique au sens large (pattern identique à Supabase anon key).

// ⚠️  Ne jamais hardcoder la clé ici — déclarer VITE_BREVO_API_KEY dans .env.local
// et dans les variables d'environnement Vercel.
const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY || ''

const SENDER = { name: 'Retbaa Circle', email: 'auth@retbaa.com' }

/**
 * Envoie un email via l'API Brevo SMTP.
 * @param {Object} params
 * @param {string} params.to       - Adresse email du destinataire
 * @param {string} params.subject  - Sujet de l'email
 * @param {string} params.html     - Corps HTML de l'email
 * @returns {Promise<void>}
 */
export async function sendEmail({ to, subject, html }) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Accept':       'application/json',
      'Content-Type': 'application/json',
      'api-key':      BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: SENDER,
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('[Brevo] Erreur envoi email:', errorData)
    // On ne throw pas pour ne pas bloquer l'onboarding utilisateur
    // L'email est best-effort
  }
}
