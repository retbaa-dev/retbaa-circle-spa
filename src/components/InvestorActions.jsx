import { Link } from 'react-router-dom'

const ACTIONS = [
  {
    title: 'Lire la thèse',
    desc: 'Comprendre pourquoi Retbaa peut devenir une maison Cultural Luxury défendable.',
    icon: 'auto_stories',
    to: '/insights',
    tone: '#1A3A6B',
  },
  {
    title: 'Ouvrir le deck',
    desc: 'Accéder au pitch deck et aux documents structurants de la levée.',
    icon: 'folder_open',
    to: '/dataroom-docs',
    tone: '#795465',
  },
  {
    title: 'Voir les projections',
    desc: 'Tester les hypothèses financières, trajectoires et scénarios de rendement.',
    icon: 'monitoring',
    to: '/projections',
    tone: '#065F46',
  },
  {
    title: 'Comparer les véhicules',
    desc: 'Holding, SPV Les Adresses, Manufacture : choisir l’exposition adaptée.',
    icon: 'account_balance',
    to: '/investissement',
    tone: '#7C3AED',
  },
]

export default function InvestorActions({ compact = false }) {
  return (
    <section style={{
      background: '#fff',
      border: '1px solid rgba(26,58,107,0.08)',
      borderRadius: '10px',
      padding: compact ? '20px' : '26px 28px',
      margin: compact ? '24px 0' : '0 0 40px',
      boxShadow: '0 18px 36px rgba(0,27,63,0.04)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '18px',
        marginBottom: '20px',
      }}>
        <div>
          <div style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '10px', letterSpacing: '0.22em',
            textTransform: 'uppercase', color: '#795465', fontWeight: 800, marginBottom: '8px',
          }}>
            Actions investisseur
          </div>
          <h2 style={{
            fontFamily: 'Newsreader, serif', fontSize: compact ? '24px' : '30px',
            fontWeight: 300, fontStyle: 'italic', color: '#1A3A6B', margin: 0,
          }}>
            Passer de l’analyse à la décision
          </h2>
        </div>
        {!compact && (
          <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: '#9CA3AF', maxWidth: '280px', lineHeight: 1.6 }}>
            Chaque lecture doit ramener vers une preuve, un scénario ou un choix d’investissement.
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        {ACTIONS.map(action => (
          <Link key={action.title} to={action.to} style={{ textDecoration: 'none' }}>
            <div style={{
              height: '100%', boxSizing: 'border-box', padding: '16px', borderRadius: '8px',
              background: '#FAF7F2', border: `1px solid ${action.tone}18`,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '22px', color: action.tone, marginBottom: '12px', display: 'block' }}>
                {action.icon}
              </span>
              <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: '18px', color: '#1A3A6B', marginBottom: '6px' }}>
                {action.title}
              </div>
              <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: '#6B7280', lineHeight: 1.55 }}>
                {action.desc}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
