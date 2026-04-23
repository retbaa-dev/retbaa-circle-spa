// pages/ArticlePage.jsx — Retbaa Circle — Page de lecture d'article
import { useState, useEffect } from 'react'

// ─── RENDERER DE SECTIONS ─────────────────────────────────────
function renderSection(section, index) {
  switch (section.type) {
    case 'summary':
      return (
        <div key={index} style={{
          background: 'rgba(239,192,212,0.08)',
          borderLeft: '3px solid #EFC0D4',
          borderRadius: '0 4px 4px 0',
          padding: '24px 28px',
          marginBottom: '32px',
        }}>
          <p style={{
            fontFamily: 'Newsreader, serif', fontStyle: 'italic',
            fontSize: '17px', color: '#43474F', lineHeight: 1.8,
            margin: 0,
          }}>
            {section.content}
          </p>
        </div>
      )

    case 'heading2':
      return (
        <h2 key={index} style={{
          fontFamily: 'Newsreader, serif', fontSize: '28px', fontWeight: 300,
          fontStyle: 'italic', color: '#1A3A6B',
          borderLeft: '3px solid #EFC0D4', paddingLeft: '16px',
          margin: '48px 0 20px', lineHeight: 1.3,
        }}>
          {section.content}
        </h2>
      )

    case 'heading3':
      return (
        <h3 key={index} style={{
          fontFamily: 'Manrope, sans-serif', fontSize: '11px',
          textTransform: 'uppercase', letterSpacing: '0.2em',
          color: '#795465', fontWeight: 700,
          margin: '32px 0 12px',
        }}>
          {section.content}
        </h3>
      )

    case 'paragraph':
      return (
        <p key={index} style={{
          fontFamily: 'Manrope, sans-serif', fontSize: '15px',
          color: '#43474F', lineHeight: 1.8,
          margin: '0 0 20px',
        }}>
          {section.content}
        </p>
      )

    case 'quote':
      return (
        <blockquote key={index} style={{
          fontFamily: 'Newsreader, serif', fontStyle: 'italic',
          fontSize: '18px', color: '#1A3A6B',
          background: 'rgba(239,192,212,0.08)',
          borderLeft: '3px solid #EFC0D4',
          borderRadius: '0 4px 4px 0',
          padding: '20px 24px',
          margin: '32px 0',
          lineHeight: 1.7,
        }}>
          {section.content}
        </blockquote>
      )

    case 'list':
      return (
        <ul key={index} style={{
          fontFamily: 'Manrope, sans-serif', fontSize: '15px',
          color: '#43474F', lineHeight: 1.8,
          margin: '0 0 24px', paddingLeft: '0',
          listStyle: 'none',
        }}>
          {(Array.isArray(section.content) ? section.content : [section.content]).map((item, i) => (
            <li key={i} style={{
              display: 'flex', gap: '12px', alignItems: 'flex-start',
              marginBottom: '8px',
            }}>
              <span style={{
                color: '#EFC0D4', fontWeight: 800, flexShrink: 0,
                marginTop: '2px', fontSize: '16px', lineHeight: 1.6,
              }}>—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )

    case 'table':
      return (
        <div key={index} style={{
          overflowX: 'auto', marginBottom: '32px',
          borderRadius: '4px', border: '1px solid rgba(239,192,212,0.2)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            {section.headers && (
              <thead>
                <tr style={{ background: 'rgba(239,192,212,0.1)' }}>
                  {section.headers.map((h, i) => (
                    <th key={i} style={{
                      fontFamily: 'Manrope, sans-serif', fontSize: '11px',
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                      color: '#1A3A6B', fontWeight: 700,
                      padding: '12px 16px', textAlign: 'left',
                      borderBottom: '1px solid rgba(239,192,212,0.25)',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {(section.rows || []).map((row, i) => (
                <tr key={i}
                  style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(249,249,249,0.5)' }}
                >
                  {row.map((cell, j) => (
                    <td key={j} style={{
                      fontFamily: 'Manrope, sans-serif', fontSize: '13px',
                      color: '#43474F', padding: '12px 16px',
                      borderBottom: '1px solid rgba(239,192,212,0.08)',
                    }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'sources':
      return (
        <div key={index} style={{
          marginTop: '48px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(239,192,212,0.25)',
        }}>
          <p style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '10px',
            textTransform: 'uppercase', letterSpacing: '0.2em',
            color: '#9CA3AF', fontWeight: 700, marginBottom: '10px',
          }}>
            Sources
          </p>
          <p style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '12px',
            color: '#9CA3AF', lineHeight: 1.7, margin: 0,
            fontStyle: 'italic',
          }}>
            {section.content}
          </p>
        </div>
      )

    case 'conclusion':
      return (
        <div key={index} style={{
          background: 'linear-gradient(135deg, rgba(26,58,107,0.04) 0%, rgba(239,192,212,0.06) 100%)',
          borderRadius: '4px',
          border: '1px solid rgba(239,192,212,0.2)',
          padding: '28px 32px',
          margin: '40px 0 32px',
        }}>
          <p style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '10px',
            textTransform: 'uppercase', letterSpacing: '0.2em',
            color: '#795465', fontWeight: 700, marginBottom: '12px',
          }}>
            Conclusion
          </p>
          <p style={{
            fontFamily: 'Newsreader, serif', fontStyle: 'italic',
            fontSize: '17px', color: '#1A3A6B', lineHeight: 1.75,
            margin: 0,
          }}>
            {section.content}
          </p>
        </div>
      )

    default:
      return null
  }
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────
export default function ArticlePage({ article, onBack }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [article?.id])

  if (!article) return null

  return (
    <div style={{ background: '#F9F9F9', minHeight: '100vh' }}>

      {/* ─── BOUTON RETOUR (toujours visible) ─────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(249,249,249,0.95)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 1px 12px rgba(0,27,63,0.06)',
        transition: 'all 0.3s ease',
      }} className="article-back-bar">
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontFamily: 'Manrope, sans-serif', fontSize: '10px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            fontWeight: 700, color: '#1A3A6B',
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 0,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
          Retbaa Insights
        </button>
      </div>

      {/* ─── HERO PLEINE LARGEUR ────────────────────────────── */}
      <div style={{
        position: 'relative',
        height: '420px',
        overflow: 'hidden',
        marginTop: scrolled ? '0' : '0',
      }}>
        <img
          src={article.img}
          alt={article.title}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(26,58,107,0.3) 0%, rgba(26,58,107,0.75) 100%)',
        }} />

        {/* Bouton retour sur le hero */}
        <button
          onClick={onBack}
          style={{
            position: 'absolute', top: '28px', left: '48px',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontFamily: 'Manrope, sans-serif', fontSize: '10px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            fontWeight: 700, color: 'rgba(239,192,212,0.9)',
            background: 'rgba(26,58,107,0.4)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(239,192,212,0.25)',
            padding: '10px 18px', borderRadius: '2px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239,192,212,0.15)'
            e.currentTarget.style.color = '#ffffff'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(26,58,107,0.4)'
            e.currentTarget.style.color = 'rgba(239,192,212,0.9)'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>arrow_back</span>
          Retbaa Insights
        </button>

        {/* Tag flottant */}
        <div style={{
          position: 'absolute', bottom: '40px', left: '48px',
        }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(26,58,107,0.7)',
            backdropFilter: 'blur(6px)',
            padding: '6px 14px',
            borderRadius: '2px',
            marginBottom: '16px',
          }}>
            <span style={{
              fontFamily: 'Manrope, sans-serif', fontSize: '10px',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#EFC0D4', fontWeight: 800,
            }}>
              {article.tag}
            </span>
          </div>

          {/* Titre hero */}
          <h1 style={{
            fontFamily: 'Newsreader, serif', fontSize: '52px',
            fontWeight: 300, fontStyle: 'italic',
            color: '#ffffff', margin: 0, lineHeight: 1.15,
            maxWidth: '800px',
            textShadow: '0 2px 12px rgba(0,0,0,0.25)',
          }}>
            {article.title}
          </h1>
        </div>
      </div>

      {/* ─── BANDEAU META ────────────────────────────────────── */}
      <div style={{
        background: '#ffffff',
        borderBottom: '4px solid #EFC0D4',
        boxShadow: '0 4px 20px rgba(0,27,63,0.05)',
      }}>
        <div style={{
          maxWidth: '860px', margin: '0 auto',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px', flexWrap: 'wrap',
        }} className="article-cta-section">
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            flexWrap: 'wrap',
          }}>
            <span style={{
              fontFamily: 'Manrope, sans-serif', fontSize: '12px',
              color: '#43474F', fontStyle: 'italic',
            }}>
              {article.author}
            </span>
            <span style={{ color: '#EFC0D4', fontWeight: 300 }}>·</span>
            <span style={{
              fontFamily: 'Manrope, sans-serif', fontSize: '12px',
              color: '#9CA3AF',
            }}>
              {article.date}
            </span>
            <span style={{ color: '#EFC0D4', fontWeight: 300 }}>·</span>
            <span style={{
              fontFamily: 'Manrope, sans-serif', fontSize: '10px',
              textTransform: 'uppercase', letterSpacing: '0.15em',
              color: '#795465', fontWeight: 700,
            }}>
              {article.tag}
            </span>
          </div>

          {article.pdf && (
            <a
              href={article.pdf}
              target="_blank"
              download
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                fontWeight: 700, color: '#1A3A6B',
                background: 'rgba(26,58,107,0.05)',
                border: '1px solid rgba(26,58,107,0.15)',
                padding: '10px 18px', borderRadius: '2px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#1A3A6B'
                e.currentTarget.style.color = '#ffffff'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(26,58,107,0.05)'
                e.currentTarget.style.color = '#1A3A6B'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>download</span>
              Télécharger le PDF
            </a>
          )}
        </div>
      </div>

      {/* ─── CORPS DE L'ARTICLE ──────────────────────────────── */}
      <div style={{
        maxWidth: '860px', margin: '0 auto',
      }} className="article-content">
        {/* Sous-titre */}
        {article.subtitle && (
          <p style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '12px',
            textTransform: 'uppercase', letterSpacing: '0.18em',
            color: '#795465', fontWeight: 700,
            marginBottom: '40px',
          }}>
            {article.subtitle}
          </p>
        )}

        {/* Sections de contenu */}
        {(article.sections || []).map((section, i) => renderSection(section, i))}

        {/* ─── PIED D'ARTICLE ──────────────────────────────── */}
        <div style={{
          marginTop: '64px',
          paddingTop: '32px',
          borderTop: '1px solid rgba(239,192,212,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <button
            onClick={onBack}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontFamily: 'Manrope, sans-serif', fontSize: '10px',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              fontWeight: 700, color: '#1A3A6B',
              background: 'none',
              border: '1px solid rgba(26,58,107,0.2)',
              padding: '12px 22px', borderRadius: '2px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#1A3A6B'
              e.currentTarget.style.color = '#ffffff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'none'
              e.currentTarget.style.color = '#1A3A6B'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>arrow_back</span>
            Retour aux Insights
          </button>

          {article.pdf && (
            <a
              href={article.pdf}
              target="_blank"
              download
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                fontWeight: 700, color: '#795465',
                background: 'none',
                border: '1px solid rgba(121,84,101,0.25)',
                padding: '12px 22px', borderRadius: '2px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#795465'
                e.currentTarget.style.color = '#ffffff'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'none'
                e.currentTarget.style.color = '#795465'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>download</span>
              Télécharger le PDF
            </a>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .article-back-bar { padding: 12px 20px !important; }
        }
      `}</style>
    </div>
  )
}
