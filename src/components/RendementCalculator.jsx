// RendementCalculator.jsx — Retbaa Circle
// Calculateur de rendement interactif — Holding + SPV, 3 scénarios
// Zéro dépendance externe — CSS inline uniquement

import { useState } from 'react'

const fmt = (n) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + '\u202f€'

const fmtX = (n) =>
  new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + 'x'

// ── Calculs ──────────────────────────────────────────────────────────────────

function calcHolding(montant, horizon) {
  const valorisationActuelle = 3_000_000
  const partPct = montant / valorisationActuelle // ex: 30000/3000000 = 1%
  const scenarios = [
    { label: 'Conservateur', taux: 0.08, color: '#6B7280' },
    { label: 'Base', taux: 0.15, color: '#1A3A6B' },
    { label: 'Optimiste', taux: 0.25, color: '#C4A96A' },
  ]
  return scenarios.map((sc) => {
    const valorFuture = valorisationActuelle * Math.pow(1 + sc.taux, horizon)
    const capitalFinal = partPct * valorFuture
    const gainNet = capitalFinal - montant
    const multiple = capitalFinal / montant
    return { ...sc, valorFuture, capitalFinal, gainNet, multiple }
  })
}

function calcSPV(montant, horizon) {
  const results = [
    { label: 'TRI 13%', tri: 0.13 },
    { label: 'TRI 15%', tri: 0.15 },
  ].map((s) => {
    const capitalFinal = montant * Math.pow(1 + s.tri, horizon)
    const gainNet = capitalFinal - montant
    const multiple = capitalFinal / montant
    return { ...s, capitalFinal, gainNet, multiple }
  })
  return results
}

// ── Barre proportionnelle ─────────────────────────────────────────────────────

function BarChart({ scenarios, maxValue }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
      {scenarios.map((sc) => {
        const pct = Math.min((sc.capitalFinal / maxValue) * 100, 100)
        return (
          <div key={sc.label}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '4px',
            }}>
              <span style={{
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em',
                textTransform: 'uppercase', color: sc.color || '#1A3A6B',
              }}>
                {sc.label}
              </span>
              <span style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontStyle: 'italic',
                fontSize: '15px',
                color: '#C4A96A',
              }}>
                {fmt(sc.capitalFinal)}
              </span>
            </div>
            <div style={{
              height: '6px', background: 'rgba(26,58,107,0.07)',
              borderRadius: '3px', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${pct}%`,
                background: sc.color || '#1A3A6B',
                borderRadius: '3px',
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Tableau résultats Holding ─────────────────────────────────────────────────

function HoldingTable({ scenarios }) {
  return (
    <div style={{ overflowX: 'auto', marginTop: '20px' }}>
      <table style={{
        width: '100%', borderCollapse: 'collapse',
        fontFamily: 'system-ui, sans-serif', fontSize: '13px',
      }}>
        <thead>
          <tr>
            {['Scénario', 'Capital final', 'Gain net', 'Multiple'].map((h) => (
              <th key={h} style={{
                textAlign: 'left', padding: '8px 12px',
                fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em',
                textTransform: 'uppercase', color: '#9CA3AF',
                borderBottom: '1px solid rgba(26,58,107,0.08)',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {scenarios.map((sc) => (
            <tr key={sc.label} style={{ borderBottom: '1px solid rgba(26,58,107,0.05)' }}>
              <td style={{ padding: '12px', color: sc.color, fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em' }}>
                {sc.label}
              </td>
              <td style={{
                padding: '12px',
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontStyle: 'italic', fontSize: '16px', color: '#C4A96A',
              }}>
                {fmt(sc.capitalFinal)}
              </td>
              <td style={{
                padding: '12px',
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontStyle: 'italic', fontSize: '15px', color: '#C4A96A',
              }}>
                +{fmt(sc.gainNet)}
              </td>
              <td style={{
                padding: '12px', fontWeight: 700, fontSize: '14px', color: '#1A3A6B',
              }}>
                {fmtX(sc.multiple)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Tableau résultats SPV ─────────────────────────────────────────────────────

function SPVTable({ scenarios }) {
  return (
    <div style={{ overflowX: 'auto', marginTop: '20px' }}>
      <table style={{
        width: '100%', borderCollapse: 'collapse',
        fontFamily: 'system-ui, sans-serif', fontSize: '13px',
      }}>
        <thead>
          <tr>
            {['Scénario', 'Capital final', 'Gain net', 'Multiple'].map((h) => (
              <th key={h} style={{
                textAlign: 'left', padding: '8px 12px',
                fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em',
                textTransform: 'uppercase', color: '#9CA3AF',
                borderBottom: '1px solid rgba(26,58,107,0.08)',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {scenarios.map((sc) => (
            <tr key={sc.label} style={{ borderBottom: '1px solid rgba(26,58,107,0.05)' }}>
              <td style={{ padding: '12px', color: '#1A3A6B', fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em' }}>
                {sc.label}
              </td>
              <td style={{
                padding: '12px',
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontStyle: 'italic', fontSize: '16px', color: '#C4A96A',
              }}>
                {fmt(sc.capitalFinal)}
              </td>
              <td style={{
                padding: '12px',
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontStyle: 'italic', fontSize: '15px', color: '#C4A96A',
              }}>
                +{fmt(sc.gainNet)}
              </td>
              <td style={{
                padding: '12px', fontWeight: 700, fontSize: '14px', color: '#1A3A6B',
              }}>
                {fmtX(sc.multiple)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Composant principal ───────────────────────────────────────────────────────

export default function RendementCalculator() {
  const [montant, setMontant] = useState(30_000)
  const [vehicule, setVehicule] = useState('holding')
  const [horizon, setHorizon] = useState(7)

  const holdingScenarios = calcHolding(montant, horizon)
  const spvScenarios = calcSPV(montant, horizon)

  const activeScenarios = vehicule === 'holding' ? holdingScenarios : spvScenarios
  const maxCapital = Math.max(...activeScenarios.map((s) => s.capitalFinal))

  // Styles communs
  const labelStyle = {
    display: 'block',
    fontSize: '9px', fontWeight: 700,
    letterSpacing: '0.2em', textTransform: 'uppercase',
    color: '#9CA3AF', marginBottom: '10px',
  }

  const radioGroupStyle = {
    display: 'flex', gap: '8px', flexWrap: 'wrap',
  }

  const radioBtn = (active) => ({
    padding: '8px 18px',
    border: active ? '1.5px solid #1A3A6B' : '1.5px solid rgba(26,58,107,0.15)',
    background: active ? '#1A3A6B' : '#fff',
    color: active ? '#fff' : '#1A3A6B',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '12px', fontWeight: active ? 700 : 400,
    letterSpacing: '0.05em',
    transition: 'all 0.15s',
  })

  return (
    <div style={{
      background: '#fff',
      border: '1.5px solid rgba(26,58,107,0.12)',
      borderRadius: '12px',
      padding: '40px',
      maxWidth: '720px',
      margin: '0 auto',
      boxShadow: '0 4px 24px rgba(26,58,107,0.06)',
    }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          fontSize: '9px', fontWeight: 700, letterSpacing: '0.35em',
          textTransform: 'uppercase', color: '#C4A96A', marginBottom: '10px',
        }}>
          SIMULATEUR D'INVESTISSEMENT
        </div>
        <h2 style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontStyle: 'italic', fontWeight: 300,
          fontSize: '28px', color: '#1A3A6B',
          margin: 0, lineHeight: 1.2,
        }}>
          Estimez votre rendement
        </h2>
      </div>

      {/* ── Inputs ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>

        {/* Montant */}
        <div>
          <label style={labelStyle}>Montant investi</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <input
              type="range"
              min={30_000}
              max={500_000}
              step={10_000}
              value={montant}
              onChange={(e) => setMontant(Number(e.target.value))}
              style={{ flex: 1, minWidth: '160px', accentColor: '#1A3A6B' }}
            />
            <div style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontStyle: 'italic',
              fontSize: '22px',
              color: '#1A3A6B',
              minWidth: '140px',
              textAlign: 'right',
            }}>
              {fmt(montant)}
            </div>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '10px', color: '#9CA3AF', marginTop: '4px',
          }}>
            <span>30 000 €</span>
            <span>500 000 €</span>
          </div>
        </div>

        {/* Véhicule */}
        <div>
          <label style={labelStyle}>Véhicule d'investissement</label>
          <div style={radioGroupStyle}>
            {[
              { val: 'holding', label: 'Retbaa Holding' },
              { val: 'spv', label: 'SPV Les Adresses' },
            ].map(({ val, label }) => (
              <button key={val} onClick={() => setVehicule(val)} style={radioBtn(vehicule === val)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Horizon */}
        <div>
          <label style={labelStyle}>Horizon de placement</label>
          <div style={radioGroupStyle}>
            {[5, 7, 10].map((h) => (
              <button key={h} onClick={() => setHorizon(h)} style={radioBtn(horizon === h)}>
                {h} ans
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Séparateur */}
      <div style={{ height: '1px', background: 'rgba(26,58,107,0.08)', marginBottom: '28px' }} />

      {/* ── Résultats ── */}
      <div>
        <div style={{
          fontSize: '9px', fontWeight: 700, letterSpacing: '0.25em',
          textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '4px',
        }}>
          PROJECTIONS — {vehicule === 'holding' ? 'RETBAA HOLDING (EQUITY)' : 'SPV LES ADRESSES'}
        </div>
        <div style={{
          fontSize: '11px', color: '#6B7280', marginBottom: '16px', lineHeight: 1.6,
        }}>
          {vehicule === 'holding'
            ? `Votre participation actuelle : ${((montant / 3_000_000) * 100).toFixed(2)}% du capital · Valorisation implicite 3 M€`
            : `TRI cible 13–15% · Horizon ${horizon} ans · Capital garanti en scénario de base`
          }
        </div>

        {/* Tableau */}
        {vehicule === 'holding'
          ? <HoldingTable scenarios={holdingScenarios} />
          : <SPVTable scenarios={spvScenarios} />
        }

        {/* Graphique barres */}
        <BarChart scenarios={activeScenarios} maxValue={maxCapital} />
      </div>

      {/* Disclaimer */}
      <div style={{
        marginTop: '28px',
        padding: '14px 16px',
        background: 'rgba(26,58,107,0.03)',
        borderLeft: '3px solid rgba(196,169,106,0.4)',
        borderRadius: '0 4px 4px 0',
        fontSize: '11px', color: '#9CA3AF',
        lineHeight: 1.7, fontStyle: 'italic',
      }}>
        ⚠️ Projections indicatives. Les performances passées ne préjugent pas des performances futures.
        Ces simulations sont fournies à titre informatif et ne constituent pas un conseil en investissement.
      </div>
    </div>
  )
}
