// MonInvestissementPage.jsx — Retbaa Circle — Design Stitch fidèle
const INVESTOR_DATA = {
  'Massata':     { amount: 1000,   pct: 86.96, shares: 100000, sharesRange: '1 à 100 000',         entry: 'Fév. 2026', id: 'RC-0001', role: 'founder',  label: 'Apport fondateur' },
  'Barthélemy':  { amount: 150000, pct: 5.43,  shares: 6250,   sharesRange: '100 001 à 106 250',   entry: 'Fév. 2026', id: 'RC-9921', role: 'investor', label: 'Tranche 1' },
  'Pape Amadou': { amount: 150000, pct: 5.43,  shares: 6250,   sharesRange: '106 251 à 112 500',   entry: 'Fév. 2026', id: 'RC-0042', role: 'investor', label: 'Tranche 1' },
  'Cathy':       { amount: 30000,  pct: 1.09,  shares: 1250,   sharesRange: '112 501 à 113 750',   entry: 'Fév. 2026', id: 'RC-0078', role: 'investor', label: 'Tranche 1' },
  'Raphaël':     { amount: 30000,  pct: 1.09,  shares: 1250,   sharesRange: '113 751 à 115 000',   entry: 'Fév. 2026', id: 'RC-0093', role: 'investor', label: 'Tranche 1' },
}

function DonutChart({ pct, color }) {
  const r = 60
  const circ = 2 * Math.PI * r
  const rest = 100 - pct - 28.06 // management
  const slices = [
    { value: 65 - (100 - pct - 28.06 - pct), fill: '#1A3A6B' }, // institutionnels
    { value: rest > 0 ? rest : 0, fill: '#1A3A6B' },
    { value: pct, fill: color },
    { value: 28.06, fill: '#E8E8E8' },
  ]
  // Simple donut with SVG
  let offset = 0
  const segments = []
  const total = 100
  ;[
    { value: 100 - pct - 28.06, fill: '#1A3A6B' },
    { value: pct, fill: color },
    { value: 28.06, fill: '#E8E8E8' },
  ].forEach((s, i) => {
    const dash = (s.value / total) * circ
    segments.push(
      <circle
        key={i}
        cx="70" cy="70" r={r}
        fill="none"
        stroke={s.fill}
        strokeWidth="18"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={-offset}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '70px 70px' }}
      />
    )
    offset += dash
  })
  return (
    <svg width="140" height="140">
      {segments}
      <text x="70" y="64" textAnchor="middle" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '9px', fill: '#9CA3AF', letterSpacing: '0.15em', textTransform: 'uppercase' }}>STATUS</text>
      <text x="70" y="82" textAnchor="middle" style={{ fontFamily: 'Newsreader, serif', fontSize: '16px', fill: '#1A3A6B', fontStyle: 'italic' }}>Actif</text>
    </svg>
  )
}

export default function MonInvestissementPage({ userName, setActivePage }) {
  const data = INVESTOR_DATA[userName] || INVESTOR_DATA['Barthélemy']

  const estimatedValue = data.amount ? Math.round(data.amount * 1.138) : null

  const docs = [
    { title: "Pacte d'actionnaires V2", sub: 'Fév. 2026', status: 'sign', pdf: '/docs/governance/pacte-actionnaires.pdf' },
    { title: 'Bulletin de souscription', sub: 'Fév. 2026', status: 'sign', pdf: '/docs/governance/bulletin-souscription.pdf' },
    { title: 'Engagement Tranche 2 (Optionnel)', sub: 'Action requise avant le 30 Juin 2026', status: 'pending', pdf: null },
  ]

  const steps = [
    { num: '01', title: 'Entrée au Capital', desc: 'Souscription validée et fonds transférés.', status: 'done' },
    { num: '02', title: 'Gouvernance Active', desc: 'Droit de vote opérationnel. Participation aux comités.', status: 'current' },
    { num: '03', title: 'Tranche 2', desc: 'Ouverture de la fenêtre de ré-investissement — T4 2026.', status: 'upcoming' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9F9F9', fontFamily: 'Manrope, sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '64px 48px' }} className="mon-invest-padding">

        {/* ── Hero ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#EFC0D4', marginBottom: '12px' }}>
              ESPACE INVESTISSEUR PRIVÉ
            </div>
            <h1 style={{
              fontFamily: 'Newsreader, serif', fontStyle: 'italic',
              fontSize: '48px', fontWeight: 300, color: '#1A3A6B',
              margin: 0, lineHeight: 1.1,
            }}>
              Mon Portefeuille :<br />{userName}
            </h1>
          </div>
          {estimatedValue && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '6px' }}>
                VALEUR ESTIMÉE
              </div>
              <div style={{ fontFamily: 'Newsreader, serif', fontSize: '36px', color: '#1A3A6B' }}>
                €{estimatedValue.toLocaleString('fr-FR')}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#EFC0D4', letterSpacing: '0.05em' }}>
                +13.8% performance
              </div>
            </div>
          )}
        </div>

        {/* ── KPI cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
          {[
            { label: 'MONTANT INVESTI', value: data.role === 'founder' ? '1 000 €' : `€${data.amount.toLocaleString('fr-FR')}`, sub: `Transaction ID # ${data.id}` },
            { label: 'ACTIONNARIAT', value: `${data.pct}%`, sub: `${data.shares.toLocaleString('fr-FR')} actions · Droits de vote actifs` },
            { label: "DATE D'ENTRÉE", value: data.entry, sub: 'Période de lock-up : 24 mois' },
            { label: 'NUMÉROS D\'ACTIONS', value: `N° ${data.sharesRange}`, sub: 'Actions ordinaires · 0,01 € nominal' },
          ].map(k => (
            <div key={k.label} style={{
              background: '#ffffff', borderRadius: '4px', padding: '28px 32px',
              boxShadow: '0px 10px 30px rgba(0,27,63,0.04)',
              borderBottom: '3px solid rgba(239,192,212,0.3)',
            }}>
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '10px' }}>
                {k.label}
              </div>
              <div style={{ fontFamily: 'Newsreader, serif', fontSize: '28px', color: '#1A3A6B', marginBottom: '4px' }}>
                {k.value}
              </div>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Donut + Répartition ── */}
        <div style={{
          background: '#ffffff', borderRadius: '4px', padding: '40px',
          boxShadow: '0px 20px 40px rgba(0,27,63,0.04)',
          marginBottom: '32px',
        }} className="donut-card">
          <div className="donut-inner">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <DonutChart pct={data.pct} color="#EFC0D4" />
            </div>
            <div>
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '20px' }}>
                RÉPARTITION DU CAPITAL
              </div>
              {[
                { label: 'Massata NIANG (Fondateur)', pct: '86.96%', color: '#1A3A6B' },
                { label: `${userName} (vous)`, pct: `${data.pct}%`, color: '#EFC0D4' },
                { label: 'Autres investisseurs Circle', pct: `${(100 - 86.96 - data.pct).toFixed(2)}%`, color: '#E8E8E8' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ width: '12px', height: '12px', background: r.color, borderRadius: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: '#43474F', flex: 1 }}>{r.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1A3A6B' }}>{r.pct}</span>
                </div>
              ))}
              <button
                onClick={() => setActivePage('documents')}
                style={{
                  marginTop: '16px', padding: '10px 20px',
                  background: 'none', border: '1px solid #EFC0D4',
                  borderRadius: '4px', cursor: 'pointer',
                  fontFamily: 'Manrope, sans-serif', fontSize: '9px',
                  fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: '#795465',
                }}
              >
                CONSULTER LA CAP TABLE COMPLÈTE
              </button>
            </div>
          </div>
        </div>

        {/* ── Timeline ── */}
        <div style={{
          background: '#ffffff', borderRadius: '4px', padding: '40px',
          boxShadow: '0px 20px 40px rgba(0,27,63,0.04)',
          marginBottom: '32px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: '28px', color: '#1A3A6B', margin: 0 }}>
              Timeline d'Investissement
            </h2>
            <span style={{ padding: '4px 12px', border: '1px solid #EFC0D4', fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#795465', borderRadius: '2px' }}>
              PHASE 2 EN COURS
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }} className="timeline-grid">
            {steps.map(s => (
              <div key={s.num} style={{
                padding: '24px', borderRadius: '4px',
                background: s.status === 'upcoming' ? '#FAFAFA' : '#ffffff',
                border: s.status === 'current' ? '1px solid rgba(239,192,212,0.4)' : '1px solid rgba(0,27,63,0.06)',
                opacity: s.status === 'upcoming' ? 0.6 : 1,
              }}>
                <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: s.status === 'done' ? '#EFC0D4' : s.status === 'current' ? '#1A3A6B' : '#9CA3AF', marginBottom: '10px' }}>
                  ÉTAPE {s.num} — {s.status === 'done' ? 'COMPLÉTÉ' : s.status === 'current' ? 'EN COURS' : 'À VENIR'}
                </div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px', fontWeight: 700, color: s.status === 'upcoming' ? '#9CA3AF' : '#1A3A6B', marginBottom: '8px' }}>
                  {s.title}
                </div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: 1.6 }}>
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
          {/* Barre de progression */}
          <div style={{ height: '4px', background: '#E0E8FF', borderRadius: '2px', marginTop: '20px', overflow: 'hidden' }}>
            <div style={{ width: '66%', height: '100%', background: 'linear-gradient(90deg, #EFC0D4 0%, #1A3A6B 100%)', borderRadius: '2px' }} />
          </div>
        </div>

        {/* ── Documents personnels ── */}
        <div style={{
          background: '#ffffff', borderRadius: '4px', padding: '40px',
          boxShadow: '0px 20px 40px rgba(0,27,63,0.04)',
        }}>
          <h2 style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: '28px', color: '#1A3A6B', margin: '0 0 28px' }}>
            Documents Personnels
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {docs.map((doc, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '20px 0',
                borderBottom: i < docs.length - 1 ? '1px solid rgba(239,192,212,0.12)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#1A3A6B' }}>description</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A3A6B', marginBottom: '2px' }}>{doc.title}</div>
                    <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{doc.sub}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {doc.status === 'sign' && (
                    <span style={{ padding: '3px 10px', background: 'rgba(186,26,26,0.06)', color: '#ba1a1a', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', border: '1px solid rgba(186,26,26,0.15)' }}>
                      À SIGNER
                    </span>
                  )}
                  {doc.status === 'pending' && (
                    <span style={{ padding: '3px 10px', background: 'rgba(26,58,107,0.08)', color: '#1A3A6B', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      SIGNATURE EN ATTENTE
                    </span>
                  )}
                  {doc.pdf ? (
                    <a href={doc.pdf} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', color: '#EFC0D4', textDecoration: 'none' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>download</span>
                    </a>
                  ) : (
                    <button style={{ padding: '8px 16px', background: '#1A3A6B', color: '#ffffff', border: 'none', borderRadius: '4px', fontFamily: 'Manrope, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>
                      SIGNER
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        .donut-inner {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 48px;
          align-items: center;
        }
        @media (max-width: 640px) {
          .donut-card { padding: 24px !important; }
          .donut-inner {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .timeline-grid { grid-template-columns: 1fr !important; }
          .mon-invest-padding { padding: 24px 16px !important; }
        }
      `}</style>
    </div>
  )
}
