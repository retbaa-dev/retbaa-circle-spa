# Contributing — Retbaa Circle SPA

## Setup local

```bash
git clone https://github.com/retbaa-dev/retbaa-circle-spa.git
cd retbaa-circle-spa
npm install
cp .env.example .env.local
# Remplir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env.local
npm run dev
```

## Branches

| Branche | Usage |
|---------|-------|
| `main` | Production (auto-deploy Vercel) |
| `feat/*` | Nouvelles fonctionnalités |
| `fix/*` | Corrections de bugs |
| `docs/*` | Documentation uniquement |

## Conventions de commits

```
feat: ajouter la page podcast
fix: corriger le redirect Google OAuth
refactor: extraire useInsights hook
docs: mettre à jour ARCHITECTURE.md
chore: forcer redeploy Vercel
```

## Règles

- **Ne jamais committer de secrets** (clés API, tokens) — utiliser .env.local
- **Toujours tester localement** avant de pusher sur main
- **Composants < 200 lignes** — découper si trop long
- **Pas de données hardcodées** dans les composants — utiliser Supabase ou src/data/

## Déploiement

Push sur `main` → GitHub Actions → Vercel (auto).
Variables d'environnement : configurées dans Vercel Dashboard.
