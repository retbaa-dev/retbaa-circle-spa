// components/Sidebar.jsx — Stitch Design System
import { useState } from 'react'

const CONTACT_SUBJECTS = [
  { value: 'general', label: 'Question générale' },
  { value: 'documents', label: 'Documents & signature' },
  { value: 'tranche2', label: 'Tranche 2 — Investissement' },
  { value: 'gouvernance', label: 'Gouvernance' },
  { value: 'autre', label: 'Autre' },
]

function ContactModal({ userName, onClose }) {
  const [subject, setSubject] = useState('general')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    const subjectLabel = CONTACT_SUBJECTS.find(s => s.value === subject)?.label || subject
    const mailto = `mailto:massata@retbaa.com?subject=${encodeURIComponent(`[Retbaa Circle] ${subjectLabel} — ${userName}`)}&body=${encodeURIComponent(`Bonjour Massata,\n\n${message}\n\nCordialement,\n${userName}`)}`
    window.open(mailto, '_blank')
    setSent(true)
    setTimeout(() => { setSent(false); onClose() }, 1500)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,27,63,0.35)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: '#fff',
        borderRadius: '4px',
        width: '100%', maxWidth: '480px',
        boxShadow: '0px 32px 80px rgba(0,27,63,0.18)',
        overflow: 'hidden',
      }}>
        {/* Header modale */}
        <div style={{
          background: '#1A3A6B', padding: '28px 32px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: '22px', color: '#fff', marginBottom: '4px' }}>
              Contacter l'équipe
            </div>
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', color: 'rgba(239,192,212,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Retbaa Circle · Réponse sous 24h
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: '4px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
          </button>
        </div>

        {/* Corps */}
        <div style={{ padding: '28px 32px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#EFC0D4', display: 'block', marginBottom: '12px' }}>check_circle</span>
              <div style={{ fontFamily: 'Newsreader, serif', fontSize: '18px', color: '#1A3A6B', fontStyle: 'italic' }}>Message envoyé</div>
            </div>
          ) : (
            <>
              {/* Objet */}
              <div>
                <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1A3A6B', marginBottom: '8px' }}>
                  Objet
                </label>
                <select value={subject} onChange={e => setSubject(e.target.value)} style={{
                  width: '100%', padding: '10px 12px',
                  fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#1A3A6B',
                  background: '#F9F9F9', border: 'none', borderBottom: '2px solid #EFC0D4',
                  borderRadius: 0, outline: 'none', cursor: 'pointer', appearance: 'none',
                }}>
                  {CONTACT_SUBJECTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>

              {/* Message */}
              <div>
                <label style={{ display: 'block', fontFamily: 'Manrope, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1A3A6B', marginBottom: '8px' }}>
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Votre message..."
                  style={{
                    width: '100%', padding: '12px',
                    fontFamily: 'Manrope, sans-serif', fontSize: '13px', color: '#43474F',
                    background: '#F9F9F9', border: 'none', borderBottom: '2px solid #EFC0D4',
                    borderRadius: 0, outline: 'none', resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* CTA */}
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                style={{
                  width: '100%', padding: '16px',
                  background: message.trim() ? '#EFC0D4' : '#F3F3F4',
                  color: message.trim() ? '#1A3A6B' : '#9CA3AF',
                  border: 'none', borderRadius: '4px',
                  fontFamily: 'Manrope, sans-serif', fontSize: '11px',
                  fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
                  cursor: message.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>send</span>
                Envoyer le message
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Sidebar({ activePage, setActivePage, userName, onLogout, observateur, isAdmin }) {
  const [showContact, setShowContact] = useState(false)
  const initials = userName
    ? userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'RC'

  const navItems = observateur
    ? [
        { id: 'dashboard',    icon: 'account_balance', label: 'Tableau de bord' },
        { id: 'insights',     icon: 'insights',        label: 'Insights'         },
        { id: 'products',     icon: 'category',        label: 'Produits'         },
        { id: 'documents',    icon: 'description',     label: 'Documents'        },
        { id: 'tranche2',     icon: 'trending_up',     label: 'Tranche 2'        },
        { id: 'podcast',      icon: 'mic',             label: 'Podcast'          },
        // inner-circle et mon-investissement masqués
      ]
    : [
        { id: 'dashboard',          icon: 'account_balance', label: 'Tableau de bord'   },
        { id: 'insights',           icon: 'insights',        label: 'Insights'           },
        { id: 'products',           icon: 'category',        label: 'Produits'           },
        { id: 'documents',          icon: 'description',     label: 'Documents'          },
        { id: 'inner-circle',       icon: 'diamond',         label: 'Inner Circle'       },
        { id: 'tranche2',           icon: 'trending_up',     label: 'Tranche 2'          },
        { id: 'podcast',            icon: 'mic',             label: 'Podcast'            },
        { id: 'mon-investissement', icon: 'person',          label: 'Mon Investissement' },
        ...(userName?.toLowerCase().includes('massata') || isAdmin ? [{ id: 'analytics', icon: 'bar_chart', label: 'Analytics' }] : []),
      ]

  return (
    <aside style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '288px',
      height: '100vh',
      background: '#E0E8FF',
      boxShadow: '0px 20px 40px rgba(0,27,63,0.06)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      overflowY: 'auto',
    }}>

      {/* ── Logo ── */}
      <div
        onClick={() => setActivePage('dashboard')}
        style={{
          padding: '36px 28px 28px',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <div style={{
          fontFamily: 'Newsreader, serif',
          fontStyle: 'italic',
          fontSize: '22px',
          fontWeight: 400,
          color: '#1A3A6B',
          lineHeight: 1.2,
          marginBottom: '4px',
        }}>
          Retbaa Circle
        </div>
        <div style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: '10px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#1A3A6B',
          opacity: 0.5,
          fontWeight: 600,
        }}>
          Portail Investisseurs
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, paddingTop: '8px' }}>
        {navItems.map(({ id, icon, label }) => {
          const isActive = activePage === id || (id === 'products' && activePage === 'catalogue')
          return (
            <button
              key={id}
              onClick={() => setActivePage(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: 'calc(100% - 32px)',
                margin: '2px 16px',
                padding: '12px 16px',
                background: isActive ? '#EFC0D4' : 'transparent',
                borderRadius: isActive ? '6px' : '6px',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(239,192,212,0.2)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '20px',
                  color: isActive ? '#704C5D' : '#1A3A6B',
                  flexShrink: 0,
                }}
              >
                {icon}
              </span>
              <span style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#704C5D' : '#1A3A6B',
                letterSpacing: '0.01em',
              }}>
                {label}
              </span>
            </button>
          )
        })}

        {/* Inner Circle — verrouillé en mode observateur */}
        {observateur && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: 'calc(100% - 32px)',
            margin: '2px 16px',
            padding: '12px 16px',
            background: 'transparent',
            borderRadius: '6px',
            cursor: 'not-allowed',
            opacity: 0.45,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#1A3A6B', flexShrink: 0 }}>
              lock
            </span>
            <span style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '13px',
              fontWeight: 500,
              color: '#1A3A6B',
              letterSpacing: '0.01em',
            }}>
              Inner Circle
            </span>
          </div>
        )}
      </nav>

      {/* ── Bas de sidebar ── */}
      <div style={{ padding: '24px 16px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Bouton Contacter */}
        <button
          onClick={() => setShowContact(true)}
          style={{
          width: '100%',
          padding: '12px 16px',
          background: '#EFC0D4',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontFamily: 'Manrope, sans-serif',
          fontSize: '10px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontWeight: 700,
          color: '#704C5D',
          transition: 'opacity 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Contacter l'équipe
        </button>

        {showContact && <ContactModal userName={userName} onClose={() => setShowContact(false)} />}

        {/* Logout */}
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            padding: '10px 16px',
            background: 'transparent',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'Manrope, sans-serif',
            fontSize: '10px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontWeight: 600,
            color: 'rgba(26,58,107,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#704C5D' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(26,58,107,0.4)' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>logout</span>
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
