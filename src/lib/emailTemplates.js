// src/lib/emailTemplates.js — Retbaa Circle
// Templates HTML inline pour les emails automatiques via Brevo.
// Brand : #1A3A6B (navy), #EFC0D4 (pink), Georgia serif.

// ── Utilitaires ──────────────────────────────────────────────────────────────

const base = `
  <div style="margin:0;padding:0;background:#f4f6f9;font-family:Georgia,serif;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f6f9;padding:40px 0;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0"
               style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;
                      box-shadow:0 2px 12px rgba(0,0,0,0.08);overflow:hidden;">
          {{CONTENT}}
        </table>
      </td></tr>
    </table>
  </div>
`

function wrap(content) {
  return base.replace('{{CONTENT}}', content)
}

// ── Template A — Bienvenue prospect ──────────────────────────────────────────

/**
 * Email de bienvenue envoyé au prospect après signature NDA + qualification.
 * @param {Object} params
 * @param {string} params.firstName
 * @param {string} params.lastName
 * @returns {string} HTML
 */
export function welcomeProspect({ firstName, lastName }) {
  const displayName = firstName ? firstName.trim() : 'Cher investisseur'

  const header = `
    <tr>
      <td style="background:#1A3A6B;padding:32px 40px;text-align:center;">
        <div style="font-family:Georgia,serif;font-size:22px;font-weight:bold;
                    letter-spacing:3px;color:#EFC0D4;text-transform:uppercase;
                    margin-bottom:4px;">
          RETBAA CIRCLE
        </div>
        <div style="font-family:Georgia,serif;font-size:11px;letter-spacing:2px;
                    color:rgba(239,192,212,0.7);text-transform:uppercase;">
          Espace Investisseurs Privé
        </div>
      </td>
    </tr>
  `

  const body = `
    <tr>
      <td style="padding:40px 40px 24px;">
        <h1 style="font-family:Georgia,serif;font-size:24px;color:#1A3A6B;
                   margin:0 0 16px;font-weight:normal;">
          Bienvenue, ${escapeHtml(displayName)}
        </h1>
        <p style="font-family:Georgia,serif;font-size:16px;color:#444;
                  line-height:1.7;margin:0 0 24px;">
          Votre espace est prêt. Vous avez désormais accès à notre dataroom privée
          et aux documents confidentiels de Retbaa Circle.
        </p>

        <div style="background:#f8f5f7;border-left:4px solid #EFC0D4;
                    border-radius:4px;padding:20px 24px;margin:0 0 28px;">
          <div style="font-family:Georgia,serif;font-size:13px;font-weight:bold;
                      color:#1A3A6B;text-transform:uppercase;letter-spacing:1px;
                      margin-bottom:12px;">
            Documents disponibles en aperçu
          </div>
          <ul style="margin:0;padding:0 0 0 18px;font-family:Georgia,serif;
                     font-size:14px;color:#555;line-height:2;">
            <li>Mémorandum d'information (Executive Summary)</li>
            <li>Business Plan & Projections financières</li>
            <li>Analyse de marché et positionnement</li>
            <li>Structure juridique et conditions d'investissement</li>
            <li>Équipe fondatrice & Gouvernance</li>
            <li>Roadmap et jalons stratégiques</li>
          </ul>
        </div>

        <div style="text-align:center;margin:32px 0;">
          <a href="https://circle.retbaa.com/dataroom-docs"
             style="display:inline-block;background:#1A3A6B;color:#ffffff;
                    font-family:Georgia,serif;font-size:15px;letter-spacing:1px;
                    text-decoration:none;padding:14px 36px;border-radius:4px;
                    font-weight:bold;">
            Accéder à la dataroom
          </a>
        </div>

        <p style="font-family:Georgia,serif;font-size:14px;color:#777;
                  line-height:1.6;margin:0;">
          Si vous avez des questions, n'hésitez pas à nous contacter directement
          en répondant à cet email.
        </p>
      </td>
    </tr>
  `

  const divider = `
    <tr>
      <td style="background:#EFC0D4;height:2px;"></td>
    </tr>
  `

  const footer = `
    <tr>
      <td style="padding:24px 40px;background:#fafafa;text-align:center;">
        <p style="font-family:Georgia,serif;font-size:12px;color:#999;
                  margin:0 0 6px;line-height:1.6;">
          Cet email vous a été envoyé car vous avez rejoint Retbaa Circle.
        </p>
        <p style="font-family:Georgia,serif;font-size:12px;color:#bbb;margin:0;">
          © ${new Date().getFullYear()} Retbaa Circle — Confidentiel
        </p>
      </td>
    </tr>
  `

  return wrap(header + body + divider + footer)
}

// ── Template B — Notification admin ──────────────────────────────────────────

/**
 * Email de notification envoyé à Massata lors d'un nouveau prospect.
 * @param {Object} params
 * @param {string} params.firstName
 * @param {string} params.lastName
 * @param {string} params.email
 * @param {string} params.canal
 * @param {string} params.montant
 * @returns {string} HTML
 */
export function notifyAdmin({ firstName, lastName, email, canal, montant }) {
  const now = new Date()
  const dateStr = now.toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  const header = `
    <tr>
      <td style="background:#1A3A6B;padding:24px 32px;">
        <div style="font-family:Georgia,serif;font-size:13px;color:#EFC0D4;
                    letter-spacing:2px;text-transform:uppercase;">
          🔔 Retbaa Circle — Nouveau Prospect
        </div>
      </td>
    </tr>
  `

  const rowStyle = `border-bottom:1px solid #eee;`
  const thStyle  = `font-family:Georgia,serif;font-size:13px;color:#888;
                    font-weight:normal;text-align:left;padding:10px 16px 10px 0;
                    white-space:nowrap;width:35%;`
  const tdStyle  = `font-family:Georgia,serif;font-size:14px;color:#1A3A6B;
                    font-weight:bold;padding:10px 0;`

  const tableRows = [
    ['Email',               escapeHtml(email || '—')],
    ['Prénom',              escapeHtml(firstName || '—')],
    ['Nom',                 escapeHtml(lastName || '—')],
    ["Canal d'intérêt",    escapeHtml(canal || '—')],
    ['Montant envisagé',    escapeHtml(montant || '—')],
    ['Date',                escapeHtml(dateStr)],
  ].map(([label, value]) => `
    <tr style="${rowStyle}">
      <th style="${thStyle}">${label}</th>
      <td style="${tdStyle}">${value}</td>
    </tr>
  `).join('')

  const body = `
    <tr>
      <td style="padding:32px;">
        <h2 style="font-family:Georgia,serif;font-size:20px;color:#1A3A6B;
                   margin:0 0 24px;font-weight:normal;">
          Nouveau prospect — ${escapeHtml(firstName)} ${escapeHtml(lastName)}
        </h2>

        <table width="100%" cellpadding="0" cellspacing="0" border="0"
               style="border-top:1px solid #eee;margin-bottom:32px;">
          ${tableRows}
        </table>

        <div style="text-align:center;">
          <a href="https://circle.retbaa.com/admin"
             style="display:inline-block;background:#1A3A6B;color:#ffffff;
                    font-family:Georgia,serif;font-size:14px;letter-spacing:1px;
                    text-decoration:none;padding:12px 28px;border-radius:4px;">
            Voir le dossier
          </a>
        </div>
      </td>
    </tr>
  `

  const footer = `
    <tr>
      <td style="padding:16px 32px;background:#fafafa;border-top:1px solid #eee;
                 text-align:center;">
        <p style="font-family:Georgia,serif;font-size:11px;color:#bbb;margin:0;">
          Retbaa Circle — Notification interne automatique
        </p>
      </td>
    </tr>
  `

  return wrap(header + body + footer)
}

// ── Utilitaire ────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;')
}
