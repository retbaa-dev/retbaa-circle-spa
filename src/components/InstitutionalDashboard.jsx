// components/InstitutionalDashboard.jsx — Dashboard personnalisé par type d'institution
import { useNavigate } from 'react-router-dom'

const PROFILES = {
  sovereign_fund: {
    headline: "Retbaa — Un actif de souveraineté culturelle",
    pitch: "Vous investissez dans les infrastructures stratégiques du Sénégal. Retbaa est l'infrastructure manquante : une maison de Cultural Luxury qui transforme les matières premières sénégalaises en produits vendus à Paris et Dubai.",
    angle: "Filière locale · Rayonnement international · Soft power",
    metrics: [
      { label: "CA 2025", value: "€191K", sub: "Marge brute 60%" },
      { label: "EBITDA", value: "22.7%", sub: "Dès l'année 1" },
      { label: "Programme Manufacture", value: "€1.18M", sub: "Filière karité/baobab" },
      { label: "Marché adressable", value: "€325Mds", sub: "d'ici 2030" },
    ],
    featuredDocs: ["Pitch Deck", "Retbaa Manufacture", "Étude de marché"],
    cta: "Accéder aux documents de la filière",
  },
  public_institution: {
    headline: "Retbaa — Industries créatives sénégalaises à impact",
    pitch: "Retbaa crée des emplois qualifiés dans la parfumerie, la cosmétique et l'épicerie fine. Notre Manufacture est une Academy : formation, transfert de compétences, valorisation de l'artisanat local.",
    angle: "Emplois jeunes · Artisanat · Industries créatives",
    metrics: [
      { label: "Pentawards 2024", value: "2 Gold", sub: "Seule entreprise africaine" },
      { label: "Filière locale", value: "Manufacture", sub: "Karité · Baobab · Fleurs" },
      { label: "Marchés actifs", value: "3", sub: "Sénégal · France · Golfe" },
      { label: "CA certifié 2025", value: "125M FCFA", sub: "EBITDA 22.7%" },
    ],
    featuredDocs: ["Pitch Deck", "Retbaa Manufacture", "Note stratégique"],
    cta: "Voir le dossier industries créatives",
  },
  private_equity: {
    headline: "Retbaa — Double marché, double moat, sortie à double multiple",
    pitch: "Un modèle dérisqué par la demande captive (Retbaa comme premier client de sa propre Manufacture) et un double marché (B2C marque + B2B marque blanche). Sortie possible à 5-7x CA (luxe) ou 10-25x ARR (SaaS).",
    angle: "Rentabilité · Jalons · Sortie",
    metrics: [
      { label: "Pre-money", value: "€2.4M", sub: "Post-money €3M" },
      { label: "Tranche 2", value: "€240K", sub: "À clôturer" },
      { label: "ARR SaaS 36 mois", value: "€8.7M–€19.8M", sub: "SaaS-ability validée" },
      { label: "Multiple sortie", value: "5–25x", sub: "Luxe ou SaaS" },
    ],
    featuredDocs: ["Pitch Deck", "Projections Financières", "Closing Binder", "Cap Table"],
    cta: "Accéder aux projections financières",
  },
  impact_fund: {
    headline: "Retbaa — Cultural Luxury comme vecteur de développement durable",
    pitch: "Retbaa valorise les matières culturelles africaines (karité, baobab, fleurs) pour créer des produits premium exportables. Cultural economy + supply chain locale + emplois qualifiés = impact mesurable et désirable.",
    angle: "Impact · ICC · Filière durable",
    metrics: [
      { label: "Ticket Manufacture", value: "50M–300M FCFA", sub: "Séquencé par jalons" },
      { label: "Filière", value: "Karité · Baobab", sub: "Intégration verticale" },
      { label: "Export actif", value: "France · Golfe", sub: "Dubai pipeline" },
      { label: "Pentawards", value: "2 Gold 2024", sub: "62 pays, 2000+ candidatures" },
    ],
    featuredDocs: ["Pitch Deck", "Retbaa Manufacture", "Étude de marché", "Note stratégique"],
    cta: "Voir le dossier impact filière",
  },
  development_agency: {
    headline: "Retbaa — Industries créatives africaines : du local au global",
    pitch: "Le groupe AFD finance les ICC comme levier de développement durable. Retbaa est la démonstration que le Cultural Luxury africain peut accéder aux standards globaux les plus élevés — Pentawards, Paris, Dubai — tout en ancrant sa production locale.",
    angle: "ICC · Développement · Rayonnement",
    metrics: [
      { label: "Bilan ICC AFD 2025", value: "Axe transversal", sub: "38Mds€ investis Afrique" },
      { label: "CA 2025", value: "€191K", sub: "Marge 60%" },
      { label: "Manufacture", value: "€1.18M", sub: "Filière locale" },
      { label: "Marché luxe Afrique", value: "€325Mds", sub: "d'ici 2030" },
    ],
    featuredDocs: ["Pitch Deck", "Étude de marché", "Retbaa Manufacture"],
    cta: "Accéder au dossier ICC",
  },
  bank: {
    headline: "Retbaa — Partenaire distribution clientèle premium",
    pitch: "Retbaa est présent dans les meilleurs hôtels et lounges d'Afrique de l'Ouest (Terrou-Bi, Sokhamoné, Ecobank). Notre réseau B2B est un canal de distribution naturel pour une offre bancaire premium.",
    angle: "B2B · Distribution · Clientèle premium",
    metrics: [
      { label: "Pipeline B2B", value: "€330K", sub: "Identifié" },
      { label: "Références", value: "Ecobank", sub: "IFC partnership" },
      { label: "Segments", value: "B2C · B2B · B2G", sub: "3 canaux validés" },
      { label: "Marchés actifs", value: "3", sub: "Sénégal · France · Golfe" },
    ],
    featuredDocs: ["Pitch Deck", "Note stratégique"],
    cta: "Voir le dossier partenariat",
  },
}

export default function InstitutionalDashboard({ institutionType }) {
  const navigate = useNavigate()
  const profile = PROFILES[institutionType]

  if (!profile) return null

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(26,58,107,0.12)',
      borderRadius: '12px',
      padding: '32px',
      marginBottom: '40px',
      boxShadow: '0 2px 16px rgba(0,27,63,0.06)',
    }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '24px',
      }}>
        <h2 style={{
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: '22px',
          color: '#1A3A6B',
          margin: 0,
          lineHeight: 1.3,
          flex: 1,
          minWidth: '200px',
        }}>
          {profile.headline}
        </h2>

        {/* Badge angle — or */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '5px 14px',
          background: 'rgba(196,169,106,0.12)',
          border: '1px solid rgba(196,169,106,0.5)',
          borderRadius: '999px',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.04em',
          color: '#6B5A2A',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          {profile.angle}
        </div>
      </div>

      {/* ── KPI Grid ──────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '12px',
        marginBottom: '24px',
      }}>
        {profile.metrics.map((m, i) => (
          <div key={i} style={{
            background: '#FAF7F2',
            border: '1px solid rgba(26,58,107,0.08)',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              fontSize: '22px',
              color: '#1A3A6B',
              fontWeight: 400,
              lineHeight: 1.2,
              marginBottom: '4px',
            }}>
              {m.value}
            </div>
            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#374151',
              letterSpacing: '0.03em',
              marginBottom: '2px',
            }}>
              {m.label}
            </div>
            <div style={{
              fontSize: '10px',
              color: '#9CA3AF',
              lineHeight: 1.4,
            }}>
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── Pitch ─────────────────────────────────────────────────────── */}
      <p style={{
        fontFamily: 'Manrope, sans-serif',
        fontSize: '14px',
        color: '#374151',
        lineHeight: 1.75,
        margin: '0 0 24px',
      }}>
        {profile.pitch}
      </p>

      {/* ── Docs recommandés ──────────────────────────────────────────── */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          fontSize: '9px',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: '#9CA3AF',
          fontWeight: 700,
          marginBottom: '10px',
        }}>
          DOCUMENTS RECOMMANDÉS
        </div>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {profile.featuredDocs.map((doc, i) => (
            <li key={i}>
              <a
                href="/dataroom-docs"
                onClick={e => { e.preventDefault(); navigate('/dataroom-docs') }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  background: 'rgba(26,58,107,0.04)',
                  border: '1px solid rgba(26,58,107,0.15)',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#1A3A6B',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'background 0.15s, border-color 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(26,58,107,0.08)'
                  e.currentTarget.style.borderColor = 'rgba(26,58,107,0.3)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(26,58,107,0.04)'
                  e.currentTarget.style.borderColor = 'rgba(26,58,107,0.15)'
                }}
              >
                <span style={{ fontSize: '14px' }}>📄</span>
                {doc}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <button
        onClick={() => navigate('/dataroom-docs')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          background: '#1A3A6B',
          border: 'none',
          borderRadius: '8px',
          color: '#fff',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.02em',
          cursor: 'pointer',
          transition: 'background 0.15s, transform 0.1s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#142d56'
          e.currentTarget.style.transform = 'translateY(-1px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = '#1A3A6B'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        {profile.cta}
        <span style={{ fontSize: '16px' }}>→</span>
      </button>

    </div>
  )
}
