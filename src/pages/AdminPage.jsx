// pages/AdminPage.jsx — Panel de validation des investisseurs
import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function AdminPage() {
  const { session, isLoaded, isSignedIn, role } = useAuth()
  const [pendingUsers, setPendingUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [actionMsg, setActionMsg] = useState('')

  // Admin = role 'founder' uniquement — source de vérité : user_profiles Supabase
  const isAdmin = isLoaded && isSignedIn && role === 'founder'

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

  if (!isLoaded) return <div style={{ padding: '40px', fontFamily: 'Manrope, sans-serif' }}>Chargement…</div>
  if (!isAdmin) return (
    <div style={{ padding: '40px', fontFamily: 'Manrope, sans-serif', color: '#ba1a1a' }}>
      Accès refusé — réservé à l'administration Retbaa.
    </div>
  )

  return (
    <div style={{ padding: '40px', fontFamily: 'Manrope, sans-serif', maxWidth: '800px' }}>
      <h1 style={{ fontFamily: 'Newsreader, serif', fontSize: '28px', color: '#1A3A6B', marginBottom: '8px' }}>
        Panel Admin
      </h1>
      <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '32px' }}>
        Gestion des accès investisseurs Retbaa Circle
      </p>

      {actionMsg && (
        <div style={{ padding: '12px 16px', background: 'rgba(26,58,107,0.06)', borderRadius: '4px', marginBottom: '24px', fontSize: '13px', color: '#1A3A6B' }}>
          {actionMsg}
        </div>
      )}

      {/* Invitations */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1A3A6B', marginBottom: '16px' }}>
          Créer une invitation
        </h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['barthelemy', 'pape', 'cathy', 'raphael'].map(key => (
            <button key={key} onClick={() => sendInvite(key)} style={{
              padding: '8px 16px', background: '#1A3A6B', color: '#fff',
              border: 'none', borderRadius: '4px', cursor: 'pointer',
              fontFamily: 'Manrope, sans-serif', fontSize: '12px', fontWeight: 600,
            }}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Utilisateurs en attente */}
      <section>
        <h2 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1A3A6B', marginBottom: '16px' }}>
          Comptes en attente de validation {loadingUsers ? '…' : `(${pendingUsers.length})`}
        </h2>
        {pendingUsers.length === 0 ? (
          <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Aucun compte en attente.</p>
        ) : (
          pendingUsers.map(u => (
            <div key={u.id} style={{ padding: '16px', border: '1px solid #E5E7EB', borderRadius: '4px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#1A1C1C' }}>{u.firstName} {u.lastName}</div>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>{u.email} · {u.investorKey || 'inconnu'}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => approveUser(u.id)} style={{ padding: '6px 14px', background: '#1E6B4A', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                  Approuver
                </button>
                <button onClick={() => suspendUser(u.id)} style={{ padding: '6px 14px', background: '#ba1a1a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                  Suspendre
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  )
}
