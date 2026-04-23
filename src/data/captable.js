// Cap Table officielle Retbaa SAS — Post-closing Tranche 1 — 5 février 2026

export const CAP_TABLE = [
  {
    name: 'Massata NIANG',
    shortName: 'Massata',
    role: 'Fondateur',
    actions: 100000,
    actionsRange: '1 à 100 000',
    pct: 86.9565,
    invested: 1000,
    type: 'fondateur',
    email: 'massata.niang@retbaa-circle.fr',
  },
  {
    name: 'Barthélemy FAYE',
    shortName: 'Barthélemy',
    role: 'Investisseur',
    actions: 6250,
    actionsRange: '100 001 à 106 250',
    pct: 5.4348,
    invested: 150000,
    type: 'investisseur',
    email: 'barthelemy@retbaa-circle.fr',
  },
  {
    name: 'Pape Amadou NGOM',
    shortName: 'Pape Amadou',
    role: 'Investisseur',
    actions: 6250,
    actionsRange: '106 251 à 112 500',
    pct: 5.4348,
    invested: 150000,
    type: 'investisseur',
    email: 'pape.amadou.ngom@retbaa-circle.fr',
  },
  {
    name: 'Cathy MUIZA',
    shortName: 'Cathy',
    role: 'Investisseur',
    actions: 1250,
    actionsRange: '112 501 à 113 750',
    pct: 1.087,
    invested: 30000,
    type: 'investisseur',
    email: 'cathy@retbaa-circle.fr',
  },
  {
    name: 'Raphaël PERDRIX',
    shortName: 'Raphaël',
    role: 'Investisseur',
    actions: 1250,
    actionsRange: '113 751 à 115 000',
    pct: 1.087,
    invested: 30000,
    type: 'investisseur',
    email: 'raphael@retbaa-circle.fr',
  },
]

export const COMPANY_INFO = {
  name: 'RETBAA SAS',
  totalActions: 115000,
  capitalSocial: 1150,
  valeurNominale: 0.01,
  prixSouscription: 24,
  montantLeve: 360000,
  tranche1: { status: 'closed', date: '5 février 2026', amount: 360000 },
  tranche2: { status: 'ongoing', amount: 240000 },
}

// Retourne les données d'un utilisateur par son email
export function getUserData(email) {
  return CAP_TABLE.find(u => u.email === email.toLowerCase()) || null
}
