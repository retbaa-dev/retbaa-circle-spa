// pages/AdminPage.jsx — Panel de validation des investisseurs
import { Fragment, useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

// ── Helpers NDA meta ──────────────────────────────────────────────────────────
const JURISDICTION_LABEL = {
  cci:         'CCI — Paris (France et international)',
  ccja:        'CCJA — Abidjan (zone OHADA)',
  ohada_dakar: 'Arbitrage OHADA — Dakar (République du Sénégal)',
}

const ARTICLE_LABEL = {
  article1: 'Article 1 — Objet',
  article2: 'Article 2 — Obligations de confidentialité',
  article3: 'Article 3 — Exclusions',
  article4: 'Article 4 — Non-sollicitation',
  article5: "Article 5 — Absence d'engagement",
  article6: 'Article 6 — Durée',
  article7: 'Article 7 — Droit applicable et règlement des différends',
}

function hasNdaComments(ndaMeta) {
  if (!ndaMeta || !ndaMeta.comments) return false
  return Object.values(ndaMeta.comments).some(v => v && v.trim().length > 0)
}

function NdaDetail({ ndaMeta }) {
  if (!ndaMeta) return null
  const jurisdiction = ndaMeta.jurisdiction
  const comments = ndaMeta.comments || {}
  const filledComments = Object.entries(comments).filter(([, v]) => v && v.trim().length > 0)

  return (
    <div style={{
      marginTop: '12px',
      padding: '16px 20px',
      background: '#FFF8EE',
      border: '1px solid rgba(196,169,106,0.35)',
      borderRadius: '3px',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '12px',
    }}>
      {jurisdiction && (
        <div style={{ marginBottom: filledComments.length > 0 ? '12px' : 0 }}>
          <span style={{ fontWeight: 700, color: '#1A3A6B', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Juridiction choisie
          </span>
          <div style={{ marginTop: '4px', color: '#374151' }}>{JURISDICTION_LABEL[jurisdiction] || jurisdiction}</div>
        </div>
      )}
      {filledComments.length > 0 && (
        <div>
          <div style={{ fontWeight: 700, color: '#1A3A6B', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Commentaires
          </div>
          {filledComments.map(([key, val]) => (
            <div key={key} style={{ marginBottom: '10px' }}>
              <div style={{ fontWeight: 600, color: '#1A3A6B', marginBottom: '2px', fontSize: '11px' }}>
                {ARTICLE_LABEL[key] || key}
              </div>
              <div style={{ color: '#374151', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{val}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Badge statut prospects ────────────────────────────────────────────────────
const STATUS_BADGE = {
  pending:          { label: 'En attente',        bg: 'rgba(196,169,106,0.12)', color: '#7A5C00', border: 'rgba(196,169,106,0.4)' },
  access_requested: { label: 'Accès demandé',     bg: 'rgba(26,58,107,0.08)',  color: '#1A3A6B', border: 'rgba(26,58,107,0.3)' },
  approved:         { label: 'Approuvé',           bg: 'rgba(30,107,74,0.08)',  color: '#1E6B4A', border: 'rgba(30,107,74,0.3)' },
  rejected:         { label: 'Rejeté',             bg: 'rgba(186,26,26,0.08)', color: '#ba1a1a', border: 'rgba(186,26,26,0.3)' },
}

const CHANNEL_LABEL = { holding: 'Retbaa Holding', spv: 'SPV Les Adresses', manufacture: 'Manufacture' }
const AMOUNT_LABEL  = { lt_10k: '< 10k€', '10k_50k': '10–50k€', '50k_100k': '50–100k€', gt_100k: '≥ 100k€' }

// ── Score de chaleur ──────────────────────────────────────────────────────────
function heatScore(prospect) {
  let score = 0
  if (prospect.nda_signed_at) score += 30
  if (prospect.status === 'approved') score += 40
  if (prospect.doc_views_count > 0) score += 20
  if (prospect.doc_views_count > 3) score += 10
  return Math.min(score, 100)
}

function HeatBadge({ score }) {
  let bg, color, border
  if (score <= 30) {
    bg = 'rgba(107,114,128,0.1)'; color = '#6B7280'; border = 'rgba(107,114,128,0.3)'
  } else if (score <= 60) {
    bg = 'rgba(234,88,12,0.1)'; color = '#EA580C'; border = 'rgba(234,88,12,0.3)'
  } else {
    bg = 'rgba(30,107,74,0.1)'; color = '#1E6B4A'; border = 'rgba(30,107,74,0.3)'
  }
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '0.08em',
      color,
      background: bg,
      border: `1px solid ${border}`,
      whiteSpace: 'nowrap',
    }}>
      🔥 {score}
    </span>
  )
}

// ── Export CSV ────────────────────────────────────────────────────────────────
function exportCSV(prospects) {
  const headers = ['email', 'nom', 'statut', 'tier', 'institution', 'date_inscription', 'score_chaleur']
  const rows = prospects.map(p => {
    const score = heatScore(p)
    const nom = `${p.first_name || ''} ${p.last_name || ''}`.trim()
    const institution = p.investor_type === 'institutional' ? (p.institution_name || '') : ''
    return [
      p.email || '',
      nom,
      p.status || '',
      p.tier || '',
      institution,
      p.created_at ? new Date(p.created_at).toLocaleDateString('fr-FR') : '',
      score,
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
  })
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `prospects_${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ── NDAs signés (sous-onglet) ─────────────────────────────────────────────────
function NdasSignedTable() {
  const { data: ndas = [], isLoading } = useQuery({
    queryKey: ['ndas_signed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ndas')
        .select('*')
        .order('signed_at', { ascending: false })
      if (error) throw new Error(error.message)
      return data || []
    },
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) return <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Chargement des NDAs…</p>
  if (ndas.length === 0) return <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Aucun NDA signé.</p>

  return (
    <div style={{ overflowX: 'auto', marginTop: '16px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui, sans-serif' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid rgba(26,58,107,0.1)' }}>
            {['Email', 'Nom', 'Profil', 'Institution', 'Date signature', 'Version NDA'].map(h => (
              <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1A3A6B', whiteSpace: 'nowrap' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ndas.map((n, i) => (
            <tr key={n.id || i} style={{ borderBottom: '1px solid rgba(26,58,107,0.06)' }}>
              <td style={{ padding: '10px 12px', color: '#6B7280' }}>{n.email || '—'}</td>
              <td style={{ padding: '10px 12px', color: '#1A1C1C', fontWeight: 600 }}>{n.full_name || n.name || '—'}</td>
              <td style={{ padding: '10px 12px', color: '#374151' }}>{n.investor_type || n.profile || '—'}</td>
              <td style={{ padding: '10px 12px', color: '#374151' }}>{n.institution_name || n.institution || '—'}</td>
              <td style={{ padding: '10px 12px', color: '#6B7280', whiteSpace: 'nowrap' }}>
                {n.signed_at ? new Date(n.signed_at).toLocaleDateString('fr-FR') : '—'}
              </td>
              <td style={{ padding: '10px 12px', color: '#9CA3AF', fontSize: '12px' }}>{n.nda_version || n.version || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Onglet Prospects ──────────────────────────────────────────────────────────
function ProspectsTab({ docViewsMap }) {
  const queryClient = useQueryClient()
  const [msg, setMsg] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [subTab, setSubTab] = useState('list') // 'list' | 'ndas'

  const fetchProspects = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('dataroom_prospects')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setProspects(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchProspects() }, [])

  // Enrichir avec doc_views_count depuis la map
  const prospectsEnriched = prospects.map(p => ({
    ...p,
    doc_views_count: docViewsMap[p.email] || 0,
  }))

  const updateStatus = async (id, status) => {
    const patch = { status }
    if (status === 'approved') patch.approved_at = new Date().toISOString()
    const { error } = await supabase.from('dataroom_prospects').update(patch).eq('id', id)
    if (error) {
      setMsg('❌ Erreur : ' + error.message)
    } else {
      setMsg(status === 'approved' ? '✅ Prospect approuvé' : '❌ Prospect rejeté')
      queryClient.invalidateQueries({ queryKey: ['prospects'] })
    }
    setTimeout(() => setMsg(''), 3500)
  }

  if (loading) return <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Chargement des prospects…</p>

  const subTabStyle = (key) => ({
    padding: '6px 14px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    border: 'none',
    borderBottom: subTab === key ? '2px solid #C4A96A' : '2px solid transparent',
    color: subTab === key ? '#1A3A6B' : '#9CA3AF',
    background: 'transparent',
  })

  return (
    <section>
      {/* Header + CSV */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1A3A6B', margin: 0 }}>
          Prospects dataroom ({prospectsEnriched.length})
        </h2>
        <button
          onClick={() => exportCSV(prospectsEnriched)}
          style={{
            padding: '6px 14px',
            background: '#1A3A6B',
            color: '#C4A96A',
            border: 'none',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          ↓ Exporter CSV
        </button>
      </div>

      {/* Sous-onglets */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(26,58,107,0.1)', marginBottom: '20px' }}>
        <button style={subTabStyle('list')} onClick={() => setSubTab('list')}>Liste</button>
        <button style={subTabStyle('ndas')} onClick={() => setSubTab('ndas')}>NDAs signés</button>
      </div>

      {msg && (
        <div style={{ padding: '10px 14px', background: 'rgba(26,58,107,0.06)', fontSize: '13px', color: '#1A3A6B', marginBottom: '16px' }}>
          {msg}
        </div>
      )}

      {subTab === 'ndas' && <NdasSignedTable />}

      {subTab === 'list' && (
        prospectsEnriched.length === 0 ? (
          <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Aucun prospect pour le moment.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui, sans-serif' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(26,58,107,0.1)' }}>
                  {['Nom', 'Email', 'Canal', 'Montant', 'Statut', 'Chaleur', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1A3A6B', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prospectsEnriched.map(p => {
                  const badge       = STATUS_BADGE[p.status] || STATUS_BADGE.pending
                  const ndaMeta     = p.nda_meta || {}
                  const withComments= hasNdaComments(ndaMeta)
                  const isExpanded  = expandedId === p.id
                  const score       = heatScore(p)

                  return (
                    <Fragment key={p.id}>
                      <tr
                        style={{ borderBottom: isExpanded ? 'none' : '1px solid rgba(26,58,107,0.06)', cursor: 'pointer' }}
                        onClick={() => setExpandedId(isExpanded ? null : p.id)}
                      >
                        <td style={{ padding: '12px 12px', fontWeight: 600, color: '#1A1C1C', whiteSpace: 'nowrap' }}>
                          {p.first_name} {p.last_name}
                          {withComments && (
                            <span style={{
                              display: 'inline-block',
                              marginLeft: '8px',
                              fontSize: '9px',
                              fontWeight: 700,
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              color: '#7A4100',
                              background: 'rgba(234,179,8,0.15)',
                              border: '1px solid rgba(234,179,8,0.5)',
                              padding: '2px 6px',
                              verticalAlign: 'middle',
                            }}>
                              💬 Commentaires NDA
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '12px 12px', color: '#6B7280', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.email}
                        </td>
                        <td style={{ padding: '12px 12px', color: '#374151', whiteSpace: 'nowrap' }}>
                          {CHANNEL_LABEL[p.channel] || p.channel}
                        </td>
                        <td style={{ padding: '12px 12px', color: '#374151', whiteSpace: 'nowrap' }}>
                          {AMOUNT_LABEL[p.amount_range] || p.amount_range}
                        </td>
                        <td style={{ padding: '12px 12px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            fontSize: '10px',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: badge.color,
                            background: badge.bg,
                            border: `1px solid ${badge.border}`,
                            whiteSpace: 'nowrap',
                          }}>
                            {badge.label}
                          </span>
                        </td>
                        <td style={{ padding: '12px 12px' }}>
                          <HeatBadge score={score} />
                        </td>
                        <td style={{ padding: '12px 12px', color: '#9CA3AF', whiteSpace: 'nowrap', fontSize: '12px' }}>
                          {new Date(p.created_at).toLocaleDateString('fr-FR')}
                        </td>
                        <td style={{ padding: '12px 12px' }} onClick={e => e.stopPropagation()}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => updateStatus(p.id, 'approved')}
                              disabled={p.status === 'approved'}
                              style={{
                                padding: '5px 12px', background: p.status === 'approved' ? '#E5E7EB' : '#1E6B4A',
                                color: p.status === 'approved' ? '#9CA3AF' : '#fff',
                                border: 'none', cursor: p.status === 'approved' ? 'default' : 'pointer',
                                fontSize: '11px', fontWeight: 600, fontFamily: 'system-ui, sans-serif',
                              }}
                            >
                              Approuver
                            </button>
                            <button
                              onClick={() => updateStatus(p.id, 'rejected')}
                              disabled={p.status === 'rejected'}
                              style={{
                                padding: '5px 12px', background: p.status === 'rejected' ? '#E5E7EB' : '#ba1a1a',
                                color: p.status === 'rejected' ? '#9CA3AF' : '#fff',
                                border: 'none', cursor: p.status === 'rejected' ? 'default' : 'pointer',
                                fontSize: '11px', fontWeight: 600, fontFamily: 'system-ui, sans-serif',
                              }}
                            >
                              Rejeter
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (ndaMeta.jurisdiction || withComments) && (
                        <tr style={{ borderBottom: '1px solid rgba(26,58,107,0.06)' }}>
                          <td colSpan={8} style={{ padding: '0 12px 16px 12px' }}>
                            <NdaDetail ndaMeta={ndaMeta} />
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      )}
    </section>
  )
}

// ── Onglet Pipeline Kanban ────────────────────────────────────────────────────
function PipelineTab({ docViewsMap }) {
  const { data: prospects = [], isLoading } = useProspects()

  const { data: activeProfiles = [] } = useQuery({
    queryKey: ['user_profiles_active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('email, role')
        .eq('role', 'active')
      if (error) return []
      return data || []
    },
    staleTime: 5 * 60 * 1000,
  })

  const activeEmails = new Set(activeProfiles.map(u => u.email))

  const columns = [
    {
      key: 'inconnu',
      label: 'Inconnu',
      color: '#6B7280',
      bg: 'rgba(107,114,128,0.06)',
      filter: (p) => !p.nda_signed_at && p.status !== 'approved' && !activeEmails.has(p.email),
    },
    {
      key: 'prospect',
      label: 'Prospect',
      color: '#7A5C00',
      bg: 'rgba(196,169,106,0.08)',
      filter: (p) => p.nda_signed_at && p.status !== 'approved' && !activeEmails.has(p.email),
    },
    {
      key: 'qualifie',
      label: 'Qualifié',
      color: '#1E6B4A',
      bg: 'rgba(30,107,74,0.06)',
      filter: (p) => p.status === 'approved' && !activeEmails.has(p.email),
    },
    {
      key: 'investisseur',
      label: 'Investisseur',
      color: '#1A3A6B',
      bg: 'rgba(26,58,107,0.06)',
      filter: (p) => activeEmails.has(p.email),
    },
  ]

  if (isLoading) return <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Chargement du pipeline…</p>

  const prospectsEnriched = prospects.map(p => ({
    ...p,
    doc_views_count: docViewsMap[p.email] || 0,
  }))

  return (
    <section>
      <h2 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1A3A6B', marginBottom: '24px' }}>
        Pipeline investisseurs
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', alignItems: 'start' }}>
        {columns.map(col => {
          const cards = prospectsEnriched.filter(col.filter)
          return (
            <div key={col.key} style={{ background: col.bg, border: `1px solid ${col.color}22`, borderRadius: '4px', padding: '12px' }}>
              {/* Header colonne */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: col.color }}>
                  {col.label}
                </span>
                <span style={{
                  fontSize: '11px', fontWeight: 700,
                  background: col.color, color: '#fff',
                  borderRadius: '50%', width: '20px', height: '20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {cards.length}
                </span>
              </div>

              {/* Cartes */}
              {cards.length === 0 ? (
                <p style={{ color: '#9CA3AF', fontSize: '12px', fontStyle: 'italic', textAlign: 'center', padding: '8px 0' }}>—</p>
              ) : (
                cards.map(p => (
                  <div key={p.id} style={{
                    background: '#fff',
                    border: '1px solid rgba(26,58,107,0.1)',
                    borderRadius: '3px',
                    padding: '10px 12px',
                    marginBottom: '8px',
                    fontSize: '12px',
                    fontFamily: 'system-ui, sans-serif',
                  }}>
                    <div style={{ fontWeight: 700, color: '#1A1C1C', marginBottom: '2px' }}>
                      {p.first_name} {p.last_name}
                    </div>
                    <div style={{ color: '#6B7280', fontSize: '11px', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.email}
                    </div>
                    {p.investor_type === 'institutional' && p.institution_name && (
                      <div style={{ color: '#1A3A6B', fontSize: '11px', marginBottom: '4px' }}>
                        🏛 {p.institution_name}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                      {p.nda_signed_at && (
                        <span style={{ fontSize: '10px', color: '#1E6B4A', background: 'rgba(30,107,74,0.08)', padding: '2px 6px', border: '1px solid rgba(30,107,74,0.2)' }}>
                          NDA {new Date(p.nda_signed_at).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                      <span style={{ fontSize: '10px', color: '#9CA3AF' }}>
                        Inscrit {new Date(p.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ── Onglet Vues docs — Heatmap de lecture ─────────────────────────────────────
function DocViewsTab() {
  const [views, setViews] = useState([])
  const [loading, setLoading] = useState(true)
  const [subTab, setSubTab] = useState('by_doc') // 'by_doc' | 'by_prospect' | 'heatmap'

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('dataroom_doc_views')
        .select('doc_id, viewer_email, viewed_at, duration_seconds, dataroom_docs(title, doc_tier)')
        .order('viewed_at', { ascending: false })
      if (!error && data) setViews(data)
      setLoading(false)
    }
    load()
  }, [])

  const subTabStyle = (key) => ({
    padding: '6px 16px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    border: 'none',
    borderBottom: subTab === key ? '2px solid #C4A96A' : '2px solid transparent',
    color: subTab === key ? '#1A3A6B' : '#9CA3AF',
    background: 'transparent',
    fontFamily: 'system-ui, sans-serif',
  })

  // ── Agréger par doc ──────────────────────────────────────────────────────
  const byDoc = (() => {
    const map = {}
    for (const v of views) {
      const id = v.doc_id
      if (!map[id]) {
        map[id] = {
          doc_id: id,
          title: v.dataroom_docs?.title || id,
          tier: v.dataroom_docs?.doc_tier || '—',
          total_views: 0,
          unique_viewers: new Set(),
          total_duration: 0,
          last_access: null,
        }
      }
      map[id].total_views += 1
      if (v.viewer_email) map[id].unique_viewers.add(v.viewer_email)
      map[id].total_duration += v.duration_seconds || 0
      const d = v.viewed_at ? new Date(v.viewed_at) : null
      if (d && (!map[id].last_access || d > map[id].last_access)) map[id].last_access = d
    }
    return Object.values(map).map(d => ({
      ...d,
      unique_viewers: d.unique_viewers.size,
      avg_duration: d.total_views > 0 ? Math.round(d.total_duration / d.total_views) : 0,
    })).sort((a, b) => b.total_views - a.total_views)
  })()

  // ── Agréger par prospect ─────────────────────────────────────────────────
  const byProspect = (() => {
    const map = {}
    for (const v of views) {
      const email = v.viewer_email || 'inconnu'
      if (!map[email]) {
        map[email] = {
          email,
          docs_seen: new Set(),
          total_duration: 0,
          last_access: null,
        }
      }
      if (v.doc_id) map[email].docs_seen.add(v.doc_id)
      map[email].total_duration += v.duration_seconds || 0
      const d = v.viewed_at ? new Date(v.viewed_at) : null
      if (d && (!map[email].last_access || d > map[email].last_access)) map[email].last_access = d
    }
    return Object.values(map).map(p => {
      const nb_docs = p.docs_seen.size
      const total_minutes = p.total_duration / 60
      const score = Math.min(nb_docs * 10 + total_minutes * 2, 100)
      return {
        email: p.email,
        nb_docs,
        total_duration: p.total_duration,
        last_access: p.last_access,
        score: Math.round(score),
      }
    }).sort((a, b) => b.score - a.score)
  })()

  // ── Heatmap data (max 10×10) ─────────────────────────────────────────────
  const heatDocs = byDoc.slice(0, 10)
  const heatProspects = byProspect.slice(0, 10)
  // Map: email → doc_id → total_duration_seconds
  const heatMap = (() => {
    const m = {}
    for (const v of views) {
      const email = v.viewer_email || 'inconnu'
      const docId = v.doc_id
      if (!m[email]) m[email] = {}
      m[email][docId] = (m[email][docId] || 0) + (v.duration_seconds || 0)
    }
    return m
  })()

  const cellColor = (seconds) => {
    if (!seconds) return '#FFFFFF'
    if (seconds < 60) return '#FFF9C4'   // jaune pâle
    if (seconds < 300) return '#C4A96A'  // or
    return '#1A3A6B'                      // navy
  }
  const cellTextColor = (seconds) => {
    if (!seconds) return '#D1D5DB'
    if (seconds < 60) return '#7A5C00'
    if (seconds < 300) return '#4A3500'
    return '#FFFFFF'
  }

  const fmtDuration = (seconds) => {
    if (!seconds) return '—'
    if (seconds < 60) return `${seconds}s`
    return `${Math.floor(seconds / 60)}min`
  }

  const engagementBadge = (score) => {
    let bg, color, border
    if (score <= 30) { bg = 'rgba(107,114,128,0.1)'; color = '#6B7280'; border = 'rgba(107,114,128,0.3)' }
    else if (score <= 60) { bg = 'rgba(234,88,12,0.1)'; color = '#EA580C'; border = 'rgba(234,88,12,0.3)' }
    else { bg = 'rgba(30,107,74,0.1)'; color = '#1E6B4A'; border = 'rgba(30,107,74,0.3)' }
    return (
      <span style={{
        display: 'inline-block', padding: '2px 8px',
        fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
        color, background: bg, border: `1px solid ${border}`, whiteSpace: 'nowrap',
      }}>
        ⚡ {score}
      </span>
    )
  }

  const thStyle = {
    padding: '10px 12px', textAlign: 'left', fontSize: '10px',
    fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
    color: '#1A3A6B', whiteSpace: 'nowrap',
  }
  const tdStyle = { padding: '10px 12px', fontSize: '13px', color: '#374151' }

  if (loading) return <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Chargement des vues…</p>

  return (
    <section style={{ fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1A3A6B', marginBottom: '20px' }}>
        Tracking lecture documents
      </h2>

      {/* Sous-onglets */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(26,58,107,0.1)', marginBottom: '24px' }}>
        <button style={subTabStyle('by_doc')} onClick={() => setSubTab('by_doc')}>Par document</button>
        <button style={subTabStyle('by_prospect')} onClick={() => setSubTab('by_prospect')}>Par prospect</button>
        <button style={subTabStyle('heatmap')} onClick={() => setSubTab('heatmap')}>Heatmap visuelle</button>
      </div>

      {/* ── Vue 1 : Par document ── */}
      {subTab === 'by_doc' && (
        byDoc.length === 0 ? (
          <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Aucune vue enregistrée.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(26,58,107,0.1)' }}>
                  {['Titre doc', 'Tier', 'Nb vues total', 'Lecteurs uniques', 'Durée moy.', 'Dernier accès'].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {byDoc.map((d, i) => (
                  <tr key={d.doc_id || i} style={{ borderBottom: '1px solid rgba(26,58,107,0.06)' }}>
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#1A1C1C', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {d.title}
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        display: 'inline-block', padding: '2px 8px',
                        fontSize: '10px', fontWeight: 700,
                        background: 'rgba(26,58,107,0.07)',
                        color: '#1A3A6B', border: '1px solid rgba(26,58,107,0.2)',
                      }}>
                        {d.tier}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 700, color: '#1A3A6B' }}>{d.total_views}</td>
                    <td style={tdStyle}>{d.unique_viewers}</td>
                    <td style={tdStyle}>{fmtDuration(d.avg_duration)}</td>
                    <td style={{ ...tdStyle, color: '#9CA3AF', fontSize: '12px' }}>
                      {d.last_access ? d.last_access.toLocaleDateString('fr-FR') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* ── Vue 2 : Par prospect ── */}
      {subTab === 'by_prospect' && (
        byProspect.length === 0 ? (
          <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Aucune vue enregistrée.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(26,58,107,0.1)' }}>
                  {['Email', 'Nb docs vus', 'Temps total', 'Dernier accès', 'Score engagement'].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {byProspect.map((p, i) => (
                  <tr key={p.email || i} style={{ borderBottom: '1px solid rgba(26,58,107,0.06)' }}>
                    <td style={{ ...tdStyle, color: '#1A1C1C', fontWeight: 600, maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.email}
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 700, color: '#1A3A6B' }}>{p.nb_docs}</td>
                    <td style={tdStyle}>{fmtDuration(p.total_duration)}</td>
                    <td style={{ ...tdStyle, color: '#9CA3AF', fontSize: '12px' }}>
                      {p.last_access ? p.last_access.toLocaleDateString('fr-FR') : '—'}
                    </td>
                    <td style={tdStyle}>{engagementBadge(p.score)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* ── Vue 3 : Heatmap visuelle ── */}
      {subTab === 'heatmap' && (
        heatDocs.length === 0 || heatProspects.length === 0 ? (
          <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Pas assez de données pour afficher la heatmap.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            {/* Légende */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {[
                { color: '#FFFFFF', border: '#D1D5DB', label: 'Non vu' },
                { color: '#FFF9C4', border: '#C4A96A', label: '< 1 min' },
                { color: '#C4A96A', border: '#7A5C00', label: '1–5 min' },
                { color: '#1A3A6B', border: '#0D2347', label: '> 5 min' },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#6B7280' }}>
                  <span style={{
                    display: 'inline-block', width: '14px', height: '14px',
                    background: l.color, border: `1px solid ${l.border}`,
                  }} />
                  {l.label}
                </div>
              ))}
            </div>

            <table style={{ borderCollapse: 'collapse', fontSize: '11px', fontFamily: 'system-ui, sans-serif' }}>
              <thead>
                <tr>
                  {/* Coin vide */}
                  <th style={{ padding: '6px 8px', minWidth: '140px', textAlign: 'left', color: '#9CA3AF', fontSize: '10px', fontWeight: 600 }}>
                    Email ↓ / Doc →
                  </th>
                  {heatDocs.map(d => (
                    <th key={d.doc_id} style={{
                      padding: '6px 4px', textAlign: 'center',
                      fontSize: '10px', fontWeight: 700, color: '#1A3A6B',
                      letterSpacing: '0.05em', maxWidth: '80px',
                      writingMode: 'vertical-lr', transform: 'rotate(180deg)',
                      whiteSpace: 'nowrap', height: '80px',
                    }}>
                      {(d.title || d.doc_id).slice(0, 15)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatProspects.map((p, ri) => (
                  <tr key={p.email} style={{ borderTop: '1px solid rgba(26,58,107,0.06)' }}>
                    <td style={{
                      padding: '5px 8px', fontSize: '11px', color: '#374151',
                      maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {p.email.length > 22 ? p.email.slice(0, 22) + '…' : p.email}
                    </td>
                    {heatDocs.map(d => {
                      const secs = heatMap[p.email]?.[d.doc_id] || 0
                      const bg = cellColor(secs)
                      const tc = cellTextColor(secs)
                      return (
                        <td key={d.doc_id} style={{
                          padding: 0, textAlign: 'center',
                          background: bg,
                          border: '1px solid rgba(26,58,107,0.08)',
                          width: '40px', height: '32px',
                          fontSize: '9px', color: tc, fontWeight: 600,
                        }}
                          title={secs ? `${p.email} — ${d.title}: ${fmtDuration(secs)}` : 'Non vu'}
                        >
                          {secs ? fmtDuration(secs) : ''}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </section>
  )
}

// ── AdminPage ─────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { session, isLoaded, isSignedIn, role } = useAuth()
  const [activeTab, setActiveTab]   = useState('pipeline')
  const [pendingUsers, setPendingUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [actionMsg, setActionMsg]   = useState('')

  // Admin = role 'founder' uniquement — source de vérité : user_profiles Supabase
  const isAdmin = isLoaded && isSignedIn && role === 'founder'

  // Précharger doc_views_count par email
  const { data: docViewsMap = {} } = useQuery({
    queryKey: ['doc_views_count_by_email'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dataroom_doc_views')
        .select('viewer_email')
      if (error || !data) return {}
      const map = {}
      for (const row of data) {
        if (row.viewer_email) {
          map[row.viewer_email] = (map[row.viewer_email] || 0) + 1
        }
      }
      return map
    },
    staleTime: 5 * 60 * 1000,
    enabled: isAdmin,
  })

  // Helper : requête admin avec access_token Supabase
  const adminFetch = async (url, options = {}) => {
    const token = session?.access_token
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(options.headers || {}),
      },
    })
  }

  useEffect(() => {
    if (isAdmin) fetchPending()
  }, [isAdmin])

  const fetchPending = async () => {
    setLoadingUsers(true)
    try {
      const res = await adminFetch('/api/admin/users/pending')
      const data = await res.json()
      setPendingUsers(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingUsers(false)
    }
  }

  const approveUser = async (userId) => {
    try {
      const res = await adminFetch(`/api/admin/users/${userId}/approve`, {
        method: 'POST',
        body: JSON.stringify({}),
      })
      const data = await res.json()
      if (data.ok) {
        setActionMsg('✅ Accès accordé')
        fetchPending()
      }
    } catch {
      setActionMsg('❌ Erreur')
    }
  }

  const suspendUser = async (userId) => {
    try {
      const res = await adminFetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        body: JSON.stringify({}),
      })
      const data = await res.json()
      if (data.ok) {
        setActionMsg('⏸️ Suspendu')
        fetchPending()
      }
    } catch {
      setActionMsg('❌ Erreur')
    }
  }

  const sendInvite = async (investorKey) => {
    try {
      const res = await adminFetch('/api/admin/invite', {
        method: 'POST',
        body: JSON.stringify({ investorKey }),
      })
      const data = await res.json()
      if (data.inviteUrl) {
        setActionMsg(`✅ Invitation créée : ${data.inviteUrl}`)
      }
    } catch {
      setActionMsg('❌ Erreur invitation')
    }
  }

  if (!isLoaded) return <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif' }}>Chargement…</div>
  if (!isAdmin) return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', color: '#ba1a1a' }}>
      Accès refusé — réservé à l'administration Retbaa.
    </div>
  )

  // ── Tab nav styles ──────────────────────────────────────────────────────────
  const tabStyle = (key) => ({
    padding: '10px 20px',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    border: 'none',
    borderBottom: activeTab === key ? '2px solid #C4A96A' : '2px solid transparent',
    color: activeTab === key ? '#1A3A6B' : '#9CA3AF',
    background: 'transparent',
    transition: 'color 0.15s',
  })

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', maxWidth: '1100px' }}>
      <h1 style={{ fontFamily: 'Newsreader, serif', fontSize: '28px', color: '#1A3A6B', marginBottom: '8px', fontWeight: 300, fontStyle: 'italic' }}>
        Panel Admin
      </h1>
      <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '32px' }}>
        Gestion des accès investisseurs Retbaa Circle
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid rgba(26,58,107,0.1)', marginBottom: '36px' }}>
        <button style={tabStyle('pipeline')}  onClick={() => setActiveTab('pipeline')}>Pipeline</button>
        <button style={tabStyle('users')}     onClick={() => setActiveTab('users')}>Investisseurs</button>
        <button style={tabStyle('prospects')} onClick={() => setActiveTab('prospects')}>Prospects</button>
        <button style={tabStyle('invites')}   onClick={() => setActiveTab('invites')}>Invitations</button>
        <button style={tabStyle('doc_views')} onClick={() => setActiveTab('doc_views')}>Vues docs</button>
      </div>

      {actionMsg && (
        <div style={{ padding: '12px 16px', background: 'rgba(26,58,107,0.06)', marginBottom: '24px', fontSize: '13px', color: '#1A3A6B' }}>
          {actionMsg}
        </div>
      )}

      {/* ── Tab: Pipeline ── */}
      {activeTab === 'pipeline' && <PipelineTab docViewsMap={docViewsMap} />}

      {/* ── Tab: Investisseurs ── */}
      {activeTab === 'users' && (
        <section>
          <h2 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1A3A6B', marginBottom: '16px' }}>
            Comptes en attente de validation {loadingUsers ? '…' : `(${pendingUsers.length})`}
          </h2>
          {pendingUsers.length === 0 ? (
            <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Aucun compte en attente.</p>
          ) : (
            pendingUsers.map(u => (
              <div key={u.id} style={{ padding: '16px', border: '1px solid #E5E7EB', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#1A1C1C' }}>{u.firstName} {u.lastName}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>{u.email} · {u.investorKey || 'inconnu'}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => approveUser(u.id)} style={{ padding: '6px 14px', background: '#1E6B4A', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                    Approuver
                  </button>
                  <button onClick={() => suspendUser(u.id)} style={{ padding: '6px 14px', background: '#ba1a1a', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                    Suspendre
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {/* ── Tab: Prospects ── */}
      {activeTab === 'prospects' && <ProspectsTab docViewsMap={docViewsMap} />}

      {/* ── Tab: Vues docs ── */}
      {activeTab === 'doc_views' && <DocViewsTab />}

      {/* ── Tab: Invitations ── */}
      {activeTab === 'invites' && (
        <section>
          <h2 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1A3A6B', marginBottom: '16px' }}>
            Créer une invitation
          </h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['barthelemy', 'pape', 'cathy', 'raphael'].map(key => (
              <button key={key} onClick={() => sendInvite(key)} style={{
                padding: '8px 16px', background: '#1A3A6B', color: '#fff',
                border: 'none', cursor: 'pointer',
                fontFamily: 'system-ui, sans-serif', fontSize: '12px', fontWeight: 600,
              }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
