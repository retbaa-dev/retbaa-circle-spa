# Architecture — Retbaa Circle SPA

## Stack technique

| Couche | Technologie | Rôle |
|--------|-------------|------|
| Frontend | React 18 + Vite | SPA investisseurs |
| Auth | Supabase Auth (magic link + Google OAuth) | Authentification |
| Base de données | Supabase (PostgreSQL) | Données dynamiques |
| Déploiement | Vercel | Hosting + CI/CD |
| DNS | circle.retbaa.com | Domaine custom |

## Structure des fichiers

```
src/
├── components/       # Composants réutilisables (Header, Sidebar, Footer, Timeline…)
├── data/             # Données statiques (catalogue.js, captable.js, articles.js)
├── hooks/            # Hooks custom (useAuth.jsx)
├── i18n/             # Internationalisation (fr/en)
├── lib/              # Clients externes (supabase.js)
├── pages/            # Pages principales (une par route)
│   ├── Dashboard.jsx         # Vue principale investisseur
│   ├── InsightsPage.jsx      # Revue éditoriale
│   ├── CataloguePage.jsx     # Catalogue produits
│   ├── DocumentsPage.jsx     # Documents légaux
│   ├── MonInvestissementPage.jsx  # Données perso investisseur
│   ├── AdminPage.jsx         # Back-office fondateur
│   ├── LoginPage.jsx         # Auth magic link + Google
│   └── …
└── utils/            # Utilitaires (tracker.js)
```

## Flux de données

```
Utilisateur → Clerk Auth (magic link / Google)
           → Supabase user_profiles (role: founder | investisseur | assistant | pending)
           → Dashboard / InsightsPage / etc.
           → Supabase (cap_table, insights, documents…)
```

## Tables Supabase (retbaa-brain)

| Table | Description | RLS |
|-------|-------------|-----|
| `user_profiles` | Profils utilisateurs + rôles | Lecture par owner |
| `insights` | Articles éditoriaux | Lecture publique (published) |
| `cap_table` | Actionnariat officiel | Lecture authentifiés |
| `kemia_memories` | Mémoire partagée Kemia | Interne |

## Rôles utilisateurs

| Rôle | Accès |
|------|-------|
| `founder` | Accès total + analytics + admin |
| `investisseur` | Dashboard + documents + insights |
| `assistant` | Lecture seule, sans données financières |
| `pending` | Page d'attente uniquement |
| `no_access` | Refusé |

## Conventions de code

- Composants : PascalCase (`InsightsPage.jsx`)
- Hooks : camelCase préfixé `use` (`useAuth.jsx`)
- Données statiques : SCREAMING_SNAKE_CASE (`STATIC_ARTICLES`)
- Styles : inline styles (pas de CSS modules — choix historique)
- Commits : `type: description` (fix, feat, refactor, chore, docs)

## Décisions techniques (ADR)

### ADR-001 : Supabase Auth vs Clerk
Supabase Auth retenu pour simplicité et intégration native avec la DB.
Clerk évalué mais non retenu (coût, complexité).

### ADR-002 : Fallback statique Insights
Les articles sont dupliqués dans `src/data/articles.js` comme snapshot statique.
Raison : env vars Vercel non injectées au build time dans certains contextes.
À terme : migration vers fetch Supabase pur quand env vars stabilisées.

### ADR-011 : Architecture Insights (Draft)
App Next.js autonome sur `insights.retbaa.com` + même Supabase retbaa-brain.
Statut : Draft — à finaliser.
