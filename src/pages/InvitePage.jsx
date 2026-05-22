// pages/InvitePage.jsx — Page d'accueil d'une invitation unique
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function InvitePage() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [step, setStep] = useState('loading') // loading | valid | form | sent | error
  const [investorData, setInvestorData] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/invite/${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.valid) {
          setInvestorData(data.investorData)
          setStep('valid')
        } else {
          setErrorMsg(data.error || 'Lien invalide')
          setStep('error')
        }
      })
      .catch(() => {
        setErrorMsg('Impossible de vérifier le lien.')
        setStep('error')
      })
  }, [token])

  const handleCreateAccount = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim()

      // Créer le compte via Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        setErrorMsg(signUpError.message || 'Erreur lors de la création du compte')
        setLoading(false)
        return
      }

      // Marquer le token comme utilisé côté serveur
      await fetch(`/api/admin/invite/${token}/use`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabaseUserId: authData?.user?.id,
          email: form.email.trim().toLowerCase(),
          fullName,
        }),
      }).catch(() => {}) // non bloquant

      setStep('sent')
    } catch (err) {
      setErrorMsg(err.message || 'Erreur inattendue')
    } finally {
      setLoading(false)
    }
  }

  // ── Styles communs ──
  const S = {
    page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9', fontFamily: 'Manrope, sans-serif' },
    card: { width: '100%', maxWidth: '480px', backgroundColor: '#fff', padding: '56px 48px', boxShadow: '0 32px 80px rgba(26,58,107,0.1)', borderRadius: '4px' },
    label: { display: 'block', fontSize: '10px', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1A3A6B', fontWeight: 700, marginBottom: '8px' },
    input: { width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(196,198,208,0.7)', outline: 'none', padding: '12px 0', fontSize: '14px', fontFamily: 'Manrope, sans-serif', color: '#1A1C1C', boxSizing: 'border-box' },
    btn: { width: '100%', backgroundColor: '#EFC0D4', color: '#1A3A6B', padding: '16px 32px', fontSize: '11px', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 700, border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '24px' },
    title: { fontFamily: 'Newsreader, serif', fontSize: '28px', fontStyle: 'italic', fontWeight: 300, color: '#1A3A6B', marginBottom: '8px' },
    sub: { fontSize: '13px', color: '#6B7280', lineHeight: 1.6, marginBottom: '32px' },
    badge: { display: 'inline-block', padding: '4px 12px', backgroundColor: 'rgba(239,192,212,0.15)', border: '1px solid #EFC0D4', borderRadius: '2px', fontSize: '11px', color: '#1A3A6B', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '28px' },
    field: { marginBottom: '24px' },
    error: { padding: '10px 14px', background: 'rgba(239,192,212,0.15)', borderLeft: '2px solid #EFC0D4', fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: '#1A3A6B', marginBottom: '16px' },
  }

  if (step === 'loading') return (
    <div style={S.page}>
      <div style={{ ...S.card, textAlign: 'center' }}>
        <p style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', color: '#1A3A6B', opacity: 0.5 }}>Vérification du lien…</p>
      </div>
    </div>
  )

  if (step === 'error') return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.title}>Lien invalide</div>
        <p style={S.sub}>{errorMsg}</p>
        <p style={{ fontSize: '12px', color: '#9CA3AF' }}>Contactez Massata Niang pour obtenir un nouveau lien d'invitation.</p>
      </div>
    </div>
  )

  if (step === 'sent') return (
    <div style={S.page}>
      <div style={{ ...S.card, textAlign: 'center' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#EFC0D4', display: 'block', marginBottom: '16px' }}>
          mark_email_read
        </span>
        <div style={S.title}>Vérifiez votre email</div>
        <p style={S.sub}>
          Un lien de confirmation a été envoyé à <strong>{form.email}</strong>.<br />
          Cliquez dessus pour activer votre compte.
        </p>
        <p style={{ fontSize: '11px', color: '#9CA3AF' }}>
          Votre accès sera activé par Massata Niang après confirmation.
        </p>
      </div>
    </div>
  )

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={{ marginBottom: '8px', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#EFC0D4', fontWeight: 700 }}>Retbaa Circle — Invitation Privée</div>
        <div style={S.title}>Créez votre espace</div>
        {investorData && (
          <div style={S.badge}>
            {investorData.name} · {investorData.ref}
          </div>
        )}
        <p style={S.sub}>Choisissez votre email et mot de passe. Votre accès sera activé après validation.</p>
        {errorMsg && <div style={S.error}>{errorMsg}</div>}
        <form onSubmit={handleCreateAccount}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={S.label}>Prénom</label>
              <input style={S.input} type="text" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} required />
            </div>
            <div>
              <label style={S.label}>Nom</label>
              <input style={S.input} type="text" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} required />
            </div>
          </div>
          <div style={S.field}>
            <label style={S.label}>Adresse email</label>
            <input style={S.input} type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div style={S.field}>
            <label style={S.label}>Mot de passe</label>
            <input style={S.input} type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} minLength={8} required />
            <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '6px' }}>8 caractères minimum</p>
          </div>
          <button type="submit" style={S.btn} disabled={loading}>
            {loading ? 'Création…' : 'Créer mon compte →'}
          </button>
        </form>
        <p style={{ fontSize: '10px', color: '#c4c6d0', textAlign: 'center', marginTop: '24px', letterSpacing: '0.05em' }}>
          Accès sécurisé · Investisseurs Retbaa Circle uniquement
        </p>
      </div>
    </div>
  )
}
