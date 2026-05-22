// server/admin.js — Serveur admin Retbaa Circle
// Gère : invitations, validation des comptes, liste des investisseurs en attente

import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
import clerkBackend from '@clerk/backend'

const { Clerk, verifyToken } = clerkBackend

const app = express()
app.use(express.json())
app.use(cors({ origin: ['https://circle.retbaa.com', 'http://localhost:5173'] }))

const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY })

const ADMIN_EMAILS = ['massata@retbaa.com', 'massata+1@retbaa.com']

// Middleware auth admin — vérifie le token Clerk JWT
async function requireAdmin(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ error: 'Token manquant' })
    const payload = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY })
    // Vérifier le rôle admin ou email autorisé
    const user = await clerk.users.getUser(payload.sub)
    const email = user.emailAddresses?.[0]?.emailAddress
    const isAdmin = user.publicMetadata?.role === 'admin' || ADMIN_EMAILS.includes(email)
    if (!isAdmin) return res.status(403).json({ error: 'Accès refusé' })
    req.clerkUserId = payload.sub
    next()
  } catch (e) {
    res.status(401).json({ error: 'Non autorisé', detail: e.message })
  }
}

// Données investisseurs (pré-chargées — liées au token d'invitation)
const INVESTOR_DATA = {
  massata:    { name: 'Massata Niang',    email: 'massata@retbaa.com',        amount: 0,      shares: 100000, shareClass: 'Fondateur', ref: 'RC-0001' },
  barthelemy: { name: 'Barthélemy Faye',  email: 'bfaye@cgsh.com',            amount: 150000, shares: 6250,   shareClass: 'Série A',   ref: 'RC-9921' },
  pape:       { name: 'Pape Amadou Ngom', email: 'angom@sqorus.com',          amount: 150000, shares: 6250,   shareClass: 'Série A',   ref: 'RC-0042' },
  cathy:      { name: 'Cathy Muiza',      email: 'cathy@r2coop.com',          amount: 30000,  shares: 1250,   shareClass: 'Série A',   ref: 'RC-0078' },
  raphael:    { name: 'Raphaël Perdrix',  email: 'Raphael.Perdrix@gmail.com', amount: 30000,  shares: 1250,   shareClass: 'Série A',   ref: 'RC-0093' },
  // Assistants — accès délégué lecture seule, sans données financières
  leah:       { name: 'Leah',             email: 'leah@r2coop.com',           amount: 0,      shares: 0,      shareClass: 'Assistant', ref: 'RC-0078-A', role: 'assistant', linkedTo: 'cathy' },
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
// Body: { investorKey: 'barthelemy': '...' }
app.post('/admin/invite', requireAdmin, async (req, res) => {
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
    const inv = invite.investorData
    await clerk.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        status: 'pending',
        investorKey: invite.investorKey,
        investorRef: inv.ref,
        investorName: inv.name,
        // Propagés uniquement si présents (pour les assistants)
        ...(inv.role     && { role: inv.role }),
        ...(inv.linkedTo && { linkedTo: inv.linkedTo }),
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
app.get('/admin/users/pending', requireAdmin, async (req, res) => {
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
app.post('/admin/users/:userId/approve', requireAdmin, async (req, res) => {
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
app.post('/admin/users/:userId/suspend', requireAdmin, async (req, res) => {
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

// ── GET /api/stats ─────────────────────────────────────────────────────────
// Analytics pour AnalyticsPage (token simple)
app.get('/api/stats', async (req, res) => {
  if (req.query.token !== 'retbaa2026') return res.status(401).json({ error: 'Non autorisé' })

  const invites = loadInvites()

  // Construire les stats par investisseur depuis les invites
  const investors = {}
  for (const [token, inv] of Object.entries(invites)) {
    const key = inv.investorKey
    if (!key) continue
    investors[key] = {
      name: inv.investorData?.name || key,
      ref: inv.investorData?.ref || '',
      invited_at: inv.createdAt || null,
      joined_at: inv.usedAt || null,
      status: inv.used ? 'active' : 'pending',
      kyc_uploaded: false, // sera enrichi si on a les données kyc
    }
  }

  // Compter les KYC uploadés par investisseur
  const kycDir = join(__dirname, '../kyc-uploads')
  if (existsSync(kycDir)) {
    const { readdirSync } = await import('fs')
    for (const userDir of readdirSync(kycDir)) {
      const files = readdirSync(join(kycDir, userDir))
      const key = userDir.toLowerCase()
      for (const invKey of Object.keys(investors)) {
        if (key.includes(invKey) || invKey.includes(key.split(' ')[0])) {
          investors[invKey].kyc_uploaded = files.length > 0
          investors[invKey].kyc_count = files.length
        }
      }
    }
  }

  const totalInvited = Object.keys(invites).length
  const totalJoined = Object.values(invites).filter(i => i.used).length

  res.json({
    investors,
    summary: {
      total_invited: totalInvited,
      total_joined: totalJoined,
      pending: totalInvited - totalJoined,
    },
    top_pages: [
      { page: 'dashboard', visits: 0 },
      { page: 'documents', visits: 0 },
      { page: 'insights', visits: 0 },
    ],
    top_podcasts: [],
    generated_at: new Date().toISOString(),
  })
})

// ── POST /onboarding/magic-link ────────────────────────────────────────────
// Page /bienvenue : l'investisseur entre son email → reçoit un magic link Clerk
// Pas d'auth requise — on vérifie juste que l'email est dans la liste investisseurs
app.post('/onboarding/magic-link', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email requis' })

    const normalizedEmail = email.trim().toLowerCase()

    // Vérifier que l'email est dans la liste investisseurs autorisés
    const AUTHORIZED_EMAILS = Object.values(INVESTOR_DATA).map(i => i.email.toLowerCase())
    const investorEntry = Object.entries(INVESTOR_DATA).find(
      ([, v]) => v.email.toLowerCase() === normalizedEmail
    )

    if (!investorEntry) {
      // On retourne toujours succès pour éviter l'énumération d'emails
      return res.json({ success: true, message: 'Si cet email est enregistré, vous recevrez un lien de connexion.' })
    }

    const [investorKey, investorData] = investorEntry

    // Trouver ou créer l'utilisateur Clerk
    let clerkUser = null
    try {
      const users = await clerk.users.getUserList({ emailAddress: [email.trim()] })
      clerkUser = users.data?.[0] || users[0] || null
    } catch (e) {
      console.error('Clerk getUserList error:', e.message)
    }

    // Si pas de compte Clerk → créer le compte
    if (!clerkUser) {
      try {
        clerkUser = await clerk.users.createUser({
          emailAddress: [email.trim()],
          firstName: investorData.name.split(' ')[0],
          lastName: investorData.name.split(' ').slice(1).join(' '),
          publicMetadata: {
            investor: investorKey,
            role: investorData.role || 'investor',
            status: 'active',
            linkedTo: investorData.linkedTo || null,
          }
        })
      } catch (e) {
        console.error('Clerk createUser error:', e.message)
        return res.status(500).json({ error: 'Erreur création compte' })
      }
    } else {
      // Mettre à jour les metadata si manquantes
      if (!clerkUser.publicMetadata?.investor) {
        await clerk.users.updateUser(clerkUser.id, {
          firstName: clerkUser.firstName || investorData.name.split(' ')[0],
          lastName: clerkUser.lastName || investorData.name.split(' ').slice(1).join(' '),
          publicMetadata: {
            investor: investorKey,
            role: investorData.role || 'investor',
            status: 'active',
            linkedTo: investorData.linkedTo || null,
          }
        })
      }
    }

    // Générer un sign-in token Clerk (magic link valable 24h)
    const tokenResult = await clerk.signInTokens.createSignInToken({
      userId: clerkUser.id,
      expiresInSeconds: 86400,
    })

    const magicLink = `https://circle.retbaa.com/?__clerk_ticket=${tokenResult.token}`

    // Envoyer l'email via Clerk (email transactionnel)
    try {
      await clerk.emails.createEmail({
        fromEmailName: 'circle',
        subject: 'Votre accès Retbaa Circle',
        body: `
Bonjour ${investorData.name.split(' ')[0]},

Voici votre lien de connexion à Retbaa Circle. Il est personnel et valable 24h.

${magicLink}

Aucun mot de passe requis — cliquez simplement sur le lien.

Cordialement,
Massata Niang
Retbaa
        `.trim(),
        emailAddressId: clerkUser.emailAddresses[0].id,
      })
      return res.json({ success: true, message: 'Lien envoyé par email.' })
    } catch (emailErr) {
      // Si l'envoi email Clerk échoue (plan limité), retourner le lien directement
      console.error('Clerk email error (non bloquant):', emailErr.message)
      return res.json({
        success: true,
        message: 'Lien généré.',
        magicLink, // Retourné pour affichage direct si email indisponible
        fallback: true,
      })
    }

  } catch (err) {
    console.error('onboarding/magic-link error:', err)
    res.status(500).json({ error: 'Erreur serveur' })
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
