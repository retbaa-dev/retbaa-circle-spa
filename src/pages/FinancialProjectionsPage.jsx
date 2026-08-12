// FinancialProjectionsPage.jsx — Tier 2 Confidentiel
// Retbaa Circle · Design navy/or

export default function FinancialProjectionsPage() {
  const NAVY  = '#0D1F3C'
  const GOLD  = '#C9A96E'
  const CREAM = '#FAF7F2'
  const TEXT  = '#1A3A6B'

  const kpis = [
    { label: "Chiffre d'affaires 2025", value: '€191K', icon: '📈' },
    { label: 'Marge brute',             value: '60%',   icon: '💎' },
    { label: 'EBITDA',                  value: '22,7%', icon: '⚡' },
    { label: 'Trésorerie',              value: '€33K',  icon: '🏦' },
  ]

  const projections = [
    { year: 2025, ca: 191,  label: '€191K', growth: 'base',            pct: 191/6000 },
    { year: 2026, ca: 300,  label: '€300K', growth: '+57% (révisé Dubai)', pct: 300/6000 },
    { year: 2027, ca: 600,  label: '€600K', growth: '+100%',           pct: 600/6000 },
    { year: 2028, ca: 1500, label: '€1,5M', growth: '+150%',           pct: 1500/6000 },
    { year: 2029, ca: 3200, label: '€3,2M', growth: '+113%',           pct: 3200/6000 },
    { year: 2030, ca: 6000, label: '€6M',   growth: '+88%',            pct: 1 },
  ]

  const arrRows = [
    { horizon: '12 mois', low: '€620K',  high: '€1,4M'  },
    { horizon: '36 mois', low: '€8,7M',  high: '€19,8M' },
  ]

  const exitRows = [
    { scenario: 'Luxe — 2026', multiple: '5–7x CA', implied: '€1,5M–€2,1M', note: 'Valorisation actifs tangibles' },
    { scenario: 'Luxe — 2028', multiple: '7–12x CA', implied: '€10,5M–€18M', note: 'Expansion internationale' },
    { scenario: 'SaaS — 2030', multiple: '10–25x ARR', implied: '€87M–€495M', note: 'Si SaaS-ability validée' },
    { scenario: 'Bloomberg comp.', multiple: '>30x ARR', implied: '—', note: 'Référence data-rich SaaS' },
    { scenario: 'Palantir comp.',  multiple: '>25x ARR', implied: '—', note: 'Référence data-rich SaaS' },
    { scenario: 'Carta comp.',    multiple: '>15x ARR', implied: '—', note: 'Référence data-rich SaaS' },
  ]

  const section = {
    marginBottom: '48px',
  }

  const sectionTitle = {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '16px',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: GOLD,
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: `1px solid ${GOLD}33`,
  }

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '14px',
  }

  const thStyle = {
    background: NAVY,
    color: GOLD,
    padding: '10px 14px',
    textAlign: 'left',
    fontWeight: 600,
    letterSpacing: '0.05em',
    fontSize: '12px',
    textTransform: 'uppercase',
  }

  const tdStyle = {
    padding: '10px 14px',
    borderBottom: '1px solid #e5e0d8',
    color: TEXT,
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: CREAM,
      padding: '0 0 80px',
    }}>

      {/* ── Header ── */}
      <div style={{
        background: NAVY,
        padding: '40px 32px 32px',
        position: 'relative',
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          {/* Badge Tier 2 */}
          <span style={{
            display: 'inline-block',
            background: `${GOLD}22`,
            border: `1px solid ${GOLD}`,
            color: GOLD,
            fontFamily: 'system-ui, sans-serif',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            padding: '4px 12px',
            borderRadius: '2px',
            marginBottom: '16px',
          }}>
            🔒 Tier 2 — Accès restreint
          </span>

          <h1 style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '28px',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#ffffff',
            margin: '0 0 8px',
          }}>
            Projections Financières
          </h1>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '13px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: GOLD,
            fontWeight: 300,
          }}>
            CONFIDENTIEL — Retbaa Circle · 2025–2030
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 32px 0' }}>

        {/* ── KPIs 2025 ── */}
        <div style={section}>
          <div style={sectionTitle}>Performance 2025</div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
          }}>
            {kpis.map(k => (
              <div key={k.label} style={{
                background: '#ffffff',
                border: `1px solid ${GOLD}44`,
                borderTop: `3px solid ${GOLD}`,
                padding: '20px',
                borderRadius: '2px',
              }}>
                <div style={{ fontSize: '22px', marginBottom: '8px' }}>{k.icon}</div>
                <div style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: NAVY,
                  marginBottom: '4px',
                }}>
                  {k.value}
                </div>
                <div style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '11px',
                  color: '#9CA3AF',
                  letterSpacing: '0.05em',
                }}>
                  {k.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Graphique CA 2025-2030 ── */}
        <div style={section}>
          <div style={sectionTitle}>Projections CA 2025–2030</div>
          <div style={{
            background: '#ffffff',
            border: `1px solid ${GOLD}44`,
            padding: '24px',
            borderRadius: '2px',
          }}>
            {projections.map((p, i) => (
              <div key={p.year} style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: i < projections.length - 1 ? '14px' : 0,
                gap: '12px',
              }}>
                <div style={{
                  width: '48px',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: TEXT,
                  flexShrink: 0,
                }}>
                  {p.year}
                </div>
                <div style={{
                  flex: 1,
                  height: '28px',
                  background: '#f3f0ea',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.max(p.pct * 100, 3.2)}%`,
                    background: i === projections.length - 1
                      ? `linear-gradient(90deg, ${NAVY}, ${GOLD})`
                      : i >= 3
                      ? `linear-gradient(90deg, ${NAVY}cc, ${GOLD})`
                      : NAVY,
                    borderRadius: '2px',
                    transition: 'width 0.6s ease',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '8px',
                  }}>
                    <span style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#ffffff',
                      whiteSpace: 'nowrap',
                    }}>
                      {p.label}
                    </span>
                  </div>
                </div>
                <div style={{
                  width: '160px',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '11px',
                  color: p.growth === 'base' ? '#9CA3AF' : GOLD,
                  fontWeight: p.growth === 'base' ? 400 : 600,
                  flexShrink: 0,
                }}>
                  {p.growth}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ARR SaaS ── */}
        <div style={section}>
          <div style={sectionTitle}>ARR SaaS — Retbaa OS</div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Horizon</th>
                <th style={thStyle}>Fourchette basse</th>
                <th style={thStyle}>Fourchette haute</th>
              </tr>
            </thead>
            <tbody>
              {arrRows.map(r => (
                <tr key={r.horizon} style={{ background: '#ffffff' }}>
                  <td style={{ ...tdStyle, fontWeight: 600, color: TEXT }}>{r.horizon}</td>
                  <td style={{ ...tdStyle, color: '#6B7280' }}>{r.low}</td>
                  <td style={{ ...tdStyle, color: GOLD, fontWeight: 700 }}>{r.high}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{
            marginTop: '10px',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '11px',
            color: '#9CA3AF',
            fontStyle: 'italic',
          }}>
            Basé sur l'adoption Retbaa OS V5.2 — Horizon 36 mois à compter de Q3 2025.
          </div>
        </div>

        {/* ── Structure de la levée ── */}
        <div style={section}>
          <div style={sectionTitle}>Structure de la Levée</div>
          <div style={{
            background: '#ffffff',
            border: `1px solid ${GOLD}44`,
            padding: '24px',
            borderRadius: '2px',
            marginBottom: '16px',
          }}>
            {/* Résumé chiffres */}
            <div style={{
              display: 'flex',
              gap: '32px',
              marginBottom: '28px',
              flexWrap: 'wrap',
            }}>
              {[
                { label: 'Total levée', value: '€600K' },
                { label: 'Pre-money', value: '€2,4M' },
                { label: 'Post-money', value: '€3M' },
                { label: 'Mobilisables Q3 2026', value: '€900K' },
              ].map(item => (
                <div key={item.label}>
                  <div style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: NAVY,
                  }}>{item.value}</div>
                  <div style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '11px',
                    color: '#9CA3AF',
                  }}>{item.label}</div>
                </div>
              ))}
            </div>

            {/* Timeline tranches */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0',
              position: 'relative',
            }}>
              {/* Ligne connectrice */}
              <div style={{
                position: 'absolute',
                top: '18px',
                left: '20px',
                right: '20px',
                height: '2px',
                background: `linear-gradient(90deg, ${GOLD}, ${GOLD}44)`,
                zIndex: 0,
              }} />

              {/* Tranche 1 */}
              <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '36px', height: '36px',
                  background: GOLD,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px',
                  marginBottom: '10px',
                  boxShadow: `0 0 0 4px ${GOLD}22`,
                }}>✅</div>
                <div style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: NAVY,
                  marginBottom: '4px',
                }}>Tranche 1 — €360K</div>
                <div style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '11px',
                  color: '#6B7280',
                }}>Levée · Clôturée</div>
              </div>

              {/* Tranche 2 */}
              <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '36px', height: '36px',
                  background: '#ffffff',
                  border: `2px dashed ${GOLD}`,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px',
                  marginBottom: '10px',
                }}>⏳</div>
                <div style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: NAVY,
                  marginBottom: '4px',
                }}>Tranche 2 — €240K</div>
                <div style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '11px',
                  color: '#6B7280',
                }}>À clôturer · Q3 2026</div>
              </div>

              {/* Levier */}
              <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '36px', height: '36px',
                  background: NAVY,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px',
                  color: GOLD,
                  fontWeight: 700,
                  marginBottom: '10px',
                }}>⚡</div>
                <div style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: NAVY,
                  marginBottom: '4px',
                }}>Effet levier €300K</div>
                <div style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '11px',
                  color: '#6B7280',
                }}>€240K + €60K prêt actionnaire</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Multiples de sortie ── */}
        <div style={section}>
          <div style={sectionTitle}>Multiples de Sortie Envisagés</div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Scénario</th>
                <th style={thStyle}>Multiple</th>
                <th style={thStyle}>Valorisation implicite</th>
                <th style={thStyle}>Note</th>
              </tr>
            </thead>
            <tbody>
              {exitRows.map((r, i) => (
                <tr key={r.scenario} style={{ background: i % 2 === 0 ? '#ffffff' : '#faf7f2' }}>
                  <td style={{ ...tdStyle, fontWeight: 600, color: TEXT }}>{r.scenario}</td>
                  <td style={{ ...tdStyle, color: GOLD, fontWeight: 700 }}>{r.multiple}</td>
                  <td style={{ ...tdStyle, color: NAVY }}>{r.implied}</td>
                  <td style={{ ...tdStyle, color: '#9CA3AF', fontSize: '12px' }}>{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Disclaimer ── */}
        <div style={{
          background: `${NAVY}08`,
          border: `1px solid ${NAVY}22`,
          borderLeft: `3px solid ${GOLD}`,
          padding: '16px 20px',
          borderRadius: '2px',
        }}>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '12px',
            color: '#6B7280',
            lineHeight: 1.6,
          }}>
            <strong style={{ color: TEXT }}>⚠️ Projections indicatives.</strong>{' '}
            Ces informations sont confidentielles et couvertes par le NDA signé.
            Les projections financières présentées sont basées sur des hypothèses de croissance
            et ne constituent pas une garantie de performance. Retbaa Circle se réserve le droit
            de réviser ces projections à tout moment.
          </div>
        </div>

      </div>
    </div>
  )
}
