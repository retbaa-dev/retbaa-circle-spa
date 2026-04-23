import { useState } from 'react'

export default function ProspectGatePage({ onAccess }) {
  const [form, setForm] = useState({ prenom: '', nom: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.prenom || !form.nom || !form.email) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Email invalide.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await fetch('/api/prospect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    } catch {}
    setLoading(false)
    // Stocker en session pour ne pas redemander
    sessionStorage.setItem('retbaa_prospect', JSON.stringify(form))
    onAccess(form)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0D2247 0%, #1A3A6B 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img src="/retbaa-logo-white.png" alt="Retbaa" style={{ height: '36px', marginBottom: '20px' }} />
          <p style={{
            fontFamily: 'Newsreader, serif', fontStyle: 'italic',
            fontSize: '13px', color: 'rgba(239,192,212,0.85)',
            margin: '0 0 8px', lineHeight: 1.5, textAlign: 'center',
          }}>
            Crafted in Paris. Rooted in Africa. For the World.
          </p>
          <p style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '11px', color: 'rgba(255,255,255,0.45)',
            margin: 0, lineHeight: 1.6, textAlign: 'center',
          }}>
            Un espace réservé aux personnes qui construisent Retbaa avec nous.
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(239,192,212,0.15)',
          borderRadius: '4px',
          padding: '40px',
        }}>
          <h2 style={{
            fontFamily: 'Newsreader, serif', fontSize: '28px',
            fontWeight: 300, fontStyle: 'italic',
            color: '#ffffff', margin: '0 0 8px',
          }}>
            Accès Observateur
          </h2>
          <p style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '11px',
            color: 'rgba(255,255,255,0.5)', margin: '0 0 32px', lineHeight: 1.6,
          }}>
            Renseignez vos coordonnées pour accéder au portail. Un lien personnalisé vous sera envoyé par email.
          </p>

          <form onSubmit={handleSubmit}>
            {[
              { key: 'prenom', label: 'Prénom', type: 'text', placeholder: 'Jean' },
              { key: 'nom', label: 'Nom', type: 'text', placeholder: 'Dupont' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'jean.dupont@example.com' },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontFamily: 'Manrope, sans-serif', fontSize: '9px',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'rgba(239,192,212,0.8)', fontWeight: 700,
                  marginBottom: '8px',
                }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                  style={{
                    width: '100%', padding: '12px 16px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '4px',
                    fontFamily: 'Manrope, sans-serif', fontSize: '13px',
                    color: '#ffffff',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(239,192,212,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                />
              </div>
            ))}

            {error && (
              <div style={{
                fontFamily: 'Manrope, sans-serif', fontSize: '11px',
                color: '#EFC0D4', marginBottom: '16px',
              }}>{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: '#EFC0D4', color: '#1A3A6B',
                border: 'none', borderRadius: '4px', cursor: loading ? 'wait' : 'pointer',
                fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
                opacity: loading ? 0.7 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'Chargement...' : 'Accéder au portail →'}
            </button>
          </form>
        </div>

        <p style={{
          textAlign: 'center', marginTop: '24px',
          fontFamily: 'Manrope, sans-serif', fontSize: '10px',
          color: 'rgba(255,255,255,0.3)', lineHeight: 1.6,
        }}>
          Vos données sont traitées confidentiellement<br />et ne seront jamais partagées.
        </p>
      </div>
    </div>
  )
}
