import { useState } from 'react'

const SUBJECTS = [
  "Opportunité d'investissement",
  'Question dataroom',
  'Partenariat',
  'Autre',
]

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#FAF7F2',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    fontFamily: 'Manrope, system-ui, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  brand: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '11px',
    letterSpacing: '0.4em',
    textTransform: 'uppercase',
    color: '#C4A96A',
    fontWeight: 300,
    marginBottom: '8px',
  },
  title: {
    fontFamily: 'Georgia, serif',
    fontSize: '32px',
    fontWeight: 300,
    fontStyle: 'italic',
    color: '#1A3A6B',
    marginBottom: '8px',
  },
  divider: {
    width: '32px',
    height: '1px',
    background: '#C4A96A',
    margin: '0 auto 12px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#6B7280',
    letterSpacing: '0.02em',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '2px',
    padding: '40px 48px',
    width: '100%',
    maxWidth: '560px',
    boxShadow: '0 2px 24px rgba(26, 58, 107, 0.07)',
    border: '1px solid rgba(196, 169, 106, 0.15)',
  },
  fieldGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#1A3A6B',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '14px',
    fontFamily: 'Manrope, system-ui, sans-serif',
    color: '#1A3A6B',
    backgroundColor: '#FAF7F2',
    border: '1px solid rgba(26, 58, 107, 0.2)',
    borderRadius: '1px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '14px',
    fontFamily: 'Manrope, system-ui, sans-serif',
    color: '#1A3A6B',
    backgroundColor: '#FAF7F2',
    border: '1px solid rgba(26, 58, 107, 0.2)',
    borderRadius: '1px',
    outline: 'none',
    boxSizing: 'border-box',
    appearance: 'none',
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '14px',
    fontFamily: 'Manrope, system-ui, sans-serif',
    color: '#1A3A6B',
    backgroundColor: '#FAF7F2',
    border: '1px solid rgba(26, 58, 107, 0.2)',
    borderRadius: '1px',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'vertical',
    minHeight: '120px',
    lineHeight: '1.6',
    transition: 'border-color 0.2s',
  },
  optional: {
    fontSize: '10px',
    fontWeight: 400,
    color: '#9CA3AF',
    textTransform: 'none',
    letterSpacing: '0.05em',
    marginLeft: '4px',
  },
  error: {
    fontSize: '11px',
    color: '#DC2626',
    marginTop: '4px',
  },
  button: {
    width: '100%',
    padding: '13px',
    backgroundColor: '#1A3A6B',
    color: '#FAF7F2',
    border: 'none',
    borderRadius: '1px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    fontFamily: 'Manrope, system-ui, sans-serif',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'background-color 0.2s, opacity 0.2s',
  },
  successBox: {
    textAlign: 'center',
    padding: '20px 0',
  },
  successIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: 'rgba(196, 169, 106, 0.15)',
    border: '1px solid #C4A96A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    fontSize: '20px',
  },
  successTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '22px',
    fontWeight: 300,
    fontStyle: 'italic',
    color: '#1A3A6B',
    marginBottom: '12px',
  },
  successText: {
    fontSize: '14px',
    color: '#6B7280',
    lineHeight: '1.6',
  },
  backLink: {
    display: 'inline-block',
    marginTop: '24px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#1A3A6B',
    textDecoration: 'none',
    borderBottom: '1px solid rgba(26, 58, 107, 0.3)',
    paddingBottom: '1px',
  },
}

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    institution: '',
    subject: SUBJECTS[0],
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Le nom est requis.'
    if (!form.email.trim()) e.email = "L'email est requis."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide.'
    if (!form.message.trim()) e.message = 'Le message est requis.'
    else if (form.message.trim().length < 20) e.message = 'Le message doit contenir au moins 20 caractères.'
    return e
  }

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setSending(true)

    const apiKey = import.meta.env.VITE_BREVO_API_KEY

    if (!apiKey) {
      console.warn('[ContactPage] VITE_BREVO_API_KEY absent — email non envoyé.')
    } else {
      try {
        const body = {
          sender: { name: form.name, email: 'noreply@retbaa.com' },
          to: [{ email: 'massata@retbaa.com', name: 'Massata Niang' }],
          replyTo: { email: form.email, name: form.name },
          subject: `[Retbaa Contact] ${form.subject} — ${form.name}`,
          htmlContent: `
            <div style="font-family: Georgia, serif; color: #1A3A6B; max-width: 600px; margin: auto; padding: 32px;">
              <h2 style="font-style: italic; font-weight: 300; color: #1A3A6B; margin-bottom: 8px;">
                Nouveau message — Retbaa Circle
              </h2>
              <div style="width: 32px; height: 1px; background: #C4A96A; margin-bottom: 24px;"></div>
              <table style="font-family: system-ui, sans-serif; font-size: 14px; color: #374151; width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 6px 0; font-weight: 700; width: 160px;">Nom</td><td>${form.name}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: 700;">Email</td><td><a href="mailto:${form.email}">${form.email}</a></td></tr>
                ${form.institution ? `<tr><td style="padding: 6px 0; font-weight: 700;">Institution</td><td>${form.institution}</td></tr>` : ''}
                <tr><td style="padding: 6px 0; font-weight: 700;">Objet</td><td>${form.subject}</td></tr>
              </table>
              <div style="margin-top: 24px; padding: 20px; background: #FAF7F2; border-left: 3px solid #C4A96A; font-family: system-ui, sans-serif; font-size: 14px; line-height: 1.7; color: #374151;">
                ${form.message.replace(/\n/g, '<br>')}
              </div>
            </div>
          `,
        }

        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey,
          },
          body: JSON.stringify(body),
        })

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          console.error('[ContactPage] Brevo error:', errData)
        }
      } catch (err) {
        console.error('[ContactPage] Fetch error:', err)
      }
    }

    setSending(false)
    setSent(true)
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.brand}>Retbaa Circle</div>
        <h1 style={styles.title}>Nous contacter</h1>
        <div style={styles.divider} />
        <p style={styles.subtitle}>Une question, une opportunité ? Écrivez-nous.</p>
      </div>

      <div style={styles.card}>
        {sent ? (
          <div style={styles.successBox}>
            <div style={styles.successIcon}>✓</div>
            <div style={styles.successTitle}>Message envoyé</div>
            <p style={styles.successText}>
              Votre message a été transmis à l'équipe Retbaa.<br />
              Nous revenons vers vous sous 48h.
            </p>
            <a href="/" style={styles.backLink}>Retour à l'accueil</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {/* Nom */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Nom complet</label>
              <input
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="Votre nom"
                style={{
                  ...styles.input,
                  borderColor: errors.name ? '#DC2626' : 'rgba(26,58,107,0.2)',
                }}
              />
              {errors.name && <div style={styles.error}>{errors.name}</div>}
            </div>

            {/* Email */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="votre@email.com"
                style={{
                  ...styles.input,
                  borderColor: errors.email ? '#DC2626' : 'rgba(26,58,107,0.2)',
                }}
              />
              {errors.email && <div style={styles.error}>{errors.email}</div>}
            </div>

            {/* Institution */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                Institution / Organisation
                <span style={styles.optional}>(optionnel)</span>
              </label>
              <input
                type="text"
                value={form.institution}
                onChange={handleChange('institution')}
                placeholder="Votre organisation"
                style={styles.input}
              />
            </div>

            {/* Objet */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Objet</label>
              <select
                value={form.subject}
                onChange={handleChange('subject')}
                style={styles.select}
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Message</label>
              <textarea
                value={form.message}
                onChange={handleChange('message')}
                placeholder="Votre message (20 caractères minimum)…"
                style={{
                  ...styles.textarea,
                  borderColor: errors.message ? '#DC2626' : 'rgba(26,58,107,0.2)',
                }}
              />
              {errors.message && <div style={styles.error}>{errors.message}</div>}
            </div>

            <button
              type="submit"
              disabled={sending}
              style={{ ...styles.button, opacity: sending ? 0.6 : 1, cursor: sending ? 'wait' : 'pointer' }}
            >
              {sending ? 'Envoi en cours…' : 'Envoyer'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
