// Tranche2Page.jsx — Retbaa Circle — Design Stitch fidèle
export default function Tranche2Page({ userName }) {
  const target = 240000
  const raised = 0
  const minimum = 30000
  const pct = Math.round((raised / target) * 100)

  // Investisseurs à 1% → opportunité de monter à 5%
  const isSmallShareholder = ['Cathy', 'Raphaël'].some(n => userName?.includes(n))

  const kpis = [
    { label: 'TRANCHE 1 CLÔTURÉE', value: '€360 000', icon: 'check_circle' },
    { label: 'OBJECTIF TRANCHE 2', value: '€240 000', icon: 'flag' },
    { label: 'TICKET MINIMUM', value: '€30 000', icon: 'payments' },
    { label: 'DATE LIMITE', value: '30 Juin 2026', icon: 'schedule' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9F9F9', fontFamily: 'Manrope, sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '64px 48px' }} className="dashboard-main-padding">

        {/* ── Hero ── */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em',
            textTransform: 'uppercase', color: '#EFC0D4', marginBottom: '16px',
          }}>
            RETBAA CIRCLE · OPPORTUNITÉ EXCLUSIVE
          </div>
          <h1 style={{
            fontFamily: 'Newsreader, serif', fontStyle: 'italic',
            fontSize: '72px', fontWeight: 300, color: '#1A3A6B',
            margin: '0 0 20px', lineHeight: 1,
          }}>
            Tranche 2
          </h1>
          <p style={{
            fontSize: '15px', color: '#43474F', lineHeight: 1.7,
            maxWidth: '600px', margin: 0,
          }}>
            La Tranche 1 est clôturée à <strong style={{ color: '#1A3A6B' }}>360 000€</strong>.
            Nous ouvrons maintenant la Tranche 2 pour compléter notre tour de table à hauteur de{' '}
            <strong style={{ color: '#1A3A6B' }}>240 000€ supplémentaires</strong>.
          </p>
        </div>

        {/* ── Bannière investisseur à 1% ── */}
        {isSmallShareholder && (
          <div style={{
            background: 'linear-gradient(135deg, #1A3A6B 0%, #2d5499 100%)',
            borderRadius: '4px', padding: '28px 36px',
            marginBottom: '32px',
            display: 'flex', alignItems: 'center', gap: '20px',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#EFC0D4', flexShrink: 0 }}>trending_up</span>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#EFC0D4', marginBottom: '6px' }}>
                OPPORTUNITÉ PERSONNALISÉE
              </div>
              <p style={{ fontSize: '14px', color: '#ffffff', lineHeight: 1.6, margin: 0 }}>
                Vous détenez actuellement <strong>~1%</strong> du capital. La Tranche 2 vous permet d'augmenter votre participation jusqu'à <strong style={{ color: '#EFC0D4' }}>~5%</strong> — en ligne avec les investisseurs de référence du cercle.
              </p>
            </div>
          </div>
        )}

        {/* ── Barre de progression ── */}
        <div style={{
          background: '#ffffff', borderRadius: '4px', padding: '40px',
          boxShadow: '0px 20px 40px rgba(0,27,63,0.04)', marginBottom: '32px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
            <div>
              <div style={{
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em',
                textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '8px',
              }}>
                ÉTAT DE LA LEVÉE — TRANCHE 2
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span style={{
                  fontFamily: 'Newsreader, serif', fontSize: '48px',
                  fontWeight: 400, color: '#1A3A6B', lineHeight: 1,
                }}>
                  €0
                </span>
                <span style={{
                  fontFamily: 'Newsreader, serif', fontSize: '24px',
                  color: '#9CA3AF', fontStyle: 'italic',
                }}>
                  / €240 000
                </span>
              </div>
            </div>
            <div style={{
              padding: '8px 16px', background: 'rgba(239,192,212,0.15)',
              borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#795465' }}>hourglass_empty</span>
              <span style={{
                fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#795465',
              }}>
                OUVERTURE EN COURS
              </span>
            </div>
          </div>

          {/* Barre */}
          <div style={{
            height: '8px', background: '#E0E8FF', borderRadius: '4px',
            marginBottom: '12px', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: '#EFC0D4', borderRadius: '4px',
              transition: 'width 0.6s ease',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9CA3AF' }}>0€ LEVÉ</span>
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9CA3AF' }}>OBJECTIF 240 000€</span>
          </div>

          {/* Contexte Tranche 1 */}
          <div style={{
            marginTop: '24px', padding: '16px 20px',
            background: 'rgba(26,58,107,0.03)', borderRadius: '4px',
            borderLeft: '3px solid #EFC0D4',
          }}>
            <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#EFC0D4', marginBottom: '6px' }}>
              TRANCHE 1 CLÔTURÉE
            </div>
            <p style={{ fontSize: '12px', color: '#43474F', lineHeight: 1.6, margin: 0 }}>
              La Tranche 1 a été clôturée le <strong>5 février 2026</strong> à hauteur de{' '}
              <strong style={{ color: '#1A3A6B' }}>360 000€</strong>, portant la valorisation post-money à{' '}
              <strong style={{ color: '#1A3A6B' }}>3 M€</strong>.
              La Tranche 2 vise à compléter le tour de table pour financer la prochaine phase de croissance.
            </p>
          </div>
        </div>

        {/* ── KPIs ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px', marginBottom: '48px',
        }} className="kpi-grid">
          {kpis.map(k => (
            <div key={k.label} style={{
              background: '#ffffff', borderRadius: '4px',
              padding: '24px', borderLeft: '3px solid #EFC0D4',
              boxShadow: '0px 10px 30px rgba(239,192,212,0.1)',
            }}>
              <div style={{
                fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em',
                textTransform: 'uppercase', color: '#795465', marginBottom: '10px',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#EFC0D4' }}>{k.icon}</span>
                {k.label}
              </div>
              <div style={{
                fontFamily: 'Newsreader, serif', fontSize: '26px',
                color: '#1A3A6B', fontWeight: 400,
              }}>
                {k.value}
              </div>
            </div>
          ))}
        </div>

        {/* ── Conditions + CTA ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }} className="dashboard-grid">

          {/* Conditions */}
          <div style={{
            background: '#ffffff', borderRadius: '4px', padding: '40px',
            boxShadow: '0px 20px 40px rgba(0,27,63,0.04)',
          }}>
            <h2 style={{
              fontFamily: 'Newsreader, serif', fontStyle: 'italic',
              fontSize: '32px', fontWeight: 300, color: '#1A3A6B',
              margin: '0 0 36px',
            }}>
              Conditions de l'Offre
            </h2>

            {/* Tranche 1 rappel */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '8px' }}>
                CONTEXTE — TRANCHE 1
              </div>
              <p style={{ fontSize: '13px', color: '#43474F', lineHeight: 1.6, margin: 0 }}>
                360 000€ levés auprès d'un cercle d'investisseurs sélectionnés.
                Clôture officielle le <strong style={{ color: '#1A3A6B' }}>5 février 2026</strong>.
              </p>
            </div>

            {/* Valorisation */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '8px' }}>
                VALORISATION
              </div>
              <p style={{ fontSize: '13px', color: '#43474F', lineHeight: 1.6, margin: 0 }}>
                <strong style={{ color: '#1A3A6B' }}>2,4 M€ pre-money</strong> · <strong style={{ color: '#1A3A6B' }}>3 M€ post-money</strong> post-closing Tranche 1.
              </p>
            </div>

            {/* Droits */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '8px' }}>
                DROITS ATTACHÉS
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{
                  padding: '3px 10px', background: 'rgba(239,192,212,0.2)',
                  fontSize: '9px', fontWeight: 700, color: '#795465',
                  letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px',
                }}>
                  Actions ordinaires
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#43474F', lineHeight: 1.6, margin: 0 }}>
                Droit de vote plein et entier aux assemblées générales. Accès au portail Retbaa Circle.
              </p>
            </div>

            {/* Minimum */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '8px' }}>
                TICKET MINIMUM
              </div>
              <div style={{
                fontFamily: 'Newsreader, serif', fontSize: '36px',
                color: '#1A3A6B', marginBottom: '4px',
              }}>
                €30 000
              </div>
              <p style={{ fontSize: '12px', color: '#9CA3AF', fontStyle: 'italic', margin: 0 }}>
                Par investisseur. Montée en capital possible jusqu'à 5% pour les actionnaires existants.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div style={{
            background: '#1A3A6B', borderRadius: '4px', padding: '40px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Décoration */}
            <div style={{
              position: 'absolute', top: 0, right: 0,
              width: '80px', height: '80px',
              background: 'rgba(239,192,212,0.15)',
              borderRadius: '0 0 0 80px',
            }} />

            <h3 style={{
              fontFamily: 'Newsreader, serif', fontStyle: 'italic',
              fontSize: '28px', fontWeight: 300, color: '#ffffff',
              margin: '0 0 16px', lineHeight: 1.2,
            }}>
              Rejoindre la Tranche 2
            </h3>
            <p style={{
              fontSize: '13px', color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.7, margin: '0 0 32px',
            }}>
              Exprimez votre intérêt directement à Massata.
              Les discussions se font en mode privé, dans le respect de la confidentialité du cercle.
            </p>

            <button
              onClick={() => window.open('mailto:massata@retbaa.com?subject=[Retbaa Circle] Intérêt Tranche 2&body=Bonjour Massata,%0A%0AJe suis intéressé(e) par la Tranche 2 de Retbaa Circle.%0A%0ACordialement', '_blank')}
              style={{
                width: '100%', padding: '18px',
                background: '#EFC0D4', color: '#1A3A6B',
                border: 'none', borderRadius: '4px',
                fontFamily: 'Manrope, sans-serif', fontSize: '11px',
                fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
                cursor: 'pointer', marginBottom: '16px',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              JE SUIS INTÉRESSÉ(E)
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '13px', color: 'rgba(239,192,212,0.5)' }}>lock</span>
              <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(239,192,212,0.5)' }}>
                PLATEFORME SÉCURISÉE & CONFIDENTIELLE
              </span>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .dashboard-main-padding { padding: 32px 16px !important; }
          .kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .kpi-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
