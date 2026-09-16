const ACCESS_LEVELS = [
  {
    label: 'Public',
    depth: 'Réponses éditoriales',
    desc: 'Positionnement, marché, articles publics, vocabulaire non confidentiel.',
  },
  {
    label: 'NDA signé',
    depth: 'Réponses documentaires',
    desc: 'Synthèse Tier 1, études de marché, logique des véhicules, sans chiffres sensibles non publics.',
  },
  {
    label: 'Approuvé',
    depth: 'Réponses investisseur',
    desc: 'Dataroom Tier 2, projections, risques, comparaisons de véhicules, traçabilité des sources.',
  },
  {
    label: 'Fondateur',
    depth: 'Réponses complètes',
    desc: 'Tier 3, cap table, closing binder, notes internes et arbitrages confidentiels.',
  },
]

export default function KemiaAdvisorPanel({ access = 'Public' }) {
  return (
    <section style={{
      background: '#0D1F3C', color: '#fff', borderRadius: '12px',
      padding: '28px', margin: '0 0 40px', position: 'relative', overflow: 'hidden',
      boxShadow: '0 24px 50px rgba(13,31,60,0.18)',
    }}>
      <div style={{ position: 'absolute', right: '-60px', bottom: '-80px', fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: '220px', color: 'rgba(239,192,212,0.06)', lineHeight: 1 }}>
        K
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontFamily: 'Manrope, sans-serif', fontSize: '10px', letterSpacing: '0.24em',
          textTransform: 'uppercase', color: '#EFC0D4', fontWeight: 800, marginBottom: '8px',
        }}>
          Agent IA confidentiel · Kemia
        </div>
        <h2 style={{
          fontFamily: 'Newsreader, serif', fontSize: '30px', fontWeight: 300,
          fontStyle: 'italic', margin: '0 0 10px', color: '#fff',
        }}>
          Répondre selon le niveau d’accès, jamais au-delà
        </h2>
        <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, maxWidth: '680px', margin: '0 0 22px' }}>
          Le futur assistant doit être branché à une base documentaire indexée par niveau de confidentialité. Chaque réponse devra citer ses sources, refuser les documents hors périmètre et journaliser les questions sensibles.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {ACCESS_LEVELS.map(level => {
            const active = level.label === access
            return (
              <div key={level.label} style={{
                padding: '14px', borderRadius: '8px',
                background: active ? 'rgba(239,192,212,0.16)' : 'rgba(255,255,255,0.06)',
                border: active ? '1px solid rgba(239,192,212,0.45)' : '1px solid rgba(255,255,255,0.08)',
              }}>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: active ? '#EFC0D4' : 'rgba(255,255,255,0.55)', fontWeight: 800, marginBottom: '8px' }}>
                  {level.label}
                </div>
                <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: '17px', color: '#fff', marginBottom: '6px' }}>
                  {level.depth}
                </div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.62)', lineHeight: 1.5 }}>
                  {level.desc}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{
          display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap',
          padding: '14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#EFC0D4' }}>lock</span>
          <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
            Prochaine étape : connecter ce panneau à un endpoint serveur sécurisé avec RAG Supabase, citations obligatoires et garde-fous par rôle.
          </span>
        </div>
      </div>
    </section>
  )
}
