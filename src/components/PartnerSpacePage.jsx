/**
 * PartnerSpacePage.jsx — Composant standalone
 *
 * NOTE D'INTÉGRATION (à faire lors du merge avec la branche principale) :
 * -----------------------------------------------------------------------
 * Si PartnerSpacePage.jsx existe dans la branche principale, insérer :
 *
 *   import DocExchange from './DocExchange';
 *   // … après la Timeline et avant la messagerie :
 *   <DocExchange
 *     partnerEmail={partnerEmail}
 *     institutionName={institutionName}
 *     isAdmin={isAdmin}
 *   />
 * -----------------------------------------------------------------------
 */

import DocExchange from './DocExchange';

/**
 * Standalone demo/page pour PartnerSpace.
 * Remplacer les props en dur par les vraies données (auth context, route params…).
 */
export default function PartnerSpacePage({ partnerEmail, institutionName, isAdmin = false }) {
  return (
    <div
      style={{
        background: '#FAF7F2',
        minHeight: '100vh',
        padding: '2rem',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* En-tête */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#1a2744', fontSize: '1.5rem', margin: 0 }}>
          Espace Partenaire — {institutionName || partnerEmail}
        </h1>
        <p style={{ color: '#888', fontSize: '0.88rem', margin: '0.3rem 0 0' }}>
          Gérez vos documents et échanges avec Retbaa Circle.
        </p>
      </div>

      {/* Timeline — placeholder (intégrer le vrai composant Timeline ici lors du merge) */}
      {/* <Timeline partnerEmail={partnerEmail} /> */}

      {/* ── DocExchange ── */}
      <section style={{ marginTop: '1.5rem' }}>
        <DocExchange
          partnerEmail={partnerEmail}
          institutionName={institutionName}
          isAdmin={isAdmin}
        />
      </section>

      {/* Messagerie — placeholder (intégrer le vrai composant Messagerie ici lors du merge) */}
      {/* <Messagerie partnerEmail={partnerEmail} /> */}
    </div>
  );
}
