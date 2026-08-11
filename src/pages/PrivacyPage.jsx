// src/pages/PrivacyPage.jsx
// Politique de confidentialité — Retbaa SAS

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#FAF7F2',
    padding: '0 20px 60px',
  },
  header: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '32px 0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(26,58,107,0.1)',
    marginBottom: '48px',
  },
  logo: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontStyle: 'italic',
    fontWeight: 300,
    fontSize: '22px',
    color: '#1A3A6B',
    letterSpacing: '0.05em',
  },
  logoSub: {
    fontSize: '10px',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: '#EFC0D4',
    fontStyle: 'normal',
    display: 'block',
    marginTop: '2px',
  },
  backLink: {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '12px',
    color: '#6B7280',
    textDecoration: 'none',
    letterSpacing: '0.05em',
  },
  container: {
    maxWidth: '720px',
    margin: '0 auto',
  },
  h1: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontStyle: 'italic',
    fontWeight: 300,
    fontSize: '32px',
    color: '#1A3A6B',
    marginBottom: '8px',
  },
  date: {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '12px',
    color: '#9CA3AF',
    marginBottom: '40px',
    letterSpacing: '0.05em',
  },
  h2: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontStyle: 'italic',
    fontWeight: 400,
    fontSize: '18px',
    color: '#1A3A6B',
    marginTop: '36px',
    marginBottom: '12px',
  },
  p: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '14px',
    lineHeight: '1.75',
    color: '#374151',
    marginBottom: '12px',
  },
  ul: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '14px',
    lineHeight: '1.75',
    color: '#374151',
    paddingLeft: '24px',
    marginBottom: '12px',
  },
  li: {
    marginBottom: '4px',
  },
  a: {
    color: '#1A3A6B',
    textDecoration: 'underline',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid rgba(26,58,107,0.1)',
    margin: '40px 0',
  },
}

export default function PrivacyPage() {
  return (
    <div style={styles.page}>
      {/* Header minimal */}
      <header style={styles.header}>
        <div style={styles.logo}>
          Retbaa
          <span style={styles.logoSub}>Circle</span>
        </div>
        <a href="https://circle.retbaa.com" style={styles.backLink}>
          ← circle.retbaa.com
        </a>
      </header>

      {/* Contenu */}
      <div style={styles.container}>
        <h1 style={styles.h1}>Politique de confidentialité</h1>
        <div style={styles.date}>Dernière mise à jour : 11 août 2026</div>

        {/* 1. Responsable du traitement */}
        <h2 style={styles.h2}>1. Responsable du traitement</h2>
        <p style={styles.p}>
          Le responsable du traitement de vos données personnelles est :
        </p>
        <p style={styles.p}>
          <strong>Retbaa SAS</strong><br />
          Contact : <a href="mailto:massata@retbaa.com" style={styles.a}>massata@retbaa.com</a>
        </p>

        <hr style={styles.divider} />

        {/* 2. Données collectées */}
        <h2 style={styles.h2}>2. Données collectées</h2>
        <p style={styles.p}>
          Dans le cadre de l'accès au portail Retbaa Circle, nous collectons les données suivantes :
        </p>
        <ul style={styles.ul}>
          <li style={styles.li}>Adresse email</li>
          <li style={styles.li}>Nom et prénom</li>
          <li style={styles.li}>Institution ou société de rattachement</li>
          <li style={styles.li}>Adresse IP de connexion</li>
          <li style={styles.li}>Comportement de navigation (pages consultées, durée de session, documents ouverts)</li>
        </ul>

        <hr style={styles.divider} />

        {/* 3. Finalités */}
        <h2 style={styles.h2}>3. Finalités du traitement</h2>
        <p style={styles.p}>Vos données sont traitées aux fins suivantes :</p>
        <ul style={styles.ul}>
          <li style={styles.li}>Gestion des accès à la dataroom investisseurs et aux documents confidentiels</li>
          <li style={styles.li}>Communication avec les investisseurs et prospects qualifiés (mises à jour, rapports, invitations)</li>
          <li style={styles.li}>Amélioration du service et analyse de l'utilisation du portail</li>
          <li style={styles.li}>Respect de nos obligations légales et contractuelles (notamment le NDA)</li>
        </ul>

        <hr style={styles.divider} />

        {/* 4. Base légale */}
        <h2 style={styles.h2}>4. Base légale</h2>
        <p style={styles.p}>
          Le traitement de vos données repose sur deux bases légales au sens du RGPD (art. 6) :
        </p>
        <ul style={styles.ul}>
          <li style={styles.li}>
            <strong>Intérêt légitime</strong> (art. 6.1.f) : gestion de la relation investisseurs, sécurisation des accès à la dataroom, amélioration du service.
          </li>
          <li style={styles.li}>
            <strong>Consentement</strong> (art. 6.1.a) : recueilli lors de la signature du NDA préalable à l'accès aux informations confidentielles.
          </li>
        </ul>

        <hr style={styles.divider} />

        {/* 5. Durée de conservation */}
        <h2 style={styles.h2}>5. Durée de conservation</h2>
        <p style={styles.p}>
          Vos données personnelles sont conservées pendant <strong>3 ans à compter de la dernière interaction</strong> avec le portail Retbaa Circle ou avec nos équipes. À l'issue de cette période, vos données sont supprimées ou anonymisées, sauf obligation légale contraire.
        </p>

        <hr style={styles.divider} />

        {/* 6. Droits des personnes */}
        <h2 style={styles.h2}>6. Vos droits</h2>
        <p style={styles.p}>
          Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :
        </p>
        <ul style={styles.ul}>
          <li style={styles.li}><strong>Droit d'accès</strong> : obtenir une copie des données vous concernant</li>
          <li style={styles.li}><strong>Droit de rectification</strong> : corriger des données inexactes ou incomplètes</li>
          <li style={styles.li}><strong>Droit à l'effacement</strong> : demander la suppression de vos données (sous réserve de nos obligations légales)</li>
          <li style={styles.li}><strong>Droit à la limitation</strong> : restreindre temporairement le traitement de vos données</li>
          <li style={styles.li}><strong>Droit d'opposition</strong> : vous opposer au traitement fondé sur l'intérêt légitime</li>
          <li style={styles.li}><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré et lisible</li>
        </ul>
        <p style={styles.p}>
          Pour exercer ces droits, contactez-nous à :{' '}
          <a href="mailto:massata@retbaa.com" style={styles.a}>massata@retbaa.com</a>.
          Nous nous engageons à répondre dans un délai d'un mois. En cas de litige, vous pouvez saisir la{' '}
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={styles.a}>CNIL</a>.
        </p>

        <hr style={styles.divider} />

        {/* 7. Cookies */}
        <h2 style={styles.h2}>7. Cookies et stockage local</h2>
        <p style={styles.p}>
          Retbaa Circle n'utilise <strong>aucun cookie tiers</strong> à des fins publicitaires ou de tracking externe. Le portail utilise exclusivement le <strong>localStorage</strong> du navigateur pour maintenir votre session et vos préférences d'affichage. Ces données restent sur votre appareil et ne sont pas transmises à des tiers.
        </p>

        <hr style={styles.divider} />

        {/* 8. Hébergement */}
        <h2 style={styles.h2}>8. Hébergement et sous-traitants</h2>
        <p style={styles.p}>
          Vos données sont hébergées auprès des prestataires suivants, qui agissent en qualité de sous-traitants au sens du RGPD :
        </p>
        <ul style={styles.ul}>
          <li style={styles.li}>
            <strong>Vercel Inc.</strong> (San Francisco, USA) — hébergement de l'application web. Transfert encadré par les clauses contractuelles types de la Commission européenne.
          </li>
          <li style={styles.li}>
            <strong>Supabase Inc.</strong> — base de données hébergée dans l'<strong>Union européenne</strong> (région EU West). Conforme au RGPD.
          </li>
        </ul>

        <hr style={styles.divider} />

        {/* 9. Mise à jour */}
        <h2 style={styles.h2}>9. Modification de cette politique</h2>
        <p style={styles.p}>
          Retbaa SAS se réserve le droit de mettre à jour cette politique de confidentialité à tout moment. La date de dernière mise à jour est indiquée en haut de ce document. En cas de modification substantielle, vous en serez informé par email.
        </p>
      </div>
    </div>
  )
}
