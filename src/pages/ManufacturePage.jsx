import { useNavigate } from 'react-router-dom'

export default function ManufacturePage() {
  const navigate = useNavigate()

  const s = {
    page: { fontFamily: 'Manrope, sans-serif', color: '#1A1A1A', background: '#fff' },

    // Hero
    hero: {
      background: '#1A3A6B',
      padding: '100px 40px',
      textAlign: 'center',
    },
    heroTitle: {
      fontFamily: 'Georgia, serif',
      fontStyle: 'italic',
      fontSize: 'clamp(36px, 5vw, 60px)',
      fontWeight: 400,
      color: '#fff',
      marginBottom: '16px',
      letterSpacing: '-0.01em',
    },
    heroSub: {
      fontFamily: 'Manrope, sans-serif',
      fontSize: 'clamp(14px, 2vw, 18px)',
      color: 'rgba(255,255,255,0.75)',
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: 1.6,
    },

    // Modèle
    modele: {
      background: '#FAF7F2',
      padding: '80px 40px',
    },
    modeleInner: {
      maxWidth: '900px',
      margin: '0 auto',
    },
    modeleGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '40px',
      marginTop: '48px',
    },
    modeleCard: {
      background: '#fff',
      padding: '36px 32px',
      borderRadius: '2px',
      border: '1px solid rgba(26,58,107,0.1)',
    },
    modeleCardTitle: {
      fontFamily: 'Georgia, serif',
      fontStyle: 'italic',
      fontSize: '22px',
      color: '#1A3A6B',
      marginBottom: '16px',
    },
    modeleCardText: {
      fontSize: '14px',
      lineHeight: 1.7,
      color: '#555',
    },

    // Section titles
    sectionLabel: {
      fontSize: '9px',
      letterSpacing: '0.3em',
      textTransform: 'uppercase',
      color: '#1A3A6B',
      fontWeight: 700,
      marginBottom: '12px',
    },
    sectionTitle: {
      fontFamily: 'Georgia, serif',
      fontStyle: 'italic',
      fontSize: '32px',
      fontWeight: 400,
      color: '#1A3A6B',
      marginBottom: '8px',
    },

    // Programme
    programme: {
      background: '#fff',
      padding: '80px 40px',
    },
    programmeInner: {
      maxWidth: '700px',
      margin: '0 auto',
    },
    timeline: {
      marginTop: '48px',
      position: 'relative',
      paddingLeft: '32px',
      borderLeft: '2px solid #E5E0D8',
    },
    phase: {
      marginBottom: '48px',
      position: 'relative',
    },
    phaseDot: {
      position: 'absolute',
      left: '-41px',
      top: '4px',
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      background: '#1A3A6B',
      border: '3px solid #fff',
      boxShadow: '0 0 0 2px #1A3A6B',
    },
    phaseBadge: {
      display: 'inline-block',
      background: '#C9A84C',
      color: '#fff',
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '0.05em',
      padding: '4px 12px',
      borderRadius: '2px',
      marginBottom: '12px',
    },
    phaseTitle: {
      fontFamily: 'Georgia, serif',
      fontStyle: 'italic',
      fontSize: '20px',
      color: '#1A3A6B',
      marginBottom: '12px',
    },
    phaseItems: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
    },
    phaseItem: {
      background: '#FAF7F2',
      padding: '6px 14px',
      borderRadius: '2px',
      fontSize: '13px',
      color: '#444',
    },

    // Mécanismes
    mecanismes: {
      background: '#FAF7F2',
      padding: '80px 40px',
    },
    mecanismesInner: {
      maxWidth: '1000px',
      margin: '0 auto',
    },
    mecanismesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '24px',
      marginTop: '48px',
    },
    mecanismeCard: {
      background: '#fff',
      border: '2px solid #1A3A6B',
      borderRadius: '2px',
      padding: '32px 28px',
    },
    mecanismeCardTitle: {
      fontFamily: 'Georgia, serif',
      fontStyle: 'italic',
      fontSize: '18px',
      color: '#1A3A6B',
      marginBottom: '12px',
    },
    mecanismeCardText: {
      fontSize: '13px',
      lineHeight: 1.7,
      color: '#555',
    },

    // KPIs
    kpis: {
      background: '#fff',
      padding: '80px 40px',
    },
    kpisInner: {
      maxWidth: '900px',
      margin: '0 auto',
    },
    kpisGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '24px',
      marginTop: '48px',
    },
    kpiCard: {
      background: '#FAF7F2',
      padding: '32px 24px',
      textAlign: 'center',
      borderRadius: '2px',
    },
    kpiValue: {
      fontFamily: 'Georgia, serif',
      fontStyle: 'italic',
      fontSize: '36px',
      color: '#1A3A6B',
      marginBottom: '8px',
    },
    kpiLabel: {
      fontSize: '12px',
      color: '#888',
      letterSpacing: '0.05em',
    },

    // CTA
    cta: {
      background: '#1A3A6B',
      padding: '80px 40px',
      textAlign: 'center',
    },
    ctaTitle: {
      fontFamily: 'Georgia, serif',
      fontStyle: 'italic',
      fontSize: '28px',
      color: '#fff',
      marginBottom: '32px',
    },
    ctaBtn: {
      display: 'inline-block',
      background: '#fff',
      color: '#1A3A6B',
      padding: '16px 40px',
      fontFamily: 'Manrope, sans-serif',
      fontWeight: 700,
      fontSize: '14px',
      letterSpacing: '0.05em',
      borderRadius: '2px',
      cursor: 'pointer',
      border: 'none',
    },
  }

  return (
    <div style={s.page}>

      {/* ── Hero ── */}
      <section style={s.hero}>
        <h1 style={s.heroTitle}>Retbaa Manufacture</h1>
        <p style={s.heroSub}>L'infrastructure du Cultural Luxury. Deux marchés. Un modèle dérisqué.</p>
      </section>

      {/* ── Le modèle ── */}
      <section style={s.modele}>
        <div style={s.modeleInner}>
          <div style={s.sectionLabel}>Le modèle</div>
          <div style={s.sectionTitle}>Double marché, risque maîtrisé</div>
          <div style={s.modeleGrid}>
            <div style={s.modeleCard}>
              <div style={s.modeleCardTitle}>Client fondateur</div>
              <p style={s.modeleCardText}>
                Retbaa est son propre premier client — demande captive garantie dès le jour 1.
                Élimine le risque de démarrage classique d'une manufacture industrielle.
                La production trouve immédiatement preneur, sans attendre la construction d'un portefeuille clients.
              </p>
            </div>
            <div style={s.modeleCard}>
              <div style={s.modeleCardTitle}>Marque blanche</div>
              <p style={s.modeleCardText}>
                D'autres maisons européennes s'approvisionnent via la Manufacture Retbaa.
                Second flux de revenus entièrement indépendant de la marque Retbaa.
                Chaque contrat marque blanche accroît la capacité industrielle et dilue les coûts fixes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Programme ── */}
      <section style={s.programme}>
        <div style={s.programmeInner}>
          <div style={s.sectionLabel}>Programme d'investissement</div>
          <div style={s.sectionTitle}>€1.18M · 2 phases</div>
          <div style={s.timeline}>

            <div style={s.phase}>
              <div style={s.phaseDot} />
              <div style={s.phaseBadge}>Phase 1 — €880K</div>
              <div style={s.phaseTitle}>Lab & Academy</div>
              <div style={s.phaseItems}>
                {['Lab parfumerie & cosmétique', 'Academy artisans', 'Ligne bougies', 'Filière karité & baobab'].map(item => (
                  <span key={item} style={s.phaseItem}>{item}</span>
                ))}
              </div>
            </div>

            <div style={s.phase}>
              <div style={s.phaseDot} />
              <div style={s.phaseBadge}>Phase 2 — €300K</div>
              <div style={s.phaseTitle}>Fleurs d'exception</div>
              <div style={s.phaseItems}>
                {['Serre fleurs d\'exception', 'Ingrédients rares Afrique subsaharienne'].map(item => (
                  <span key={item} style={s.phaseItem}>{item}</span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Mécanismes ── */}
      <section style={s.mecanismes}>
        <div style={s.mecanismesInner}>
          <div style={s.sectionLabel}>Mécanismes d'investissement</div>
          <div style={s.sectionTitle}>Trois voies d'entrée</div>
          <div style={s.mecanismesGrid}>
            <div style={s.mecanismeCard}>
              <div style={s.mecanismeCardTitle}>Equity Manufacture</div>
              <p style={s.mecanismeCardText}>
                Participation directe dans la filiale Manufacture SAS.
                Upside lié à la croissance du portefeuille marque blanche.
              </p>
            </div>
            <div style={s.mecanismeCard}>
              <div style={s.mecanismeCardTitle}>Prêt participatif</div>
              <p style={s.mecanismeCardText}>
                Remboursement indexé sur le chiffre d'affaires marque blanche.
                TRI cible 10–12% sur horizon 5–7 ans.
              </p>
            </div>
            <div style={s.mecanismeCard}>
              <div style={s.mecanismeCardTitle}>Co-investissement filière</div>
              <p style={s.mecanismeCardText}>
                Aux côtés de Teranga Capital et Proparco.
                Focus filière karité sénégalaise — impact agricole mesurable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── KPIs ── */}
      <section style={s.kpis}>
        <div style={s.kpisInner}>
          <div style={s.sectionLabel}>Chiffres clés</div>
          <div style={s.sectionTitle}>Le programme en un coup d'œil</div>
          <div style={s.kpisGrid}>
            {[
              { value: '€1.18M', label: 'Programme total' },
              { value: '€880K',  label: 'Phase 1 démarrage' },
              { value: '2',      label: 'Marchés (Marque propre + Marque blanche)' },
              { value: 'Phase 1', label: 'Démarrage immédiat' },
            ].map(kpi => (
              <div key={kpi.label} style={s.kpiCard}>
                <div style={s.kpiValue}>{kpi.value}</div>
                <div style={s.kpiLabel}>{kpi.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={s.cta}>
        <div style={s.ctaTitle}>Prêt à aller plus loin ?</div>
        <button style={s.ctaBtn} onClick={() => navigate('/dataroom-docs')}>
          Accéder au dossier Manufacture
        </button>
      </section>

    </div>
  )
}
