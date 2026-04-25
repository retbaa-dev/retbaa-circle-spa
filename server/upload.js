// server/upload.js — KYC Upload Handler for Retbaa Circle
import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = 3001

app.use(express.json())

// KYC uploads directory
const KYC_DIR = path.join(__dirname, '../kyc-uploads')
if (!fs.existsSync(KYC_DIR)) fs.mkdirSync(KYC_DIR, { recursive: true })

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = path.join(KYC_DIR, req.body.userName || 'unknown')
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true })
    cb(null, userDir)
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const ext = path.extname(file.originalname)
    cb(null, `kyc_${timestamp}${ext}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowed.includes(ext)) cb(null, true)
    else cb(new Error('Format non supporté'))
  }
})

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://investisseurs.retbaa.com')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

// Backup KYC to Genspark AI-Drive
async function backupToAIDrive(userName, filePath, originalName) {
  try {
    const { execSync } = await import('child_process')
    const driveDate = new Date().toISOString().slice(0,10)
    const uploadPath = `/Retbaa_Circle/KYC/${userName}_${driveDate}_${originalName}`
    execSync(`gsk drive upload --file_url "${filePath}" --upload_path "${uploadPath}"`, {
      timeout: 30000,
      stdio: 'pipe'
    })
    console.log(`✅ KYC sauvegardé sur AI-Drive : ${uploadPath}`)
    return true
  } catch (err) {
    console.error('AI-Drive backup error:', err.message)
    return false
  }
}

// Mapping userName → email investisseur
const INVESTOR_EMAILS = {
  barthelemy: { name: 'Barthélemy Faye',  email: 'bfaye@cgsh.com' },
  pape:       { name: 'Pape Amadou Ngom', email: 'angom@sqorus.com' },
  cathy:      { name: 'Cathy Muiza',      email: 'cathy@r2coop.com' },
  raphael:    { name: 'Raphaël Perdrix',  email: 'Raphael.Perdrix@gmail.com' },
}

function getInvestorEmail(userName) {
  if (!userName) return null
  const key = userName.toLowerCase()
  for (const [k, v] of Object.entries(INVESTOR_EMAILS)) {
    if (key.includes(k) || k.includes(key.split(' ')[0]?.toLowerCase())) return v
  }
  return null
}

// Envoie un email via gsk (Gmail OAuth)
async function sendEmail(to, subject, body) {
  try {
    const { execSync } = await import('child_process')
    // Échapper les guillemets dans le body
    const safeBody = body.replace(/"/g, '\\"').replace(/\n/g, '\\n')
    execSync(`gsk email send "${to}" -s "${subject}" -b "${safeBody}"`, {
      timeout: 30000, stdio: 'pipe'
    })
    console.log(`✅ Email envoyé à ${to}`)
    return true
  } catch (err) {
    console.error('Email error:', err.message)
    return false
  }
}

// Notification Massata — email + WhatsApp
async function notifyMassata(userName, originalName, investorEmail) {
  const date = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })

  // Email
  const body = `Nouveau document KYC reçu sur Retbaa Circle\n\nInvestisseur : ${userName}\nFichier : ${originalName}\nDate : ${date}\nEmail : ${investorEmail || 'inconnu'}\n\nRetbaa Circle — Portail Investisseurs`
  await sendEmail('massata@retbaa.com', `[Retbaa Circle] KYC reçu — ${userName}`, body)

  // WhatsApp via OpenClaw gateway
  try {
    const { execSync } = await import('child_process')
    const msg = `🌿 *Retbaa Circle*\n\nNouveau document KYC reçu !\n\n👤 *${userName}*\n📄 ${originalName}\n🕐 ${date}\n\n_Connecte-toi sur circle.retbaa.com pour consulter._`
    execSync(`openclaw message send --channel whatsapp --to "+33767410184" --message "${msg.replace(/"/g, '\\"')}"`, {
      timeout: 15000, stdio: 'pipe'
    })
    console.log('✅ WhatsApp envoyé à Massata')
  } catch (err) {
    console.error('WhatsApp error:', err.message)
  }
}

// Confirmation à l'investisseur
async function confirmToInvestor(investorInfo, originalName) {
  if (!investorInfo?.email) return
  const date = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
  const body = `Bonjour ${investorInfo.name},\n\nNous avons bien reçu votre document KYC sur le portail Retbaa Circle.\n\nFichier reçu : ${originalName}\nDate de réception : ${date}\n\nVotre document sera examiné par l'équipe Retbaa dans les meilleurs délais. Vous serez informé(e) par email de la validation.\n\nPour toute question : massata@retbaa.com\n\nCordialement,\nMassata Niang\nRetbaa Circle`
  await sendEmail(investorInfo.email, `[Retbaa Circle] Document KYC bien reçu`, body)
}

// KYC upload route
app.post('/kyc', upload.single('document'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier reçu' })
  const userName = req.body.userName || 'Inconnu'
  console.log(`📄 KYC reçu de ${userName} : ${req.file.filename}`)

  // Backup sur AI-Drive (indépendant du VM)
  await backupToAIDrive(userName, req.file.path, req.file.originalname)

  // Lookup email investisseur
  const investorInfo = getInvestorEmail(userName)

  // Notifier Massata par email
  await notifyMassata(userName, req.file.originalname, investorInfo?.email)

  // Confirmer à l'investisseur
  await confirmToInvestor(investorInfo, req.file.originalname)

  res.json({ success: true, message: 'Document reçu avec succès' })
})

// Status check
app.get('/kyc/status', (req, res) => {
  const { userName } = req.query
  if (!userName) return res.json({ uploaded: false })
  const userDir = path.join(KYC_DIR, userName)
  const uploaded = fs.existsSync(userDir) && fs.readdirSync(userDir).length > 0
  res.json({ uploaded })
})

// Analytics tracker (prevent 502)
app.post('/track', (req, res) => res.json({ ok: true }))
app.get('/track', (req, res) => res.json({ ok: true }))

app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Retbaa Circle upload server on port ${PORT}`)
})
