// src/components/InsightsCover.jsx
// Visuel texturé "Retbaa Insights" — remplace les images par des blocs graphiques CSS
// Palette et motif adaptés par thème (tag)

const THEMES = {
  'LVMH':               { bg: ['#1A3A6B', '#0D2244'], accent: '#C4A96A', pattern: 'grid' },
  'Kering':             { bg: ['#2D1A4A', '#1A0D2E'], accent: '#C4A96A', pattern: 'dots' },
  'Hermès':             { bg: ['#5C3D1E', '#3A2510'], accent: '#E8C97A', pattern: 'diagonal' },
  'Richemont':          { bg: ['#1A2E4A', '#0D1E33'], accent: '#B8D4E8', pattern: 'grid' },
  'M&A':                { bg: ['#1A3A2E', '#0D2219'], accent: '#7AC4A0', pattern: 'dots' },
  'Mode africaine':     { bg: ['#4A2010', '#2E1208'], accent: '#F0A060', pattern: 'weave' },
  'Luxe culturel':      { bg: ['#3A1A4A', '#220D2E'], accent: '#D4A0E8', pattern: 'weave' },
  'Investissement Afrique': { bg: ['#1A3A2E', '#0D2219'], accent: '#7AC4A0', pattern: 'diagonal' },
  'Marché africain':    { bg: ['#3A2A10', '#221A08'], accent: '#E8C060', pattern: 'weave' },
  'IA luxe':            { bg: ['#0D2244', '#060D1A'], accent: '#60A8E8', pattern: 'circuit' },
  'Technologie luxe':   { bg: ['#0D2233', '#060D1A'], accent: '#60C8E8', pattern: 'circuit' },
  'NFT luxe':           { bg: ['#1A0D44', '#0D0622'], accent: '#9060E8', pattern: 'circuit' },
  'Phygital':           { bg: ['#0D2233', '#060D1A'], accent: '#60E8C0', pattern: 'circuit' },
  'Gen Z':              { bg: ['#3A1A2E', '#221020'], accent: '#E880B0', pattern: 'dots' },
  'Tourisme premium':   { bg: ['#1A3020', '#0D1E12'], accent: '#80C880', pattern: 'diagonal' },
  'Hôtellerie luxe':    { bg: ['#2A2A1A', '#1A1A0D'], accent: '#C8C060', pattern: 'grid' },
  'Marché luxe':        { bg: ['#1A3A6B', '#0D2244'], accent: '#C4A96A', pattern: 'grid' },
  'default':            { bg: ['#1A3A6B', '#0D2244'], accent: '#C4A96A', pattern: 'grid' },
}

// Motifs SVG inline
function Pattern({ type, accent, size = 200 }) {
  const op = 0.12
  const c = accent

  if (type === 'grid') return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: op }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke={c} strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)"/>
    </svg>
  )

  if (type === 'dots') return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: op }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill={c}/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)"/>
    </svg>
  )

  if (type === 'diagonal') return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: op }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="diag" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="16" stroke={c} strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#diag)"/>
    </svg>
  )

  if (type === 'weave') return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: op }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="weave" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M0 12 Q6 0 12 12 Q18 24 24 12" fill="none" stroke={c} strokeWidth="1"/>
          <path d="M0 0 Q6 12 12 0 Q18 -12 24 0" fill="none" stroke={c} strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#weave)"/>
    </svg>
  )

  if (type === 'circuit') return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: op }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="circuit" width="40" height="40" patternUnits="userSpaceOnUse">
          <line x1="0" y1="20" x2="40" y2="20" stroke={c} strokeWidth="0.5"/>
          <line x1="20" y1="0" x2="20" y2="40" stroke={c} strokeWidth="0.5"/>
          <circle cx="20" cy="20" r="3" fill="none" stroke={c} strokeWidth="1"/>
          <circle cx="0" cy="0" r="2" fill={c}/>
          <circle cx="40" cy="40" r="2" fill={c}/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit)"/>
    </svg>
  )

  return null
}

export default function InsightsCover({ tags = [], title = '', height = 200, hovered = false, featured = false }) {
  // Trouver le thème selon les tags
  const tag = tags[0] || 'default'
  const theme = THEMES[tag] || THEMES['default']
  const [c1, c2] = theme.bg

  const fontSize = featured ? '36px' : '22px'
  const subtitleSize = featured ? '11px' : '9px'

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      minHeight: height,
      background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
      overflow: 'hidden',
      transition: 'transform 0.3s ease',
    }}>
      {/* Motif de fond */}
      <Pattern type={theme.pattern} accent={theme.accent} />

      {/* Cercle décoratif */}
      <div style={{
        position: 'absolute',
        bottom: featured ? '-40px' : '-20px',
        right: featured ? '-40px' : '-20px',
        width: featured ? '180px' : '120px',
        height: featured ? '180px' : '120px',
        borderRadius: '50%',
        border: `1px solid ${theme.accent}22`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: featured ? '-70px' : '-40px',
        right: featured ? '-70px' : '-40px',
        width: featured ? '260px' : '180px',
        height: featured ? '260px' : '180px',
        borderRadius: '50%',
        border: `1px solid ${theme.accent}11`,
        pointerEvents: 'none',
      }} />

      {/* Contenu centré */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '24px',
      }}>
        {/* Ligne déco */}
        <div style={{
          width: featured ? '48px' : '32px',
          height: '1px',
          background: theme.accent,
          opacity: 0.6,
          marginBottom: '4px',
        }} />

        {/* "Retbaa" en serif */}
        <div style={{
          fontFamily: 'Newsreader, serif',
          fontStyle: 'italic',
          fontSize: fontSize,
          color: theme.accent,
          letterSpacing: '-0.01em',
          lineHeight: 1,
          textAlign: 'center',
          opacity: 0.9,
        }}>
          Retbaa
        </div>

        {/* "Insights" */}
        <div style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: subtitleSize,
          fontWeight: 700,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          textAlign: 'center',
        }}>
          Insights
        </div>

        {/* Ligne déco bas */}
        <div style={{
          width: featured ? '48px' : '32px',
          height: '1px',
          background: theme.accent,
          opacity: 0.3,
          marginTop: '4px',
        }} />

        {/* Tag */}
        {tag && tag !== 'default' && (
          <div style={{
            marginTop: '8px',
            fontFamily: 'Manrope, sans-serif',
            fontSize: '9px',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: `${theme.accent}88`,
            textAlign: 'center',
          }}>
            {tag}
          </div>
        )}
      </div>
    </div>
  )
}
