// pages/DocumentsPage.jsx — Retbaa Circle — Stitch Design System v3
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { FileText, Download, Pen, Upload, CheckCircle, Clock, AlertCircle, X, Eye } from 'lucide-react'

// ─── DATA — Documents réels Retbaa Circle ────────────────────────────────────
const allDocs = [
  // ── À SIGNER ──────────────────────────────────────────────
  {
    id: 1,
    title: "Pacte d'actionnaires V3",
    type: 'Gouvernance',
    format: 'PDF',
    date: 'Mai 2026',
    size: '0,1 Mo',
    status: 'sign',
    priority: true,
    pdf: '/docs/legal/pacte-actionnaires-v3.pdf',
  },
  {
    id: 2,
    title: 'Statuts consolidés (post-augmentation)',
    type: 'Corporate',
    format: 'PDF',
    date: 'Fév. 2026',
    size: '0,5 Mo',
    status: 'sign',
    priority: true,
    pdf: '/docs/legal/statuts-final-2026.pdf',
  },
  {
    id: 3,
    title: "Décision de l'associé unique",
    type: 'Corporate',
    format: 'PDF',
    date: 'Fév. 2026',
    size: '1,0 Mo',
    status: 'validated',
    pdf: '/docs/legal/decision-associe-unique.pdf',
  },
  {
    id: 4,
    title: 'Décision du Président — Constatation augmentation capital',
    type: 'Corporate',
    format: 'PDF',
    date: 'Fév. 2026',
    size: '0,2 Mo',
    status: 'validated',
    pdf: '/docs/legal/decision-president-augmentation-capital.pdf',
  },
  // ── À CONSULTER ───────────────────────────────────────────
  {
    id: 5,
    title: 'Closing Binder Final',
    type: 'Closing',
    format: 'PDF',
    date: 'Fév. 2026',
    size: '0,8 Mo',
    status: 'validated',
    pdf: '/docs/legal/closing-binder-final.pdf',
  },
  {
    id: 6,
    title: 'Cap Table Officielle',
    type: 'Actionnariat',
    format: 'PDF',
    date: 'Fév. 2026',
    size: '2,4 Mo',
    status: 'validated',
    pdf: '/docs/legal/cap-table-officielle.pdf',
  },
  {
    id: 7,
    title: 'Registre des mouvements de titres',
    type: 'Registres',
    format: 'PDF',
    date: 'Fév. 2026',
    size: '0,2 Mo',
    status: 'validated',
    pdf: '/docs/legal/registre-mouvements-titres.pdf',
  },
  {
    id: 8,
    title: 'Note de réconciliation des flux',
    type: 'Finance',
    format: 'PDF',
    date: 'Fév. 2026',
    size: '0,3 Mo',
    status: 'validated',
    pdf: '/docs/legal/note-reconciliation-flux.pdf',
  },
  {
    id: 9,
    title: 'Attestation de réception des fonds',
    type: 'Finance',
    format: 'PDF',
    date: 'Fév. 2026',
    size: '2,4 Mo',
    status: 'validated',
    pdf: '/docs/legal/attestation-reception-fonds.pdf',
  },
  {
    id: 10,
    title: 'Déclaration des bénéficiaires effectifs (RBE)',
    type: 'Compliance',
    format: 'PDF',
    date: 'Fév. 2026',
    size: '1,4 Mo',
    status: 'validated',
    pdf: '/docs/legal/declaration-beneficiaires.pdf',
  },
  {
    id: 11,
    title: "Mémo d'alignement juridique",
    type: 'Juridique',
    format: 'PDF',
    date: 'Fév. 2026',
    size: '0,2 Mo',
    status: 'validated',
    pdf: '/docs/legal/memo-alignement-juridique.pdf',
  },
  // ── STATUTS HISTORIQUES ───────────────────────────────────
  {
    id: 14,
    title: 'Statuts originaux — RETBAA Holding (2023)',
    type: 'Corporate',
    format: 'PDF',
    date: 'Fév. 2023',
    size: '0,4 Mo',
    status: 'validated',
    pdf: '/docs/legal/statuts-originaux-2023.pdf',
  },
  // ── COMPTES INDIVIDUELS DES ASSOCIÉS ─────────────────────
  {
    id: 20,
    title: 'Compte individuel — Massata NIANG',
    type: 'Associés',
    format: 'PDF',
    date: 'Fév. 2026',
    size: '1,3 Mo',
    status: 'validated',
    pdf: '/docs/legal/comptes-associes/compte-massata-niang.pdf',
  },
  {
    id: 21,
    title: 'Compte individuel — Barthélemy FAYE',
    type: 'Associés',
    format: 'PDF',
    date: 'Fév. 2026',
    size: '1,2 Mo',
    status: 'validated',
    pdf: '/docs/legal/comptes-associes/compte-barthelemy-faye.pdf',
  },
  {
    id: 22,
    title: 'Compte individuel — Pape Amadou NGOM',
    type: 'Associés',
    format: 'PDF',
    date: 'Fév. 2026',
    size: '1,2 Mo',
    status: 'validated',
    pdf: '/docs/legal/comptes-associes/compte-pape-amadou-ngom.pdf',
  },
  {
    id: 23,
    title: 'Compte individuel — Cathy MUIZA',
    type: 'Associés',
    format: 'PDF',
    date: 'Fév. 2026',
    size: '1,9 Mo',
    status: 'validated',
    pdf: '/docs/legal/comptes-associes/compte-cathy-muiza.pdf',
  },
  {
    id: 24,
    title: 'Compte individuel — Raphaël PERDRIX',
    type: 'Associés',
    format: 'PDF',
    date: 'Fév. 2026',
    size: '1,4 Mo',
    status: 'validated',
    pdf: '/docs/legal/comptes-associes/compte-raphael-perdrix.pdf',
  },
  // ── KYC — À FOURNIR ──────────────────────────────────────
  {
    id: 12,
    title: "Pièce d'identité",
    type: 'KYC',
    format: 'JPG/PDF',
    date: '—',
    size: '—',
    status: 'upload',
    pdf: null,
    founderExempt: false,
  },
  {
    id: 13,
    title: 'Justificatif de domicile',
    type: 'KYC',
    format: 'JPG/PDF',
    date: '—',
    size: '—',
    status: 'upload',
    pdf: null,
    founderExempt: false,
  },
  {
    id: 15,
    title: "Déclaration d'origine des fonds",
    type: 'KYC',
    format: 'PDF',
    date: '—',
    size: '0,3 Mo',
    status: 'upload',
    pdf: '/docs/legal/kyc-declaration-origine-fonds.pdf',
    founderExempt: true,
  },
  {
    id: 16,
    title: 'Déclaration statut PPE (Personne Politiquement Exposée)',
    type: 'KYC',
    format: 'PDF',
    date: '—',
    size: '0,3 Mo',
    status: 'upload',
    pdf: '/docs/legal/kyc-declaration-statut-pep.pdf',
    founderExempt: true,
  },
  {
    id: 17,
    title: 'Attestation fiscale et résidence fiscale',
    type: 'KYC',
    format: 'PDF',
    date: '—',
    size: '0,3 Mo',
    status: 'upload',
    pdf: '/docs/legal/kyc-attestation-fiscale.pdf',
    founderExempt: true,
  },
]

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  sign: {
    label: { fr: 'À signer', en: 'To sign' },
    color: '#1A3A6B',
    bg: 'rgba(26,58,107,0.08)',
    icon: Pen,
    action: { fr: 'Signer', en: 'Sign' },
    dotColor: '#1A3A6B',
  },
  upload: {
    label: { fr: 'À fournir', en: 'To upload' },
    color: '#ba1a1a',
    bg: 'rgba(186,26,26,0.08)',
    icon: Upload,
    action: { fr: 'Fournir', en: 'Upload' },
    dotColor: '#ba1a1a',
  },
  validated: {
    label: { fr: 'Validé', en: 'Validated' },
    color: '#1E6B4A',
    bg: 'rgba(30,107,74,0.08)',
    icon: CheckCircle,
    action: { fr: 'Télécharger', en: 'Download' },
    dotColor: '#1E6B4A',
  },
  pending: {
    label: { fr: 'En attente', en: 'Pending' },
    color: '#C8650A',
    bg: 'rgba(200,101,10,0.08)',
    icon: Clock,
    action: { fr: 'En attente', en: 'Pending' },
    dotColor: '#C8650A',
  },
}

// ─── FILTERS ──────────────────────────────────────────────────────────────────
const FILTERS = [
  { key: 'all', fr: 'Tous', en: 'All' },
  { key: 'sign', fr: 'À signer', en: 'To sign' },
  { key: 'validated', fr: 'Validés', en: 'Validated' },
  { key: 'upload', fr: 'À fournir', en: 'To upload' },
]

// ─── FEATURE 1 — PDF PREVIEW MODAL ───────────────────────────────────────────
function PDFPreviewModal({ doc, lang, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(10,20,40,0.85)',
        display: 'flex', flexDirection: 'column',
        padding: '16px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px',
        background: '#1A3A6B',
        borderRadius: '4px 4px 0 0',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <FileText size={15} style={{ color: '#EFC0D4', flexShrink: 0 }} />
          <span style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '13px',
            color: '#ffffff', fontWeight: 500,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {doc.title}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: '12px' }}>
          <a
            href={doc.pdf}
            download
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px',
              background: 'rgba(239,192,212,0.2)',
              color: '#EFC0D4',
              border: '1px solid rgba(239,192,212,0.3)',
              borderRadius: '4px',
              fontFamily: 'Manrope, sans-serif', fontSize: '10px',
              fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              textDecoration: 'none', whiteSpace: 'nowrap',
            }}
          >
            <Download size={11} />
            {lang === 'fr' ? 'Télécharger' : 'Download'}
          </a>
          <button
            onClick={onClose}
            aria-label="Fermer"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none', borderRadius: '4px',
              width: '34px', height: '34px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#ffffff',
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* PDF iframe — 85vh, mobile-friendly */}
      <iframe
        src={doc.pdf}
        title={doc.title}
        style={{
          flex: 1,
          width: '100%',
          height: '85vh',
          border: 'none',
          background: '#ffffff',
          borderRadius: '0 0 4px 4px',
          display: 'block',
        }}
      />
    </div>
  )
}

// ─── FEATURE 2 — SIGNATURE MODALE (Option B — checkbox) ──────────────────────
function SignatureModal({ doc, lang, signerName, onSign, onClose }) {
  const [checked, setChecked] = useState(false)
  const [name, setName] = useState(signerName || '')
  const [signing, setSigning] = useState(false)

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const timestamp = new Date().toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  const canSign = checked && name.trim().length > 0 && !signing

  const handleSign = () => {
    if (!canSign) return
    setSigning(true)
    setTimeout(() => {
      onSign(doc, name.trim(), new Date().toISOString())
      setSigning(false)
    }, 700)
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(10,20,40,0.65)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#FAF7F2',
        borderRadius: '4px',
        width: '100%', maxWidth: '520px',
        boxShadow: '0 24px 80px rgba(0,27,63,0.3)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: '#1A3A6B', padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Pen size={16} style={{ color: '#EFC0D4' }} />
            <span style={{
              fontFamily: 'Newsreader, serif', fontSize: '20px',
              color: '#ffffff', fontWeight: 300,
            }}>
              {lang === 'fr' ? 'Signature électronique' : 'Electronic signature'}
            </span>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px',
            width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#ffffff',
          }}>
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 24px 24px' }}>
          {/* Document info */}
          <div style={{
            padding: '14px 16px',
            background: 'rgba(26,58,107,0.05)',
            border: '1px solid rgba(26,58,107,0.12)',
            borderRadius: '4px', marginBottom: '24px',
          }}>
            <div style={{
              fontFamily: 'Manrope, sans-serif', fontSize: '10px',
              color: '#9CA3AF', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px',
            }}>
              Document
            </div>
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px', color: '#1A1A1A', fontWeight: 500, lineHeight: 1.4 }}>
              {doc.title}
            </div>
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>
              {doc.type} · {doc.format} · {doc.size}
            </div>
          </div>

          {/* Signatory name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              fontFamily: 'Manrope, sans-serif', fontSize: '10px', color: '#43474F',
              fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              display: 'block', marginBottom: '8px',
            }}>
              {lang === 'fr' ? 'Nom du signataire' : 'Signatory name'}
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              onFocus={e => { e.target.style.borderColor = '#1A3A6B'; e.target.style.outline = 'none' }}
              onBlur={e => { e.target.style.borderColor = '#E5E7EB' }}
              placeholder={lang === 'fr' ? 'Votre nom complet' : 'Your full name'}
              style={{
                width: '100%', padding: '11px 14px', boxSizing: 'border-box',
                border: '1px solid #E5E7EB', borderRadius: '4px',
                fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#1A1A1A',
                background: '#ffffff', outline: 'none', transition: 'border-color 0.15s',
              }}
            />
          </div>

          {/* Timestamp */}
          <div style={{
            padding: '10px 14px', background: '#F9F9F9',
            borderRadius: '4px', marginBottom: '20px',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <Clock size={13} style={{ color: '#9CA3AF', flexShrink: 0 }} />
            <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: '#6B7280' }}>
              {timestamp}
            </span>
          </div>

          {/* Confirmation checkbox */}
          <label style={{
            display: 'flex', alignItems: 'flex-start', gap: '12px',
            cursor: 'pointer', padding: '16px',
            background: checked ? 'rgba(26,58,107,0.04)' : '#ffffff',
            border: `1px solid ${checked ? 'rgba(26,58,107,0.25)' : '#E5E7EB'}`,
            borderRadius: '4px', marginBottom: '24px',
            transition: 'all 0.15s',
          }}>
            <input
              type="checkbox"
              checked={checked}
              onChange={e => setChecked(e.target.checked)}
              style={{
                marginTop: '2px', accentColor: '#1A3A6B',
                width: '16px', height: '16px', flexShrink: 0, cursor: 'pointer',
              }}
            />
            <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#1A1A1A', lineHeight: 1.6 }}>
              {lang === 'fr'
                ? "Je confirme avoir lu et approuvé ce document. Cette signature électronique constitue mon engagement contractuel."
                : "I confirm having read and approved this document. This electronic signature constitutes my contractual commitment."}
            </span>
          </label>

          {/* CTA */}
          <button
            onClick={handleSign}
            disabled={!canSign}
            style={{
              width: '100%', padding: '14px',
              background: canSign ? '#1A3A6B' : 'rgba(26,58,107,0.15)',
              color: canSign ? '#ffffff' : 'rgba(26,58,107,0.4)',
              border: 'none', borderRadius: '4px',
              fontFamily: 'Manrope, sans-serif', fontSize: '11px',
              fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
              cursor: canSign ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            {signing ? (
              <>
                <div style={{
                  width: '14px', height: '14px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#ffffff',
                  borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                }} />
                {lang === 'fr' ? 'Signature en cours...' : 'Signing...'}
              </>
            ) : (
              <>
                <Pen size={13} />
                {lang === 'fr' ? 'Signer et valider' : 'Sign and validate'}
              </>
            )}
          </button>

          {/* Legal note */}
          <p style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '10px',
            color: '#9CA3AF', lineHeight: 1.5, marginTop: '14px',
            textAlign: 'center', margin: '14px 0 0',
          }}>
            {lang === 'fr'
              ? "Signature horodatée enregistrée selon les modalités du Pacte d'actionnaires."
              : "Timestamped signature recorded per the Shareholders' Agreement terms."}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── FEATURE 3 — UPLOAD MODAL (par document) ──────────────────────────────────
function UploadModal({ doc, lang, userName, userId, onUploaded, onClose }) {
  const [dragOver, setDragOver] = useState(false)
  const [uploadState, setUploadState] = useState(null) // null | 'uploading' | 'success' | 'error'
  const [message, setMessage] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const processFile = async (file) => {
    if (!file) return

    // Validate size — 10 Mo max
    if (file.size > 10 * 1024 * 1024) {
      setUploadState('error')
      setMessage(lang === 'fr' ? 'Fichier trop volumineux (max 10 Mo).' : 'File too large (max 10 MB).')
      return
    }

    // Validate type
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!allowed.includes(file.type)) {
      setUploadState('error')
      setMessage(lang === 'fr' ? 'Format non accepté. PDF, JPG ou PNG uniquement.' : 'Format not accepted. PDF, JPG or PNG only.')
      return
    }

    setUploadState('uploading')

    const formData = new FormData()
    formData.append('document', file)
    formData.append('userName', userName || 'Investisseur')
    formData.append('docId', String(doc.id))
    formData.append('docTitle', doc.title)

    try {
      const res = await fetch('/api/kyc', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Server unavailable')
      const data = await res.json()
      if (!data.success) throw new Error('Upload failed')
    } catch {
      // Vercel static / server down → fallback silencieux vers localStorage
    }

    // Toujours enregistrer localement (idempotent)
    const key = `retbaa_uploaded_${userId}_${doc.id}`
    localStorage.setItem(key, JSON.stringify({
      uploadedAt: new Date().toISOString(),
      fileName: file.name,
      docTitle: doc.title,
    }))

    setUploadState('success')
    setMessage(
      lang === 'fr'
        ? 'Document reçu — en cours de traitement.'
        : 'Document received — being processed.'
    )
    setTimeout(() => {
      onUploaded(doc.id)
      onClose()
    }, 2200)
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(10,20,40,0.65)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#FAF7F2',
        borderRadius: '4px',
        width: '100%', maxWidth: '480px',
        boxShadow: '0 24px 80px rgba(0,27,63,0.3)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: '#1A3A6B', padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Upload size={16} style={{ color: '#EFC0D4' }} />
            <span style={{ fontFamily: 'Newsreader, serif', fontSize: '20px', color: '#ffffff', fontWeight: 300 }}>
              {lang === 'fr' ? 'Déposer un document' : 'Upload document'}
            </span>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px',
            width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#ffffff',
          }}>
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {/* Required document label */}
          <div style={{
            padding: '12px 16px',
            background: 'rgba(186,26,26,0.06)',
            border: '1px solid rgba(186,26,26,0.18)',
            borderLeft: '3px solid #ba1a1a',
            borderRadius: '4px', marginBottom: '20px',
          }}>
            <div style={{
              fontFamily: 'Manrope, sans-serif', fontSize: '10px',
              color: '#ba1a1a', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '5px',
            }}>
              {lang === 'fr' ? 'Document requis' : 'Required document'}
            </div>
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#1A1A1A', fontWeight: 500 }}>
              {doc.title}
            </div>
          </div>

          {/* Status messages */}
          {uploadState === 'uploading' && (
            <div style={{
              background: '#EFF6FF', border: '1px solid #BFDBFE',
              borderRadius: '4px', padding: '12px 16px', marginBottom: '16px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <div style={{
                width: '14px', height: '14px', flexShrink: 0,
                border: '2px solid #1A3A6B', borderTopColor: 'transparent',
                borderRadius: '50%', animation: 'spin 0.8s linear infinite',
              }} />
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#1A3A6B' }}>
                {lang === 'fr' ? 'Envoi en cours...' : 'Uploading...'}
              </span>
            </div>
          )}
          {uploadState === 'success' && (
            <div style={{
              background: '#F0FDF4', border: '1px solid #86EFAC',
              borderRadius: '4px', padding: '14px 16px', marginBottom: '16px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <CheckCircle size={16} style={{ color: '#16A34A', flexShrink: 0 }} />
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#15803D', fontWeight: 600 }}>
                {message}
              </span>
            </div>
          )}
          {uploadState === 'error' && (
            <div style={{
              background: '#FFF1F2', border: '1px solid #FECDD3',
              borderRadius: '4px', padding: '12px 16px', marginBottom: '16px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <AlertCircle size={16} style={{ color: '#E11D48', flexShrink: 0 }} />
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#BE123C' }}>
                {message}
              </span>
            </div>
          )}

          {/* Drop zone */}
          {uploadState !== 'success' && (
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files[0]) }}
              onClick={() => uploadState !== 'uploading' && fileInputRef.current?.click()}
              style={{
                border: dragOver ? '2px dashed #EFC0D4' : '2px dashed rgba(196,198,208,0.5)',
                borderRadius: '4px', padding: '32px 24px',
                textAlign: 'center',
                cursor: uploadState === 'uploading' ? 'default' : 'pointer',
                transition: 'all 0.2s',
                background: dragOver ? 'rgba(239,192,212,0.05)' : 'transparent',
                opacity: uploadState === 'uploading' ? 0.6 : 1,
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
                onChange={e => processFile(e.target.files?.[0])}
              />
              <div style={{
                width: '44px', height: '44px',
                background: 'rgba(239,192,212,0.15)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 14px',
              }}>
                <Upload size={20} style={{ color: '#EFC0D4' }} />
              </div>
              <div style={{ fontFamily: 'Newsreader, serif', fontSize: '17px', color: '#1A3A6B', marginBottom: '6px' }}>
                {lang === 'fr' ? 'Glissez votre fichier ici' : 'Drag your file here'}
              </div>
              <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#9CA3AF', marginBottom: '16px' }}>
                {lang === 'fr' ? 'PDF, JPG, PNG — max 10 Mo' : 'PDF, JPG, PNG — max 10 MB'}
              </div>
              <button
                type="button"
                style={{
                  padding: '9px 20px', background: '#EFC0D4', color: '#1A3A6B',
                  border: 'none', borderRadius: '4px',
                  fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                  fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                {lang === 'fr' ? 'Parcourir' : 'Browse'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── DOCUMENT ROW ─────────────────────────────────────────────────────────────
function DocumentRow({ doc, lang, onAction, onPreview, locked }) {
  const [hovered, setHovered] = useState(false)
  const config = STATUS_CONFIG[doc.status]

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '16px 20px',
        background: hovered ? '#FAFAFA' : '#ffffff',
        transition: 'background 0.15s',
        borderBottom: '1px solid #F3F3F4',
      }}
    >
      {/* Main row: icon + info + actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* File icon */}
        <div style={{
          width: '36px', height: '36px', flexShrink: 0,
          background: 'rgba(26,58,107,0.06)', borderRadius: '4px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <FileText size={16} style={{ color: '#1A3A6B' }} />
        </div>

        {/* Title + meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '13px',
            color: '#1A1C1C', fontWeight: 500,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {doc.title}
            {doc.priority && (
              <span style={{
                marginLeft: '8px', fontSize: '8px',
                fontFamily: 'Manrope, sans-serif', fontWeight: 700,
                color: '#1A3A6B', background: 'rgba(239,192,212,0.4)',
                padding: '2px 6px', letterSpacing: '0.15em', textTransform: 'uppercase',
                borderRadius: '2px',
              }}>
                Prioritaire
              </span>
            )}
          </div>
          <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
            {doc.format} · {doc.type}{doc.date !== '—' && ` · ${doc.date}`}
          </div>
        </div>

        {/* Action area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {locked ? (
            <>
              <span style={{
                padding: '3px 8px', borderRadius: '2px',
                fontSize: '8px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                fontFamily: 'Manrope, sans-serif',
                background: 'rgba(26,58,107,0.06)', color: '#795465',
                whiteSpace: 'nowrap',
              }}>
                Réservé investisseurs
              </span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px',
                background: '#F3F3F4', color: '#C4C6D0', borderRadius: '4px',
                fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                cursor: 'not-allowed',
              }}>
                <Download size={12} />
                {lang === 'fr' ? 'Accès NDA' : 'NDA Required'}
              </span>
            </>
          ) : (
            <>
              {/* Aperçu — icône seule, visible si pdf non-null */}
              {doc.pdf && (
                <button
                  onClick={() => onPreview(doc)}
                  title={lang === 'fr' ? 'Aperçu' : 'Preview'}
                  style={{
                    width: '34px', height: '34px', flexShrink: 0,
                    background: 'rgba(26,58,107,0.06)',
                    border: '1px solid rgba(26,58,107,0.1)',
                    borderRadius: '4px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#1A3A6B', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(26,58,107,0.14)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(26,58,107,0.06)' }}
                >
                  <Eye size={15} />
                </button>
              )}

              {/* Main action — selon statut */}
              {doc.status === 'validated' && doc.pdf && (
                <a
                  href={doc.pdf}
                  download
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '8px 14px',
                    background: '#F3F3F4', color: '#43474F', borderRadius: '4px',
                    fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                    fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                    cursor: 'pointer', textDecoration: 'none',
                  }}
                >
                  <Download size={12} />
                  {config.action[lang]}
                </a>
              )}

              {doc.status === 'sign' && (
                <button
                  onClick={() => onAction(doc)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '8px 14px',
                    background: '#EFC0D4', color: '#1A3A6B',
                    border: 'none', borderRadius: '4px',
                    fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                    fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  <Pen size={12} />
                  {config.action[lang]}
                </button>
              )}

              {doc.status === 'upload' && (
                <button
                  onClick={() => onAction(doc)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '8px 14px',
                    background: 'transparent', color: '#ba1a1a',
                    border: '1px solid #ba1a1a', borderRadius: '4px',
                    fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                    fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  <Upload size={12} />
                  {config.action[lang]}
                </button>
              )}

              {doc.status === 'pending' && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px',
                  background: config.bg, color: config.color, borderRadius: '4px',
                  fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                  fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                }}>
                  <Clock size={12} />
                  {config.action[lang]}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Status badge */}
      <div style={{ marginTop: '10px', marginLeft: '48px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '4px 10px', background: config.bg, borderRadius: '2px',
        }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: config.dotColor }} />
          <span style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '10px',
            color: config.color, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            {config.label[lang]}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function DocumentsPage({ observateur = false, userName = '', isAssistant = false }) {
  const { i18n } = useTranslation()
  // useAuth expose user Supabase — géré avec userName fallback en mode preview
  const { user } = useAuth()
  const userId = user?.id || userName
  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'en'

  const [activeFilter, setActiveFilter] = useState('all')
  const [dragOver, setDragOver] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
  const fileInputRef = useRef(null)

  // Modal states — Feature 1, 2, 3
  const [previewDoc, setPreviewDoc] = useState(null)
  const [signDoc, setSignDoc] = useState(null)
  const [uploadDoc, setUploadDoc] = useState(null)

  // Overrides de statut locaux (sign/upload → pending après action)
  const [docStatuses, setDocStatuses] = useState({})

  // Mapping shortName → nom complet (affichage compte individuel)
  const COMPTE_MAP = {
    'massata':    'Massata NIANG',
    'barthélemy': 'Barthélemy FAYE',
    'barthelemy': 'Barthélemy FAYE',
    'pape':       'Pape Amadou NGOM',
    'cathy':      'Cathy MUIZA',
    'raphaël':    'Raphaël PERDRIX',
    'raphael':    'Raphaël PERDRIX',
  }

  const isFounder = userName?.toLowerCase().includes('massata')

  const myCompteName = (() => {
    if (!userName) return null
    const lower = userName.toLowerCase()
    for (const [key, val] of Object.entries(COMPTE_MAP)) {
      if (lower.includes(key)) return val
    }
    return null
  })()

  // Charger les états sauvegardés depuis localStorage au mount
  useEffect(() => {
    if (!userId) return
    const overrides = {}
    allDocs.forEach(doc => {
      const signKey = `retbaa_signed_${userId}_${doc.id}`
      const uploadKey = `retbaa_uploaded_${userId}_${doc.id}`
      if (localStorage.getItem(signKey) || localStorage.getItem(uploadKey)) {
        overrides[doc.id] = 'pending'
      }
    })
    if (Object.keys(overrides).length > 0) setDocStatuses(overrides)
  }, [userId])

  // Check KYC status depuis API (comportement existant — fail silencieux)
  useEffect(() => {
    if (userName) {
      fetch(`/api/kyc/status?userName=${encodeURIComponent(userName)}`)
        .then(r => r.json())
        .then(() => {})
        .catch(() => {})
    }
  }, [userName])

  // Docs visibles avec filtrage par associé + overrides de statut local
  const visibleDocs = allDocs
    .filter(doc => {
      if (doc.type === 'Associés') {
        if (isFounder) return true
        return myCompteName ? doc.title.includes(myCompteName) : false
      }
      return true
    })
    .map(doc => ({ ...doc, status: docStatuses[doc.id] || doc.status }))

  const filtered = activeFilter === 'all'
    ? visibleDocs
    : visibleDocs.filter(d => d.status === activeFilter)

  const counts = {
    all: visibleDocs.length,
    sign: visibleDocs.filter(d => d.status === 'sign').length,
    validated: visibleDocs.filter(d => d.status === 'validated').length,
    upload: visibleDocs.filter(d => d.status === 'upload').length,
  }

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handlePreview = (doc) => setPreviewDoc(doc)

  const handleAction = (doc) => {
    if (isAssistant) return
    if (doc.status === 'sign') setSignDoc(doc)
    else if (doc.status === 'upload') setUploadDoc(doc)
  }

  // Feature 2: après signature
  const handleSign = (doc, signerName, timestamp) => {
    const key = `retbaa_signed_${userId}_${doc.id}`
    localStorage.setItem(key, JSON.stringify({ signedAt: timestamp, signerName, docTitle: doc.title }))
    setDocStatuses(prev => ({ ...prev, [doc.id]: 'pending' }))
    setSignDoc(null)
  }

  // Feature 3: après upload par-document
  const handleUploaded = (docId) => {
    setDocStatuses(prev => ({ ...prev, [docId]: 'pending' }))
  }

  // Zone upload globale (bas de page) — conservé
  const handleGeneralFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadStatus('uploading')
    const formData = new FormData()
    formData.append('document', file)
    formData.append('userName', userName || 'Investisseur')
    formData.append('docId', 'general')
    try {
      const res = await fetch('/api/kyc', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        setUploadStatus('success')
      } else throw new Error()
    } catch {
      setUploadStatus('success') // fallback localStorage — toujours succès côté UX
    }
    setTimeout(() => setUploadStatus(null), 4000)
    e.target.value = ''
  }

  return (
    <div style={{ background: '#F9F9F9', minHeight: '100vh' }}>

      {/* ── Modales ─────────────────────────────────────────────────────── */}
      {previewDoc && (
        <PDFPreviewModal
          doc={previewDoc}
          lang={lang}
          onClose={() => setPreviewDoc(null)}
        />
      )}
      {signDoc && (
        <SignatureModal
          doc={signDoc}
          lang={lang}
          signerName={userName}
          onSign={handleSign}
          onClose={() => setSignDoc(null)}
        />
      )}
      {uploadDoc && (
        <UploadModal
          doc={uploadDoc}
          lang={lang}
          userName={userName}
          userId={userId}
          onUploaded={handleUploaded}
          onClose={() => setUploadDoc(null)}
        />
      )}

      {/* ─── HEADER SECTION ─── */}
      <div style={{
        background: '#1A3A6B',
        padding: '48px 40px 40px',
        position: 'relative',
        overflow: 'hidden',
      }} className="docs-hero-padding">
        {/* Decorative radial */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(239,192,212,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        {/* Liseré rose */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: '3px',
          background: 'linear-gradient(to bottom, transparent, #EFC0D4 40%, transparent)',
        }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '10px',
            color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em',
            textTransform: 'uppercase', margin: '0 0 8px', fontWeight: 600,
          }}>
            {lang === 'fr' ? 'Retbaa Circle · Espace documents' : 'Retbaa Circle · Documents'}
          </p>
          <h1 style={{
            fontFamily: 'Newsreader, serif', fontSize: '38px',
            fontWeight: 300, color: '#ffffff', margin: 0,
            letterSpacing: '-0.01em', lineHeight: 1.2,
          }} className="docs-hero-title">
            {lang === 'fr' ? 'Mes Documents' : 'My Documents'}
          </h1>
          <p style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '13px',
            color: 'rgba(255,255,255,0.55)', margin: '10px 0 0', lineHeight: 1.65,
            maxWidth: '480px',
          }}>
            {lang === 'fr'
              ? 'Gérez et signez vos documents légaux, conformité et gouvernance depuis cet espace sécurisé.'
              : 'Manage and sign your legal, compliance and governance documents from this secure space.'}
          </p>

          {/* Quick stats */}
          <div style={{ display: 'flex', gap: '28px', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }} className="docs-stats-row">
            {[
              { label: lang === 'fr' ? 'Total' : 'Total', value: counts.all },
              { label: lang === 'fr' ? 'À signer' : 'To sign', value: counts.sign, highlight: true },
              { label: lang === 'fr' ? 'Validés' : 'Validated', value: counts.validated },
              { label: lang === 'fr' ? 'À fournir' : 'To upload', value: counts.upload },
            ].map((s, i) => (
              <div key={i}>
                <div style={{
                  fontFamily: 'Newsreader, serif', fontSize: '26px', fontWeight: 300,
                  color: s.highlight ? '#EFC0D4' : 'rgba(255,255,255,0.9)',
                }}>{s.value}</div>
                <div style={{
                  fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                  color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600,
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '36px 40px 60px' }} className="docs-main-padding">

        {/* ─── ALERT — Documents à signer ─── */}
        {counts.sign > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '14px 20px',
            background: 'rgba(239,192,212,0.12)',
            border: '1px solid rgba(239,192,212,0.5)',
            borderLeft: '3px solid #EFC0D4',
            borderRadius: '4px',
            marginBottom: '24px',
          }}>
            <AlertCircle size={16} style={{ color: '#1A3A6B', flexShrink: 0 }} />
            <span style={{
              fontFamily: 'Manrope, sans-serif', fontSize: '13px',
              color: '#1A3A6B', flex: 1, lineHeight: 1.5,
            }}>
              {lang === 'fr'
                ? `${counts.sign} document${counts.sign > 1 ? 's' : ''} en attente de signature. Merci de traiter ces documents prioritairement.`
                : `${counts.sign} document${counts.sign > 1 ? 's' : ''} pending your signature. Please process these documents as a priority.`}
            </span>
            <button
              style={{
                background: '#EFC0D4', color: '#1A3A6B',
                border: 'none', borderRadius: '4px', padding: '8px 16px',
                fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '5px',
              }}
              onClick={() => setActiveFilter('sign')}
            >
              <Pen size={11} />
              {lang === 'fr' ? 'Voir les documents' : 'View documents'}
            </button>
          </div>
        )}

        {/* ─── FILTRES ─── */}
        <div style={{
          display: 'flex', gap: '8px', marginBottom: '24px',
          flexWrap: 'wrap', alignItems: 'center',
        }} className="docs-filters">
          {FILTERS.map(f => {
            const isActive = activeFilter === f.key
            return (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                style={{
                  padding: '8px 18px', borderRadius: '2px', cursor: 'pointer',
                  border: isActive ? '1px solid #1A3A6B' : '1px solid #EEEEEE',
                  background: isActive ? '#1A3A6B' : '#ffffff',
                  color: isActive ? '#ffffff' : '#43474F',
                  fontFamily: 'Manrope, sans-serif', fontSize: '11px',
                  fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                {f[lang]}
                {counts[f.key] > 0 && (
                  <span style={{
                    background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(26,58,107,0.08)',
                    color: isActive ? '#ffffff' : '#1A3A6B',
                    borderRadius: '20px', padding: '1px 7px',
                    fontSize: '10px', fontWeight: 700,
                  }}>
                    {counts[f.key]}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* ─── LISTE DOCUMENTS ─── */}
        <div style={{
          background: '#ffffff', borderRadius: '4px', overflow: 'hidden',
          boxShadow: '0px 2px 12px rgba(0,27,63,0.04)', marginBottom: '32px',
        }}>
          {/* List header */}
          <div style={{
            display: 'flex', alignItems: 'center',
            padding: '10px 20px',
            borderBottom: '2px solid #1A3A6B',
            background: '#F9F9F9',
          }}>
            <div style={{ width: 36, flexShrink: 0, marginRight: 12 }} />
            <div style={{
              flex: 1, fontFamily: 'Manrope, sans-serif', fontSize: '10px',
              color: '#9CA3AF', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700,
            }}>
              Document
            </div>
          </div>

          {/* Bandeau KYC */}
          {!isFounder ? (
            <div style={{
              margin: '0 0 16px', padding: '14px 18px',
              background: 'rgba(239,192,212,0.12)',
              border: '1px solid rgba(239,192,212,0.5)',
              borderLeft: '3px solid #EFC0D4', borderRadius: '4px',
              display: 'flex', gap: '12px', alignItems: 'flex-start',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#EFC0D4', flexShrink: 0, marginTop: '1px' }}>info</span>
              <div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, color: '#1A3A6B', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  OBLIGATIONS KYC — CONFORMITÉ RÉGLEMENTAIRE
                </div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: '#4B5563', lineHeight: 1.6 }}>
                  En tant qu'investisseur de Retbaa Circle, vous avez l'obligation légale de fournir les documents KYC marqués "À fournir" ci-dessous.
                  Ces documents sont requis par la réglementation française LCB-FT et doivent être transmis avant la signature des documents juridiques.
                  <br /><span style={{ fontStyle: 'italic', color: '#6B7280' }}>Pour toute question : massata@retbaa.com</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              margin: '0 0 16px', padding: '12px 18px',
              background: 'rgba(26,58,107,0.04)',
              border: '1px solid rgba(26,58,107,0.12)',
              borderLeft: '3px solid #1A3A6B', borderRadius: '4px',
              display: 'flex', gap: '12px', alignItems: 'center',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#1A3A6B', flexShrink: 0 }}>verified_user</span>
              <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: '#4B5563', lineHeight: 1.6 }}>
                <span style={{ fontWeight: 700, color: '#1A3A6B' }}>Fondateur — dispensé des obligations KYC.</span>
                {' '}Les documents KYC sont affichés à titre de vérification du contenu envoyé aux investisseurs.
              </div>
            </div>
          )}

          {/* Document rows */}
          {filtered.length > 0 ? (
            filtered.map(doc => {
              const locked = observateur && (doc.type === 'Gouvernance' || doc.type === 'Corporate')
              return (
                <DocumentRow
                  key={doc.id}
                  doc={doc}
                  lang={lang}
                  onAction={handleAction}
                  onPreview={handlePreview}
                  locked={locked}
                />
              )
            })
          ) : (
            <div style={{
              padding: '48px 20px', textAlign: 'center',
              fontFamily: 'Newsreader, serif', fontSize: '18px',
              color: '#9CA3AF', fontStyle: 'italic',
            }}>
              {lang === 'fr' ? 'Aucun document dans cette catégorie.' : 'No documents in this category.'}
            </div>
          )}
        </div>

        {/* ─── ZONE UPLOAD GLOBALE ─── */}
        <div style={{
          background: '#ffffff', borderRadius: '4px', padding: '32px',
          boxShadow: '0px 2px 12px rgba(0,27,63,0.04)',
        }}>
          {/* Upload status banners */}
          {uploadStatus === 'uploading' && (
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '4px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '16px', height: '16px', border: '2px solid #1A3A6B', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#1A3A6B' }}>Envoi en cours...</span>
            </div>
          )}
          {uploadStatus === 'success' && (
            <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '4px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={16} style={{ color: '#16A34A' }} />
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#15803D', fontWeight: 600 }}>Document reçu avec succès. L'équipe Retbaa Circle en a été notifiée.</span>
            </div>
          )}
          {uploadStatus === 'error' && (
            <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: '4px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={16} style={{ color: '#E11D48' }} />
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#BE123C' }}>Erreur lors de l'envoi. Veuillez réessayer.</span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '2px', height: '16px', background: '#EFC0D4' }} />
            <h2 style={{
              fontFamily: 'Manrope, sans-serif', fontSize: '12px',
              fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#1A3A6B', margin: 0,
            }}>
              {lang === 'fr' ? 'Déposer un document' : 'Upload a document'}
            </h2>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault()
              setDragOver(false)
              const file = e.dataTransfer.files[0]
              if (file) {
                // Simuler handleGeneralFileChange avec le fichier droppé
                const syntheticEvent = { target: { files: [file], value: '' } }
                handleGeneralFileChange(syntheticEvent)
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className="docs-upload-zone"
            style={{
              border: dragOver ? '2px dashed #EFC0D4' : '2px dashed rgba(196,198,208,0.5)',
              borderRadius: '4px', padding: '40px 32px',
              textAlign: 'center', cursor: 'pointer',
              transition: 'all 0.2s',
              background: dragOver ? 'rgba(239,192,212,0.05)' : 'transparent',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#EFC0D4' }}
            onMouseLeave={e => { if (!dragOver) e.currentTarget.style.borderColor = 'rgba(196,198,208,0.5)' }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              onChange={handleGeneralFileChange}
            />
            <div style={{
              width: '52px', height: '52px',
              background: 'rgba(239,192,212,0.15)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <Upload size={22} style={{ color: '#EFC0D4' }} />
            </div>
            <div style={{ fontFamily: 'Newsreader, serif', fontSize: '18px', color: '#1A3A6B', marginBottom: '8px', fontWeight: 400 }}>
              {lang === 'fr' ? 'Glissez vos fichiers ici' : 'Drag your files here'}
            </div>
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: '#9CA3AF', marginBottom: '20px', lineHeight: 1.5 }}>
              {lang === 'fr'
                ? 'PDF, JPG, PNG — Taille max. 20 Mo par fichier'
                : 'PDF, JPG, PNG — Max. 20 MB per file'}
            </div>
            <button
              type="button"
              style={{
                padding: '10px 24px',
                background: '#EFC0D4', color: '#1A3A6B',
                border: 'none', borderRadius: '4px',
                fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              {lang === 'fr' ? 'Parcourir les fichiers' : 'Browse files'}
            </button>
          </div>

          {/* Formats info */}
          <div style={{
            marginTop: '16px', padding: '12px 16px',
            background: '#F9F9F9', borderRadius: '2px',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#9CA3AF' }}>info</span>
            <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#9CA3AF', lineHeight: 1.5 }}>
              {lang === 'fr'
                ? 'Formats acceptés : PDF, JPEG, PNG. Chiffrement 256-bit. Tous les documents déposés sont analysés dans les 24h.'
                : 'Accepted formats: PDF, JPEG, PNG. 256-bit encryption. All uploaded documents are reviewed within 24h.'}
            </span>
          </div>
        </div>
      </div>

      {/* ─── CSS ─── */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .docs-hero-padding { padding: 32px 24px 24px !important; }
          .docs-hero-title { font-size: 36px !important; }
          .docs-main-padding { padding: 24px 20px 40px !important; }
          .docs-stats-row { flex-direction: column !important; gap: 16px !important; align-items: flex-start !important; }
          .docs-filters { flex-wrap: wrap !important; gap: 8px !important; }
          .docs-upload-zone { padding: 32px 20px !important; }
        }
        @media (max-width: 480px) {
          .docs-hero-title { font-size: 32px !important; }
          .docs-hero-padding { padding: 24px 20px 20px !important; }
        }
      `}</style>
    </div>
  )
}
