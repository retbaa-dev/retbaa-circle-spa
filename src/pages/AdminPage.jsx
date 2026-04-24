// pages/AdminPage.jsx — Panel de validation des investisseurs
import { useState, useEffect } from 'react'
import { useUser, useAuth } from '@clerk/clerk-react'

const ADMIN_EMAILS = ['massata.niang@retbaa-circle.fr', 'massata@retbaa.com', 'massata+1@retbaa.com']
const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || ''

export default function AdminPage() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth()
  const { user, isLoaded: userLoaded } = useUser()
  const [pendingUsers, setPendingUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [actionMsg, setActionMsg] = useState('')

  const isLoaded = authLoaded && userLoaded
  const userEmail = user?.emailAddresses?.[0]?.emailAddress
  const isAdmin = isLoaded && isSignedIn && (
    user?.publicMetadata?.role === 'admin' || ADMIN_EMAILS.includes(userEmail)
  )

  useEffect(() => {
    if (isAdmin) fetchPending()
  }, [isAdmin])

  const fetchPending = async () => {
    setLoadingUsers(true)
    try {
      const res = await fetch(`/api/admin/users/pending?adminSecret=${ADMIN_SECRET}`)
      const data = await res.json()
      setPendingUsers(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingUsers(false)
    }
  }

  const approve = async (userId, name) => {
    try {
      await fetch(`/api/admin/users/${userId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminSecret: ADMIN_SECRET }),
      })
      setActionMsg(`✅ ${name} validé(e) avec succès`)
      fetchPending()
    } catch (e) {
      setActionMsg('Erreur lors de la validation')
    }
  }

  const suspend = async (userId, name) => {
    if (!confirm(`Suspendre l'accès de ${name} ?`)) return
    try {
      await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminSecret: ADMIN_SECRET }),
      })
      setActionMsg(`⏸ ${name} suspendu(e)`)
      fetchPending()
    } catch (e) {
      setActionMsg('Erreur')
    }
  }

  const S = {
    page: { minHeight: '100vh', backgroundColor: '#f9f9f9', fontFamily: 'Manrope, sans-serif', padding: '40px' },
    title: { fontFamily: 'Newsreader, serif', fontSize: '32px', fontStyle: 'italic', fontWeight: 300, color: '#1A3A6B' },
    card: { backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 4px 24px rgba(26,58,107,0.08)', overflow: 'hidden', marginBottom: '24px' },
    cardHeader: { padding: '20px 28px', borderBottom: '1px solid rgba(196,198,208,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    cardTitle: { fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1A3A6B', fontWeight: 700 },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '12px 28px', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9CA3AF', textAlign: 'left', fontWeight: 700, borderBottom: '1px solid rgba(196,198,208,0.2)' },
    td: { padding: '16px 28px', fontSize: '13px', color: '#1A1C1C', borderBottom: '1px solid rgba(196,198,208,0.1)' },
    btnApprove: { padding: '7px 16px', backgroundColor: '#EFC0D4', color: '#1A3A6B', border: 'none', borderRadius: '2px', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', marginRight: '8px' },
    btnSuspend: { padding: '7px 16px', backgroundColor: 'transparent', color: '#9CA3AF', border: '1px solid rgba(196,198,208,0.5)', borderRadius: '2px', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' },
    center: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9' },
  }

  // Chargement
  if (!isLoaded) {
    return (
      <div style={S.center}>
        <p style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', color: '#1A3A6B', opacity: 0.5 }}>Chargement…</p>
      </div>
    )
  }

  // Pas connecté
  if (!isSignedIn) {
    window.location.href = '/'
    return null
  }

  // Pas admin
  if (!isAdmin) {
    return (
      <div style={S.center}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', color: '#1A3A6B', fontSize: '20px' }}>Accès réservé aux administrateurs</p>
          <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '8px' }}>Email détecté : {userEmail}</p>
          <p style={{ fontSize: '11px', color: '#9CA3AF' }}>Rôle : {user?.publicMetadata?.role || 'aucun'}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={S.page}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#EFC0D4', fontWeight: 700, marginBottom: '8px' }}>
            Retbaa Circle — Administration
          </div>
          <div style={S.title}>Validation des investisseurs</div>
        </div>

        {actionMsg && (
          <div style={{ padding: '12px 20px', backgroundColor: 'rgba(239,192,212,0.15)', border: '1px solid #EFC0D4', borderRadius: '4px', marginBottom: '24px', fontSize: '13px', color: '#1A3A6B' }}>
            {actionMsg}
          </div>
        )}

        <div style={S.card}>
          <div style={S.cardHeader}>
            <span style={S.cardTitle}>En attente de validation</span>
            <button onClick={fetchPending} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: '#9CA3AF', letterSpacing: '0.1em' }}>
              ↻ Actualiser
            </button>
          </div>

          {loadingUsers ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontStyle: 'italic' }}>Chargement…</div>
          ) : pendingUsers.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
              Aucun investisseur en attente de validation.
            </div>
          ) : (
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Nom</th>
                  <th style={S.th}>Email</th>
                  <th style={S.th}>Réf.</th>
                  <th style={S.th}>Date</th>
                  <th style={S.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map(u => (
                  <tr key={u.id}>
                    <td style={S.td}>{u.name || '—'}</td>
                    <td style={S.td}>{u.email}</td>
                    <td style={{ ...S.td, fontWeight: 700, color: '#EFC0D4' }}>{u.ref || '—'}</td>
                    <td style={{ ...S.td, color: '#9CA3AF', fontSize: '11px' }}>
                      {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td style={S.td}>
                      <button style={S.btnApprove} onClick={() => approve(u.id, u.name)}>✓ Valider</button>
                      <button style={S.btnSuspend} onClick={() => suspend(u.id, u.name)}>Suspendre</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <InviteLinkGenerator />
      </div>
    </div>
  )
}

// Composant pour générer les liens d'invitation
function InviteLinkGenerator() {
  const [selectedInvestor, setSelectedInvestor] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const investors = [
    { key: 'barthelemy', label: 'Barthélemy Faye (RC-9921)' },
    { key: 'pape', label: 'Pape Amadou Ngom (RC-0042)' },
    { key: 'cathy', label: 'Cathy Muiza (RC-0078)' },
    { key: 'raphael', label: 'Raphaël Perdrix (RC-0093)' },
  ]

  const generate = async () => {
    if (!selectedInvestor) return
    setLoading(true)
    setGeneratedLink('')
    try {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investorKey: selectedInvestor, adminSecret: ADMIN_SECRET }),
      })
      const data = await res.json()
      setGeneratedLink(data.link)
    } catch (e) {
      alert('Erreur lors de la génération du lien')
    } finally {
      setLoading(false)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const S2 = {
    card: { backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 4px 24px rgba(26,58,107,0.08)', overflow: 'hidden' },
    body: { padding: '28px' },
    select: { width: '100%', padding: '12px 16px', border: '1px solid rgba(196,198,208,0.5)', borderRadius: '4px', fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#1A1C1C', marginBottom: '16px', outline: 'none' },
    btn: { padding: '12px 28px', backgroundColor: '#EFC0D4', color: '#1A3A6B', border: 'none', borderRadius: '2px', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer' },
    linkBox: { marginTop: '20px', padding: '16px', backgroundColor: '#F9F9F9', borderRadius: '4px', border: '1px solid rgba(196,198,208,0.3)' },
  }

  return (
    <div style={S2.card}>
      <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(196,198,208,0.2)' }}>
        <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1A3A6B', fontWeight: 700 }}>
          Générer un lien d'invitation
        </span>
      </div>
      <div style={S2.body}>
        <select style={S2.select} value={selectedInvestor} onChange={e => { setSelectedInvestor(e.target.value); setGeneratedLink('') }}>
          <option value="">Sélectionner un investisseur…</option>
          {investors.map(i => <option key={i.key} value={i.key}>{i.label}</option>)}
        </select>
        <button style={S2.btn} onClick={generate} disabled={loading || !selectedInvestor}>
          {loading ? 'Génération…' : 'Générer le lien →'}
        </button>
        {generatedLink && (
          <div style={S2.linkBox}>
            <p style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '8px' }}>Lien à envoyer à l'investisseur :</p>
            <p style={{ fontSize: '13px', color: '#1A3A6B', wordBreak: 'break-all', fontWeight: 500 }}>{generatedLink}</p>
            <button onClick={copyLink} style={{ marginTop: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: '#EFC0D4', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.1em' }}>
              {copied ? '✓ Copié !' : 'Copier le lien'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
