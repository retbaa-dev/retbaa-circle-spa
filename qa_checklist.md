# QA Agent — Retbaa Circle Portal
# Mission : tester exhaustivement investisseurs.retbaa.com
# Rapport WhatsApp → +33767410184

## URLS À TESTER
BASE_MASSATA="https://investisseurs.retbaa.com?preview=massata"
BASE_BARTHELEMY="https://investisseurs.retbaa.com?preview=barthelemy"
BASE_PAPE="https://investisseurs.retbaa.com?preview=pape"
BASE_CATHY="https://investisseurs.retbaa.com?preview=cathy"
BASE_RAPHAEL="https://investisseurs.retbaa.com?preview=raphael"

## CHECKS

### 1. HTTP status
- GET / → 200
- GET /?preview=massata → 200
- GET /assets/* → 200 (JS/CSS chargés)

### 2. PDFs
- /docs/governance/pacte-actionnaires.pdf → 200
- /docs/governance/statuts.pdf → 200
- /docs/governance/registre-titres.pdf → 200
- /docs/governance/bulletin-souscription.pdf → 200
- /docs/governance/decision-president.pdf → 200

### 3. Podcasts
- /podcasts/podcast_ep1_en.mp3 → 200
- /podcasts/podcast_ep2_en.mp3 → 200
- /podcasts/podcast_ep3_en.mp3 → 200
- /podcasts/podcast_ep4_en.mp3 → 200
- /podcasts/podcast_ep5_en.mp3 → 200

### 4. Assets visuels
- /retbaa-logo-white.png → 200
- /massata-portrait.jpg → 200

### 5. API Analytics
- POST /api/track → 200 {"ok":true}
- GET /api/stats?token=retbaa2026 → 200 JSON valide

### 6. Mobile (viewport 390px)
- Dashboard : sidebar cachée, hamburger visible
- KPIs : 2 colonnes
- Documents : cards lisibles
- Podcast : player centré
- Tranche 2 : barre progression visible

### 7. Données par investisseur
- Massata : 86.96%, 100 000 actions, valorisation 3M€
- Barthélemy : 5.43%, 6 250 actions
- Pape : 5.43%, 6 250 actions
- Cathy : 1.09%, 1 250 actions, bannière Tranche 2 visible
- Raphaël : 1.09%, 1 250 actions, bannière Tranche 2 visible

### 8. Interactions
- Bouton hamburger → sidebar s'ouvre
- Navigation sidebar → changement de page
- Footer : Privacy Policy → modale, Terms → modale, Contact → mailto
- Podcast play → audio démarre
- Carrousel → flèches fonctionnelles, dots actifs
