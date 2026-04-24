// webhook.js — auto-deploy depuis GitHub
import express from 'express'
import crypto from 'crypto'
import { exec } from 'child_process'

const app = express()
const PORT = 3003
const SECRET = process.env.WEBHOOK_SECRET || 'retbaa-webhook-2026'
const DEPLOY_DIR = '/home/work/.openclaw/workspace/retbaa-circle'
const DEPLOY_DEST = '/var/www/retbaa-circle'

app.use(express.raw({ type: 'application/json' }))

app.post('/webhook/deploy', (req, res) => {
  // Vérifier la signature GitHub
  const sig = req.headers['x-hub-signature-256']
  if (!sig) return res.status(401).send('No signature')

  const expected = 'sha256=' + crypto.createHmac('sha256', SECRET).update(req.body).digest('hex')
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return res.status(401).send('Invalid signature')
  }

  const payload = JSON.parse(req.body)
  if (payload.ref !== 'refs/heads/main') return res.status(200).send('Not main branch, skipping')

  console.log('[webhook] Push reçu sur main — déploiement en cours...')
  res.status(200).send('Deploying...')

  const cmd = `cd ${DEPLOY_DIR} && git pull origin main && npm ci && npm run build && sudo cp -r dist/* ${DEPLOY_DEST}/`
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error('[webhook] Erreur déploiement:', stderr)
    } else {
      console.log('[webhook] ✅ Déploiement réussi')
    }
  })
})

app.get('/webhook/health', (req, res) => res.send('OK'))

app.listen(PORT, () => console.log(`[webhook] Serveur démarré sur port ${PORT}`))
