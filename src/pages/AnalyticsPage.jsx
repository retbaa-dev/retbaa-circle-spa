// pages/AnalyticsPage.jsx — Dashboard admin Retbaa Circle
import { useState, useEffect } from 'react'

const TOKEN = 'retbaa2026'
const INVESTOR_LABELS = {
  massata: 'Massata NIANG',
  barthelemy: 'Barthélemy FAYE',
  pape: 'Pape Amadou NGOM',
  cathy: 'Cathy MUIZA',
  raphael: 'Raphaël PERDRIX',
  anonymous: 'Visiteur anonyme',
}

const PAGE_LABELS = {
  dashboard: 'Tableau de bord',
  insights: 'Insights',
  products: 'Produits',
  documents: 'Documents',
  'inner-circle': 'Inner Circle',
  tranche2: 'Tranche 2',
  'mon-investissement': 'Mon Investissement',
  podcast: 'Podcast',
}

function StatCard({ label, value, icon, sub }) {
  return (
    <div style={{
      background: '#ffffff', borderRadius: '4px', padding: '24px',
      borderLeft: '3px solid #EFC0D4',
      boxShadow: '0px 10px 30px rgba(239,192,212,0.1)',
    }}>
      <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#795465', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#EFC0D4' }}>{icon}</span>
        {label}
      </div>
      <div style={{ fontFamily: 'Newsreader, serif', fontSize: '36px', color: '#1A3A6B', fontWeight: 400 }}>{value}</div>
      {sub && <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>{sub}</div>}
    </div>
  )
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeInv, setActiveInv] = useState(null)

  useEffect(() => {
    fetch(`/api/stats?token=${TOKEN}`)
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  const refresh = () => {
    setLoading(true)
    fetch(`/api/stats?token=${TOKEN}`)
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#EFC0D4', animation: 'spin 1s linear infinite' }}>refresh</span>
    </div>
  )

  if (error) return (
    <div style={{ padding: '64px 48px', color: '#ba1a1a', fontFamily: 'Manrope, sans-serif' }}>
      Erreur : {error}
    </div>
  )

  const investors = stats?.investors || {}
  const topPages = stats?.top_pages || []
  const topPodcasts = stats?.top_podcasts || []
  const invList = Object.values(investors).sort((a, b) => b.visits - a.visits)
  const totalVisits = invList.reduce((s, i) => s + i.visits, 0)

  const fmt = (ts) => ts ? new Date(ts).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9F9F9', fontFamily: 'Manrope, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 48px 64px' }} className="dashboard-main-padding">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#EFC0D4', marginBottom: '12px' }}>
              ADMIN · CONFIDENTIEL
            </div>
            <h1 style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: '48px', fontWeight: 300, color: '#1A3A6B', margin: 0, lineHeight: 1 }}>
              Analytics
            </h1>
          </div>
          <button onClick={refresh} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: 'none', border: '1px solid #EFC0D4', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#795465' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>refresh</span>
            Actualiser
          </button>
        </div>

        {/* KPIs globaux */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }} className="kpi-grid">
          <StatCard label="Visites totales" value={totalVisits} icon="visibility" />
          <StatCard label="Investisseurs actifs" value={invList.filter(i => i.name !== 'anonymous').length} icon="group" />
          <StatCard label="Écoutes podcast" value={topPodcasts.reduce((s, [,n]) => s + n, 0)} icon="headphones" />
          <StatCard label="Pages distinctes" value={topPages.length} icon="article" sub="pages visitées" />
        </div>

        {/* Tableau investisseurs */}
        <div style={{ background: '#ffffff', borderRadius: '4px', boxShadow: '0px 20px 40px rgba(0,27,63,0.04)', marginBottom: '32px', overflow: 'hidden' }}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid #F3F3F4' }}>
            <h2 style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: '24px', fontWeight: 300, color: '#1A3A6B', margin: 0 }}>
              Engagement par investisseur
            </h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9F9F9' }}>
                  {['Investisseur', 'Visites', 'Pages vues', 'Podcasts', 'Dernière visite'].map(h => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9CA3AF', borderBottom: '2px solid #1A3A6B' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invList.map(inv => {
                  const label = INVESTOR_LABELS[inv.name] || inv.name
                  const totalPages = Object.values(inv.pages).reduce((s, n) => s + n, 0)
                  const totalPodcasts = Object.values(inv.podcasts).reduce((s, n) => s + n, 0)
                  const isActive = activeInv === inv.name
                  return (
                    <>
                      <tr
                        key={inv.name}
                        onClick={() => setActiveInv(isActive ? null : inv.name)}
                        style={{ cursor: 'pointer', background: isActive ? 'rgba(239,192,212,0.08)' : '#ffffff', borderBottom: '1px solid #F3F3F4', transition: 'background 0.15s' }}
                      >
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(239,192,212,0.2)', border: '2px solid #EFC0D4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <span style={{ fontFamily: 'Newsreader, serif', fontSize: '11px', color: '#795465', fontWeight: 600 }}>{label.slice(0,2).toUpperCase()}</span>
                            </div>
                            <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', fontWeight: 600, color: '#1A3A6B' }}>{label}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', fontFamily: 'Newsreader, serif', fontSize: '20px', color: '#1A3A6B' }}>{inv.visits}</td>
                        <td style={{ padding: '16px 20px', fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#43474F' }}>{totalPages}</td>
                        <td style={{ padding: '16px 20px' }}>
                          {totalPodcasts > 0 ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', background: 'rgba(239,192,212,0.2)', borderRadius: '2px', fontSize: '10px', fontWeight: 700, color: '#795465' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>headphones</span>
                              {totalPodcasts}
                            </span>
                          ) : <span style={{ color: '#E0E0E0', fontSize: '12px' }}>—</span>}
                        </td>
                        <td style={{ padding: '16px 20px', fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#9CA3AF' }}>{fmt(inv.lastSeen)}</td>
                      </tr>
                      {isActive && (
                        <tr key={`${inv.name}-detail`} style={{ background: 'rgba(239,192,212,0.04)' }}>
                          <td colSpan={5} style={{ padding: '16px 32px 24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                              <div>
                                <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '12px' }}>PAGES VISITÉES</div>
                                {Object.entries(inv.pages).sort((a,b) => b[1]-a[1]).map(([p, n]) => (
                                  <div key={p} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F3F3F4', fontSize: '12px' }}>
                                    <span style={{ color: '#43474F' }}>{PAGE_LABELS[p] || p}</span>
                                    <span style={{ fontWeight: 700, color: '#1A3A6B' }}>{n}×</span>
                                  </div>
                                ))}
                                {Object.keys(inv.pages).length === 0 && <span style={{ color: '#9CA3AF', fontSize: '12px' }}>Aucune page trackée</span>}
                              </div>
                              <div>
                                <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '12px' }}>PODCASTS ÉCOUTÉS</div>
                                {Object.entries(inv.podcasts).sort((a,b) => b[1]-a[1]).map(([ep, n]) => (
                                  <div key={ep} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F3F3F4', fontSize: '12px' }}>
                                    <span style={{ color: '#43474F' }}>{ep}</span>
                                    <span style={{ fontWeight: 700, color: '#1A3A6B' }}>{n}×</span>
                                  </div>
                                ))}
                                {Object.keys(inv.podcasts).length === 0 && <span style={{ color: '#9CA3AF', fontSize: '12px' }}>Aucun podcast écouté</span>}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}
                {invList.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontStyle: 'italic' }}>Aucune donnée encore — les visites s'afficheront ici en temps réel.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pages + Podcasts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="dashboard-grid">
          <div style={{ background: '#ffffff', borderRadius: '4px', padding: '28px 32px', boxShadow: '0px 20px 40px rgba(0,27,63,0.04)' }}>
            <h3 style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: '20px', fontWeight: 300, color: '#1A3A6B', margin: '0 0 20px' }}>Pages les plus vues</h3>
            {topPages.slice(0, 8).map(([page, count]) => (
              <div key={page} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div style={{ flex: 1, fontSize: '12px', color: '#43474F' }}>{PAGE_LABELS[page] || page}</div>
                <div style={{ width: `${Math.round((count / (topPages[0]?.[1] || 1)) * 120)}px`, height: '4px', background: '#EFC0D4', borderRadius: '2px', transition: 'width 0.3s', minWidth: '4px' }} />
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1A3A6B', width: '24px', textAlign: 'right' }}>{count}</div>
              </div>
            ))}
            {topPages.length === 0 && <p style={{ color: '#9CA3AF', fontSize: '12px', fontStyle: 'italic' }}>En attente des premières visites…</p>}
          </div>

          <div style={{ background: '#ffffff', borderRadius: '4px', padding: '28px 32px', boxShadow: '0px 20px 40px rgba(0,27,63,0.04)' }}>
            <h3 style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: '20px', fontWeight: 300, color: '#1A3A6B', margin: '0 0 20px' }}>Podcasts les plus écoutés</h3>
            {topPodcasts.map(([ep, count]) => (
              <div key={ep} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#EFC0D4', flexShrink: 0 }}>headphones</span>
                <div style={{ flex: 1, fontSize: '12px', color: '#43474F' }}>{ep}</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1A3A6B' }}>{count}×</div>
              </div>
            ))}
            {topPodcasts.length === 0 && <p style={{ color: '#9CA3AF', fontSize: '12px', fontStyle: 'italic' }}>En attente des premières écoutes…</p>}
          </div>
        </div>

      </div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .dashboard-main-padding { padding: 24px 16px !important; }
          .kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
