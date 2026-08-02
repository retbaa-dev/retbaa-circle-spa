// pages/dataroom/DataroomLanding.jsx — Retbaa Circle
// Portail public prospects — Stepper 3 étapes : Présentation → NDA → Qualification
import { useState, useRef, useEffect, useCallback } from 'react'
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

// ── Étape 2 — NDA (refonte complète) ──────────────────────────────────────────
function StepNDA({ onNext, ndaMeta, setNdaMeta, ndaAccepted, setNdaAccepted }) {
  // counterparty type
  const [cpType, setCpType] = useState(ndaMeta.counterparty_type || '')

  // Particulier
  const [firstName, setFirstName]   = useState(ndaMeta.cp_first_name || '')
  const [lastName, setLastName]     = useState(ndaMeta.cp_last_name || '')
  const [address, setAddress]       = useState(ndaMeta.address || '')

  // Entité
  const [entityName, setEntityName]         = useState(ndaMeta.counterparty_name || '')
  const [legalForm, setLegalForm]           = useState(ndaMeta.legal_form || '')
  const [registration, setRegistration]     = useState(ndaMeta.registration || '')
  const [entityAddress, setEntityAddress]   = useState(ndaMeta.address || '')
  const [repName, setRepName]               = useState(ndaMeta.representative_name || '')
  const [repTitle, setRepTitle]             = useState(ndaMeta.representative_title || '')

  // Signature
  const [sigMode, setSigMode]   = useState('typed')
  const [sigTyped, setSigTyped] = useState('')
  const [sigDrawn, setSigDrawn] = useState('')  // base64 PNG
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef(null)
  const lastPos = useRef(null)

  const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })

  // Canvas drawing helpers
  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect()
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const startDraw = useCallback((e) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    setIsDrawing(true)
    lastPos.current = getPos(e, canvas)
  }, [])

  const draw = useCallback((e) => {
    e.preventDefault()
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const pos = getPos(e, canvas)
    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = '#1A3A6B'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
    lastPos.current = pos
  }, [isDrawing])

  const endDraw = useCallback(() => {
    if (!isDrawing) return
    setIsDrawing(false)
    lastPos.current = null
    // Capture base64
    const canvas = canvasRef.current
    if (canvas) {
      setSigDrawn(canvas.toDataURL('image/png'))
    }
  }, [isDrawing])

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setSigDrawn('')
  }

  // Attach touch listeners
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.addEventListener('touchstart', startDraw, { passive: false })
    canvas.addEventListener('touchmove', draw, { passive: false })
    canvas.addEventListener('touchend', endDraw, { passive: false })
    return () => {
      canvas.removeEventListener('touchstart', startDraw)
      canvas.removeEventListener('touchmove', draw)
      canvas.removeEventListener('touchend', endDraw)
    }
  }, [startDraw, draw, endDraw])

  // Validation
  const hasType = cpType !== ''
  const hasFields = cpType === 'personal'
    ? firstName.trim() && lastName.trim() && address.trim()
    : cpType === 'entity'
      ? entityName.trim() && legalForm.trim() && registration.trim() && entityAddress.trim() && repName.trim() && repTitle.trim()
      : false
  const hasSig = sigMode === 'typed' ? sigTyped.trim().length > 0 : sigDrawn !== ''
  const canContinue = hasType && hasFields && ndaAccepted && hasSig

  const handleNext = () => {
    if (!canContinue) return
    const meta = {
      counterparty_type: cpType,
      counterparty_name: cpType === 'personal' ? `${firstName.trim()} ${lastName.trim()}` : entityName.trim(),
      cp_first_name: cpType === 'personal' ? firstName.trim() : '',
      cp_last_name: cpType === 'personal' ? lastName.trim() : '',
      legal_form: legalForm.trim(),
      registration: registration.trim(),
      address: cpType === 'personal' ? address.trim() : entityAddress.trim(),
      representative_name: repName.trim(),
      representative_title: repTitle.trim(),
      signature_mode: sigMode,
      signature_data: sigMode === 'typed' ? sigTyped.trim() : sigDrawn,
    }
    setNdaMeta(meta)
    onNext()
  }

  return (
    <div>
      <div style={s.stepLabel(true)}>Étape 2 — Confidentialité</div>
      <div style={s.title}>Accord de confidentialité</div>

      {/* ── A. Formulaire contrepartie ── */}
      <div style={{ ...s.label, marginTop: 0 }}>Vous êtes *</div>
      <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
        <label style={s.radioRow}>
          <input
            type="radio"
            name="nda-cp-type"
            value="personal"
            checked={cpType === 'personal'}
            onChange={() => setCpType('personal')}
            style={s.radio}
          />
          <span style={s.radioLabel}>Particulier</span>
        </label>
        <label style={s.radioRow}>
          <input
            type="radio"
            name="nda-cp-type"
            value="entity"
            checked={cpType === 'entity'}
            onChange={() => setCpType('entity')}
            style={s.radio}
          />
          <span style={s.radioLabel}>Entité / Société</span>
        </label>
      </div>

      {cpType === 'personal' && (
        <div>
          <div style={s.grid2}>
            <div>
              <label style={{ ...s.label, marginTop: 0 }}>Prénom *</label>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="Prénom"
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
                style={s.input}
              />
            </div>
          </div>
          <label style={s.label}>Adresse *</label>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Adresse complète"
            style={s.input}
          />
        </div>
      )}

      {cpType === 'entity' && (
        <div>
          <label style={{ ...s.label, marginTop: 0 }}>Dénomination / Nom société *</label>
          <input
            type="text"
            value={entityName}
            onChange={e => setEntityName(e.target.value)}
            placeholder="SAS Exemple"
            style={s.input}
          />
          <div style={s.grid2}>
            <div>
              <label style={s.label}>Forme juridique *</label>
              <input
                type="text"
                value={legalForm}
                onChange={e => setLegalForm(e.target.value)}
                placeholder="SAS, SARL, SA…"
                style={s.input}
              />
            </div>
            <div>
              <label style={s.label}>Numéro d'immatriculation *</label>
              <input
                type="text"
                value={registration}
                onChange={e => setRegistration(e.target.value)}
                placeholder="SIREN / RCCM"
                style={s.input}
              />
            </div>
          </div>
          <label style={s.label}>Adresse / Siège social *</label>
          <input
            type="text"
            value={entityAddress}
            onChange={e => setEntityAddress(e.target.value)}
            placeholder="Adresse complète du siège"
            style={s.input}
          />
          <div style={{ marginTop: '16px', padding: '14px 16px', background: '#FAF7F2', borderLeft: '2px solid rgba(196,169,106,0.5)' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1A3A6B', marginBottom: '12px' }}>
              Représenté par
            </div>
            <div style={s.grid2}>
              <div>
                <label style={{ ...s.label, marginTop: 0 }}>Nom *</label>
                <input
                  type="text"
                  value={repName}
                  onChange={e => setRepName(e.target.value)}
                  placeholder="Prénom Nom"
                  style={s.input}
                />
              </div>
              <div>
                <label style={{ ...s.label, marginTop: 0 }}>Qualité / Titre *</label>
                <input
                  type="text"
                  value={repTitle}
                  onChange={e => setRepTitle(e.target.value)}
                  placeholder="Gérant, DG…"
                  style={s.input}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── B. Texte NDA ── */}
      {cpType !== '' && (
        <>
          <div style={s.divider} />
          <div style={{
            maxHeight: '280px',
            overflowY: 'auto',
            border: '1px solid rgba(26,58,107,0.15)',
            padding: '20px',
            fontSize: '12.5px',
            lineHeight: 1.75,
            color: '#374151',
            background: '#FAFAFA',
            marginBottom: '20px',
          }}>
            <p style={{ fontWeight: 700, textAlign: 'center', marginTop: 0, marginBottom: '4px', fontSize: '13px', color: '#1A3A6B' }}>
              ACCORD DE CONFIDENTIALITÉ
            </p>
            <p style={{ fontWeight: 700, textAlign: 'center', marginTop: 0, marginBottom: '16px', fontSize: '12px', color: '#1A3A6B' }}>
              Groupe Retbaa — Multi-Entités France / Sénégal
            </p>

            <p style={{ fontWeight: 600, marginBottom: '6px' }}>Entre les soussignés :</p>
            <p style={{ marginTop: 0 }}>
              D'une part, <strong>RETBAA SASU</strong> (Entité France), SIREN 949 021 885, dont le siège social est situé 60 quai Fernand Saguet, 94700 Maisons-Alfort, France ; et <strong>RETBAA SASU</strong> (Entité Sénégal), RCCM SN DKR 2024 B 46558, dont le siège social est situé Villa E10, Cité Teylium Horizon, VDN, Dakar, Sénégal ; ci-après le « Groupe Retbaa », représenté par Massata Niang, Fondateur &amp; CEO.
            </p>
            <p>D'autre part, la Contrepartie identifiée ci-dessus.</p>

            <p style={{ fontWeight: 600, marginBottom: '4px' }}>Article 1 — Objet</p>
            <p style={{ marginTop: 0 }}>
              Le présent accord a pour objet de définir les conditions dans lesquelles les Parties s'engagent à préserver la confidentialité des informations échangées dans le cadre d'un projet de partenariat, d'investissement ou de collaboration impliquant une ou plusieurs entités du Groupe Retbaa.
            </p>

            <p style={{ fontWeight: 600, marginBottom: '4px' }}>Article 2 — Obligations de confidentialité</p>
            <p style={{ marginTop: 0 }}>
              La Contrepartie s'engage à : (i) conserver strictement confidentielles toutes les informations reçues ; (ii) ne les utiliser qu'aux seules fins de l'évaluation du projet ; (iii) ne les divulguer qu'à ses représentants ayant un besoin d'en connaître, tenus par des obligations équivalentes.
            </p>

            <p style={{ fontWeight: 600, marginBottom: '4px' }}>Article 3 — Exclusions</p>
            <p style={{ marginTop: 0 }}>
              Ne sont pas confidentielles les informations déjà publiques, déjà connues de la Contrepartie, ou devant être divulguées par obligation légale.
            </p>

            <p style={{ fontWeight: 600, marginBottom: '4px' }}>Article 4 — Non-sollicitation</p>
            <p style={{ marginTop: 0 }}>
              Pendant les discussions et pendant 18 mois après leur cessation, la Contrepartie s'interdit de solliciter dirigeants, salariés ou partenaires clés du Groupe Retbaa identifiés dans ce cadre.
            </p>

            <p style={{ fontWeight: 600, marginBottom: '4px' }}>Article 5 — Absence d'engagement</p>
            <p style={{ marginTop: 0 }}>
              Le présent accord ne constitue ni une offre ni un engagement de conclure une opération. Chaque Partie peut mettre fin aux discussions à tout moment.
            </p>

            <p style={{ fontWeight: 600, marginBottom: '4px' }}>Article 6 — Durée</p>
            <p style={{ marginTop: 0 }}>
              Le présent accord est valable 3 ans à compter de sa signature. Les obligations relatives aux secrets d'affaires survivent 5 ans.
            </p>

            <p style={{ fontWeight: 600, marginBottom: '4px' }}>Article 7 — Droit applicable</p>
            <p style={{ marginTop: 0, marginBottom: 0 }}>
              Le présent accord est soumis au droit français. Tout différend sera tranché par arbitrage CCI, siège Paris.
            </p>
          </div>

          {/* ── C. Signature double mode ── */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1A3A6B', marginBottom: '12px' }}>
              Votre signature *
            </div>

            {/* Onglets */}
            <div style={{ display: 'flex', borderBottom: '2px solid rgba(26,58,107,0.12)', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setSigMode('typed')}
                style={{
                  padding: '8px 20px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: sigMode === 'typed' ? '#1A3A6B' : '#9CA3AF',
                  borderBottom: sigMode === 'typed' ? '2px solid #1A3A6B' : '2px solid transparent',
                  marginBottom: '-2px',
                  transition: 'color 0.15s',
                }}
              >
                ✏️ Taper
              </button>
              <button
                type="button"
                onClick={() => setSigMode('drawn')}
                style={{
                  padding: '8px 20px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: sigMode === 'drawn' ? '#1A3A6B' : '#9CA3AF',
                  borderBottom: sigMode === 'drawn' ? '2px solid #1A3A6B' : '2px solid transparent',
                  marginBottom: '-2px',
                  transition: 'color 0.15s',
                }}
              >
                🖊️ Dessiner
              </button>
            </div>

            {/* Onglet Taper */}
            {sigMode === 'typed' && (
              <div>
                <input
                  type="text"
                  value={sigTyped}
                  onChange={e => setSigTyped(e.target.value)}
                  placeholder="Tapez votre nom complet"
                  style={s.input}
                />
                {sigTyped.trim() && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px 16px',
                    background: '#FAF7F2',
                    border: '1px solid rgba(196,169,106,0.3)',
                    fontStyle: 'italic',
                    fontFamily: 'Newsreader, Georgia, serif',
                    fontSize: '28px',
                    color: '#1A3A6B',
                    minHeight: '52px',
                  }}>
                    {sigTyped}
                  </div>
                )}
                <p style={s.note}>Votre nom tapé vaut signature électronique.</p>
              </div>
            )}

            {/* Onglet Dessiner */}
            {sigMode === 'drawn' && (
              <div>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <canvas
                    ref={canvasRef}
                    width={460}
                    height={120}
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={endDraw}
                    onMouseLeave={endDraw}
                    style={{
                      display: 'block',
                      background: '#fff',
                      border: '1px solid rgba(26,58,107,0.2)',
                      cursor: 'crosshair',
                      maxWidth: '100%',
                      touchAction: 'none',
                    }}
                  />
                </div>
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={clearCanvas}
                    style={{
                      padding: '6px 14px',
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#6B7280',
                      background: 'none',
                      border: '1px solid rgba(107,114,128,0.4)',
                      cursor: 'pointer',
                    }}
                  >
                    Effacer
                  </button>
                  {sigDrawn && (
                    <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>✓ Signature enregistrée</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Date */}
          <label style={s.label}>Date</label>
          <input type="text" value={today} readOnly style={s.inputReadonly} />

          {/* Checkbox */}
          <div style={s.checkboxRow}>
            <input
              type="checkbox"
              id="nda-checkbox"
              checked={ndaAccepted}
              onChange={e => setNdaAccepted(e.target.checked)}
              style={s.checkbox}
            />
            <label htmlFor="nda-checkbox" style={s.checkboxLabel}>
              J'ai lu et j'accepte les termes du présent Accord de Confidentialité. Je m'engage
              à ne pas divulguer les informations reçues à des tiers et à les utiliser exclusivement
              dans le cadre de ma réflexion d'investissement avec Retbaa Circle.
            </label>
          </div>
        </>
      )}

      <button
        type="button"
        style={{ ...s.btnPrimary, opacity: canContinue ? 1 : 0.45, cursor: canContinue ? 'pointer' : 'not-allowed' }}
        onClick={handleNext}
        disabled={!canContinue}
      >
        Signer et continuer →
      </button>
    </div>
  )
}

// ── Étape 3 — Qualification ───────────────────────────────────────────────────
function StepQualification({ ndaMeta, ndaDate, onSuccess }) {
  // Pré-remplissage depuis l'étape NDA
  const initFirstName = () => {
    if (ndaMeta.counterparty_type === 'personal') return ndaMeta.cp_first_name || ''
    return ''
  }
  const initLastName = () => {
    if (ndaMeta.counterparty_type === 'personal') return ndaMeta.cp_last_name || ''
    return ''
  }
  const initEntityName = () => {
    if (ndaMeta.counterparty_type === 'entity') return ndaMeta.counterparty_name || ''
    return ''
  }

  const [firstName, setFirstName] = useState(initFirstName)
  const [lastName, setLastName]   = useState(initLastName)
  const [email, setEmail]         = useState('')
  const [type, setType]           = useState('personal')
  const [entityName, setEntityName] = useState(initEntityName)
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
          nda_signer_name: ndaMeta.counterparty_name || '',
          nda_meta: ndaMeta,
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>

        {/* Holding */}
        <label style={{
          display: 'flex', flexDirection: 'column', gap: '6px',
          border: `2px solid ${channel === 'holding' ? '#1A3A6B' : '#E5E0D8'}`,
          borderRadius: '4px', padding: '14px 16px', cursor: 'pointer',
          backgroundColor: channel === 'holding' ? '#F0F4FA' : '#fff',
          transition: 'border-color 0.15s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="radio" name="channel" value="holding" checked={channel === 'holding'} onChange={() => setChannel('holding')} style={s.radio} />
            <span style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: '15px', color: '#1A3A6B', fontWeight: 500 }}>Retbaa Holding</span>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C4A96A' }}>Equity direct</span>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', lineHeight: '1.5', paddingLeft: '22px' }}>
            Entrez au capital de Maison Retbaa Global Holding. Ticket à partir de 30 000 € pour 1 % d'equity — avec un bonus de +1 % pour tout engagement ≥ 150 000 €. Valorisation en forte croissance : CA ×8 visé d'ici 2028.
          </p>
        </label>

        {/* SPV */}
        <label style={{
          display: 'flex', flexDirection: 'column', gap: '6px',
          border: `2px solid ${channel === 'spv' ? '#1A3A6B' : '#E5E0D8'}`,
          borderRadius: '4px', padding: '14px 16px', cursor: 'pointer',
          backgroundColor: channel === 'spv' ? '#F0F4FA' : '#fff',
          transition: 'border-color 0.15s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="radio" name="channel" value="spv" checked={channel === 'spv'} onChange={() => setChannel('spv')} style={s.radio} />
            <span style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: '15px', color: '#1A3A6B', fontWeight: 500 }}>SPV Les Adresses</span>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C4A96A' }}>Rendement patrimonial</span>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', lineHeight: '1.5', paddingLeft: '22px' }}>
            Co-investissez dans les deux premières adresses physiques Retbaa — Abidjan et Dakar — via un SPV dédié (SAS OHADA). Ticket à partir de 25 000 €. Redevance progressive sur CA (3 % → 5 %), plancher 6 %, sortie contractuelle à ×1,4 en année 5. TRI cible : 13–15 %.
          </p>
        </label>

        {/* Manufacture */}
        <label style={{
          display: 'flex', flexDirection: 'column', gap: '6px',
          border: `2px solid ${channel === 'manufacture' ? '#1A3A6B' : '#E5E0D8'}`,
          borderRadius: '4px', padding: '14px 16px', cursor: 'pointer',
          backgroundColor: channel === 'manufacture' ? '#F0F4FA' : '#fff',
          transition: 'border-color 0.15s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="radio" name="channel" value="manufacture" checked={channel === 'manufacture'} onChange={() => setChannel('manufacture')} style={s.radio} />
            <span style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: '15px', color: '#1A3A6B', fontWeight: 500 }}>Retbaa Manufacture</span>
            <span style={s.badge}>Institutionnel</span>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', lineHeight: '1.5', paddingLeft: '22px' }}>
            Financement de la filière industrielle Retbaa : production intégrée, sourcing des matières premières africaines, académie des métiers du luxe. Horizon 7–10 ans. Réservé aux investisseurs institutionnels (DFI, family offices, fonds de développement). Un accès preview est disponible — l'accès complet est soumis à validation.
          </p>
        </label>

      </div>

      {/* Montant */}
      <label style={s.label}>Niveau d'engagement envisagé *</label>
      <div style={s.radioGroup}>
        {[
          { value: '25k_50k',    label: '25 000 – 50 000 €  /  16,4 – 32,8 M FCFA' },
          { value: '50k_100k',   label: '50 000 – 100 000 €  /  32,8 – 65,6 M FCFA' },
          { value: '100k_150k',  label: '100 000 – 150 000 €  /  65,6 – 98,4 M FCFA' },
          { value: '150k_300k',  label: '150 000 – 300 000 €  /  98,4 – 196,8 M FCFA' },
          { value: 'gt_300k',    label: '300 000 € et plus  /  196,8 M FCFA et plus' },
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
  const [ndaMeta, setNdaMeta]         = useState({})
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
                ndaMeta={ndaMeta}
                setNdaMeta={setNdaMeta}
                ndaAccepted={ndaAccepted}
                setNdaAccepted={setNdaAccepted}
              />
            )}
            {step === 2 && (
              <StepQualification
                ndaMeta={ndaMeta}
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
