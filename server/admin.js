// server/admin.js — Serveur admin Retbaa Circle
// Gère : invitations, validation des comptes, liste des investisseurs en attente
// Auth : Supabase (migré depuis Clerk — ADR-008)

import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

const app = express()
app.use(express.json())
app.use(cors({ origin: ['https://circle.retbaa.com', 'http://localhost:5173'] }))

// ── Supabase admin client (service role — serveur uniquement) ─────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const ADMIN_EMAILS = ['massata@retbaa.com', 'massata+1@retbaa.com']

// ── Middleware auth admin — vérifie le JWT Supabase ───────────────────────────
async function requireAdmin(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ error: 'Token manquant' })

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return res.status(401).json({ error: 'Non autorisé' })

    // Récupérer profil avec rôle
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role, email')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'founder' || ADMIN_EMAILS.includes(profile?.email)
    if (!isAdmin) return res.status(403).json({ error: 'Accès refusé' })

    req.userId = user.id
    next()
  } catch (e) {
    res.status(401).json({ error: 'Non autorisé', detail: e.message })
  }
}

// ── Données investisseurs (pré-chargées — liées au token d'invitation) ─────────
const INVESTOR_DATA = {
  massata:    { name: 'Massata Niang',    email: 'massata@retbaa.com',        amount: 0,      shares: 100000, shareClass: 'Fondateur', ref: 'RC-0001' },
  barthelemy: { name: 'Barthélemy Faye',  email: 'bfaye@cgsh.com',            amount: 150000, shares: 6250,   shareClass: 'Série A',   ref: 'RC-9921' },
  pape:       { name: 'Pape Amadou Ngom', email: 'angom@sqorus.com',          amount: 150000, shares: 6250,   shareClass: 'Série A',   ref: 'RC-0042' },
  cathy:      { name: 'Cathy Muiza',      email: 'cathy@r2coop.com',          amount: 30000,  shares: 1250,   shareClass: 'Série A',   ref: 'RC-0078' },
  raphael:    { name: 'Raphaël Perdrix',  email: 'Raphael.Perdrix@gmail.com', amount: 30000,  shares: 1250,   shareClass: 'Série A',   ref: 'RC-0093' },
  // Assistants — accès délégué lecture seule, sans données financières
  leah:       { name: 'Leah',             email: 'leah@r2coop.com',           amount: 0,      shares: 0,      shareClass: 'Assistant', ref: 'RC-0078-A', role: 'assistant', linkedTo: 'cathy' },
}

// ── POST /admin/invite ──────────────────────────────────────────────────────
// Génère un lien d'invitation unique pour un investisseur
// Body: { investorKey: 'barthelemy' }
app.post('/admin/invite', requireAdmin, async (req, res) => {
  const { investorKey } = req.body
  if (!INVESTOR_DATA[investorKey]) {
    return res.status(400).json({ error: 'Investisseur inconnu' })
  }

  const token = crypto.randomBytes(24).toString('hex')
  const investor = INVESTOR_DATA[investorKey]

  // Insérer dans Supabase
  const { data, error } = await supabase
    .from('invitations')
    .insert({
      token,
      investor_key: investorKey,
      email: investor.email,
      name: investor.name,
      amount: investor.amount,
      shares: investor.shares,
      share_class: investor.shareClass,
      investor_ref: investor.ref,
      role: investor.role || null,
      linked_to: investor.linkedTo || null,
    })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  const link = `https://circle.retbaa.com/invite/${token}`

  // ── Email à l'investisseur via gsk ────────────────────────────────────────
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
app.get('/admin/invite/:token', async (req, res) => {
  const { data: invite, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('token', req.params.token)
    .single()

  if (error || !invite) return res.status(404).json({ error: 'Lien invalide ou expiré' })
  if (invite.used_at) return res.status(410).json({ error: 'Ce lien a déjà été utilisé' })

  res.json({
    valid: true,
    investorData: {
      name: invite.name,
      email: invite.email,
      amount: invite.amount,
      shares: invite.shares,
      shareClass: invite.share_class,
      ref: invite.investor_ref,
    }
  })
})

// ── POST /admin/invite/:token/use ───────────────────────────────────────────
// Marque le token comme utilisé après création du compte Supabase
// Body: { userId: '<supabase-auth-user-id>' }
app.post('/admin/invite/:token/use', async (req, res) => {
  const { userId } = req.body

  // Récupérer invitation
  const { data: invite, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('token', req.params.token)
    .single()

  if (error || !invite || invite.used_at) {
    return res.status(400).json({ error: 'Token invalide ou déjà utilisé' })
  }

  // Marquer comme utilisée
  await supabase
    .from('invitations')
    .update({
      used_at: new Date().toISOString(),
      used_by: userId,
    })
    .eq('token', req.params.token)

  // Créer profil dans user_profiles
  await supabase
    .from('user_profiles')
    .insert({
      id: userId,
      email: invite.email,
      full_name: invite.name,
      role: invite.role || 'ops', // 'ops' = investisseur standard
      linked_to: invite.linked_to,
    })

  // ── Email de notification à Massata via gsk ───────────────────────────────
  try {
    const { execSync } = await import('child_process')
    const htmlBody = `
<div style="font-family: Manrope, sans-serif; max-width: 600px; margin: 0 auto; color: #1A1C1C;">
  <div style="background: #1A3A6B; color: white; padding: 20px 24px; border-radius: 4px 4px 0 0;">
    <span style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700;">Retbaa Circle — Notification</span>
  </div>
  <div style="border: 1px solid #E5E7EB; border-top: none; padding: 24px; border-radius: 0 0 4px 4px;">
    <h2 style="font-size: 18px; color: #1A3A6B; margin: 0 0 16px;">🔔 Nouveau compte créé</h2>
    <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
      <tr><td style="padding: 8px 0; color: #6B7280; width: 40%;">Investisseur</td><td style="font-weight: 700;">${invite.name}</td></tr>
      <tr><td style="padding: 8px 0; color: #6B7280;">Référence</td><td>${invite.investor_ref}</td></tr>
      <tr><td style="padding: 8px 0; color: #6B7280;">Classe</td><td>${invite.share_class}</td></tr>
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
      `gsk email send --to "massata@retbaa.com" --subject "🔔 Nouveau compte Retbaa Circle — ${invite.name}" --body ${JSON.stringify(htmlBody)} --body_type html --from_account massata@retbaa.com`,
      { stdio: 'inherit' }
    )
    console.log(`🔔 Notification email envoyée à massata@retbaa.com`)

    // WhatsApp
    try {
      const date = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
      const waMsg = `🌿 *Retbaa Circle*\n\n🔔 Nouveau compte créé !\n\n👤 *${invite.name}*\n🏷️ Réf. ${invite.investor_ref}\n🕐 ${date}\n\n_Valide l'accès sur circle.retbaa.com_`
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
  const { data, error } = await supabase
    .from('user_profiles')
    .select('id, email, full_name, role, created_at')
    .eq('role', 'pending')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// ── POST /admin/users/:userId/approve ──────────────────────────────────────
// Valide un investisseur → role: ops
app.post('/admin/users/:userId/approve', requireAdmin, async (req, res) => {
  const { error } = await supabase
    .from('user_profiles')
    .update({ role: 'ops' })
    .eq('id', req.params.userId)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ ok: true, userId: req.params.userId })
})

// ── POST /admin/users/:userId/suspend ──────────────────────────────────────
// Suspend un investisseur
app.post('/admin/users/:userId/suspend', requireAdmin, async (req, res) => {
  const { error } = await supabase
    .from('user_profiles')
    .update({ role: 'suspended' })
    .eq('id', req.params.userId)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ ok: true })
})

// ── GET /api/stats ─────────────────────────────────────────────────────────
// Analytics pour AnalyticsPage (token simple)
app.get('/api/stats', async (req, res) => {
  if (req.query.token !== 'retbaa2026') return res.status(401).json({ error: 'Non autorisé' })

  // Récupérer toutes les invitations depuis Supabase
  const { data: invitations, error } = await supabase
    .from('invitations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  // Construire les stats par investisseur
  const investors = {}
  for (const inv of (invitations || [])) {
    const key = inv.investor_key
    if (!key) continue
    investors[key] = {
      name: inv.name || key,
      ref: inv.investor_ref || '',
      invited_at: inv.created_at || null,
      joined_at: inv.used_at || null,
      status: inv.used_at ? 'active' : 'pending',
      kyc_uploaded: false,
    }
  }

  // Compter les KYC uploadés par investisseur
  try {
    const { existsSync, readdirSync } = await import('fs')
    const { join, dirname } = await import('path')
    const { fileURLToPath } = await import('url')
    const __dirname = dirname(fileURLToPath(import.meta.url))
    const kycDir = join(__dirname, '../kyc-uploads')

    if (existsSync(kycDir)) {
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
  } catch (e) {
    console.error('KYC stats error:', e.message)
  }

  const totalInvited = (invitations || []).length
  const totalJoined = (invitations || []).filter(i => i.used_at).length

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
// Page /bienvenue : l'investisseur entre son email → reçoit un magic link Supabase
// Pas d'auth requise — on vérifie juste que l'email est dans la liste investisseurs
app.post('/onboarding/magic-link', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email requis' })

    const normalizedEmail = email.trim().toLowerCase()

    // Vérifier que l'email est dans la liste investisseurs autorisés
    const investorEntry = Object.entries(INVESTOR_DATA).find(
      ([, v]) => v.email.toLowerCase() === normalizedEmail
    )

    if (!investorEntry) {
      // Retourner toujours succès pour éviter l'énumération d'emails
      return res.json({ success: true, message: 'Si cet email est enregistré, vous recevrez un lien de connexion.' })
    }

    const [, investorData] = investorEntry

    // Générer un magic link Supabase (admin API)
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email.trim(),
      options: {
        redirectTo: 'https://circle.retbaa.com/auth/callback',
      }
    })

    if (error) {
      console.error('Supabase generateLink error:', error.message)
      return res.status(500).json({ error: 'Erreur génération lien' })
    }

    const magicLink = data.properties?.action_link

    // Envoyer l'email via gsk
    try {
      const { execSync } = await import('child_process')
      const prenom = investorData.name.split(' ')[0]
      const htmlBody = `
<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1A1C1C;">
  <div style="border-bottom: 2px solid #1A3A6B; padding-bottom: 20px; margin-bottom: 32px;">
    <span style="font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: #EFC0D4; font-weight: 700;">Retbaa Circle</span>
    <h1 style="font-size: 28px; font-weight: 300; font-style: italic; color: #1A3A6B; margin: 8px 0 0;">Votre lien de connexion</h1>
  </div>
  <p>Bonjour ${prenom},</p>
  <p>Voici votre lien de connexion à Retbaa Circle. Il est personnel et valable 24h.</p>
  <div style="margin: 32px 0; text-align: center;">
    <a href="${magicLink}" style="background-color: #1A3A6B; color: #ffffff; padding: 16px 32px; text-decoration: none; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700; border-radius: 4px;">
      Accéder à mon espace →
    </a>
  </div>
  <p style="font-size: 12px; color: #9CA3AF; margin-top: 32px; border-top: 1px solid #E5E7EB; padding-top: 16px;">
    Aucun mot de passe requis — cliquez simplement sur le lien. Pour toute question : <a href="mailto:massata@retbaa.com" style="color: #1A3A6B;">massata@retbaa.com</a>
  </p>
  <p style="font-size: 13px; color: #1A3A6B; font-style: italic;">— Massata Niang, Retbaa</p>
</div>`

      execSync(
        `gsk email send --to "${email.trim()}" --subject "Votre accès Retbaa Circle" --body ${JSON.stringify(htmlBody)} --body_type html --from_account massata@retbaa.com`,
        { stdio: 'inherit' }
      )
      return res.json({ success: true, message: 'Lien envoyé par email.' })
    } catch (emailErr) {
      console.error('gsk email error (non bloquant):', emailErr.message)
      // Retourner le lien directement si l'envoi email échoue
      return res.json({
        success: true,
        message: 'Lien généré.',
        magicLink,
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
  console.log(`✅ Admin server running on port ${PORT} (Supabase Auth)`)
})

// ── Docuseal integration ───────────────────────────────────────────────────
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

      const { execSync } = await import('child_process')
      const body = `**Document signé — Retbaa Circle**\n\n**Signataire :** ${name}\n**Document :** ${doc}\n**Date :** ${new Date().toLocaleString('fr-FR')}\n\n${pdfUrl ? `**PDF signé :** ${pdfUrl}` : ''}`

      execSync(`gsk vm_email send massata@retbaa.com -s "✍️ Document signé : ${doc} — ${name}" -b "${body.replace(/"/g, "'")}" -f $OPENCLAW_VM_NAME`, { stdio: 'inherit' })

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
