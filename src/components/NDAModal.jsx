// components/NDAModal.jsx — Retbaa Circle
// Modal NDA pleine page — s'affiche dès le choix de profil sur HomePage
import { useState } from 'react'
import { sendEmail } from '../lib/brevo'
import { ndaSignedConfirmation, notifyAdminInstitutional } from '../lib/emailTemplates'

const SUPABASE_URL = 'https://lufozqtrwrmowzojxcoi.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1Zm96cXRyd3Jtb3d6b2p4Y29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyOTcwNjMsImV4cCI6MjA5Mjg3MzA2M30._-jdklZKN7xAc4M9A55A5qqyVml5gkXU3URe_EyM9k4'

const NDA_TEXT = `ACCORD DE NON-DIVULGATION

Entre Retbaa SAS (ci-après "la Société") et le signataire (ci-après "le Destinataire").

1. OBJET
Le présent accord a pour objet de définir les conditions dans lesquelles des informations confidentielles relatives à la Société pourront être communiquées au Destinataire dans le cadre de l'évaluation d'une opportunité d'investissement.

2. DÉFINITION DES INFORMATIONS CONFIDENTIELLES
Sont considérées comme confidentielles toutes les informations communiquées par la Société, qu'elles soient financières, commerciales, stratégiques, techniques ou opérationnelles, sous quelque forme que ce soit (documents, présentations, données, discussions).

3. OBLIGATIONS DU DESTINATAIRE
Le Destinataire s'engage à :
- Ne pas divulguer les informations confidentielles à des tiers sans accord écrit préalable de la Société
- Utiliser ces informations uniquement dans le cadre de l'évaluation de l'opportunité d'investissement
- Protéger ces informations avec le même niveau de soin que ses propres informations confidentielles

4. DURÉE
Le présent accord prend effet à la date de signature et reste en vigueur pendant une durée de trois (3) ans.

5. DROIT APPLICABLE
Le présent accord est soumis au droit français. Tout litige sera soumis à la compétence exclusive des tribunaux de Paris.

Retbaa SAS — 2026`

const INSTITUTION_TYPES = [
  { value: 'fonds', label: "Fonds d'investissement" },
  { value: 'agence_gouvernementale', label: 'Agence gouvernementale' },
  { value: 'banque', label: 'Banque' },
  { value: 'family_office', label: 'Family office' },
  { value: 'autre', label: 'Autre' },
]

export default function NDAModal({ isOpen, profileType, userEmail, onSigned, onClose }) {
  const [fullName, setFullName]           = useState('')
  const [institutionName, setInstitutionName] = useState('')
  const [institutionType, setInstitutionType] = useState('')
  const [accepted, setAccepted]           = useState(false)
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState('')

  if (!isOpen) return null

  const isInstitutional = profileType === 'prospect_institutional'
  const canSubmit = fullName.trim() && accepted &&
    (!isInstitutional || (institutionName.trim() && institutionType))

  const handleSign = async () => {
    if (!canSubmit) return
    setLoading(true)
    setError('')

    try {
      const signed_at = new Date().toISOString()
      const payload = {
        user_email:       userEmail || 'anonymous',
        profile_type:     profileType,
        institution_name: isInstitutional ? institutionName.trim() : null,
        institution_type: isInstitutional ? institutionType : null,
        nda_version:      'v1.0',
        signed_at,
      }

      const res = await fetch(`${SUPABASE_URL}/rest/v1/ndas`, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'apikey':        SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer':        'return=minimal',
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || 'Erreur lors de l\'enregistrement du NDA')
      }

      const ndaData = {
        full_name:        fullName.trim(),
        email:            userEmail || 'anonymous',
        signed_at,
        profile_type:     profileType,
        institution_name: isInstitutional ? institutionName.trim() : null,
        institution_type: isInstitutional ? institutionType : null,
        nda_version:      'v1.0',
      }

      try {
        localStorage.setItem('retbaa_nda_signed', JSON.stringify(ndaData))
      } catch {}

      // ── Emails automatiques Brevo (best-effort) ───────────────────────────
      if (!import.meta.env.VITE_BREVO_API_KEY) {
        console.warn('[Brevo] VITE_BREVO_API_KEY absent — emails NDA non envoyés')
      } else {
        const emailPromises = [
          sendEmail({
            to:      ndaData.email,
            subject: ndaSignedConfirmation({ name: ndaData.full_name, profileType, institutionName: ndaData.institution_name }).subject,
            html:    ndaSignedConfirmation({ name: ndaData.full_name, profileType, institutionName: ndaData.institution_name }).html,
          }),
        ]
        if (isInstitutional) {
          const tpl = notifyAdminInstitutional({
            name:            ndaData.full_name,
            email:           ndaData.email,
            institutionName: ndaData.institution_name,
            institutionType: ndaData.institution_type,
          })
          emailPromises.push(
            sendEmail({ to: 'massata@retbaa.com', subject: tpl.subject, html: tpl.html })
          )
        }
        await Promise.allSettled(emailPromises)
      }

      onSigned(ndaData)
    } catch (err) {
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      backgroundColor: 'rgba(13, 31, 60, 0.92)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      overflowY: 'auto',
    }}>
      <div style={{
        width: '100%', maxWidth: '680px',
        backgroundColor: '#1A3A6B',
        color: '#fff',
        borderRadius: '4px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        position: 'relative',
        maxHeight: '92vh',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* Bouton fermer */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff', cursor: 'pointer',
            width: '36px', height: '36px',
            borderRadius: '50%',
            fontSize: '18px', lineHeight: '36px', textAlign: 'center',
            fontFamily: 'system-ui, sans-serif',
            zIndex: 1,
          }}
          aria-label="Fermer"
        >
          ×
        </button>

        {/* En-tête */}
        <div style={{ padding: '36px 48px 24px', flexShrink: 0 }}>
          <div style={{
            fontSize: '9px', fontWeight: 700, letterSpacing: '0.4em',
            textTransform: 'uppercase', color: '#C4A96A', marginBottom: '10px',
          }}>
            RETBAA CIRCLE · CONFIDENTIALITÉ
          </div>
          <h2 style={{
            fontFamily: 'Newsreader, Georgia, serif',
            fontStyle: 'italic', fontWeight: 300,
            fontSize: '28px', color: '#fff',
            margin: 0, lineHeight: 1.25,
          }}>
            Accord de non-divulgation
          </h2>
        </div>

        {/* Corps scrollable */}
        <div style={{ overflowY: 'auto', padding: '0 48px', flex: 1 }}>

          {/* Texte NDA */}
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(196,169,106,0.3)',
            borderRadius: '3px',
            padding: '24px 28px',
            marginBottom: '28px',
          }}>
            <pre style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '13px', lineHeight: 1.8,
              color: 'rgba(255,255,255,0.85)',
              whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              margin: 0,
            }}>
              {NDA_TEXT}
            </pre>
          </div>

          {/* Champ nom complet */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block', fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#C4A96A', marginBottom: '8px',
            }}>
              Nom complet *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Prénom Nom"
              style={{
                width: '100%', padding: '11px 14px',
                fontFamily: 'system-ui, sans-serif', fontSize: '14px',
                color: '#fff', background: 'rgba(255,255,255,0.08)',
                border: 'none', borderBottom: '2px solid rgba(196,169,106,0.5)',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Champs institutionnels */}
          {isInstitutional && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block', fontSize: '10px', fontWeight: 700,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: '#C4A96A', marginBottom: '8px',
                }}>
                  Nom de l'institution *
                </label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={e => setInstitutionName(e.target.value)}
                  placeholder="Nom de votre organisation"
                  style={{
                    width: '100%', padding: '11px 14px',
                    fontFamily: 'system-ui, sans-serif', fontSize: '14px',
                    color: '#fff', background: 'rgba(255,255,255,0.08)',
                    border: 'none', borderBottom: '2px solid rgba(196,169,106,0.5)',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block', fontSize: '10px', fontWeight: 700,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: '#C4A96A', marginBottom: '8px',
                }}>
                  Type d'institution *
                </label>
                <select
                  value={institutionType}
                  onChange={e => setInstitutionType(e.target.value)}
                  style={{
                    width: '100%', padding: '11px 14px',
                    fontFamily: 'system-ui, sans-serif', fontSize: '14px',
                    color: institutionType ? '#fff' : 'rgba(255,255,255,0.4)',
                    background: '#1A3A6B',
                    border: 'none', borderBottom: '2px solid rgba(196,169,106,0.5)',
                    outline: 'none', boxSizing: 'border-box', cursor: 'pointer',
                  }}
                >
                  <option value="" disabled>Sélectionnez…</option>
                  {INSTITUTION_TYPES.map(t => (
                    <option key={t.value} value={t.value} style={{ background: '#1A3A6B' }}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Checkbox */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '12px',
            marginBottom: '24px',
          }}>
            <input
              type="checkbox"
              id="nda-modal-accept"
              checked={accepted}
              onChange={e => setAccepted(e.target.checked)}
              style={{
                marginTop: '3px', width: '16px', height: '16px',
                flexShrink: 0, accentColor: '#C4A96A', cursor: 'pointer',
              }}
            />
            <label htmlFor="nda-modal-accept" style={{
              fontFamily: 'system-ui, sans-serif', fontSize: '13px',
              color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, cursor: 'pointer',
            }}>
              J'ai lu et j'accepte les termes de cet accord de confidentialité
            </label>
          </div>

          {error && (
            <div style={{
              padding: '10px 14px', marginBottom: '16px',
              background: 'rgba(186,26,26,0.2)',
              borderLeft: '3px solid #fa6b6b',
              fontSize: '13px', color: '#ffa0a0',
            }}>
              {error}
            </div>
          )}
        </div>

        {/* Footer avec bouton */}
        <div style={{
          padding: '24px 48px 36px', flexShrink: 0,
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}>
          <button
            onClick={handleSign}
            disabled={!canSubmit || loading}
            style={{
              width: '100%', padding: '16px',
              fontFamily: 'system-ui, sans-serif', fontSize: '11px',
              fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: canSubmit && !loading ? '#1A3A6B' : 'rgba(196,169,106,0.4)',
              background: canSubmit && !loading ? '#C4A96A' : 'rgba(196,169,106,0.12)',
              border: 'none', cursor: canSubmit && !loading ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease', borderRadius: '2px',
            }}
          >
            {loading ? 'Enregistrement…' : 'Signer et continuer →'}
          </button>
        </div>

      </div>
    </div>
  )
}
