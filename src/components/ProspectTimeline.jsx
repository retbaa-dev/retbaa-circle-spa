// components/ProspectTimeline.jsx — Timeline verticale du parcours prospect
import { useEffect, useRef } from 'react'

const pulseGold = `
@keyframes pulseGold {
  0%, 100% { box-shadow: 0 0 0 0 rgba(196,169,106,0.6); }
  50%       { box-shadow: 0 0 0 8px rgba(196,169,106,0); }
}
`

function TimelineStep({ title, subtitle, state, isLast }) {
  // state: 'completed' | 'active' | 'future'
  const circleStyle = {
    completed: {
      background: '#C4A96A',
      border: '2px solid #C4A96A',
      color: '#fff',
    },
    active: {
      background: 'transparent',
      border: '2px solid #C4A96A',
      color: '#C4A96A',
      animation: 'pulseGold 1.8s ease-in-out infinite',
    },
    future: {
      background: 'transparent',
      border: '2px solid #D1D5DB',
      color: '#9CA3AF',
    },
  }[state]

  const titleColor = state === 'future' ? '#9CA3AF' : '#1A3A6B'
  const lineColor  = state === 'completed' ? '#C4A96A' : 'rgba(26,58,107,0.1)'

  return (
    <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
      {/* Colonne icône + ligne */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px', fontWeight: 700,
          flexShrink: 0,
          zIndex: 1,
          ...circleStyle,
        }}>
          {state === 'completed' ? '✓' : state === 'active' ? '⏳' : '○'}
        </div>
        {!isLast && (
          <div style={{
            width: '2px', flex: 1, minHeight: '28px',
            background: lineColor,
            marginTop: '4px', marginBottom: '4px',
          }} />
        )}
      </div>

      {/* Contenu */}
      <div style={{ paddingBottom: isLast ? 0 : '28px', paddingTop: '6px' }}>
        <div style={{
          fontFamily: 'Georgia, serif', fontStyle: 'italic',
          fontSize: '16px', color: titleColor, lineHeight: 1.3,
          marginBottom: subtitle ? '4px' : 0,
        }}>
          {title}
        </div>
        {subtitle && (
          <div style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '12px', color: '#9CA3AF', lineHeight: 1.5,
          }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Props:
 *   status      — 'pending' | 'access_requested' | 'approved' | null
 *   ndaSigned   — bool
 *   submittedAt — string ISO | null
 *   approvedAt  — string ISO | null
 */
export default function ProspectTimeline({ status, ndaSigned, submittedAt, approvedAt }) {
  const fmt = (iso) => iso
    ? new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    : null

  const steps = [
    {
      title: 'NDA signé',
      subtitle: ndaSigned ? 'Accord de confidentialité accepté' : 'En attente de signature',
      state: ndaSigned ? 'completed' : 'future',
    },
    {
      title: 'Dossier soumis',
      subtitle: submittedAt ? `Soumis le ${fmt(submittedAt)}` : (status !== null ? 'Dossier reçu' : 'En attente'),
      state: status !== null ? 'completed' : 'future',
    },
    {
      title: 'En cours d\'examen',
      subtitle: 'L\'équipe Retbaa examine votre dossier',
      state: status === 'approved' ? 'completed'
           : (status === 'pending' || status === 'access_requested') ? 'active'
           : 'future',
    },
    {
      title: 'Accès validé',
      subtitle: approvedAt ? `Validé le ${fmt(approvedAt)}` : 'Accès à la dataroom complète',
      state: status === 'approved' ? 'completed' : 'future',
    },
  ]

  return (
    <>
      <style>{pulseGold}</style>
      <div style={{ padding: '4px 0' }}>
        {steps.map((step, i) => (
          <TimelineStep
            key={i}
            title={step.title}
            subtitle={step.subtitle}
            state={step.state}
            isLast={i === steps.length - 1}
          />
        ))}
      </div>
    </>
  )
}
