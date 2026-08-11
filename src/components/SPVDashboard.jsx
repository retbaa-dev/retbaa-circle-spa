// SPVDashboard.jsx — Vue SPV Les Adresses — Retbaa Circle
// Design : accent vert #065F46

const ACCENT = '#065F46'
const ACCENT_LIGHT = 'rgba(6,95,70,0.08)'
const ACCENT_BORDER = 'rgba(6,95,70,0.25)'

function SPVKpiCard({ label, value, sub }) {
  return (
    <div style={{
      background: '#ffffff',
      borderLeft: `4px solid ${ACCENT}`,
      borderRadius: '0 4px 4px 0',
      padding: '28px 32px',
      boxShadow: '0px 10px 30px rgba(6,95,70,0.08)',
      display: 'flex', flexDirection: 'column', gap: '12px',
    }}>
      <div style={{
        fontFamily: 'Manrope, sans-serif', fontSize: '9px',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: ACCENT, fontWeight: 700,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'Newsreader, serif', fontSize: '30px', fontWeight: 300,
        color: '#1A3A6B', lineHeight: 1.1,
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: 'Manrope, sans-serif', fontSize: '10px',
        color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        {sub}
      </div>
    </div>
  )
}

const TIMELINE_STEPS = [
  { id: 1, label: 'Ouverture SPV', status: 'done',    date: 'Fév. 2026' },
  { id: 2, label: 'Due diligence', status: 'current', date: 'En cours' },
  { id: 3, label: 'Closing',       status: 'upcoming', date: 'T3 2026' },
  { id: 4, label: 'Déploiement capital', status: 'upcoming', date: 'T4 2026' },
]

export default function SPVDashboard() {
  return (
    <div style={{ fontFamily: 'Manrope, sans-serif' }}>

      {/* ── Header section ── */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em',
          textTransform: 'uppercase', color: ACCENT, marginBottom: '10px',
        }}>
          SPV · LES ADRESSES
        </div>
        <h2 style={{
          fontFamily: 'Newsreader, serif', fontStyle: 'italic',
          fontSize: '36px', fontWeight: 300, color: '#1A3A6B',
          margin: '0 0 8px', lineHeight: 1.1,
        }}>
          Votre investissement SPV
        </h2>
        <p style={{
          fontSize: '13px', color: '#64748B', lineHeight: 1.65, margin: 0, maxWidth: '560px',
        }}>
          Structure d'investissement dédiée à l'actif immobilier Les Adresses.
          Rendement cible basé sur des projections de valorisation et revenus locatifs nets.
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px', marginBottom: '40px',
      }} className="spv-kpi-grid">
        <SPVKpiCard
          label="TRI Cible"
          value="13–15 %"
          sub="Taux de rendement interne annualisé"
        />
        <SPVKpiCard
          label="Horizon"
          value="7–10 ans"
          sub="Durée d'investissement estimée"
        />
        <SPVKpiCard
          label="Ticket minimum"
          value="À définir"
          sub="En attente finalisation des conditions"
        />
        <SPVKpiCard
          label="Statut closing"
          value="En cours"
          sub="Due diligence — Phase active"
        />
      </div>

      {/* ── Timeline closing ── */}
      <div style={{
        background: '#ffffff', borderRadius: '4px', padding: '40px',
        boxShadow: '0px 20px 40px rgba(0,27,63,0.04)',
        marginBottom: '32px',
      }}>
        <h3 style={{
          fontFamily: 'Newsreader, serif', fontStyle: 'italic',
          fontSize: '26px', color: '#1A3A6B', margin: '0 0 32px', fontWeight: 300,
        }}>
          Timeline de closing
        </h3>

        {/* Barre de progression horizontale */}
        <div style={{ position: 'relative', marginBottom: '32px' }}>
          {/* Rail */}
          <div style={{
            position: 'absolute', top: '16px', left: '0', right: '0',
            height: '3px', background: ACCENT_BORDER, zIndex: 0,
          }} />
          {/* Rail complété */}
          <div style={{
            position: 'absolute', top: '16px', left: '0',
            width: '33%',
            height: '3px', background: ACCENT, zIndex: 1,
          }} />

          {/* Steps */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${TIMELINE_STEPS.length}, 1fr)`,
            position: 'relative', zIndex: 2,
          }}>
            {TIMELINE_STEPS.map(step => (
              <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                {/* Dot */}
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: step.status === 'done' ? ACCENT : step.status === 'current' ? '#ffffff' : '#f5f5f5',
                  border: `3px solid ${step.status === 'upcoming' ? ACCENT_BORDER : ACCENT}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: step.status === 'current' ? `0 0 0 4px ${ACCENT_LIGHT}` : 'none',
                }}>
                  {step.status === 'done' && (
                    <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 700 }}>✓</span>
                  )}
                  {step.status === 'current' && (
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: ACCENT }} />
                  )}
                </div>
                {/* Label */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '12px', fontWeight: 600,
                    color: step.status === 'upcoming' ? '#9CA3AF' : '#1A3A6B',
                    marginBottom: '4px',
                  }}>
                    {step.label}
                  </div>
                  <div style={{
                    fontSize: '10px', letterSpacing: '0.05em', textTransform: 'uppercase',
                    color: step.status === 'done' ? ACCENT : step.status === 'current' ? ACCENT : '#9CA3AF',
                    fontWeight: step.status === 'current' ? 700 : 400,
                  }}>
                    {step.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Légende statut actuel */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: ACCENT_LIGHT,
          border: `1px solid ${ACCENT_BORDER}`,
          borderRadius: '4px', padding: '8px 16px',
        }}>
          <div style={{
            width: '7px', height: '7px', borderRadius: '50%', background: ACCENT,
            animation: 'spv-pulse 2s ease-in-out infinite',
          }} />
          <span style={{ fontSize: '11px', color: ACCENT, fontWeight: 600, letterSpacing: '0.05em' }}>
            Phase en cours : Due diligence
          </span>
        </div>
      </div>

      {/* ── Prochaines étapes ── */}
      <div style={{
        background: '#ffffff', borderRadius: '4px', padding: '40px',
        boxShadow: '0px 20px 40px rgba(0,27,63,0.04)',
        borderTop: `3px solid ${ACCENT}`,
      }}>
        <h3 style={{
          fontFamily: 'Newsreader, serif', fontStyle: 'italic',
          fontSize: '26px', color: '#1A3A6B', margin: '0 0 8px', fontWeight: 300,
        }}>
          Prochaines étapes
        </h3>
        <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '0 0 24px', letterSpacing: '0.05em' }}>
          MIS À JOUR AUTOMATIQUEMENT DÈS VALIDATION DES DONNÉES
        </p>

        <div style={{
          padding: '32px',
          background: '#FAFAFA',
          borderRadius: '4px',
          border: `1px dashed ${ACCENT_BORDER}`,
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>⏳</span>
          <div style={{
            fontFamily: 'Newsreader, serif', fontStyle: 'italic',
            fontSize: '18px', color: '#1A3A6B', marginBottom: '8px',
          }}>
            En attente des données de souscription
          </div>
          <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0, lineHeight: 1.7 }}>
            Les jalons et actions requises seront affichés ici dès que les données
            de souscription seront validées par l'équipe Retbaa.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spv-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(6,95,70,0.3); }
          50%       { box-shadow: 0 0 0 5px rgba(6,95,70,0.05); }
        }
        @media (max-width: 768px) {
          .spv-kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .spv-kpi-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
