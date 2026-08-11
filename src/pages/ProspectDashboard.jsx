// pages/ProspectDashboard.jsx — Dashboard prospect avec timeline de statut visuelle
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

// CSS keyframes pour le pulse rose
const pulseStyle = `
@keyframes pulsePink {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239,192,212,0.7); }
  50%       { box-shadow: 0 0 0 8px rgba(239,192,212,0); }
}
`

function StatusBadge({ status }) {
  if (status === 'approved') {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '6px 16px',
        background: 'rgba(6,95,70,0.1)',
        border: '1px solid rgba(6,95,70,0.3)',
        borderRadius: '999px',
        fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em',
        color: '#065F46',
      }}>
        <span style={{ fontSize: '14px' }}>✓</span>
        Accès accordé
      </div>
    )
  }
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      padding: '6px 16px',
      background: 'rgba(239,192,212,0.15)',
      border: '1px solid rgba(239,192,212,0.5)',
      borderRadius: '999px',
      fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em',
      color: '#B45E7E',
    }}>
      <span style={{
        width: '8px', height: '8px', borderRadius: '50%',
        background: '#EFC0D4',
        display: 'inline-block',
        animation: 'pulsePink 1.8s ease-in-out infinite',
      }} />
      En cours d'examen
    </div>
  )
}

function TimelineStep({ stepNumber, icon, title, description, stepState, isLast }) {
  // stepState: 'completed' | 'current' | 'locked'
  const colors = {
    completed: { bg: '#065F46', border: '#065F46', iconColor: '#fff', titleColor: '#065F46', lineColor: '#065F46' },
    current:   { bg: '#EFC0D4', border: '#EFC0D4', iconColor: '#1A3A6B', titleColor: '#1A3A6B', lineColor: 'rgba(239,192,212,0.3)' },
    locked:    { bg: '#FAF7F2', border: 'rgba(26,58,107,0.15)', iconColor: '#9CA3AF', titleColor: '#9CA3AF', lineColor: 'rgba(26,58,107,0.1)' },
  }
  const c = colors[stepState]

  return (
    <div style={{ display: 'flex', gap: '20px', position: 'relative' }}>
      {/* Colonne gauche : icône + ligne */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        {/* Icône ronde */}
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          background: c.bg,
          border: `2px solid ${c.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px',
          boxShadow: stepState === 'current' ? '0 0 0 4px rgba(239,192,212,0.2)' : 'none',
          transition: 'box-shadow 0.3s',
          zIndex: 1,
          position: 'relative',
        }}>
          {icon}
        </div>
        {/* Ligne verticale */}
        {!isLast && (
          <div style={{
            width: '2px', flex: 1, minHeight: '32px',
            background: c.lineColor,
            marginTop: '4px',
            marginBottom: '4px',
          }} />
        )}
      </div>

      {/* Contenu */}
      <div style={{
        flex: 1,
        paddingBottom: isLast ? 0 : '32px',
        paddingTop: '10px',
      }}>
        <div style={{
          fontFamily: 'Georgia, serif', fontStyle: 'italic',
          fontSize: '18px', color: c.titleColor,
          marginBottom: '6px', lineHeight: 1.3,
        }}>
          {title}
        </div>
        <div style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: '13px', color: stepState === 'locked' ? '#9CA3AF' : '#6B7280',
          lineHeight: 1.6,
        }}>
          {description}
        </div>
      </div>
    </div>
  )
}

// ── Section Mon NDA ───────────────────────────────────────────────────────────
function NDASection() {
  const ndaSigned = (() => {
    try { return JSON.parse(localStorage.getItem('retbaa_nda_signed') || 'null') } catch { return null }
  })()

  if (!ndaSigned) {
    return (
      <div style={{
        background: '#fff',
        border: '1px solid rgba(26,58,107,0.08)',
        borderRadius: '8px',
        padding: '20px 24px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,27,63,0.04)',
        fontSize: '14px', color: '#6B7280', lineHeight: 1.6,
      }}>
        NDA non signé — <a href="mailto:circle@retbaa.com" style={{ color: '#1A3A6B', fontWeight: 600 }}>contactez-nous</a>
      </div>
    )
  }

  const handlePrint = () => {
    const signed_at = ndaSigned.signed_at ? new Date(ndaSigned.signed_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'
    const win = window.open('', '_blank')
    win.document.write(`<!DOCTYPE html><html><head><title>NDA Retbaa — ${ndaSigned.full_name || ''}</title>
    <style>body{font-family:Georgia,serif;max-width:700px;margin:40px auto;color:#1A3A6B;line-height:1.7}
    h1{font-size:22px}h2{font-size:16px;margin-top:28px}p,pre{font-size:14px;color:#374151;white-space:pre-wrap}
    .meta{font-size:12px;color:#6B7280;margin-bottom:32px;border-bottom:1px solid #eee;padding-bottom:16px}
    </style></head><body>
    <h1>Accord de Non-Divulgation — Retbaa SAS</h1>
    <div class="meta">
      Signataire : <strong>${ndaSigned.full_name || '—'}</strong><br>
      Date : <strong>${signed_at}</strong><br>
      Version NDA : <strong>${ndaSigned.nda_version || 'v1.0'}</strong><br>
      Profil : <strong>${ndaSigned.profile_type || '—'}</strong>
      ${ndaSigned.institution_name ? `<br>Institution : <strong>${ndaSigned.institution_name}</strong>` : ''}
    </div>
    <pre>ACCORD DE NON-DIVULGATION

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

Retbaa SAS — 2026</pre>
    <hr style="margin-top:32px">
    <p style="font-size:12px;color:#9CA3AF">Signé électroniquement le ${signed_at} par ${ndaSigned.full_name || '—'}</p>
    </body></html>`)
    win.document.close()
    win.print()
  }

  const signed_at_display = ndaSigned.signed_at
    ? new Date(ndaSigned.signed_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—'

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(26,58,107,0.08)',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '16px',
      boxShadow: '0 2px 8px rgba(0,27,63,0.04)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '18px' }}>✅</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#065F46', letterSpacing: '0.03em' }}>NDA signé</span>
            <span style={{
              fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#1A3A6B', background: 'rgba(196,169,106,0.18)', border: '1px solid rgba(196,169,106,0.5)',
              padding: '2px 8px',
            }}>
              {ndaSigned.nda_version || 'v1.0'}
            </span>
          </div>
          <div style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6 }}>
            <div><span style={{ color: '#6B7280' }}>Signataire :</span> <strong style={{ color: '#1A3A6B' }}>{ndaSigned.full_name || ndaSigned.email || '—'}</strong></div>
            <div><span style={{ color: '#6B7280' }}>Signé le :</span> <strong style={{ color: '#1A3A6B' }}>{signed_at_display}</strong></div>
            {ndaSigned.institution_name && (
              <div><span style={{ color: '#6B7280' }}>Institution :</span> <strong style={{ color: '#1A3A6B' }}>{ndaSigned.institution_name}</strong></div>
            )}
          </div>
        </div>
        <button
          onClick={handlePrint}
          style={{
            padding: '10px 20px',
            fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#1A3A6B', background: 'transparent',
            border: '1px solid rgba(26,58,107,0.3)',
            borderRadius: '3px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            flexShrink: 0,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
          Télécharger PDF
        </button>
      </div>
    </div>
  )
}

export default function ProspectDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [prospectStatus, setProspectStatus] = useState(null)
  const [statusLoaded, setStatusLoaded]     = useState(false)

  useEffect(() => {
    if (!user?.email) return
    supabase
      .from('dataroom_prospects')
      .select('status')
      .eq('email', user.email)
      .maybeSingle()
      .then(({ data }) => {
        setProspectStatus(data?.status ?? 'pending')
        setStatusLoaded(true)
      })
  }, [user?.email])

  const isApproved = prospectStatus === 'approved'

  const steps = [
    {
      icon: '✅',
      title: 'Inscription & NDA',
      description: "Votre inscription est confirmée et l'accord de confidentialité a été signé. Bienvenue dans l'espace dataroom Retbaa.",
      stepState: 'completed',
    },
    {
      icon: isApproved ? '✅' : '🕐',
      title: 'Examen de votre dossier',
      description: isApproved
        ? "Votre dossier a été examiné et approuvé par l'équipe Retbaa."
        : "L'équipe Retbaa examine votre dossier. Vous recevrez une notification dès validation.",
      stepState: isApproved ? 'completed' : 'current',
    },
    {
      icon: isApproved ? '🔓' : '🔒',
      title: 'Accès complet',
      description: isApproved
        ? "Vous avez accès à l'intégralité de la dataroom, incluant les documents financiers et juridiques."
        : "Une fois votre dossier validé, vous aurez accès à l'ensemble des documents de la dataroom.",
      stepState: isApproved ? 'completed' : 'locked',
    },
  ]

  const quickLinks = [
    { path: '/insights',      icon: 'insights',     title: 'Insights',  desc: 'Actualités et analyses' },
    { path: '/podcast',       icon: 'mic',          title: 'Podcast',   desc: 'Tous les épisodes' },
    { path: '/dataroom-docs', icon: 'folder_open',  title: 'Dataroom',  desc: 'Documents investisseur' },
  ]

  return (
    <>
      <style>{pulseStyle}</style>
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#FAF7F2',
        padding: '48px 32px',
        fontFamily: 'Manrope, sans-serif',
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          {/* En-tête */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{
              fontSize: '9px', letterSpacing: '0.4em', textTransform: 'uppercase',
              color: '#EFC0D4', fontWeight: 700, marginBottom: '12px',
            }}>
              RETBAA CIRCLE · ESPACE PROSPECT
            </div>
            <h1 style={{
              fontFamily: 'Georgia, serif', fontWeight: 300, fontStyle: 'italic',
              fontSize: '36px', color: '#1A3A6B', margin: '0 0 12px', lineHeight: 1.25,
            }}>
              Bienvenue dans votre espace dataroom
            </h1>
            {user?.email && (
              <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 20px' }}>
                Connecté en tant que <strong style={{ color: '#1A3A6B' }}>{user.email}</strong>
              </p>
            )}
            {/* Badge statut */}
            {statusLoaded && <StatusBadge status={prospectStatus} />}
          </div>

          {/* Message félicitations si approved */}
          {isApproved && (
            <div style={{
              marginBottom: '40px',
              padding: '20px 24px',
              background: 'rgba(6,95,70,0.06)',
              border: '1px solid rgba(6,95,70,0.2)',
              borderRadius: '8px',
            }}>
              <div style={{
                fontFamily: 'Georgia, serif', fontStyle: 'italic',
                fontSize: '20px', color: '#065F46', marginBottom: '8px',
              }}>
                🎉 Félicitations !
              </div>
              <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: 1.6 }}>
                Votre dossier a été validé. Vous avez désormais accès à l'ensemble des documents
                de la dataroom Retbaa. N'hésitez pas à contacter l'équipe pour toute question à{' '}
                <a href="mailto:circle@retbaa.com" style={{ color: '#065F46', fontWeight: 600 }}>
                  circle@retbaa.com
                </a>.
              </p>
            </div>
          )}

          {/* Timeline */}
          <div style={{
            background: '#fff',
            border: '1px solid rgba(26,58,107,0.08)',
            borderRadius: '12px',
            padding: '32px',
            marginBottom: '40px',
            boxShadow: '0 2px 12px rgba(0,27,63,0.04)',
          }}>
            <div style={{
              fontSize: '9px', letterSpacing: '0.35em', textTransform: 'uppercase',
              color: '#9CA3AF', fontWeight: 700, marginBottom: '28px',
            }}>
              VOTRE PARCOURS
            </div>

            {steps.map((step, i) => (
              <TimelineStep
                key={i}
                stepNumber={i + 1}
                icon={step.icon}
                title={step.title}
                description={step.description}
                stepState={step.stepState}
                isLast={i === steps.length - 1}
              />
            ))}
          </div>

          {/* Message d'attente si pending */}
          {!isApproved && statusLoaded && (
            <div style={{
              marginBottom: '40px',
              padding: '16px 20px',
              background: 'rgba(239,192,212,0.15)',
              borderLeft: '3px solid #EFC0D4',
              borderRadius: '0 6px 6px 0',
              fontSize: '13px', color: '#704C5D', lineHeight: 1.6,
            }}>
              En attendant la validation de votre dossier, vous pouvez déjà consulter nos insights et écouter nos podcasts.
              Les documents confidentiels de la dataroom seront accessibles après approbation.
            </div>
          )}

          {/* Liens rapides */}
          <div style={{
            fontSize: '9px', letterSpacing: '0.35em', textTransform: 'uppercase',
            color: '#9CA3AF', fontWeight: 700, marginBottom: '16px',
          }}>
            MON NDA
          </div>
          <NDASection />

          <div style={{
            fontSize: '9px', letterSpacing: '0.35em', textTransform: 'uppercase',
            color: '#9CA3AF', fontWeight: 700, marginBottom: '16px', marginTop: '40px',
          }}>
            ACCÈS RAPIDE
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px',
          }}>
            {quickLinks.map(({ path, icon, title, desc }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                style={{
                  background: '#fff',
                  border: '1px solid rgba(26,58,107,0.08)',
                  borderRadius: '8px',
                  padding: '24px 20px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s, transform 0.15s',
                  boxShadow: '0 2px 8px rgba(0,27,63,0.04)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,27,63,0.10)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,27,63,0.04)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '24px', color: '#EFC0D4', display: 'block', marginBottom: '12px' }}
                >
                  {icon}
                </span>
                <div style={{
                  fontFamily: 'Georgia, serif', fontStyle: 'italic',
                  fontSize: '18px', color: '#1A3A6B', marginBottom: '4px',
                }}>
                  {title}
                </div>
                <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.5 }}>
                  {desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
