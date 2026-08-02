// components/DataroomFAQ.jsx — Section FAQ accordéon pour la dataroom
import { useState } from 'react'

const FAQ_ITEMS = [
  {
    question: 'Quels sont les véhicules d\'investissement disponibles ?',
    answer: 'Trois véhicules sont disponibles : (1) Retbaa Holding — equity direct dans la société mère, (2) SPV Les Adresses — véhicule patrimonial dédié au portefeuille immobilier premium, (3) Retbaa Manufacture — filière industrielle (cuir, textile, mobilier). Chaque véhicule correspond à une stratégie et un horizon distincts.',
  },
  {
    question: 'Quel est le ticket minimum ?',
    answer: 'Le ticket minimum est de 25 000 € pour les SPV. Pour Retbaa Holding, le ticket minimum est de 30 000 €, ce qui correspond à 1 % du capital. Des conditions particulières peuvent s\'appliquer selon le véhicule et votre profil investisseur.',
  },
  {
    question: 'Quelle est la durée d\'investissement ?',
    answer: 'La durée varie selon le véhicule : SPV Les Adresses : horizon 5 ans avec sortie structurée, Retbaa Holding : investissement long terme (capital-développement), Retbaa Manufacture : horizon 7 à 10 ans compte tenu du cycle industriel et de la montée en puissance des actifs.',
  },
  {
    question: 'Comment se passe la sortie ?',
    answer: 'Pour le SPV Les Adresses : rachat des parts à un multiple cible de ×1.4 à l\'an 5, ou cession à un tiers acquéreur. Pour Retbaa Holding : cession de parts entre actionnaires ou à un acquéreur stratégique. Les modalités exactes sont détaillées dans la documentation juridique de chaque véhicule.',
  },
  {
    question: 'Les documents sont-ils confidentiels ?',
    answer: 'Oui, l\'ensemble des documents de la dataroom est strictement confidentiel. Ils sont couverts par l\'accord de confidentialité (NDA) que vous avez signé lors de votre inscription. Toute divulgation à des tiers non autorisés est interdite et engage votre responsabilité.',
  },
  {
    question: 'Comment contacter l\'équipe Retbaa ?',
    answer: 'Pour toute question relative à votre dossier, aux documents ou aux opportunités d\'investissement, contactez l\'équipe à l\'adresse : circle@retbaa.com. Nous nous efforçons de répondre sous 48h ouvrées.',
  },
]

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div style={{
      borderBottom: '1px solid rgba(26,58,107,0.08)',
    }}>
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

      {/* Réponse avec transition */}
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
          {item.question.includes('contacter') && (
            <div style={{ marginTop: '8px' }}>
              <a
                href="mailto:circle@retbaa.com"
                style={{
                  color: '#1A3A6B',
                  fontWeight: 600,
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(26,58,107,0.3)',
                }}
              >
                circle@retbaa.com
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DataroomFAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const handleToggle = (index) => {
    setOpenIndex(prev => prev === index ? null : index)
  }

  return (
    <div style={{
      marginTop: '60px',
      paddingTop: '40px',
      borderTop: '1px solid rgba(26,58,107,0.1)',
    }}>
      {/* En-tête section */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          fontSize: '9px', letterSpacing: '0.4em', textTransform: 'uppercase',
          color: '#EFC0D4', fontWeight: 700, marginBottom: '10px',
        }}>
          QUESTIONS FRÉQUENTES
        </div>
        <h2 style={{
          fontFamily: 'Georgia, serif', fontWeight: 300, fontStyle: 'italic',
          fontSize: '28px', color: '#1A3A6B', margin: 0, lineHeight: 1.3,
        }}>
          FAQ Dataroom
        </h2>
        <p style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: '13px', color: '#9CA3AF',
          margin: '8px 0 0', lineHeight: 1.5,
        }}>
          Tout ce que vous devez savoir sur les opportunités d'investissement Retbaa.
        </p>
      </div>

      {/* Accordéon */}
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
            onToggle={() => handleToggle(index)}
          />
        ))}
      </div>

      {/* Footer FAQ */}
      <div style={{
        marginTop: '20px',
        padding: '16px 20px',
        background: 'rgba(239,192,212,0.1)',
        borderRadius: '8px',
        fontSize: '13px', color: '#704C5D',
        lineHeight: 1.6,
      }}>
        Vous ne trouvez pas la réponse à votre question ?{' '}
        <a
          href="mailto:circle@retbaa.com"
          style={{ color: '#1A3A6B', fontWeight: 600, textDecoration: 'none' }}
        >
          Contactez l'équipe
        </a>
        {' '}— nous répondons sous 48h ouvrées.
      </div>
    </div>
  )
}
