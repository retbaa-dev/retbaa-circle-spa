import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <div style={{ fontFamily: 'Manrope, sans-serif', color: '#1A1A1A' }}>

      {/* ── Section 1 — Hero ─────────────────────────────────────────────── */}
      <section style={{
        backgroundColor: '#1A3A6B',
        padding: '120px 24px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: 'clamp(28px, 5vw, 52px)',
          color: '#ffffff',
          margin: '0 0 20px',
          letterSpacing: '0.01em',
          lineHeight: 1.3,
        }}>
          Retbaa — Une maison née au bord du Lac Rose
        </h1>
        <p style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: '13px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#C4A96A',
          margin: 0,
          fontWeight: 500,
        }}>
          DAKAR · PARIS · 2024
        </p>
      </section>

      {/* ── Section 2 — La vision ─────────────────────────────────────────── */}
      <section style={{
        backgroundColor: '#FAF7F2',
        padding: '96px 24px',
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: '28px',
            color: '#1A3A6B',
            marginBottom: '48px',
            letterSpacing: '0.01em',
          }}>
            La vision
          </h2>

          <p style={{ lineHeight: 1.9, fontSize: '16px', color: '#3D3D3D', marginBottom: '28px' }}>
            Retbaa est née d'une conviction : le luxe authentique puise ses racines dans la terre, dans les mains qui façonnent, dans les savoirs transmis de génération en génération. Au bord du Lac Rose de Dakar, là où le sel rosé se dépose comme une signature naturelle, nous avons choisi de bâtir une maison qui porte cette singularité au cœur de chaque création.
          </p>

          <p style={{ lineHeight: 1.9, fontSize: '16px', color: '#3D3D3D', marginBottom: '28px' }}>
            Notre ambition n'est pas de reproduire les codes d'un luxe importé, mais d'inventer un langage propre — celui d'une Afrique contemporaine qui n'a pas à s'excuser de sa beauté. Chaque gamme Retbaa est pensée pour les femmes et les hommes qui habitent pleinement leur identité, entre Dakar et Paris, entre tradition et modernité.
          </p>

          <p style={{ lineHeight: 1.9, fontSize: '16px', color: '#3D3D3D', marginBottom: 0 }}>
            Retbaa Circle est le cercle intime de cette aventure : les investisseurs, partenaires et amis qui croient, avant l'heure, qu'une nouvelle maison de luxe africaine peut rayonner sur la scène mondiale. Ensemble, nous construisons quelque chose qui durera.
          </p>
        </div>
      </section>

      {/* ── Section 3 — Le fondateur ──────────────────────────────────────── */}
      <section style={{
        backgroundColor: '#ffffff',
        padding: '96px 24px',
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: '28px',
            color: '#1A3A6B',
            marginBottom: '48px',
          }}>
            Le fondateur
          </h2>

          <div style={{
            display: 'flex',
            gap: '40px',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}>
            {/* Avatar */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#1A3A6B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{
                fontFamily: 'Georgia, serif',
                fontSize: '24px',
                color: '#C4A96A',
                fontWeight: 400,
                letterSpacing: '0.05em',
              }}>
                MN
              </span>
            </div>

            {/* Bio */}
            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{
                fontFamily: 'Georgia, serif',
                fontSize: '20px',
                fontWeight: 400,
                color: '#1A1A1A',
                marginBottom: '4px',
              }}>
                Massata Niang
              </div>
              <div style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '12px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#C4A96A',
                marginBottom: '24px',
                fontWeight: 600,
              }}>
                Fondateur &amp; CEO
              </div>

              <p style={{ lineHeight: 1.9, fontSize: '15px', color: '#4A4A4A', marginBottom: '20px' }}>
                Entrepreneur franco-sénégalais, Massata Niang a forgé sa vision du luxe entre Dakar et Paris — deux villes qui ont nourri son goût pour l'excellence artisanale et son attachement profond aux identités culturelles africaines. C'est au contact du Lac Rose, symbole fort de l'imaginaire sénégalais, qu'est née l'idée de Retbaa.
              </p>

              <p style={{ lineHeight: 1.9, fontSize: '15px', color: '#4A4A4A', marginBottom: 0 }}>
                Convaincu que le prochain grand nom du luxe mondial émergera du continent africain, il a rassemblé autour de Retbaa une équipe et un cercle d'investisseurs partageant cette ambition. Son engagement : bâtir une maison authentique, durable, dont chaque produit raconte une histoire vraie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4 — Chiffres clés ─────────────────────────────────────── */}
      <section style={{
        backgroundColor: '#FAF7F2',
        padding: '96px 24px',
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: '28px',
            color: '#1A3A6B',
            marginBottom: '48px',
          }}>
            Retbaa en chiffres
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '24px',
          }}>
            {[
              { value: '2024', label: 'Fondée en' },
              { value: '3', label: 'Gammes' },
              { value: 'Paris · Dakar', label: 'Présence' },
              { value: 'En cours', label: 'Levée de fonds' },
            ].map((kpi) => (
              <div key={kpi.label} style={{
                backgroundColor: '#ffffff',
                border: '1px solid #E8E0D5',
                borderRadius: '4px',
                padding: '32px 24px',
                textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '28px',
                  fontWeight: 400,
                  color: '#1A3A6B',
                  marginBottom: '8px',
                }}>
                  {kpi.value}
                </div>
                <div style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#9CA3AF',
                  fontWeight: 600,
                }}>
                  {kpi.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5 — CTA ──────────────────────────────────────────────── */}
      <section style={{
        backgroundColor: '#1A3A6B',
        padding: '96px 24px',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontFamily: 'Georgia, serif',
          fontWeight: 400,
          fontStyle: 'italic',
          fontSize: '28px',
          color: '#ffffff',
          marginBottom: '48px',
        }}>
          Rejoindre l'aventure
        </h2>

        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <Link to="/dataroom" style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#1A3A6B',
            backgroundColor: '#C4A96A',
            padding: '14px 32px',
            textDecoration: 'none',
            borderRadius: '2px',
            display: 'inline-block',
          }}>
            Accéder à la Dataroom →
          </Link>

          <Link to="/insights" style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#ffffff',
            backgroundColor: 'transparent',
            padding: '14px 32px',
            textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: '2px',
            display: 'inline-block',
          }}>
            Lire nos Insights →
          </Link>
        </div>
      </section>

    </div>
  )
}
