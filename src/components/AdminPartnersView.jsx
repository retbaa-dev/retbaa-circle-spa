// components/AdminPartnersView.jsx — Pipeline Partenaires (Kanban admin)
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// ── Constantes ────────────────────────────────────────────────────────────────

const INSTITUTION_TYPE_COLORS = {
  sovereign_fund:      { bg: '#1A3A6B', color: '#fff',     label: 'Fonds souverain' },
  private_equity:      { bg: '#C4A96A', color: '#1A1C1C',  label: 'Private equity' },
  impact_fund:         { bg: '#4CAF50', color: '#fff',     label: 'Fonds impact' },
  development_agency:  { bg: '#4FC3F7', color: '#1A1C1C',  label: 'Agence développement' },
  bank:                { bg: '#9CA3AF', color: '#fff',     label: 'Banque' },
  export_agency:       { bg: '#009688', color: '#fff',     label: 'Agence export' },
  public_institution:  { bg: '#7C3AED', color: '#fff',     label: 'Institution publique' },
}

const COUNTRY_FLAG = {
  SN: '🇸🇳',
  FR: '🇫🇷',
}

const EVENT_TYPES = [
  'meeting', 'call', 'email', 'document_sent', 'document_received',
  'negotiation', 'site_visit', 'other',
]

const EVENT_TYPE_LABELS = {
  meeting:             'Réunion',
  call:                'Appel',
  email:               'Email',
  document_sent:       'Document envoyé',
  document_received:   'Document reçu',
  negotiation:         'Négociation',
  site_visit:          'Visite terrain',
  other:               'Autre',
}

const INSTITUTION_TYPE_OPTIONS = Object.entries(INSTITUTION_TYPE_COLORS).map(([value, { label }]) => ({ value, label }))

const COLUMNS = [
  { key: 'active', label: '🟢 Active',     bg: 'rgba(76,175,80,0.05)',  border: 'rgba(76,175,80,0.2)' },
  { key: 'paused', label: '🟡 En attente', bg: 'rgba(196,169,106,0.06)', border: 'rgba(196,169,106,0.3)' },
  { key: 'closed', label: '⚫ Clôturé',    bg: 'rgba(107,114,128,0.05)', border: 'rgba(107,114,128,0.2)' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (isNaN(d)) return null
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function getFlag(country) {
  if (!country) return '🌍'
  const upper = country.toUpperCase()
  return COUNTRY_FLAG[upper] || '🌍'
}

// ── Badge institution_type ────────────────────────────────────────────────────

function InstitutionBadge({ type }) {
  const cfg = INSTITUTION_TYPE_COLORS[type]
  if (!cfg) return null
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '0.06em',
      background: cfg.bg,
      color: cfg.color,
      borderRadius: '2px',
      whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  )
}

// ── Mini modal ajout événement ────────────────────────────────────────────────

function EventModal({ relation, onClose, onSaved }) {
  const [form, setForm] = useState({
    event_type: 'meeting',
    title: '',
    event_date: todayISO(),
    description: '',
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { setErr('Titre requis'); return }
    setSaving(true)
    const { error } = await supabase.from('partner_events').insert({
      partner_relation_id: relation.id,
      partner_email: relation.partner_email,
      event_type: form.event_type,
      title: form.title.trim(),
      event_date: form.event_date,
      description: form.description.trim() || null,
      created_at: new Date().toISOString(),
    })
    setSaving(false)
    if (error) { setErr(error.message); return }
    onSaved()
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(26,28,28,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: '4px', padding: '28px 32px',
        minWidth: '360px', maxWidth: '440px', width: '100%',
        boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
        fontFamily: 'system-ui, sans-serif',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: '#1A3A6B', marginBottom: '4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Ajouter un événement
        </div>
        <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '20px' }}>
          {relation.partner_name} · {relation.institution_name}
        </div>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Type d'événement</label>
          <select
            value={form.event_type}
            onChange={e => setForm(f => ({ ...f, event_type: e.target.value }))}
            style={inputStyle}
          >
            {EVENT_TYPES.map(t => <option key={t} value={t}>{EVENT_TYPE_LABELS[t]}</option>)}
          </select>

          <label style={labelStyle}>Titre *</label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Ex: Appel de présentation"
            style={inputStyle}
          />

          <label style={labelStyle}>Date</label>
          <input
            type="date"
            value={form.event_date}
            onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))}
            style={inputStyle}
          />

          <label style={labelStyle}>Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={3}
            placeholder="Notes optionnelles…"
            style={{ ...inputStyle, resize: 'vertical', minHeight: '64px' }}
          />

          {err && <div style={{ color: '#ba1a1a', fontSize: '12px', marginBottom: '12px' }}>{err}</div>}

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" onClick={onClose} style={btnSecondaryStyle}>Annuler</button>
            <button type="submit" disabled={saving} style={btnPrimaryStyle}>
              {saving ? 'Enregistrement…' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Modal nouvelle relation ────────────────────────────────────────────────────

function NewRelationModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    partner_email: '',
    partner_name: '',
    institution_name: '',
    institution_type: 'bank',
    country: '',
    relation_start_date: todayISO(),
    notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.partner_email.trim() || !form.partner_name.trim()) {
      setErr('Email et nom partenaire requis')
      return
    }
    setSaving(true)
    const { error } = await supabase.from('partner_relations').insert({
      partner_email: form.partner_email.trim(),
      partner_name: form.partner_name.trim(),
      institution_name: form.institution_name.trim() || null,
      institution_type: form.institution_type || null,
      country: form.country.trim().toUpperCase() || null,
      relation_start_date: form.relation_start_date || null,
      notes: form.notes.trim() || null,
      status: 'active',
      created_at: new Date().toISOString(),
    })
    setSaving(false)
    if (error) { setErr(error.message); return }
    onSaved()
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(26,28,28,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: '4px', padding: '28px 32px',
        minWidth: '380px', maxWidth: '480px', width: '100%',
        boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
        fontFamily: 'system-ui, sans-serif',
        maxHeight: '90vh', overflowY: 'auto',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: '#1A3A6B', marginBottom: '20px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Nouvelle relation partenaire
        </div>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Email partenaire *</label>
          <input type="email" value={form.partner_email} onChange={e => setForm(f => ({ ...f, partner_email: e.target.value }))} placeholder="contact@institution.com" style={inputStyle} />

          <label style={labelStyle}>Nom partenaire *</label>
          <input type="text" value={form.partner_name} onChange={e => setForm(f => ({ ...f, partner_name: e.target.value }))} placeholder="Jean Dupont" style={inputStyle} />

          <label style={labelStyle}>Institution</label>
          <input type="text" value={form.institution_name} onChange={e => setForm(f => ({ ...f, institution_name: e.target.value }))} placeholder="Nom de l'institution" style={inputStyle} />

          <label style={labelStyle}>Type d'institution</label>
          <select value={form.institution_type} onChange={e => setForm(f => ({ ...f, institution_type: e.target.value }))} style={inputStyle}>
            {INSTITUTION_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <label style={labelStyle}>Pays (code ISO : SN, FR…)</label>
          <input type="text" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} placeholder="SN" maxLength={3} style={inputStyle} />

          <label style={labelStyle}>Date début relation</label>
          <input type="date" value={form.relation_start_date} onChange={e => setForm(f => ({ ...f, relation_start_date: e.target.value }))} style={inputStyle} />

          <label style={labelStyle}>Notes</label>
          <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} placeholder="Contexte, remarques…" style={{ ...inputStyle, resize: 'vertical', minHeight: '64px' }} />

          {err && <div style={{ color: '#ba1a1a', fontSize: '12px', marginBottom: '12px' }}>{err}</div>}

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" onClick={onClose} style={btnSecondaryStyle}>Annuler</button>
            <button type="submit" disabled={saving} style={btnPrimaryStyle}>
              {saving ? 'Enregistrement…' : 'Créer la relation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Carte relation ────────────────────────────────────────────────────────────

function RelationCard({ relation, onEventAdded }) {
  const navigate = useNavigate()
  const [showEventModal, setShowEventModal] = useState(false)

  const nextEvent = relation._nextEvent
  const unreadCount = relation._unreadCount || 0

  return (
    <>
      <div style={{
        background: '#fff',
        border: '1px solid rgba(26,58,107,0.1)',
        borderRadius: '4px',
        padding: '14px 16px',
        marginBottom: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '13px',
      }}>
        {/* Ligne 1 : nom + flag + unread badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '4px' }}>
          <div style={{ fontWeight: 700, color: '#1A1C1C', fontSize: '13px', lineHeight: 1.3 }}>
            {relation.partner_name}
            {relation.institution_name && (
              <span style={{ fontWeight: 700, color: '#1A3A6B' }}> · {relation.institution_name}</span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, marginLeft: '8px' }}>
            <span style={{ fontSize: '16px' }}>{getFlag(relation.country)}</span>
            {unreadCount > 0 && (
              <span style={{
                background: '#ba1a1a', color: '#fff', borderRadius: '50%',
                width: '18px', height: '18px', fontSize: '10px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* Ligne 2 : badge institution_type */}
        {relation.institution_type && (
          <div style={{ marginBottom: '8px' }}>
            <InstitutionBadge type={relation.institution_type} />
          </div>
        )}

        {/* Ligne 3 : date début */}
        {relation.relation_start_date && (
          <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '6px' }}>
            Depuis le {formatDate(relation.relation_start_date)}
          </div>
        )}

        {/* Ligne 4 : prochaine étape */}
        {nextEvent && (
          <div style={{
            background: 'rgba(251,191,36,0.12)',
            border: '1px solid rgba(251,191,36,0.35)',
            borderRadius: '3px',
            padding: '6px 10px',
            fontSize: '11px',
            color: '#7A4100',
            marginBottom: '10px',
          }}>
            <span style={{ fontWeight: 700 }}>→ {nextEvent.title}</span>
            {nextEvent.event_date && (
              <span style={{ color: '#9A6300', marginLeft: '6px' }}>{formatDate(nextEvent.event_date)}</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
          <button
            onClick={() => navigate('/partner?email=' + encodeURIComponent(relation.partner_email))}
            style={{
              flex: 1, padding: '6px 10px',
              background: '#1A3A6B', color: '#C4A96A',
              border: 'none', cursor: 'pointer',
              fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.05em', fontFamily: 'system-ui, sans-serif',
              borderRadius: '2px',
            }}
          >
            Ouvrir →
          </button>
          <button
            onClick={() => setShowEventModal(true)}
            style={{
              padding: '6px 12px',
              background: 'rgba(196,169,106,0.15)',
              color: '#7A5C00',
              border: '1px solid rgba(196,169,106,0.4)',
              cursor: 'pointer',
              fontSize: '14px', fontWeight: 700,
              fontFamily: 'system-ui, sans-serif',
              borderRadius: '2px',
            }}
            title="Ajouter un événement"
          >
            +
          </button>
        </div>
      </div>

      {showEventModal && (
        <EventModal
          relation={relation}
          onClose={() => setShowEventModal(false)}
          onSaved={onEventAdded}
        />
      )}
    </>
  )
}

// ── Styles partagés ───────────────────────────────────────────────────────────

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  padding: '8px 10px', border: '1px solid rgba(26,58,107,0.2)',
  borderRadius: '2px', fontSize: '13px', fontFamily: 'system-ui, sans-serif',
  color: '#1A1C1C', background: '#FAFAFA', marginBottom: '12px',
  outline: 'none',
}

const labelStyle = {
  display: 'block', fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase',
  color: '#1A3A6B', marginBottom: '4px',
}

const btnPrimaryStyle = {
  padding: '8px 18px', background: '#1A3A6B', color: '#C4A96A',
  border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700,
  fontFamily: 'system-ui, sans-serif', borderRadius: '2px',
}

const btnSecondaryStyle = {
  padding: '8px 18px', background: 'transparent', color: '#6B7280',
  border: '1px solid #D1D5DB', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
  fontFamily: 'system-ui, sans-serif', borderRadius: '2px',
}

// ── AdminPartnersView ─────────────────────────────────────────────────────────

export default function AdminPartnersView() {
  const [relations, setRelations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showNewModal, setShowNewModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = useCallback(() => setRefreshKey(k => k + 1), [])

  useEffect(() => {
    const load = async () => {
      setLoading(true)

      // 1. Charger toutes les relations
      const { data: rels, error: relErr } = await supabase
        .from('partner_relations')
        .select('*')
        .order('relation_start_date', { ascending: false })

      if (relErr || !rels) {
        setLoading(false)
        return
      }

      // 2. Pour chaque relation : compter messages non lus + prochain événement
      const enriched = await Promise.all(rels.map(async (rel) => {
        // Messages non lus
        const { count: unreadCount } = await supabase
          .from('partner_messages')
          .select('id', { count: 'exact', head: true })
          .eq('partner_email', rel.partner_email)
          .is('read_at', null)
          .eq('is_from_retbaa', false)

        // Dernier / prochain événement (futur en premier, sinon dernier)
        const today = new Date().toISOString().slice(0, 10)
        const { data: futureEvents } = await supabase
          .from('partner_events')
          .select('title, event_date, event_type')
          .eq('partner_email', rel.partner_email)
          .gte('event_date', today)
          .order('event_date', { ascending: true })
          .limit(1)

        let nextEvent = futureEvents?.[0] || null

        if (!nextEvent) {
          const { data: pastEvents } = await supabase
            .from('partner_events')
            .select('title, event_date, event_type')
            .eq('partner_email', rel.partner_email)
            .order('event_date', { ascending: false })
            .limit(1)
          nextEvent = pastEvents?.[0] || null
        }

        return {
          ...rel,
          _unreadCount: unreadCount || 0,
          _nextEvent: nextEvent,
        }
      }))

      setRelations(enriched)
      setLoading(false)
    }

    load()
  }, [refreshKey])

  // ── Compteurs ───────────────────────────────────────────────────────────────
  const totalRelations  = relations.length
  const activeRelations = relations.filter(r => r.status === 'active').length
  const totalUnread     = relations.reduce((sum, r) => sum + (r._unreadCount || 0), 0)

  // ── Filtre recherche ────────────────────────────────────────────────────────
  const filtered = search.trim()
    ? relations.filter(r => {
        const q = search.toLowerCase()
        return (
          (r.partner_name || '').toLowerCase().includes(q) ||
          (r.institution_name || '').toLowerCase().includes(q)
        )
      })
    : relations

  return (
    <section style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 300, fontStyle: 'italic', fontFamily: 'Newsreader, serif', color: '#1A3A6B', margin: '0 0 4px' }}>
              Pipeline Partenaires
            </h2>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <Stat label="Total relations" value={totalRelations} />
              <Stat label="Relations actives" value={activeRelations} accent />
              <Stat label="Messages non lus" value={totalUnread} warn={totalUnread > 0} />
            </div>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            style={{ ...btnPrimaryStyle, padding: '10px 20px', fontSize: '12px' }}
          >
            + Nouvelle relation
          </button>
        </div>

        {/* Recherche */}
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par nom partenaire ou institution…"
          style={{
            width: '100%', maxWidth: '400px', boxSizing: 'border-box',
            padding: '9px 14px', border: '1px solid rgba(26,58,107,0.2)',
            borderRadius: '2px', fontSize: '13px', fontFamily: 'system-ui, sans-serif',
            color: '#1A1C1C', background: '#FAF7F2', outline: 'none',
          }}
        />
      </div>

      {/* ── Kanban ── */}
      {loading ? (
        <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Chargement du pipeline…</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          alignItems: 'start',
        }}>
          {COLUMNS.map(col => {
            const cards = filtered.filter(r => r.status === col.key)
            return (
              <div key={col.key} style={{
                background: col.bg,
                border: `1px solid ${col.border}`,
                borderRadius: '4px',
                padding: '14px',
              }}>
                {/* Header colonne */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1A3A6B' }}>
                    {col.label}
                  </span>
                  <span style={{
                    fontSize: '11px', fontWeight: 700,
                    background: '#1A3A6B', color: '#fff',
                    borderRadius: '50%', width: '20px', height: '20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {cards.length}
                  </span>
                </div>

                {/* Cartes */}
                {cards.length === 0 ? (
                  <p style={{ color: '#9CA3AF', fontSize: '12px', fontStyle: 'italic', textAlign: 'center', padding: '12px 0' }}>—</p>
                ) : (
                  cards.map(rel => (
                    <RelationCard
                      key={rel.id}
                      relation={rel}
                      onEventAdded={refresh}
                    />
                  ))
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Modals */}
      {showNewModal && (
        <NewRelationModal
          onClose={() => setShowNewModal(false)}
          onSaved={refresh}
        />
      )}
    </section>
  )
}

// ── Micro-composant stat ──────────────────────────────────────────────────────

function Stat({ label, value, accent, warn }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF' }}>
        {label}
      </span>
      <span style={{
        fontSize: '22px', fontWeight: 700, lineHeight: 1.1,
        color: warn ? '#ba1a1a' : accent ? '#1E6B4A' : '#1A3A6B',
      }}>
        {value}
      </span>
    </div>
  )
}
