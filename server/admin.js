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
  massata: { name: 'Massata Niang', amount: 0, shares: 8690, shareClass: 'Fondateur', ref: 'RC-0001' },
  barthelemy: { name: 'Barthélemy Faye', amount: 25000, shares: 1041, shareClass: 'Série A', ref: 'RC-9921' },
  pape: { name: 'Pape Amadou Ngom', amount: 50000, shares: 2083, shareClass: 'Série A', ref: 'RC-0042' },
  cathy: { name: 'Cathy Muiza', amount: 15000, shares: 625, shareClass: 'Série A', ref: 'RC-0078' },
  raphael: { name: 'Raphaël Perdrix', amount: 20000, shares: 833, shareClass: 'Série A', ref: 'RC-0093' },
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
  res.json({ link, token, investor: INVESTOR_DATA[investorKey] })
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
