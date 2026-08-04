// pages/HomePage.jsx — Retbaa Circle
// Page d'accueil publique — manifesto + deux chemins (prospect / investisseur)
// Réutilise StepPresentation depuis DataroomLanding sans le stepper

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Manifesto data ──────────────────────────────────────────────────────────
const MANIFESTO = [
  {
    num: 'I',
    title: "Nous ne vendons pas des produits.",
    subtitle: "Nous transformons un héritage en patrimoine.",
    body: `Nous venons de territoires où chaque matière porte une mémoire, où chaque geste transmis raconte une manière d'habiter le monde. L'Afrique possède la matière, le geste, les récits et la mémoire sensorielle. Mais elle a trop rarement disposé des maisons, des institutions et de la continuité nécessaires pour les inscrire dans un patrimoine désirable à l'échelle mondiale. Retbaa existe pour contribuer à combler cet écart — non en reproduisant les codes du luxe européen, mais en construisant, depuis une autre origine, une maison capable de créer ses propres codes et de les faire traverser les frontières comme les générations.`,
  },
  {
    num: 'II',
    title: "Le Luxe Culturel n'est pas un segment.",
    subtitle: "C'est une grammaire.",
    body: `Nous ne faisons pas du luxe inspiré par l'Afrique. Nous construisons une maison dont l'Afrique est la source de vérité, et dont Paris est l'atelier de précision. Notre langage se déploie à travers trois univers — Atmosphère, Gourmet et Beauté — unis par une même exigence. Chaque création révèle une matière, un geste, un territoire ou une mémoire. Aucune ne folklorise. Aucune ne fige. Toutes transforment.`,
  },
  {
    num: 'III',
    title: "La rareté ne se décrète pas.",
    subtitle: "Elle se prouve.",
    body: `Le luxe ne réside pas dans l'ostentation. Il naît de la profondeur : celle d'une origine, d'un savoir-faire, d'une histoire et du temps consacré à leur donner forme. Une matière première rare. Un savoir-faire humain rare. Un temps de fabrication rare. Une transmission rare. C'est cette quadruple exigence qui distingue un objet précieux d'un objet simplement cher.`,
  },
  {
    num: 'IV',
    title: "Nous ne proposons pas des objets silencieux.",
    subtitle: "Nos objets ne représentent pas une culture. Ils permettent de la vivre.",
    body: `Nous croyons qu'un objet peut être beau et avoir quelque chose à dire. Qu'un parfum peut réveiller une mémoire. Qu'une saveur peut révéler un territoire. Qu'un geste de beauté peut devenir un rituel. Qu'un espace peut être un lieu de rencontre et de transmission.`,
  },
  {
    num: 'V',
    title: "Nous n'entrons pas sur un marché.",
    subtitle: "Nous y déposons une méthode.",
    body: `Dakar, Abidjan, Kigali, Casablanca, Paris, Dubaï ou Tokyo : chaque territoire possède sa propre lecture du beau, du précieux et du désirable. Nous refusons l'expansion par duplication. Le Retbaa Compass est notre discipline d'entrée : comprendre avant de proposer, dialoguer avant de traduire, s'ancrer avant de s'étendre.`,
  },
  {
    num: 'VI',
    title: "La transmission est notre destination.",
    subtitle: "Nous créons ce qui mérite de rester.",
    body: `Une création Retbaa n'est pas achevée lorsqu'elle est fabriquée. Elle ne l'est pas davantage lorsqu'elle est achetée. Elle le devient lorsqu'elle est vécue, racontée et transmise — à un proche, à un cercle, à une génération, à une mémoire.`,
  },
  {
    num: 'VII',
    title: "Notre ambition n'est pas régionale.",
    subtitle: "Elle est fondatrice.",
    body: `Retbaa n'est pas une maison africaine qui cherche à devenir internationale. Retbaa est une maison de luxe internationale dont l'Afrique constitue l'origine de vérité — comme la Provence pour un parfumeur, Kyoto pour un maître artisan ou Murano pour un verrier. Née au bord du Lac Rose, façonnée entre Dakar et Paris.`,
  },
]

const REFUS = [
  "Nous refusons la rareté simulée.",
  "Nous refusons l'Afrique comme décor.",
  "Nous refusons la croissance sans enracinement.",
  "Nous refusons les compromis d'identité.",
  "Nous refusons la création sans transmission.",
  "Nous refusons l'international sans ancrage.",
]

// ── Composant principal ─────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate()
  const [hoveredCta, setHoveredCta] = useState(null)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D1F3C', fontFamily: 'Manrope, sans-serif', overflowX: 'hidden' }}>

      {/* Header minimal */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px',
        background: 'linear-gradient(to bottom, rgba(13,31,60,0.95) 0%, rgba(13,31,60,0) 100%)',
      }}>
        <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: '20px', color: '#EFC0D4', letterSpacing: '0.02em' }}>
          Retbaa Circle
        </div>
        <button
          onClick={() => navigate('/login')}
          onMouseEnter={() => setHoveredCta('login')}
          onMouseLeave={() => setHoveredCta(null)}
          style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: hoveredCta === 'login' ? '#0D1F3C' : '#EFC0D4',
            background: hoveredCta === 'login' ? '#EFC0D4' : 'transparent',
            border: '1px solid rgba(239,192,212,0.4)',
            padding: '10px 20px', borderRadius: '2px', cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Connexion
        </button>
      </header>

      {/* Hero */}
      <div style={{ padding: '140px 48px 80px', maxWidth: '780px', margin: '0 auto' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#EFC0D4', opacity: 0.7, marginBottom: '24px' }}>
          Retbaa Circle — Espace réservé
        </div>
        <h1 style={{
          fontFamily: 'Newsreader, serif', fontStyle: 'italic',
          fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 300,
          color: '#F5EFE6', lineHeight: 1.15, margin: '0 0 32px',
        }}>
          Une maison de luxe<br />née au bord du Lac Rose.
        </h1>
        <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(245,239,230,0.65)', maxWidth: '560px', margin: 0 }}>
          Retbaa construit depuis Dakar et Paris une nouvelle grammaire du luxe culturel — 
          ancrée dans les héritages africains, exigeante dans ses standards, fondatrice dans son ambition.
        </p>
      </div>

      {/* Manifesto */}
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 48px 80px' }}>
        {MANIFESTO.map((article, i) => (
          <div
            key={article.num}
            style={{
              borderTop: '1px solid rgba(239,192,212,0.12)',
              padding: '48px 0',
              display: 'grid',
              gridTemplateColumns: '48px 1fr',
              gap: '32px',
              opacity: 0.92,
            }}
          >
            {/* Numéro romain */}
            <div style={{
              fontFamily: 'Newsreader, serif', fontStyle: 'italic',
              fontSize: '13px', color: '#EFC0D4', opacity: 0.5,
              paddingTop: '4px',
            }}>
              {article.num}
            </div>

            {/* Contenu */}
            <div>
              <div style={{
                fontFamily: 'Newsreader, serif', fontStyle: 'italic',
                fontSize: '22px', fontWeight: 400, color: '#F5EFE6',
                marginBottom: '6px', lineHeight: 1.3,
              }}>
                {article.title}
              </div>
              <div style={{
                fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em',
                textTransform: 'uppercase', color: '#EFC0D4', opacity: 0.6,
                marginBottom: '20px',
              }}>
                {article.subtitle}
              </div>
              <p style={{ fontSize: '14px', lineHeight: 1.85, color: 'rgba(245,239,230,0.6)', margin: 0 }}>
                {article.body}
              </p>
            </div>
          </div>
        ))}

        {/* Ce que nous refusons */}
        <div style={{
          borderTop: '1px solid rgba(239,192,212,0.2)',
          padding: '56px 0',
          display: 'grid', gridTemplateColumns: '48px 1fr', gap: '32px',
        }}>
          <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: '13px', color: '#EFC0D4', opacity: 0.5, paddingTop: '4px' }}>
            ✕
          </div>
          <div>
            <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: '22px', color: '#F5EFE6', marginBottom: '28px' }}>
              Ce que nous refusons.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {REFUS.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#EFC0D4', opacity: 0.4, flexShrink: 0, marginTop: '8px' }} />
                  <span style={{ fontSize: '14px', color: 'rgba(245,239,230,0.55)', fontStyle: 'italic' }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA finale — deux chemins */}
      <div style={{
        borderTop: '1px solid rgba(239,192,212,0.15)',
        padding: '80px 48px 100px',
        maxWidth: '780px', margin: '0 auto',
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '48px',
      }}>
        <div>
          <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: '28px', color: '#F5EFE6', marginBottom: '12px' }}>
            Vous êtes ici pour une raison.
          </div>
          <p style={{ fontSize: '14px', color: 'rgba(245,239,230,0.55)', lineHeight: 1.8, margin: 0, maxWidth: '480px' }}>
            Retbaa Circle est un espace confidentiel. Choisissez votre chemin.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {/* CTA Prospect */}
          <button
            onClick={() => navigate('/dataroom')}
            onMouseEnter={() => setHoveredCta('prospect')}
            onMouseLeave={() => setHoveredCta(null)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: hoveredCta === 'prospect' ? '#0D1F3C' : '#0D1F3C',
              background: hoveredCta === 'prospect' ? '#d4a9bc' : '#EFC0D4',
              border: 'none', padding: '16px 32px', borderRadius: '2px',
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
          >
            Je découvre Retbaa
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
          </button>

          {/* CTA Investisseur */}
          <button
            onClick={() => navigate('/login')}
            onMouseEnter={() => setHoveredCta('inv')}
            onMouseLeave={() => setHoveredCta(null)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: hoveredCta === 'inv' ? '#F5EFE6' : 'rgba(245,239,230,0.6)',
              background: 'transparent',
              border: `1px solid ${hoveredCta === 'inv' ? 'rgba(245,239,230,0.5)' : 'rgba(245,239,230,0.2)'}`,
              padding: '16px 32px', borderRadius: '2px',
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
          >
            J'ai déjà un accès
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>lock_open</span>
          </button>
        </div>

        {/* Lien Insights */}
        <button
          onClick={() => navigate('/insights')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 600,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: 'rgba(239,192,212,0.45)',
            textDecoration: 'underline', textDecorationColor: 'rgba(239,192,212,0.2)',
          }}
        >
          Lire nos Insights →
        </button>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid rgba(239,192,212,0.08)',
        padding: '24px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        maxWidth: '780px', margin: '0 auto',
      }}>
        <span style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: '13px', color: 'rgba(239,192,212,0.3)' }}>
          Retbaa SAS — Confidentiel
        </span>
        <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(239,192,212,0.2)' }}>
          {new Date().getFullYear()}
        </span>
      </div>

    </div>
  )
}
