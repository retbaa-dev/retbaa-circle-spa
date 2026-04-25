// server/admin.js — Serveur admin Retbaa Circle
// Gère : invitations, validation des comptes, liste des investisseurs en attente

import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
import clerkBackend from '@clerk/backend'

const { Clerk } = clerkBackend

const app = express()
app.use(express.json())
app.use(cors({ origin: ['https://circle.retbaa.com', 'http://localhost:5173'] }))

const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY })

// Données investisseurs (pré-chargées — liées au token d'invitation)
const INVESTOR_DATA = {
  massata:    { name: 'Massata Niang',    email: 'massata@retbaa.com',        amount: 0,      shares: 100000, shareClass: 'Fondateur', ref: 'RC-0001' },
  barthelemy: { name: 'Barthélemy Faye',  email: 'bfaye@cgsh.com',            amount: 150000, shares: 6250,   shareClass: 'Série A',   ref: 'RC-9921' },
  pape:       { name: 'Pape Amadou Ngom', email: 'angom@sqorus.com',          amount: 150000, shares: 6250,   shareClass: 'Série A',   ref: 'RC-0042' },
  cathy:      { name: 'Cathy Muiza',      email: 'cathy@r2coop.com',          amount: 30000,  shares: 1250,   shareClass: 'Série A',   ref: 'RC-0078' },
  raphael:    { name: 'Raphaël Perdrix',  email: 'Raphael.Perdrix@gmail.com', amount: 30000,  shares: 1250,   shareClass: 'Série A',   ref: 'RC-0093' },
}

// Store des invitations (en prod → utiliser une DB ou fichier JSON persistant)
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const INVITES_FILE = join(__dirname, 'invites.json')

function loadInvites() {
  if (!existsSync(INVITES_FILE)) return {}
  try { return JSON.parse(readFileSync(INVITES_FILE, 'utf8')) } catch { return {} }
}

function saveInvites(data) {
  writeFileSync(INVITES_FILE, JSON.stringify(data, null, 2))
}

// ── POST /admin/invite ──────────────────────────────────────────────────────
// Génère un lien d'invitation unique pour un investisseur
// Body: { investorKey: 'barthelemy', adminSecret: '...' }
app.post('/admin/invite', async (req, res) => {
  const { investorKey, adminSecret } = req.body
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Non autorisé' })
  }
  if (!INVESTOR_DATA[investorKey]) {
    return res.status(400).json({ error: 'Investisseur inconnu' })
  }

  const token = crypto.randomBytes(24).toString('hex')
  const invites = loadInvites()
  invites[token] = {
    investorKey,
    investorData: INVESTOR_DATA[investorKey],
    createdAt: new Date().toISOString(),
    used: false,
    clerkUserId: null,
  }
  saveInvites(invites)

  const link = `https://circle.retbaa.com/invite/${token}`
  const investor = INVESTOR_DATA[investorKey]

  // ── Email à l'investisseur via Gmail ───────────────────────────────────
  try {
    const { execSync } = await import('child_process')
    const prenom = investor.name.split(' ')[0]
    const htmlBody = `
<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1A1C1C;">
  <div style="border-bottom: 2px solid #1A3A6B; padding-bottom: 20px; margin-bottom: 32px;">
    <span style="font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: #EFC0D4; font-weight: 700;">Retbaa Circle</span>
    <h1 style="font-size: 28px; font-weight: 300; font-style: italic; color: #1A3A6B; margin: 8px 0 0;">Votre invitation personnelle</h1>
  </div>
  <p>Bonjour ${prenom},</p>
  <p>Je vous invite à rejoindre <strong>Retbaa Circle</strong>, l'espace privé réservé aux investisseurs de Retbaa.</p>
  <div style="margin: 32px 0; text-align: center;">
    <a href="${link}" style="background-color: #1A3A6B; color: #ffffff; padding: 16px 32px; text-decoration: none; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700; border-radius: 4px;">
      Accéder à mon espace →
    </a>
  </div>
  <p style="font-size: 13px; color: #6B7280;">Ce lien est unique et personnel. Il vous donne accès à :</p>
  <ul style="font-size: 13px; color: #6B7280; line-height: 1.8;">
    <li>Votre tableau de bord (part, valorisation, projections)</li>
    <li>Les documents juridiques à signer</li>
    <li>Les rapports et actualités Retbaa</li>
  </ul>
  <p style="font-size: 12px; color: #9CA3AF; margin-top: 32px; border-top: 1px solid #E5E7EB; padding-top: 16px;">
    Ce lien est à usage unique. Pour toute question : <a href="mailto:massata@retbaa.com" style="color: #1A3A6B;">massata@retbaa.com</a>
  </p>
  <p style="font-size: 13px; color: #1A3A6B; font-style: italic;">— Massata Niang, Retbaa</p>
</div>`

    execSync(
      `gsk email send --to "${investor.email}" --subject "Votre accès Retbaa Circle — Invitation personnelle" --body ${JSON.stringify(htmlBody)} --body_type html --from_account massata@retbaa.com`,
      { stdio: 'inherit' }
    )
    console.log(`✉️  Invitation envoyée à ${investor.email}`)
  } catch (e) {
    console.error('Email invitation error:', e.message)
  }

  res.json({ link, token, investor })
})

// ── GET /admin/invite/:token ────────────────────────────────────────────────
// Vérifie si un token d'invitation est valide (appelé par le frontend)
app.get('/admin/invite/:token', (req, res) => {
  const invites = loadInvites()
  const invite = invites[req.params.token]
  if (!invite) return res.status(404).json({ error: 'Lien invalide ou expiré' })
  if (invite.used) return res.status(410).json({ error: 'Ce lien a déjà été utilisé' })
  res.json({ valid: true, investorData: invite.investorData })
})

// ── POST /admin/invite/:token/use ───────────────────────────────────────────
// Marque le token comme utilisé après création du compte Clerk
// Body: { clerkUserId: '...' }
app.post('/admin/invite/:token/use', async (req, res) => {
  const { clerkUserId } = req.body
  const invites = loadInvites()
  const invite = invites[req.params.token]
  if (!invite || invite.used) return res.status(400).json({ error: 'Token invalide' })

  // Marquer comme utilisé
  invite.used = true
  invite.clerkUserId = clerkUserId
  invite.usedAt = new Date().toISOString()
  saveInvites(invites)

  // Ajouter les métadonnées à l'utilisateur Clerk
  try {
    await clerk.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        status: 'pending',          // pending | active | suspended
        investorKey: invite.investorKey,
        investorRef: invite.investorData.ref,
        investorName: invite.investorData.name,
      }
    })
  } catch (e) {
    console.error('Clerk metadata error:', e.message)
  }

  // ── Email de notification à Massata via Gmail ──────────────────────────
  try {
    const { execSync } = await import('child_process')
    const inv = invite.investorData
    const htmlBody = `
<div style="font-family: Manrope, sans-serif; max-width: 600px; margin: 0 auto; color: #1A1C1C;">
  <div style="background: #1A3A6B; color: white; padding: 20px 24px; border-radius: 4px 4px 0 0;">
    <span style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700;">Retbaa Circle — Notification</span>
  </div>
  <div style="border: 1px solid #E5E7EB; border-top: none; padding: 24px; border-radius: 0 0 4px 4px;">
    <h2 style="font-size: 18px; color: #1A3A6B; margin: 0 0 16px;">🔔 Nouveau compte créé</h2>
    <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
      <tr><td style="padding: 8px 0; color: #6B7280; width: 40%;">Investisseur</td><td style="font-weight: 700;">${inv.name}</td></tr>
      <tr><td style="padding: 8px 0; color: #6B7280;">Référence</td><td>${inv.ref}</td></tr>
      <tr><td style="padding: 8px 0; color: #6B7280;">Classe</td><td>${inv.shareClass}</td></tr>
      <tr><td style="padding: 8px 0; color: #6B7280;">Date</td><td>${new Date().toLocaleString('fr-FR')}</td></tr>
    </table>
    <div style="margin-top: 20px; text-align: center;">
      <a href="https://circle.retbaa.com" style="background-color: #EFC0D4; color: #1A3A6B; padding: 12px 24px; text-decoration: none; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700; border-radius: 4px;">
        Valider l'accès →
      </a>
    </div>
  </div>
</div>`

    execSync(
      `gsk email send --to "massata@retbaa.com" --subject "🔔 Nouveau compte Retbaa Circle — ${inv.name}" --body ${JSON.stringify(htmlBody)} --body_type html --from_account massata@retbaa.com`,
      { stdio: 'inherit' }
    )
    console.log(`🔔 Notification email envoyée à massata@retbaa.com`)

    // WhatsApp
    try {
      const date = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
      const waMsg = `🌿 *Retbaa Circle*\n\n🔔 Nouveau compte créé !\n\n👤 *${inv.name}*\n🏷️ Réf. ${inv.ref}\n🕐 ${date}\n\n_Valide l'accès sur circle.retbaa.com_`
      execSync(`openclaw message send --channel whatsapp --to "+33767410184" --message "${waMsg.replace(/"/g, '\\"')}"`, {
        timeout: 15000, stdio: 'pipe'
      })
      console.log('✅ WhatsApp envoyé à Massata')
    } catch (waErr) {
      console.error('WhatsApp error:', waErr.message)
    }
  } catch (e) {
    console.error('Email notification error:', e.message)
  }

  res.json({ ok: true })
})

// ── GET /admin/users/pending ────────────────────────────────────────────────
// Liste les investisseurs en attente de validation
app.get('/admin/users/pending', async (req, res) => {
  const { adminSecret } = req.query
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Non autorisé' })
  }
  try {
    const users = await clerk.users.getUserList({ limit: 100 })
    const list = Array.isArray(users) ? users : (users.data || [])
    const pending = list.filter(u => u.publicMetadata?.status === 'pending')
    res.json(pending.map(u => ({
      id: u.id,
      email: u.emailAddresses[0]?.emailAddress,
      name: u.publicMetadata?.investorName,
      ref: u.publicMetadata?.investorRef,
      createdAt: u.createdAt,
    })))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── POST /admin/users/:userId/approve ──────────────────────────────────────
// Valide un investisseur → status: active
app.post('/admin/users/:userId/approve', async (req, res) => {
  const { adminSecret } = req.body
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Non autorisé' })
  }
  try {
    const user = await clerk.users.getUser(req.params.userId)
    await clerk.users.updateUserMetadata(req.params.userId, {
      publicMetadata: {
        ...user.publicMetadata,
        status: 'active',
        approvedAt: new Date().toISOString(),
      }
    })
    res.json({ ok: true, userId: req.params.userId })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── POST /admin/users/:userId/suspend ──────────────────────────────────────
// Suspend un investisseur
app.post('/admin/users/:userId/suspend', async (req, res) => {
  const { adminSecret } = req.body
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Non autorisé' })
  }
  try {
    const user = await clerk.users.getUser(req.params.userId)
    await clerk.users.updateUserMetadata(req.params.userId, {
      publicMetadata: { ...user.publicMetadata, status: 'suspended' }
    })
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

const PORT = process.env.ADMIN_PORT || 3002
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Admin server running on port ${PORT}`)
})

// ── Docuseal integration ──────────────────────────────────────
const DOCUSEAL_API = 'http://localhost:3004/api'
const DOCUSEAL_TOKEN = 'Ueny2jN2Ys98gunkMb5kp5kw51G59ZibpeSHWpFUSuo'

// Webhook Docuseal → email notification à massata@retbaa.com
app.post('/docuseal-webhook', express.json(), async (req, res) => {
  try {
    const event = req.body
    console.log('📝 Docuseal event:', JSON.stringify(event, null, 2))

    if (event.event_type === 'form.completed') {
      const submitter = event.data?.submitters?.[0]
      const template = event.data?.template
      const name = submitter?.name || submitter?.email || 'Investisseur'
      const doc = template?.name || 'Document'
      const pdfUrl = event.data?.audit_log_url || event.data?.documents?.[0]?.url

      // Email via gsk vm_email
      const { execSync } = await import('child_process')
      const body = `**Document signé — Retbaa Circle**\n\n**Signataire :** ${name}\n**Document :** ${doc}\n**Date :** ${new Date().toLocaleString('fr-FR')}\n\n${pdfUrl ? `**PDF signé :** ${pdfUrl}` : ''}`

      execSync(`gsk vm_email send massata@retbaa.com -s "✍️ Document signé : ${doc} — ${name}" -b "${body.replace(/"/g, "'")}" -f $OPENCLAW_VM_NAME`, { stdio: 'inherit' })

      // Sauvegarder sur AI Drive
      if (pdfUrl) {
        execSync(`gsk drive download_file --file_url "${pdfUrl}" --target_folder "/Retbaa_Circle/Documents_Signes"`, { stdio: 'ignore' })
      }
    }
    res.json({ ok: true })
  } catch (e) {
    console.error('Docuseal webhook error:', e.message)
    res.json({ ok: false })
  }
})

// API : créer un lien de signature pour un investisseur
app.post('/docuseal/sign-link', async (req, res) => {
  try {
    const { templateId, submitterName, submitterEmail } = req.body
    if (!templateId || !submitterEmail) return res.status(400).json({ error: 'Missing params' })

    const r = await fetch(`${DOCUSEAL_API}/templates/${templateId}/submissions`, {
      method: 'POST',
      headers: { 'X-Auth-Token': DOCUSEAL_TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        send_email: false,
        submitters: [{ role: 'Investor', name: submitterName, email: submitterEmail }]
      })
    })
    const data = await r.json()
    const signUrl = data?.[0]?.slug ? `http://20.214.160.202:8080/s/${data[0].slug}` : null
    res.json({ signUrl, data })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// API : liste des templates Docuseal
app.get('/docuseal/templates', async (req, res) => {
  try {
    const r = await fetch(`${DOCUSEAL_API}/templates`, {
      headers: { 'X-Auth-Token': DOCUSEAL_TOKEN }
    })
    const data = await r.json()
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})
