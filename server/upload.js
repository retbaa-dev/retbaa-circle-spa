// server/upload.js — KYC Upload Handler for Retbaa Circle
import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { createTransport } from 'nodemailer'

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

// Email notification to Massata
async function notifyMassata(userName, originalName) {
  try {
    const transporter = createTransport({
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail'
    })
    await transporter.sendMail({
      from: 'kycretbaa@investisseurs.retbaa.com',
      to: 'massata@retbaa.com',
      subject: `[Retbaa Circle] KYC reçu — ${userName}`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:auto">
          <h2 style="color:#1A3A6B">Nouveau document KYC reçu</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;color:#888">Investisseur</td><td style="padding:8px;font-weight:bold">${userName}</td></tr>
            <tr><td style="padding:8px;color:#888">Fichier</td><td style="padding:8px">${originalName}</td></tr>
            <tr><td style="padding:8px;color:#888">Date</td><td style="padding:8px">${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}</td></tr>
          </table>
          <p style="color:#888;font-size:12px;margin-top:24px">Retbaa Circle — Portail Investisseurs</p>
        </div>
      `
    })
    console.log(`✅ Email envoyé pour ${userName}`)
  } catch (err) {
    console.error('Email error:', err.message)
  }
}

// KYC upload route
app.post('/kyc', upload.single('document'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier reçu' })
  const userName = req.body.userName || 'Inconnu'
  console.log(`📄 KYC reçu de ${userName} : ${req.file.filename}`)

  // Backup sur AI-Drive (indépendant du VM)
  await backupToAIDrive(userName, req.file.path, req.file.originalname)

  // Notifier Massata par email
  await notifyMassata(userName, req.file.originalname)
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
