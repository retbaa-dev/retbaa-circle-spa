// components/ProspectFAQ.jsx — FAQ accordion pour les prospects Retbaa Circle
import { useState } from 'react'

const FAQ_ITEMS = [
  {
    question: 'Combien de temps prend la validation de mon dossier ?',
    answer: 'La validation de votre dossier prend généralement 48 à 72 heures ouvrées à compter de sa soumission. L\'équipe Retbaa vous contactera directement pour toute information complémentaire.',
  },
  {
    question: 'Quels documents puis-je consulter avant validation ?',
    answer: 'Après signature du NDA, vous avez accès aux documents Tier 1 : pitch deck, études de marché et présentation de l\'opportunité. L\'accès aux documents financiers et juridiques détaillés (Tier 2+) est accordé après validation de votre dossier.',
  },
  {
    question: 'Qu\'est-ce que le NDA ?',
    answer: 'Le NDA (Non-Disclosure Agreement) est un accord de confidentialité qui engage les deux parties. Il est conservé pendant 3 ans et protège les informations stratégiques de Retbaa tout en vous garantissant un accès sécurisé aux documents sensibles. Vous avez déjà signé cet accord lors de votre inscription.',
  },
  {
    question: 'Comment investir dans Retbaa ?',
    answer: 'Deux véhicules d\'investissement sont disponibles : (1) Retbaa Holding — equity direct dans la société mère, idéal pour un investissement à long terme dans le capital, (2) SPV Les Adresses — véhicule patrimonial dédié au portefeuille immobilier premium. Les détails de chaque véhicule vous seront communiqués après validation de votre dossier.',
  },
  {
    question: 'Quel est le ticket minimum d\'investissement ?',
    answer: 'Le ticket minimum pour Retbaa Holding est de 30 000 €, soit 1 % du capital. Pour le SPV Les Adresses, les conditions sont à définir directement avec l\'équipe selon votre profil investisseur.',
  },
  {
    question: 'Comment contacter l\'équipe Retbaa ?',
    answer: 'Vous pouvez contacter l\'équipe Retbaa à l\'adresse massata@retbaa.com ou via le formulaire de qualification. Nous nous efforçons de répondre sous 48h ouvrées.',
    hasContact: true,
  },
]

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div style={{ borderBottom: '1px solid rgba(26,58,107,0.08)' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          padding: '20px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          fontSize: '16px',
          color: isOpen ? '#1A3A6B' : '#374151',
          lineHeight: 1.4,
          transition: 'color 0.2s',
        }}>
          {item.question}
        </span>
        <span style={{
          flexShrink: 0,
          width: '28px', height: '28px',
          borderRadius: '50%',
          background: isOpen ? 'rgba(26,58,107,0.08)' : 'rgba(26,58,107,0.04)',
          border: '1px solid rgba(26,58,107,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px',
          color: '#1A3A6B',
          transition: 'transform 0.25s, background 0.2s',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
        }}>
          +
        </span>
      </button>

      <div style={{
        overflow: 'hidden',
        maxHeight: isOpen ? '400px' : '0',
        transition: 'max-height 0.3s ease-in-out, opacity 0.25s ease',
        opacity: isOpen ? 1 : 0,
      }}>
        <div style={{
          paddingBottom: '20px',
          fontFamily: 'Manrope, sans-serif',
          fontSize: '14px',
          color: '#6B7280',
          lineHeight: 1.7,
        }}>
          {item.answer}
          {item.hasContact && (
            <div style={{ marginTop: '10px' }}>
              <a
                href="mailto:massata@retbaa.com"
                style={{
                  color: '#1A3A6B',
                  fontWeight: 600,
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(26,58,107,0.3)',
                }}
              >
                massata@retbaa.com
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProspectFAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div style={{
      marginTop: '60px',
      paddingTop: '40px',
      borderTop: '1px solid rgba(26,58,107,0.1)',
    }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          fontSize: '9px', letterSpacing: '0.4em', textTransform: 'uppercase',
          color: '#C4A96A', fontWeight: 700, marginBottom: '10px',
        }}>
          QUESTIONS FRÉQUENTES
        </div>
        <h2 style={{
          fontFamily: 'Georgia, serif', fontWeight: 300, fontStyle: 'italic',
          fontSize: '28px', color: '#1A3A6B', margin: 0, lineHeight: 1.3,
        }}>
          FAQ Prospect
        </h2>
        <p style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: '13px', color: '#9CA3AF',
          margin: '8px 0 0', lineHeight: 1.5,
        }}>
          Tout ce que vous devez savoir sur votre parcours d'investisseur Retbaa.
        </p>
      </div>

      <div style={{
        background: '#fff',
        border: '1px solid rgba(26,58,107,0.08)',
        borderRadius: '12px',
        padding: '0 28px',
        boxShadow: '0 2px 12px rgba(0,27,63,0.04)',
      }}>
        {FAQ_ITEMS.map((item, index) => (
          <FAQItem
            key={index}
            item={item}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(prev => prev === index ? null : index)}
          />
        ))}
      </div>

      <div style={{
        marginTop: '20px',
        padding: '16px 20px',
        background: 'rgba(196,169,106,0.08)',
        border: '1px solid rgba(196,169,106,0.2)',
        borderRadius: '8px',
        fontSize: '13px', color: '#704C5D',
        lineHeight: 1.6,
      }}>
        Une question non listée ?{' '}
        <a
          href="mailto:massata@retbaa.com"
          style={{ color: '#1A3A6B', fontWeight: 600, textDecoration: 'none' }}
        >
          Contactez l'équipe
        </a>
        {' '}— réponse sous 48h ouvrées.
      </div>
    </div>
  )
}
