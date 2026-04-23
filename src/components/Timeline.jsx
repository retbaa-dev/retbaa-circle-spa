// components/Timeline.jsx — Stitch Design System — Editorial luxury style
// Marqueurs carrés, statuts en petites capitales, descriptions par étape

const steps = [
  {
    id: 1,
    step: 'STEP 01',
    label: { fr: 'Note de cadrage', en: 'Framing note' },
    desc: { fr: 'Définition des termes de l\'augmentation de capital et des droits des investisseurs.', en: 'Definition of capital increase terms and investor rights.' },
    status: 'done',
    date: 'Jan. 2026',
  },
  {
    id: 2,
    step: 'STEP 02',
    label: { fr: 'Décisions de l\'associé unique', en: 'Sole shareholder decisions' },
    desc: { fr: 'Approbation formelle des résolutions corporate par le fondateur.', en: 'Formal approval of corporate resolutions by the founder.' },
    status: 'done',
    date: 'Fév. 2026',
  },
  {
    id: 3,
    step: 'STEP 03',
    label: { fr: 'Augmentation de capital — Tranche 1', en: 'Capital increase — Tranche 1' },
    desc: { fr: 'Clôture de la Tranche 1 à 360K€. Entrée de 4 investisseurs au capital.', en: 'Tranche 1 closed at €360K. 4 investors entered the cap table.' },
    status: 'done',
    date: 'Fév. 2026',
  },
  {
    id: 4,
    step: 'STEP 04',
    label: { fr: 'Signature des documents de gouvernance', en: 'Governance documents signature' },
    desc: { fr: 'Signature du pacte d\'actionnaires et des statuts mis à jour par toutes les parties.', en: 'Signing of shareholders\' agreement and updated articles by all parties.' },
    status: 'current',
    date: 'Avr. 2026',
  },
  {
    id: 5,
    step: 'STEP 05',
    label: { fr: 'Clôture Tranche 2 — 240K€', en: 'Tranche 2 close — €240K' },
    desc: { fr: 'Ouverture de la Tranche 2 aux nouveaux investisseurs qualifiés.', en: 'Tranche 2 open to new qualified investors.' },
    status: 'upcoming',
    date: 'Juin 2026',
  },
]

const STATUS_COLORS = {
  done:     { square: '#1A3A6B', label: '#1A3A6B', title: '#1A1C1C', desc: '#9CA3AF', tag: 'COMPLETED' },
  current:  { square: '#EFC0D4', label: '#795465', title: '#1A1C1C', desc: '#43474F',  tag: 'IN PROGRESS' },
  upcoming: { square: '#E8E8E8', label: '#C4C6D0', title: '#C4C6D0', desc: '#E2E2E2',  tag: 'UPCOMING' },
}

export default function Timeline({ lang = 'fr' }) {
  return (
    <div style={{
      background: '#ffffff',
      padding: '28px 28px 24px',
      borderTop: '3px solid #EFC0D4',
      borderRadius: '4px',
      boxShadow: '0px 20px 40px rgba(0,27,63,0.04)',
    }}>
      {/* Titre */}
      <div style={{
        fontFamily: 'Manrope, sans-serif', fontSize: '10px',
        color: '#1A3A6B', letterSpacing: '0.2em', textTransform: 'uppercase',
        fontWeight: 700, marginBottom: '28px',
      }}>
        {lang === 'fr' ? 'Étapes clés' : 'Key milestones'}
      </div>

      {/* Steps */}
      <div style={{ position: 'relative' }}>
        {/* Ligne verticale fine */}
        <div style={{
          position: 'absolute',
          left: '7px', top: '8px',
          width: '1px',
          bottom: '8px',
          background: 'rgba(196,198,208,0.4)',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {steps.map((step) => {
            const s = STATUS_COLORS[step.status]
            return (
              <div key={step.id} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', position: 'relative' }}>
                {/* Marqueur carré */}
                <div style={{
                  width: '15px', height: '15px',
                  background: s.square,
                  flexShrink: 0,
                  marginTop: '3px',
                  position: 'relative', zIndex: 1,
                }} />

                {/* Contenu */}
                <div style={{ flex: 1 }}>
                  {/* Tag statut + date */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: '3px',
                  }}>
                    <span style={{
                      fontFamily: 'Manrope, sans-serif', fontSize: '9px',
                      fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                      color: s.label,
                    }}>
                      {step.step} — {s.tag}
                    </span>
                    <span style={{
                      fontFamily: 'Manrope, sans-serif', fontSize: '10px',
                      color: '#9CA3AF', flexShrink: 0, marginLeft: '8px',
                    }}>
                      {step.date}
                    </span>
                  </div>

                  {/* Titre */}
                  <div style={{
                    fontFamily: 'Manrope, sans-serif', fontSize: '12px',
                    fontWeight: step.status === 'current' ? 700 : 500,
                    color: s.title, lineHeight: 1.4,
                    marginBottom: '4px',
                  }}>
                    {step.label[lang]}
                  </div>

                  {/* Description */}
                  <div style={{
                    fontFamily: 'Manrope, sans-serif', fontSize: '11px',
                    color: s.desc, lineHeight: 1.6,
                  }}>
                    {step.desc[lang]}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
