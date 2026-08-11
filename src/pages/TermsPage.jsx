// src/pages/TermsPage.jsx
// Conditions d'utilisation — Retbaa Circle

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
  warning: {
    backgroundColor: 'rgba(26,58,107,0.05)',
    border: '1px solid rgba(26,58,107,0.15)',
    borderRadius: '6px',
    padding: '16px 20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '13px',
    lineHeight: '1.7',
    color: '#374151',
    marginBottom: '16px',
  },
}

export default function TermsPage() {
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
        <h1 style={styles.h1}>Conditions d'utilisation</h1>
        <div style={styles.date}>En vigueur depuis le 11 août 2026</div>

        {/* 1. Objet */}
        <h2 style={styles.h2}>1. Objet</h2>
        <p style={styles.p}>
          Les présentes conditions d'utilisation (ci-après « CGU ») régissent l'accès et l'utilisation du portail <strong>Retbaa Circle</strong>, accessible à l'adresse <a href="https://circle.retbaa.com" style={styles.a}>circle.retbaa.com</a>, édité par <strong>Retbaa SAS</strong>.
        </p>
        <p style={styles.p}>
          Ce portail est un espace confidentiel dédié à la communication avec les investisseurs et prospects qualifiés de Retbaa SAS. Il donne accès à des informations financières, stratégiques et opérationnelles sensibles.
        </p>

        <hr style={styles.divider} />

        {/* 2. Accès réservé */}
        <h2 style={styles.h2}>2. Accès réservé</h2>
        <p style={styles.p}>
          L'accès au portail Retbaa Circle est strictement réservé aux personnes suivantes :
        </p>
        <ul style={styles.ul}>
          <li style={styles.li}>Investisseurs qualifiés au sens de l'article L. 411-2 du Code monétaire et financier</li>
          <li style={styles.li}>Prospects investisseurs préalablement identifiés et invités par Retbaa SAS</li>
          <li style={styles.li}>Collaborateurs et partenaires autorisés par Retbaa SAS</li>
        </ul>
        <p style={styles.p}>
          Toute tentative d'accès non autorisé est interdite et peut faire l'objet de poursuites judiciaires. En utilisant ce portail, vous confirmez être l'une des personnes mentionnées ci-dessus et avoir reçu une invitation valide de Retbaa SAS.
        </p>

        <hr style={styles.divider} />

        {/* 3. Confidentialité */}
        <h2 style={styles.h2}>3. Confidentialité et accord de non-divulgation</h2>
        <div style={styles.warning}>
          ⚠️ <strong>Important :</strong> L'accès aux informations contenues dans ce portail est conditionné à la signature et au respect d'un accord de non-divulgation (NDA) avec Retbaa SAS.
        </div>
        <p style={styles.p}>
          En accédant à Retbaa Circle, vous vous engagez à :
        </p>
        <ul style={styles.ul}>
          <li style={styles.li}>Ne divulguer aucune information confidentielle à des tiers sans autorisation écrite préalable de Retbaa SAS</li>
          <li style={styles.li}>Utiliser les informations accessibles sur ce portail exclusivement dans le cadre de l'évaluation d'un investissement dans Retbaa SAS</li>
          <li style={styles.li}>Prendre toutes les mesures nécessaires pour protéger la confidentialité des informations auxquelles vous avez accès</li>
          <li style={styles.li}>Informer immédiatement Retbaa SAS de toute divulgation accidentelle ou non autorisée</li>
        </ul>
        <p style={styles.p}>
          Ces obligations de confidentialité demeurent en vigueur pendant toute la durée d'accès au portail et pour une durée de <strong>5 ans</strong> après la résiliation de l'accès.
        </p>

        <hr style={styles.divider} />

        {/* 4. Propriété intellectuelle */}
        <h2 style={styles.h2}>4. Propriété intellectuelle</h2>
        <p style={styles.p}>
          L'ensemble des contenus accessibles sur le portail Retbaa Circle — documents, analyses, présentations, données financières, visuels, marques et logos — sont la propriété exclusive de <strong>Retbaa SAS</strong> et sont protégés par le droit de la propriété intellectuelle.
        </p>
        <p style={styles.p}>
          © Retbaa SAS 2026. Tous droits réservés.
        </p>
        <p style={styles.p}>
          Toute reproduction, représentation, modification, publication, transmission ou exploitation de tout ou partie de ces contenus, par quelque procédé que ce soit, sans autorisation préalable écrite de Retbaa SAS, est strictement interdite.
        </p>

        <hr style={styles.divider} />

        {/* 5. Limitation de responsabilité */}
        <h2 style={styles.h2}>5. Limitation de responsabilité</h2>
        <div style={styles.warning}>
          Les informations présentées sur Retbaa Circle ont un caractère <strong>indicatif et non contractuel</strong>. Elles ne constituent pas un conseil en investissement, une recommandation d'achat ou de vente de titres, ni une offre de souscription.
        </div>
        <p style={styles.p}>
          Retbaa SAS s'efforce de maintenir l'exactitude et l'actualité des informations publiées, mais ne saurait garantir leur exhaustivité ou leur pertinence pour une situation particulière. Les projections financières et prévisionnelles présentées sont fondées sur des hypothèses raisonnables mais sujettes à incertitude.
        </p>
        <p style={styles.p}>
          Retbaa SAS ne pourra être tenue responsable des pertes ou dommages de quelque nature que ce soit résultant de l'utilisation des informations contenues dans ce portail ou de décisions d'investissement prises sur la base de celles-ci.
        </p>
        <p style={styles.p}>
          Tout investissement comporte des risques. Les performances passées ne préjugent pas des performances futures.
        </p>

        <hr style={styles.divider} />

        {/* 6. Droit applicable */}
        <h2 style={styles.h2}>6. Droit applicable et juridiction</h2>
        <p style={styles.p}>
          Les présentes CGU sont régies par le <strong>droit français</strong>. En cas de litige relatif à leur interprétation ou à leur exécution, et à défaut de résolution amiable, les parties conviennent de soumettre le différend aux <strong>tribunaux compétents de Paris</strong>.
        </p>

        <hr style={styles.divider} />

        {/* 7. Contact */}
        <h2 style={styles.h2}>7. Contact</h2>
        <p style={styles.p}>
          Pour toute question relative aux présentes CGU, pour signaler une utilisation non conforme du portail, ou pour toute demande relative à vos données personnelles :
        </p>
        <p style={styles.p}>
          <strong>Retbaa SAS</strong><br />
          Email : <a href="mailto:massata@retbaa.com" style={styles.a}>massata@retbaa.com</a>
        </p>
      </div>
    </div>
  )
}
