// HoldingDashboard.jsx — Vue Retbaa Holding — Retbaa Circle
// Design : accent navy #1A3A6B

const NAVY = '#1A3A6B'
const NAVY_LIGHT = 'rgba(26,58,107,0.06)'
const NAVY_BORDER = 'rgba(26,58,107,0.2)'
const PINK = '#EFC0D4'

// Données de projection valorisation
const VALUATION_PROJECTIONS = [
  { year: '2026', value: 3,   label: '3 M€',   note: 'Post-money T1' },
  { year: '2027', value: 8,   label: '8 M€',   note: 'Série A (conservateur)' },
  { year: '2028', value: 18,  label: '18 M€',  note: 'Série A (optimiste)' },
  { year: '2029', value: 50,  label: '50 M€',  note: 'Série B' },
  { year: '2030', value: 150, label: '150 M€', note: 'Série C' },
]

const MAX_VALUE = 150

function HoldingKpiCard({ label, value, sub, highlighted }) {
  return (
    <div style={{
      background: highlighted ? NAVY : '#ffffff',
      borderLeft: `4px solid ${highlighted ? PINK : NAVY}`,
      borderRadius: '0 4px 4px 0',
      padding: '28px 32px',
      boxShadow: highlighted
        ? '0px 10px 30px rgba(26,58,107,0.2)'
        : '0px 10px 30px rgba(26,58,107,0.06)',
      display: 'flex', flexDirection: 'column', gap: '12px',
    }}>
      <div style={{
        fontFamily: 'Manrope, sans-serif', fontSize: '9px',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: highlighted ? PINK : NAVY, fontWeight: 700,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'Newsreader, serif', fontSize: '30px', fontWeight: 300,
        color: highlighted ? '#ffffff' : NAVY, lineHeight: 1.1,
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: 'Manrope, sans-serif', fontSize: '10px',
        color: highlighted ? 'rgba(239,192,212,0.7)' : '#9CA3AF',
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        {sub}
      </div>
    </div>
  )
}

// Graphique barres CSS pur — projection valorisation
function ValuationChart() {
  return (
    <div style={{ width: '100%' }}>
      {/* Barres */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: '12px',
        height: '160px', marginBottom: '12px', padding: '0 4px',
      }}>
        {VALUATION_PROJECTIONS.map((d, i) => {
          const heightPct = (d.value / MAX_VALUE) * 100
          const isFirst = i === 0
          return (
            <div key={d.year} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '6px', height: '100%',
              justifyContent: 'flex-end',
            }}>
              {/* Valeur au dessus */}
              <div style={{
                fontFamily: 'Newsreader, serif',
                fontSize: isFirst ? '13px' : '11px',
                color: isFirst ? NAVY : 'rgba(26,58,107,0.55)',
                fontWeight: 400, whiteSpace: 'nowrap',
              }}>
                {d.label}
              </div>
              {/* Barre */}
              <div style={{
                width: '100%',
                height: `${heightPct}%`,
                background: isFirst
                  ? NAVY
                  : `linear-gradient(180deg, rgba(26,58,107,${0.15 + i * 0.15}) 0%, rgba(26,58,107,${0.1 + i * 0.12}) 100%)`,
                borderRadius: '3px 3px 0 0',
                border: isFirst ? 'none' : `1px solid ${NAVY_BORDER}`,
                position: 'relative',
                transition: 'height 0.6s ease',
              }}>
                {isFirst && (
                  <div style={{
                    position: 'absolute', top: '6px', left: 0, right: 0,
                    display: 'flex', justifyContent: 'center',
                  }}>
                    <span style={{
                      fontSize: '8px', fontWeight: 700, letterSpacing: '0.1em',
                      textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)',
                    }}>Actuel</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {/* Axe X — années */}
      <div style={{
        display: 'flex', gap: '12px', padding: '0 4px',
        borderTop: `1px solid ${NAVY_BORDER}`, paddingTop: '8px',
      }}>
        {VALUATION_PROJECTIONS.map(d => (
          <div key={d.year} style={{
            flex: 1, textAlign: 'center',
            fontFamily: 'Manrope, sans-serif', fontSize: '11px',
            fontWeight: 700, color: NAVY, letterSpacing: '0.05em',
          }}>
            {d.year}
          </div>
        ))}
      </div>
      {/* Disclaimer */}
      <p style={{
        fontFamily: 'Manrope, sans-serif', fontSize: '10px',
        color: '#9CA3AF', fontStyle: 'italic', lineHeight: 1.6,
        margin: '12px 0 0',
      }}>
        * Projections hypothétiques et non contractuelles. La dilution future n'est pas prise en compte.
        Valorisation mise à jour à chaque clôture officielle.
      </p>
    </div>
  )
}

export default function HoldingDashboard() {
  return (
    <div style={{ fontFamily: 'Manrope, sans-serif' }}>

      {/* ── Header section ── */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em',
          textTransform: 'uppercase', color: NAVY, marginBottom: '10px',
        }}>
          RETBAA HOLDING · CAPITAL
        </div>
        <h2 style={{
          fontFamily: 'Newsreader, serif', fontStyle: 'italic',
          fontSize: '36px', fontWeight: 300, color: NAVY,
          margin: '0 0 8px', lineHeight: 1.1,
        }}>
          Votre participation au capital
        </h2>
        <p style={{
          fontSize: '13px', color: '#64748B', lineHeight: 1.65, margin: 0, maxWidth: '560px',
        }}>
          Retbaa SAS — maison de luxe Africa-to-World. Votre equity ouvre droit au vote et aux
          distributions lors des événements de liquidité (cession, IPO, dividendes futurs).
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px', marginBottom: '40px',
      }} className="holding-kpi-grid">
        <HoldingKpiCard
          label="Valorisation actuelle"
          value="3 M€"
          sub="Post-money Tranche 1 — Fév. 2026"
          highlighted={true}
        />
        <HoldingKpiCard
          label="% Equity / tranche"
          value="1 % / 30k€"
          sub="Tranche 1 — prix de souscription 24 €/action"
        />
        <HoldingKpiCard
          label="Prochain tour"
          value="Série A"
          sub="Ouverture prévue T4 2026"
        />
        <HoldingKpiCard
          label="Statut"
          value="Ouvert"
          sub="Fenêtre de ré-investissement active"
        />
      </div>

      {/* ── Graphique valorisation ── */}
      <div style={{
        background: '#ffffff', borderRadius: '4px', padding: '40px',
        boxShadow: '0px 20px 40px rgba(0,27,63,0.04)',
        marginBottom: '32px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{
              fontFamily: 'Newsreader, serif', fontStyle: 'italic',
              fontSize: '26px', color: NAVY, margin: '0 0 4px', fontWeight: 300,
            }}>
              Projection de valorisation
            </h3>
            <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              2026 — 2030 · Scénarios de levée
            </p>
          </div>
          <span style={{
            padding: '4px 12px',
            border: `1px solid ${NAVY_BORDER}`,
            fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
            color: NAVY, borderRadius: '2px',
            fontFamily: 'Manrope, sans-serif',
          }}>
            PROJECTION
          </span>
        </div>
        <ValuationChart />
      </div>

      {/* ── Cap Table ── */}
      <div style={{
        background: '#ffffff', borderRadius: '4px', padding: '40px',
        boxShadow: '0px 20px 40px rgba(0,27,63,0.04)',
        borderTop: `3px solid ${NAVY}`,
      }}>
        <h3 style={{
          fontFamily: 'Newsreader, serif', fontStyle: 'italic',
          fontSize: '26px', color: NAVY, margin: '0 0 8px', fontWeight: 300,
        }}>
          Cap Table
        </h3>
        <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '0 0 28px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Document de référence · Accès réservé aux actionnaires
        </p>

        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: '16px',
          background: NAVY_LIGHT,
          border: `1px solid ${NAVY_BORDER}`,
          borderRadius: '4px', padding: '20px 24px',
        }}>
          <div style={{
            width: '36px', height: '36px', flexShrink: 0,
            background: NAVY, borderRadius: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '18px' }}>📄</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'Manrope, sans-serif', fontSize: '13px',
              fontWeight: 600, color: NAVY, marginBottom: '4px',
            }}>
              Cap Table complète — Retbaa SAS
            </div>
            <div style={{
              fontFamily: 'Manrope, sans-serif', fontSize: '11px',
              color: '#64748B', marginBottom: '12px', lineHeight: 1.5,
            }}>
              Document Tier 3 · Dataroom investisseurs · Accès conditionné à la signature du NDA
            </div>
            <a
              href="/documents"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '4px',
                background: NAVY, color: '#ffffff',
                textDecoration: 'none',
                fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              }}
            >
              Accéder à la Dataroom
              <span style={{ fontSize: '14px' }}>→</span>
            </a>
          </div>
          <div style={{ flexShrink: 0 }}>
            <span style={{
              padding: '3px 10px', borderRadius: '2px',
              fontSize: '8px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              fontFamily: 'Manrope, sans-serif',
              background: 'rgba(26,58,107,0.1)',
              color: NAVY,
              border: `1px solid ${NAVY_BORDER}`,
            }}>
              TIER 3
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .holding-kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .holding-kpi-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
