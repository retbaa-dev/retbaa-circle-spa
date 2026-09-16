import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://lufozqtrwrmowzojxcoi.supabase.co'
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const PREVIEW_SECRET = process.env.VITE_PREVIEW_TOKEN || process.env.PREVIEW_TOKEN || 'retbaa-preview-2026'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

const ACCESS_RANK = { public: 0, nda: 1, approved: 2, founder: 3 }

function json(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(body))
}

function clampQuestion(value) {
  return String(value || '').trim().slice(0, 1200)
}

function inferIntent(question) {
  const q = question.toLowerCase()
  if (/cap table|actionnaire|statuts|closing|juridique|pacte/.test(q)) return 'legal'
  if (/projection|tri|rendement|valorisation|ebitda|chiffre|ca|marge|finance|bilan/.test(q)) return 'financial'
  if (/risque|faiblesse|menace|dépendance|dependance/.test(q)) return 'risk'
  if (/véhicule|vehicle|holding|spv|manufacture|ticket|investir/.test(q)) return 'vehicle'
  if (/marché|market|luxe|afrique|gcc|riyad|dubai|maison/.test(q)) return 'market'
  return 'general'
}

async function getAccessLevel(req, body) {
  const preview = body?.preview || null
  if (preview?.token && preview.token === PREVIEW_SECRET && preview.role === 'founder') return { level: 'founder', user: 'preview:founder' }

  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token || !SUPABASE_ANON_KEY) return { level: 'public', user: null }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  })

  const { data: userData } = await supabase.auth.getUser(token)
  const user = userData?.user
  if (!user) return { level: 'public', user: null }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, email')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role === 'founder' || user.email === 'massata@retbaa.com') return { level: 'founder', user: user.email }
  if (profile?.role === 'ops') return { level: 'approved', user: user.email }

  const { data: prospect } = await supabase
    .from('dataroom_prospects')
    .select('status')
    .eq('email', user.email)
    .maybeSingle()

  if (prospect?.status === 'approved') return { level: 'approved', user: user.email }
  if (prospect) return { level: 'nda', user: user.email }
  return { level: 'public', user: user.email }
}

function allowedTier(level) {
  if (level === 'founder') return 3
  if (level === 'approved') return 2
  if (level === 'nda') return 1
  return 0
}

async function loadContext(question, access) {
  const key = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY
  if (!key) return { docs: [], insights: [] }
  const supabase = createClient(SUPABASE_URL, key, { auth: { persistSession: false } })
  const tier = allowedTier(access.level)

  const [docsResult, insightsResult] = await Promise.all([
    tier > 0
      ? supabase.from('dataroom_docs').select('title, summary, category, vehicle, doc_tier, preview_only').lte('doc_tier', tier).limit(20)
      : Promise.resolve({ data: [] }),
    supabase.from('insights').select('title, content_type, tags, content_short, source_url, published_at').eq('status', 'published').limit(20),
  ])

  const q = question.toLowerCase()
  const score = (text) => {
    const t = String(text || '').toLowerCase()
    return q.split(/\s+/).filter(w => w.length > 3 && t.includes(w)).length
  }

  const docs = (docsResult.data || [])
    .map(d => ({ ...d, _score: score(`${d.title} ${d.summary} ${d.category} ${d.vehicle}`) }))
    .sort((a, b) => b._score - a._score)
    .slice(0, 6)

  const insights = (insightsResult.data || [])
    .map(i => ({ ...i, _score: score(`${i.title} ${i.content_short} ${(i.tags || []).join(' ')}`) }))
    .sort((a, b) => b._score - a._score)
    .slice(0, 6)

  return { docs, insights }
}

function refusalIfNeeded(intent, access) {
  if (access.level === 'public' && ['financial', 'legal', 'vehicle'].includes(intent)) {
    return "Je peux répondre au niveau public, mais les chiffres détaillés, documents juridiques et modalités d'investissement nécessitent au minimum un NDA signé."
  }
  if (access.level === 'nda' && ['financial', 'legal'].includes(intent)) {
    return "Je peux résumer les documents Tier 1, mais les états financiers détaillés, la cap table, le closing binder et les pièces juridiques complètes nécessitent une validation investisseur."
  }
  return null
}

function deterministicAnswer(question, access, context) {
  const intent = inferIntent(question)
  const refusal = refusalIfNeeded(intent, access)
  const sourceLines = []
  context.insights.slice(0, 3).forEach(i => sourceLines.push(`Insight — ${i.title}`))
  context.docs.slice(0, 3).forEach(d => sourceLines.push(`Dataroom T${d.doc_tier} — ${d.title}`))

  const base = refusal
    ? `${refusal}\n\nCe que je peux dire à ce niveau : Retbaa doit être lue comme une thèse de Cultural Luxury — marché du luxe résilient, différenciation par le rituel et les matières, et optionnalité géographique Afrique/GCC.`
    : `À votre niveau d'accès (${access.level}), la réponse doit s'appuyer sur les documents accessibles et distinguer faits, interprétation et risques. Sur cette question, les axes à examiner sont : marché, traction, véhicule d'investissement, risques d'exécution et preuves documentaires.`

  return {
    answer: `${base}\n\nSynthèse courte : ${question}\n\nJe recommande de vérifier les pièces listées ci-dessous avant toute conclusion définitive.`,
    sources: sourceLines,
    accessLevel: access.level,
    requiresHumanFollowup: ['financial', 'legal', 'risk'].includes(intent),
  }
}

async function llmAnswer(question, access, context) {
  if (!OPENAI_API_KEY) return deterministicAnswer(question, access, context)

  const system = `Tu es Kemia, advisor IA de Retbaa Circle. Réponds en français. Niveau d'accès: ${access.level}. Ne révèle jamais d'information au-delà du niveau autorisé. Cite toujours les sources fournies. Si la question demande des données absentes, dis-le. Ne donne pas de conseil financier réglementé; aide à comprendre les documents et les risques.`
  const contextText = JSON.stringify({ docs: context.docs, insights: context.insights }, null, 2).slice(0, 12000)

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.2,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: `Question: ${question}\n\nContexte autorisé:\n${contextText}` },
      ],
    }),
  })
  if (!resp.ok) return deterministicAnswer(question, access, context)
  const data = await resp.json()
  return {
    answer: data.choices?.[0]?.message?.content || deterministicAnswer(question, access, context).answer,
    sources: [
      ...context.insights.slice(0, 3).map(i => `Insight — ${i.title}`),
      ...context.docs.slice(0, 3).map(d => `Dataroom T${d.doc_tier} — ${d.title}`),
    ],
    accessLevel: access.level,
    requiresHumanFollowup: inferIntent(question) !== 'general',
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' })
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
    const question = clampQuestion(body.question)
    if (!question) return json(res, 400, { error: 'Question requise' })

    const access = await getAccessLevel(req, body)
    const context = await loadContext(question, access)
    const answer = await llmAnswer(question, access, context)

    return json(res, 200, answer)
  } catch (e) {
    return json(res, 500, { error: 'Erreur advisor', detail: e?.message || String(e) })
  }
}
