// pages/dataroom/DataroomLanding.jsx — Retbaa Circle
// Portail public prospects — Stepper 3 étapes : Présentation → NDA → Qualification
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#FAF7F2',
    fontFamily: 'system-ui, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
  },
  card: {
    width: '100%',
    maxWidth: '560px',
    backgroundColor: '#fff',
    boxShadow: '0 8px 40px rgba(26,58,107,0.10)',
    padding: '56px 48px 48px',
  },
  logo: {
    fontFamily: 'Newsreader, serif',
    fontStyle: 'italic',
    fontWeight: 300,
    fontSize: '26px',
    color: '#1A3A6B',
    marginBottom: '4px',
    letterSpacing: '0.01em',
  },
  tagline: {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.35em',
    textTransform: 'uppercase',
    color: '#C4A96A',
    marginBottom: '40px',
  },
  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '36px',
  },
  dot: (active, done) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: done ? '#C4A96A' : active ? '#1A3A6B' : 'rgba(26,58,107,0.15)',
    transition: 'background-color 0.2s',
  }),
  dotLine: {
    flex: 1,
    height: '1px',
    backgroundColor: 'rgba(26,58,107,0.12)',
  },
  stepLabel: (active) => ({
    fontFamily: 'system-ui, sans-serif',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: active ? '#1A3A6B' : 'rgba(26,58,107,0.35)',
    marginBottom: '28px',
  }),
  title: {
    fontFamily: 'Newsreader, serif',
    fontSize: '28px',
    fontWeight: 300,
    fontStyle: 'italic',
    color: '#1A3A6B',
    marginBottom: '16px',
    lineHeight: 1.3,
  },
  body: {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '14px',
    color: '#4B5563',
    lineHeight: 1.75,
    marginBottom: '32px',
  },
  label: {
    display: 'block',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#1A3A6B',
    marginBottom: '8px',
    marginTop: '20px',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '14px',
    color: '#1A3A6B',
    background: '#FAF7F2',
    border: 'none',
    borderBottom: '2px solid rgba(196,169,106,0.4)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  },
  inputReadonly: {
    width: '100%',
    padding: '11px 14px',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '14px',
    color: '#9CA3AF',
    background: '#F3EFE8',
    border: 'none',
    borderBottom: '2px solid rgba(196,169,106,0.2)',
    outline: 'none',
    boxSizing: 'border-box',
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginTop: '20px',
    marginBottom: '8px',
  },
  checkbox: {
    marginTop: '2px',
    width: '16px',
    height: '16px',
    flexShrink: 0,
    accentColor: '#1A3A6B',
    cursor: 'pointer',
  },
  checkboxLabel: {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '13px',
    color: '#374151',
    lineHeight: 1.6,
    cursor: 'pointer',
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '8px',
    marginBottom: '8px',
  },
  radioRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },
  radio: {
    accentColor: '#1A3A6B',
    cursor: 'pointer',
  },
  radioLabel: {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '14px',
    color: '#374151',
    cursor: 'pointer',
  },
  badge: {
    display: 'inline-block',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#1A3A6B',
    background: 'rgba(196,169,106,0.18)',
    border: '1px solid rgba(196,169,106,0.5)',
    padding: '2px 8px',
    marginLeft: '8px',
    verticalAlign: 'middle',
  },
  note: {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '12px',
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: '4px',
    lineHeight: 1.5,
  },
  warning: {
    background: 'rgba(196,169,106,0.08)',
    border: '1px solid rgba(196,169,106,0.3)',
    padding: '12px 16px',
    marginTop: '20px',
    marginBottom: '8px',
    fontSize: '12px',
    color: '#6B7280',
    lineHeight: 1.6,
  },
  btnPrimary: {
    width: '100%',
    padding: '14px',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#fff',
    background: '#1A3A6B',
    border: 'none',
    cursor: 'pointer',
    marginTop: '32px',
    transition: 'opacity 0.15s',
  },
  error: {
    fontSize: '12px',
    color: '#ba1a1a',
    marginTop: '16px',
    padding: '10px 14px',
    background: 'rgba(186,26,26,0.06)',
    borderLeft: '3px solid #ba1a1a',
  },
  success: {
    textAlign: 'center',
    padding: '24px 0',
  },
  successTitle: {
    fontFamily: 'Newsreader, serif',
    fontStyle: 'italic',
    fontSize: '26px',
    color: '#1A3A6B',
    marginBottom: '12px',
  },
  successText: {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '14px',
    color: '#6B7280',
    lineHeight: 1.7,
  },
  divider: {
    height: '1px',
    background: 'rgba(26,58,107,0.08)',
    margin: '24px 0',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
}

const STEP_LABELS = ['Présentation', 'Confidentialité', 'Qualification']

function StepIndicator({ step }) {
  return (
    <div style={s.stepIndicator}>
      {STEP_LABELS.map((label, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: i < 2 ? 1 : 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={s.dot(i === step, i < step)} />
          </div>
          {i < 2 && <div style={s.dotLine} />}
        </div>
      ))}
    </div>
  )
}

// ── Étape 1 — Présentation ────────────────────────────────────────────────────
function StepPresentation({ onNext }) {
  return (
    <div>
      <div style={s.stepLabel(true)}>Étape 1 — Présentation</div>
      <div style={s.title}>Retbaa Circle · Espace Prospects</div>
      <div style={s.body}>
        Bienvenue dans l'espace investisseurs de Retbaa Circle. Ce portail vous permet
        d'accéder aux informations stratégiques, financières et opérationnelles du groupe
        dans le cadre d'une démarche de co-investissement.<br /><br />
        Les documents et contenus partagés ici sont réservés aux personnes ayant manifesté
        un intérêt pour rejoindre le cercle d'investisseurs Retbaa. L'accès est conditionné
        à la signature d'un accord de confidentialité et à la qualification de votre profil.
      </div>
      <div style={s.divider} />
      <button style={s.btnPrimary} onClick={onNext}>
        Accéder à la dataroom →
      </button>
    </div>
  )
}

// ── Étape 2 — NDA ─────────────────────────────────────────────────────────────
function StepNDA({ onNext, ndaName, setNdaName, ndaAccepted, setNdaAccepted }) {
  const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
  const canContinue = ndaName.trim().length > 0 && ndaAccepted

  return (
    <div>
      <div style={s.stepLabel(true)}>Étape 2 — Confidentialité</div>
      <div style={s.title}>Accord de confidentialité</div>
      <div style={s.body}>
        Les informations contenues dans cet espace sont strictement confidentielles.
        Elles sont destinées exclusivement à la personne qui en fait la demande et ne
        peuvent être reproduites, transmises ou utilisées à des fins autres que l'évaluation
        d'une opportunité d'investissement avec Retbaa Circle.
      </div>

      <label style={s.label}>Nom complet *</label>
      <input
        type="text"
        value={ndaName}
        onChange={e => setNdaName(e.target.value)}
        placeholder="Prénom Nom"
        style={s.input}
      />

      <label style={s.label}>Date</label>
      <input
        type="text"
        value={today}
        readOnly
        style={s.inputReadonly}
      />

      <div style={s.checkboxRow}>
        <input
          type="checkbox"
          id="nda-checkbox"
          checked={ndaAccepted}
          onChange={e => setNdaAccepted(e.target.checked)}
          style={s.checkbox}
        />
        <label htmlFor="nda-checkbox" style={s.checkboxLabel}>
          Je m'engage à ne pas divulguer ces informations à des tiers et à les utiliser
          exclusivement dans le cadre de ma réflexion d'investissement avec Retbaa Circle.
        </label>
      </div>

      <button
        style={{ ...s.btnPrimary, opacity: canContinue ? 1 : 0.45, cursor: canContinue ? 'pointer' : 'not-allowed' }}
        onClick={() => canContinue && onNext()}
        disabled={!canContinue}
      >
        Signer et continuer →
      </button>
    </div>
  )
}

// ── Étape 3 — Qualification ───────────────────────────────────────────────────
function StepQualification({ ndaName, ndaDate, onSuccess }) {
  const [firstName, setFirstName] = useState(() => ndaName ? ndaName.split(' ')[0] : '')
  const [lastName, setLastName]   = useState(() => ndaName ? ndaName.split(' ').slice(1).join(' ') : '')
  const [email, setEmail]         = useState('')
  const [type, setType]           = useState('personal')
  const [entityName, setEntityName] = useState('')
  const [entitySiren, setEntitySiren] = useState('')
  const [channel, setChannel]     = useState('')
  const [amount, setAmount]       = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  const canSubmit = firstName.trim() && lastName.trim() && email.trim() && channel && amount
    && (type === 'personal' || (entityName.trim() && entitySiren.trim()))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError('')

    try {
      // 1. INSERT prospect
      const { error: insertErr } = await supabase
        .from('dataroom_prospects')
        .insert({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim().toLowerCase(),
          type,
          entity_name: type === 'entity' ? entityName.trim() : null,
          entity_siren: type === 'entity' ? entitySiren.trim() : null,
          channel,
          amount_range: amount,
          nda_signed_at: ndaDate,
          nda_signer_name: ndaName,
          status: 'pending',
        })

      if (insertErr) throw insertErr

      // 2. OTP magic link
      const { error: otpErr } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: window.location.origin + '/dataroom/access',
        },
      })

      if (otpErr) throw otpErr

      // 3. Succès
      onSuccess(email.trim().toLowerCase())
    } catch (err) {
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={s.stepLabel(true)}>Étape 3 — Qualification</div>
      <div style={s.title}>Votre profil</div>

      {/* Prénom / Nom */}
      <div style={s.grid2}>
        <div>
          <label style={{ ...s.label, marginTop: 0 }}>Prénom *</label>
          <input
            type="text"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            placeholder="Prénom"
            required
            style={s.input}
          />
        </div>
        <div>
          <label style={{ ...s.label, marginTop: 0 }}>Nom *</label>
          <input
            type="text"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            placeholder="Nom"
            required
            style={s.input}
          />
        </div>
      </div>

      <label style={s.label}>Adresse e-mail *</label>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="vous@exemple.com"
        required
        style={s.input}
      />

      {/* Type */}
      <label style={s.label}>Vous investissez *</label>
      <div style={s.radioGroup}>
        <label style={s.radioRow}>
          <input type="radio" name="type" value="personal" checked={type === 'personal'} onChange={() => setType('personal')} style={s.radio} />
          <span style={s.radioLabel}>En tant que particulier</span>
        </label>
        <label style={s.radioRow}>
          <input type="radio" name="type" value="entity" checked={type === 'entity'} onChange={() => setType('entity')} style={s.radio} />
          <span style={s.radioLabel}>Via une société</span>
        </label>
      </div>

      {type === 'entity' && (
        <div style={s.grid2}>
          <div>
            <label style={{ ...s.label, marginTop: '12px' }}>Nom société *</label>
            <input
              type="text"
              value={entityName}
              onChange={e => setEntityName(e.target.value)}
              placeholder="SAS Exemple"
              required
              style={s.input}
            />
          </div>
          <div>
            <label style={{ ...s.label, marginTop: '12px' }}>SIREN *</label>
            <input
              type="text"
              value={entitySiren}
              onChange={e => setEntitySiren(e.target.value)}
              placeholder="123 456 789"
              required
              style={s.input}
            />
          </div>
        </div>
      )}

      {/* Canal */}
      <label style={s.label}>Canal d'investissement *</label>
      <div style={s.radioGroup}>
        <label style={s.radioRow}>
          <input type="radio" name="channel" value="holding" checked={channel === 'holding'} onChange={() => setChannel('holding')} style={s.radio} />
          <span style={s.radioLabel}>Retbaa Holding — <span style={{ color: '#9CA3AF', fontSize: '13px' }}>equity direct</span></span>
        </label>
        <label style={s.radioRow}>
          <input type="radio" name="channel" value="spv" checked={channel === 'spv'} onChange={() => setChannel('spv')} style={s.radio} />
          <span style={s.radioLabel}>SPV Les Adresses — <span style={{ color: '#9CA3AF', fontSize: '13px' }}>réseau retail</span></span>
        </label>
        <label style={s.radioRow}>
          <input type="radio" name="channel" value="manufacture" checked={channel === 'manufacture'} onChange={() => setChannel('manufacture')} style={s.radio} />
          <span style={s.radioLabel}>
            Manufacture
            <span style={s.badge}>Institutionnel</span>
          </span>
        </label>
      </div>
      {channel === 'manufacture' && (
        <div style={s.note}>⚠️ Ce canal est réservé aux investisseurs institutionnels.</div>
      )}

      {/* Montant */}
      <label style={s.label}>Niveau d'engagement envisagé *</label>
      <div style={s.radioGroup}>
        {[
          { value: 'lt_10k',    label: 'Moins de 10 000 €' },
          { value: '10k_50k',   label: '10 000 – 50 000 €' },
          { value: '50k_100k',  label: '50 000 – 100 000 €' },
          { value: 'gt_100k',   label: '100 000 € et plus' },
        ].map(opt => (
          <label key={opt.value} style={s.radioRow}>
            <input type="radio" name="amount" value={opt.value} checked={amount === opt.value} onChange={() => setAmount(opt.value)} style={s.radio} />
            <span style={s.radioLabel}>{opt.label}</span>
          </label>
        ))}
      </div>

      <div style={s.warning}>
        ⚠️ Cette information nous aide à vous orienter. Elle ne constitue aucun engagement de votre part.
      </div>

      {error && <div style={s.error}>{error}</div>}

      <button
        type="submit"
        disabled={loading || !canSubmit}
        style={{ ...s.btnPrimary, opacity: (loading || !canSubmit) ? 0.45 : 1, cursor: (loading || !canSubmit) ? 'not-allowed' : 'pointer' }}
      >
        {loading ? 'Envoi en cours…' : 'Recevoir mon accès par email →'}
      </button>
    </form>
  )
}

// ── Composant principal ───────────────────────────────────────────────────────
export default function DataroomLanding() {
  const [step, setStep] = useState(0)
  const [ndaName, setNdaName]         = useState('')
  const [ndaAccepted, setNdaAccepted] = useState(false)
  const [ndaDate]                     = useState(new Date().toISOString())
  const [sentTo, setSentTo]           = useState(null)

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Logo */}
        <div style={s.logo}>Retbaa Circle</div>
        <div style={s.tagline}>Espace Prospects · Portail Investisseurs</div>

        {sentTo ? (
          <div style={s.success}>
            <div style={{ fontSize: '40px', marginBottom: '20px' }}>✉️</div>
            <div style={s.successTitle}>Lien envoyé</div>
            <div style={s.successText}>
              Un lien d'accès vous a été envoyé à<br />
              <strong style={{ color: '#1A3A6B' }}>{sentTo}</strong><br /><br />
              Vérifiez votre boîte mail et cliquez sur le lien pour accéder à l'espace dataroom.
            </div>
          </div>
        ) : (
          <>
            <StepIndicator step={step} />

            {step === 0 && (
              <StepPresentation onNext={() => setStep(1)} />
            )}
            {step === 1 && (
              <StepNDA
                onNext={() => setStep(2)}
                ndaName={ndaName}
                setNdaName={setNdaName}
                ndaAccepted={ndaAccepted}
                setNdaAccepted={setNdaAccepted}
              />
            )}
            {step === 2 && (
              <StepQualification
                ndaName={ndaName}
                ndaDate={ndaDate}
                onSuccess={email => setSentTo(email)}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
