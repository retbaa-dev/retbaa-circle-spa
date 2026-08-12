// src/pages/PartnerSpacePage.jsx
// Espace Partenaire — timeline relation, onboarding, messagerie async
// Design Retbaa : navy #1A3A6B, or #C4A96A, fond #FAF7F2

import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const NAVY  = '#1A3A6B'
const GOLD  = '#C4A96A'
const BG    = '#FAF7F2'
const GRAY  = '#F0EDE8'

const EVENT_META = {
  first_contact: { icon: '📅', label: 'Premier contact'    },
  meeting:       { icon: '🤝', label: 'Réunion'            },
  doc_sent:      { icon: '📄', label: 'Document envoyé'    },
  doc_received:  { icon: '📨', label: 'Document reçu'      },
  proposal:      { icon: '💡', label: 'Proposition'        },
  followup:      { icon: '🔔', label: 'Relance'            },
  milestone:     { icon: '⭐', label: 'Étape clé'          },
  note:          { icon: '📝', label: 'Note'               },
}

function fmt(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

// ── Onboarding ───────────────────────────────────────────────────────────────
function OnboardingForm({ userEmail, userName, onDone }) {
  const [discoveryDate, setDiscoveryDate] = useState('')
  const [source, setSource]               = useState('')
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!discoveryDate) { setError('Veuillez renseigner une date.'); return }
    setLoading(true); setError(null)
    const { error: err } = await supabase.from('partner_relations').insert({
      partner_email:       userEmail,
      partner_name:        userName,
      relation_start_date: discoveryDate,
      notes:               source ? `Source : ${source}` : null,
      status:              'active',
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    onDone()
  }

  return (
    <div style={{ maxWidth: 520, margin: '60px auto', padding: '0 16px' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '40px 36px', boxShadow: '0 4px 24px rgba(26,58,107,0.10)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🤝</div>
          <h2 style={{ color: NAVY, fontSize: 22, fontWeight: 700, margin: 0 }}>Bienvenue dans votre espace partenaire</h2>
          <p style={{ color: '#6B7280', marginTop: 8, fontSize: 15 }}>Quelques informations pour démarrer votre relation avec Retbaa.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: NAVY, marginBottom: 6 }}>
              Quand avez-vous découvert Retbaa pour la première fois ?
            </label>
            <input
              type="date"
              value={discoveryDate}
              onChange={e => setDiscoveryDate(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 14px', border: `1.5px solid #D1D5DB`, borderRadius: 8, fontSize: 15, boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: NAVY, marginBottom: 6 }}>
              Comment avez-vous entendu parler de nous ?
            </label>
            <select
              value={source}
              onChange={e => setSource(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', border: `1.5px solid #D1D5DB`, borderRadius: 8, fontSize: 15, boxSizing: 'border-box', background: '#fff', outline: 'none' }}
            >
              <option value="">— Sélectionner —</option>
              <option value="Recommandation">Recommandation</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Business France">Business France</option>
              <option value="Presse">Presse</option>
              <option value="Événement">Événement</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          {error && <p style={{ color: '#DC2626', fontSize: 13, marginBottom: 16 }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '13px', background: NAVY, color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Enregistrement…' : 'Démarrer ma relation avec Retbaa'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Timeline ─────────────────────────────────────────────────────────────────
function Timeline({ events }) {
  if (!events.length) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🌱</div>
        <p style={{ margin: 0 }}>Votre parcours avec Retbaa commence ici.</p>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', paddingLeft: 40 }}>
      {/* ligne verticale */}
      <div style={{ position: 'absolute', left: 16, top: 0, bottom: 0, width: 2, background: `${NAVY}20` }} />

      {events.map((ev, i) => {
        const meta = EVENT_META[ev.event_type] || { icon: '📌', label: ev.event_type }
        return (
          <div key={ev.id} style={{ position: 'relative', marginBottom: 28 }}>
            {/* dot */}
            <div style={{
              position: 'absolute', left: -32, top: 4,
              width: 28, height: 28, borderRadius: '50%',
              background: '#fff', border: `2px solid ${NAVY}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, zIndex: 1,
            }}>
              {meta.icon}
            </div>

            <div style={{ background: '#fff', borderRadius: 12, padding: '14px 18px', boxShadow: '0 2px 8px rgba(26,58,107,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div>
                  <span style={{ fontSize: 12, color: GOLD, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{meta.label}</span>
                  <h4 style={{ margin: '2px 0 0', color: NAVY, fontSize: 15, fontWeight: 600 }}>{ev.title}</h4>
                  {ev.description && <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: 13 }}>{ev.description}</p>}
                </div>
                <span style={{ fontSize: 12, color: '#9CA3AF', whiteSpace: 'nowrap', marginTop: 2 }}>{fmt(ev.event_date)}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Messagerie ───────────────────────────────────────────────────────────────
function Messaging({ relationId, userEmail, userName, isAdmin }) {
  const [messages, setMessages]   = useState([])
  const [newMsg, setNewMsg]       = useState('')
  const [sending, setSending]     = useState(false)
  const bottomRef                 = useRef(null)

  const load = async () => {
    const { data } = await supabase
      .from('partner_messages')
      .select('*')
      .eq('relation_id', relationId)
      .order('created_at', { ascending: true })
    if (data) setMessages(data)
  }

  useEffect(() => { load() }, [relationId])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async (e) => {
    e.preventDefault()
    if (!newMsg.trim()) return
    setSending(true)
    await supabase.from('partner_messages').insert({
      relation_id:    relationId,
      sender_email:   userEmail,
      sender_name:    userName || userEmail,
      message:        newMsg.trim(),
      is_from_retbaa: isAdmin,
    })
    setNewMsg('')
    setSending(false)
    load()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 420 }}>
      {/* fil */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '40px 0', fontSize: 14 }}>Aucun message pour l'instant.</div>
        )}
        {messages.map(m => {
          const fromRetbaa = m.is_from_retbaa
          return (
            <div key={m.id} style={{ display: 'flex', justifyContent: fromRetbaa ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '72%',
                padding: '10px 14px',
                borderRadius: fromRetbaa ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: fromRetbaa ? NAVY : GRAY,
                color: fromRetbaa ? '#fff' : '#1F2937',
                fontSize: 14,
              }}>
                <p style={{ margin: 0 }}>{m.message}</p>
                <div style={{ marginTop: 4, fontSize: 11, opacity: 0.65, textAlign: 'right' }}>
                  {m.sender_name && !fromRetbaa && <span style={{ marginRight: 6 }}>{m.sender_name} · </span>}
                  {new Date(m.created_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* formulaire */}
      <form onSubmit={send} style={{ display: 'flex', gap: 8, padding: '12px 16px', borderTop: '1px solid #E5E7EB', background: '#fff' }}>
        <input
          value={newMsg}
          onChange={e => setNewMsg(e.target.value)}
          placeholder="Votre message…"
          style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #D1D5DB', borderRadius: 24, fontSize: 14, outline: 'none' }}
        />
        <button
          type="submit"
          disabled={sending || !newMsg.trim()}
          style={{ padding: '10px 20px', background: NAVY, color: '#fff', border: 'none', borderRadius: 24, fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: sending || !newMsg.trim() ? 0.6 : 1 }}
        >
          Envoyer
        </button>
      </form>
    </div>
  )
}

// ── Vue Admin ────────────────────────────────────────────────────────────────
function AdminView({ userEmail, userName }) {
  const [relations, setRelations] = useState([])
  const [selected, setSelected]   = useState(null)
  const [events, setEvents]       = useState([])
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [newEvent, setNewEvent]   = useState({ event_date: '', event_type: 'meeting', title: '', description: '' })
  const [saving, setSaving]       = useState(false)

  const loadRelations = async () => {
    const { data } = await supabase
      .from('partner_relations')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setRelations(data)
  }

  const loadEvents = async (relId) => {
    const { data } = await supabase
      .from('partner_events')
      .select('*')
      .eq('relation_id', relId)
      .order('event_date', { ascending: false })
    if (data) setEvents(data)
  }

  useEffect(() => { loadRelations() }, [])
  useEffect(() => { if (selected) loadEvents(selected.id) }, [selected])

  const addEvent = async (e) => {
    e.preventDefault()
    if (!newEvent.event_date || !newEvent.title) return
    setSaving(true)
    await supabase.from('partner_events').insert({ ...newEvent, relation_id: selected.id, created_by: 'massata' })
    setSaving(false)
    setShowAddEvent(false)
    setNewEvent({ event_date: '', event_type: 'meeting', title: '', description: '' })
    loadEvents(selected.id)
  }

  const STATUS_COLOR = { active: '#10B981', paused: '#F59E0B', closed: '#9CA3AF' }
  const STATUS_LABEL = { active: 'Actif', paused: 'En pause', closed: 'Fermé' }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selected ? '340px 1fr' : '1fr', gap: 24, maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      {/* liste relations */}
      <div>
        <h2 style={{ color: NAVY, fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Relations partenaires</h2>
        {relations.length === 0 && <p style={{ color: '#9CA3AF', fontSize: 14 }}>Aucune relation enregistrée.</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {relations.map(r => (
            <div
              key={r.id}
              onClick={() => setSelected(r)}
              style={{
                background: selected?.id === r.id ? `${NAVY}10` : '#fff',
                border: selected?.id === r.id ? `2px solid ${NAVY}` : '1.5px solid #E5E7EB',
                borderRadius: 10, padding: '14px 16px', cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, color: NAVY, fontSize: 14 }}>{r.partner_name || r.partner_email}</div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{r.institution_name || r.partner_email}</div>
                  {r.relation_start_date && <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Depuis {fmt(r.relation_start_date)}</div>}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: STATUS_COLOR[r.status] || '#9CA3AF', background: `${STATUS_COLOR[r.status] || '#9CA3AF'}15`, padding: '3px 10px', borderRadius: 20 }}>
                  {STATUS_LABEL[r.status] || r.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* détail relation sélectionnée */}
      {selected && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ color: NAVY, fontSize: 17, fontWeight: 700, margin: 0 }}>
              {selected.partner_name || selected.partner_email}
              <span style={{ fontSize: 13, fontWeight: 400, color: '#6B7280', marginLeft: 8 }}>{selected.partner_email}</span>
            </h3>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 20 }}>✕</button>
          </div>

          {/* tabs */}
          <AdminRelationTabs
            relation={selected}
            events={events}
            userEmail={userEmail}
            userName={userName}
            onEventAdded={() => loadEvents(selected.id)}
          />
        </div>
      )}
    </div>
  )
}

function AdminRelationTabs({ relation, events, userEmail, userName, onEventAdded }) {
  const [tab, setTab] = useState('timeline')
  const [showForm, setShowForm] = useState(false)
  const [ev, setEv] = useState({ event_date: '', event_type: 'meeting', title: '', description: '' })
  const [saving, setSaving] = useState(false)

  const addEvent = async (e) => {
    e.preventDefault()
    setSaving(true)
    await supabase.from('partner_events').insert({ ...ev, relation_id: relation.id, created_by: 'massata' })
    setSaving(false)
    setShowForm(false)
    setEv({ event_date: '', event_type: 'meeting', title: '', description: '' })
    onEventAdded()
  }

  const TAB_STYLE = (active) => ({
    padding: '8px 18px', border: 'none', background: active ? NAVY : 'transparent',
    color: active ? '#fff' : '#6B7280', borderRadius: 8, cursor: 'pointer', fontWeight: active ? 600 : 400, fontSize: 14,
  })

  return (
    <div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#F3F4F6', borderRadius: 10, padding: 4 }}>
        <button style={TAB_STYLE(tab === 'timeline')}  onClick={() => setTab('timeline')}>Timeline</button>
        <button style={TAB_STYLE(tab === 'messages')}  onClick={() => setTab('messages')}>Messagerie</button>
      </div>

      {tab === 'timeline' && (
        <div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h4 style={{ color: NAVY, margin: 0, fontWeight: 600 }}>Événements</h4>
              <button
                onClick={() => setShowForm(v => !v)}
                style={{ padding: '7px 16px', background: GOLD, color: NAVY, border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
              >
                + Ajouter un événement
              </button>
            </div>

            {showForm && (
              <form onSubmit={addEvent} style={{ background: BG, borderRadius: 10, padding: 16, marginBottom: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                  <input type="date" value={ev.event_date} onChange={e => setEv(p => ({...p, event_date: e.target.value}))} required
                    style={{ padding: '8px 12px', border: '1.5px solid #D1D5DB', borderRadius: 8, fontSize: 14, outline: 'none' }} />
                  <select value={ev.event_type} onChange={e => setEv(p => ({...p, event_type: e.target.value}))}
                    style={{ padding: '8px 12px', border: '1.5px solid #D1D5DB', borderRadius: 8, fontSize: 14, background: '#fff', outline: 'none' }}>
                    {Object.entries(EVENT_META).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
                  </select>
                </div>
                <input placeholder="Titre *" value={ev.title} onChange={e => setEv(p => ({...p, title: e.target.value}))} required
                  style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #D1D5DB', borderRadius: 8, fontSize: 14, marginBottom: 8, boxSizing: 'border-box', outline: 'none' }} />
                <textarea placeholder="Description (optionnel)" value={ev.description} onChange={e => setEv(p => ({...p, description: e.target.value}))}
                  rows={2}
                  style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #D1D5DB', borderRadius: 8, fontSize: 14, marginBottom: 10, boxSizing: 'border-box', resize: 'vertical', outline: 'none' }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="submit" disabled={saving} style={{ padding: '8px 20px', background: NAVY, color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                    {saving ? 'Enregistrement…' : 'Enregistrer'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} style={{ padding: '8px 16px', background: 'none', border: '1.5px solid #D1D5DB', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>
                    Annuler
                  </button>
                </div>
              </form>
            )}

            <Timeline events={events} />
          </div>
        </div>
      )}

      {tab === 'messages' && (
        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
          <Messaging relationId={relation.id} userEmail={userEmail} userName={userName} isAdmin={true} />
        </div>
      )}
    </div>
  )
}

// ── Vue Partenaire ────────────────────────────────────────────────────────────
function PartnerView({ relation, userEmail, userName }) {
  const [events, setEvents]   = useState([])
  const [tab, setTab]         = useState('timeline')

  useEffect(() => {
    supabase
      .from('partner_events')
      .select('*')
      .eq('relation_id', relation.id)
      .order('event_date', { ascending: true })
      .then(({ data }) => { if (data) setEvents(data) })
  }, [relation.id])

  const TAB_STYLE = (active) => ({
    padding: '8px 18px', border: 'none', background: active ? NAVY : 'transparent',
    color: active ? '#fff' : '#6B7280', borderRadius: 8, cursor: 'pointer', fontWeight: active ? 600 : 400, fontSize: 14,
  })

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: NAVY, fontSize: 22, fontWeight: 700, margin: 0 }}>Votre espace partenaire</h1>
        <p style={{ color: '#6B7280', margin: '4px 0 0', fontSize: 14 }}>
          Relation démarrée le {fmt(relation.relation_start_date)}
        </p>
      </div>

      {/* Prochaine étape */}
      {relation.next_step && (
        <div style={{ background: NAVY, borderRadius: 14, padding: '20px 24px', marginBottom: 24, color: '#fff' }}>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: GOLD, marginBottom: 6 }}>Prochaine étape</div>
          <div style={{ fontSize: 17, fontWeight: 600 }}>{relation.next_step}</div>
          {relation.next_step_date && (
            <div style={{ marginTop: 6, fontSize: 14, opacity: 0.8 }}>📅 {fmt(relation.next_step_date)}</div>
          )}
          {relation.notes && (
            <div style={{ marginTop: 8, fontSize: 13, opacity: 0.75 }}>{relation.notes}</div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#F3F4F6', borderRadius: 10, padding: 4 }}>
        <button style={TAB_STYLE(tab === 'timeline')} onClick={() => setTab('timeline')}>Timeline</button>
        <button style={TAB_STYLE(tab === 'messages')} onClick={() => setTab('messages')}>Messagerie</button>
      </div>

      {tab === 'timeline' && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 24 }}>
          <Timeline events={events} />
        </div>
      )}

      {tab === 'messages' && (
        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
          <Messaging relationId={relation.id} userEmail={userEmail} userName={userName} isAdmin={false} />
        </div>
      )}
    </div>
  )
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function PartnerSpacePage() {
  const [user, setUser]         = useState(null)
  const [relation, setRelation] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [isAdmin, setIsAdmin]   = useState(false)

  const ADMIN_EMAIL = 'massata@retbaa.com'

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (!user) { setLoading(false); return }

      const email = user.email
      setIsAdmin(email === ADMIN_EMAIL)

      // Charger la relation du partenaire (ou toutes si admin)
      if (email === ADMIN_EMAIL) {
        setLoading(false)
      } else {
        supabase
          .from('partner_relations')
          .select('*')
          .eq('partner_email', email)
          .maybeSingle()
          .then(({ data }) => {
            setRelation(data)
            setLoading(false)
          })
      }
    })
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ color: NAVY, fontSize: 15 }}>Chargement…</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: NAVY }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
        <h2>Connexion requise</h2>
        <p style={{ color: '#6B7280' }}>Veuillez vous connecter pour accéder à votre espace partenaire.</p>
      </div>
    )
  }

  if (isAdmin) {
    return (
      <div style={{ minHeight: '100vh', background: BG }}>
        <div style={{ background: NAVY, padding: '20px 24px' }}>
          <h1 style={{ color: '#fff', margin: 0, fontSize: 20, fontWeight: 700 }}>⚡ Admin — Espaces Partenaires</h1>
        </div>
        <AdminView userEmail={user.email} userName={user.user_metadata?.full_name || 'Massata'} />
      </div>
    )
  }

  // Partenaire sans relation → onboarding
  if (!relation || !relation.relation_start_date) {
    return (
      <div style={{ minHeight: '100vh', background: BG }}>
        <OnboardingForm
          userEmail={user.email}
          userName={user.user_metadata?.full_name || ''}
          onDone={() => {
            supabase
              .from('partner_relations')
              .select('*')
              .eq('partner_email', user.email)
              .maybeSingle()
              .then(({ data }) => setRelation(data))
          }}
        />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: BG }}>
      <PartnerView
        relation={relation}
        userEmail={user.email}
        userName={user.user_metadata?.full_name || ''}
      />
    </div>
  )
}
