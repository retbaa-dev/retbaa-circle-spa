# Retbaa Circle — Private Investor Portal

SPA React déployée sur `https://investisseurs.retbaa.com`

## Stack technique

- **React 18** + **Vite**
- **CSS custom** (pas de Tailwind, pas de MUI)
- **i18n** FR/EN intégré (`src/i18n/index.js`)
- **Déploiement** : VM Genspark → `/var/www/retbaa-circle/`
- **Reverse proxy** : Caddy (`/etc/caddy/conf.d/custom.caddy`)

## Installation locale

```bash
git clone https://github.com/retbaa-dev/retbaa-circle-spa.git
cd retbaa-circle-spa
npm install
npm run dev       # http://localhost:5173?preview=massata
```

## Build & déploiement

```bash
npm run build
# Copier dist/ sur le VM :
sudo cp -r dist/* /var/www/retbaa-circle/
```

## Accès au portail

Le portail utilise un système de tokens via `?preview=<token>` dans l'URL.

| Token | Investisseur | Vue |
|-------|-------------|-----|
| `massata` | Massata Niang (Fondateur) | Tableau de bord complet + Analytics |
| `barthelemy` | Barthélemy | Vue investisseur |
| `pape` | Pape Amadou | Vue investisseur |
| `cathy` | Cathy | Vue investisseur |
| `raphael` | Raphaël | Vue investisseur |

## Structure des fichiers

```
src/
├── App.jsx                    # Routeur principal (activePage state)
├── components/
│   ├── Sidebar.jsx            # Navigation latérale
│   ├── Header.jsx             # Topbar mobile
│   ├── Footer.jsx             # Pied de page
│   ├── KPICard.jsx            # Carte KPI dashboard
│   ├── Timeline.jsx           # Timeline investissement
│   └── DocumentCard.jsx       # Carte document
├── pages/
│   ├── Dashboard.jsx          # Page principale investisseur
│   ├── CataloguePage.jsx      # Page Produits (id: 'products')
│   ├── DocumentsPage.jsx      # Page Documents (id: 'documents')
│   ├── InsightsPage.jsx       # Page Insights (id: 'insights')
│   ├── InnerCirclePage.jsx    # Page Inner Circle (id: 'inner-circle')
│   ├── PodcastPage.jsx        # Page Podcast (id: 'podcast')
│   ├── MonInvestissementPage.jsx # Mon Portefeuille (id: 'mon-investissement')
│   ├── Tranche2Page.jsx       # Tranche 2 (id: 'tranche2')
│   ├── AnalyticsPage.jsx      # Analytics fondateur (id: 'analytics')
│   ├── LoginPage.jsx          # Page de connexion
│   └── ObservateurDashboard.jsx # Vue observateur
├── data/
│   ├── captable.js            # Cap table investisseurs
│   └── catalogue.js           # Catalogue produits Retbaa
└── i18n/
    └── index.js               # Traductions FR/EN
```

## Navigation — IDs importants

Les IDs de navigation dans `Sidebar.jsx` doivent correspondre aux conditions dans `App.jsx` :

| Sidebar ID | Page rendue |
|-----------|------------|
| `dashboard` | `<Dashboard />` |
| `products` | `<CataloguePage />` |
| `documents` | `<DocumentsPage />` |
| `insights` | `<InsightsPage />` |
| `inner-circle` | `<InnerCirclePage />` |
| `podcast` | `<PodcastPage />` |
| `mon-investissement` | `<MonInvestissementPage />` |
| `tranche2` | `<Tranche2Page />` |
| `analytics` | `<AnalyticsPage />` (fondateur seulement) |

## Données à modifier

### Cap table (`src/data/captable.js`)
Contient les informations de chaque investisseur (capital, actions, participation).

### Catalogue produits (`src/data/catalogue.js`)
Contient les produits Retbaa (Kemia, parfums, etc.).

### Contenu Inner Circle (`src/pages/InnerCirclePage.jsx`)
Articles privés du fondateur — modifier directement dans le JSX.

### Contenu Podcast (`src/pages/PodcastPage.jsx`)
Episodes du podcast Circle Insider — fichiers MP3 dans `/public/`.

## Modifier le site avec Claude Code (sans Genspark)

```bash
# 1. Cloner le repo
git clone https://github.com/retbaa-dev/retbaa-circle-spa.git
cd retbaa-circle-spa
npm install

# 2. Lancer Claude Code
claude --print --permission-mode bypassPermissions "Modifie la page Produits pour ajouter..."

# 3. Tester localement
npm run dev

# 4. Builder
npm run build

# 5. Déployer sur le VM via SSH
scp -r dist/* work@20.214.160.202:/var/www/retbaa-circle/
```

## Déploiement sur le VM Genspark

- **IP VM** : `20.214.160.202`
- **User** : `work`
- **Dossier web** : `/var/www/retbaa-circle/`
- **Config Caddy** : `/etc/caddy/conf.d/custom.caddy`
- **Redémarrer Caddy** : `sudo systemctl reload caddy`

## Contacts investisseurs

| Nom | Token | Capital | Actions | % |
|-----|-------|---------|---------|---|
| Massata Niang | massata | 1 000 € | 100 000 | 86,96% |
| Barthélemy | barthelemy | 150 000 € | 6 250 | 5,43% |
| Pape Amadou | pape | 150 000 € | 6 250 | 5,43% |
| Cathy | cathy | 30 000 € | 1 250 | 1,09% |
| Raphaël | raphael | 30 000 € | 1 250 | 1,09% |

---

**Dernière mise à jour** : Avril 2026  
**Développé par** : Kemia (Genspark AI) pour Retbaa
