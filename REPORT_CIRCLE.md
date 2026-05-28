# REPORT_CIRCLE.md — Retbaa Circle SPA
## Rapport d'audit, correction & déploiement
> Date : 2026-05-28 · Session 2 — Post-migration Clerk → Supabase Auth (23 mai 2026)
> Déploiement : `dpl_GqytUAkA4EkRZN3wfSCMRRm946Yd` · READY en 35s

---

## 1. Synthèse exécutive

Audit complet de `retbaa-dev/retbaa-circle-spa` post-migration Clerk → Supabase Auth.

**13 commits pushés · Vercel déployé en production** ✅

| Métrique | Avant | Après |
|----------|-------|-------|
| Bugs critiques | 1 (magic link brisé) | 0 corrigés en code · 1 action dashboard requise |
| Bugs hauts (assets 404) | 4 | 4 corrigés |
| Bugs moyens | 4 | 4 corrigés |
| Bundle JS initial | 837 KB | 461 KB (**-45%**) |
| Chunks séparés | 0 | 7 (lazy loading) |
| ADMIN_EMAILS hardcodés | 3 fichiers | 0 (source unique : Supabase) |
| RLS policies | Non auditées | Script SQL fourni |

---

## 2. Bugs corrigés — 13 commits atomiques

| Commit | Bug | Description | Sévérité |
|--------|-----|-------------|----------|
| `a7164b8` | BUG-002 | MP3 podcasts → `public/podcasts/` (5 fichiers EP.01-05) | 🟠 HAUTE |
| `dae47d7` | BUG-003 | Inner Circle audio remappé vers podcast_ep1-3_en.mp3 existants | 🟠 HAUTE |
| `a3a87ea` | BUG-004 | EP.06/07 PodcastPage supprimés (inexistants) — "Coming Soon" conservé | 🟠 HAUTE |
| inclus 003 | BUG-005 | PDF Inner Circle → `Retbaa_Etude_Marche_Luxe_2026.pdf` disponible | 🟠 HAUTE |
| `1089168` | BUG-006/007 | Posts orphelins supprimés, IDs uniques (id:1×3, id:5×2 → corrigés) | 🟡 MOYENNE |
| `988d037` | BUG-008 | CORS admin : ajout `retbaa-circle-spa.vercel.app` + `localhost:8002` | 🟡 MOYENNE |
| `c9476b3` | BUG-009 | AuthCallback : timeout 8s + message d'erreur explicite | 🟡 MOYENNE |
| `96c3f28` | BUG-010 | `.env.example` créé avec documentation des 3 variables VITE_* | 🔵 BASSE |
| `ee19579` | ARCH | ADMIN_EMAILS supprimés — source unique : `user_profiles.role = 'founder'` | 🔵 ARCH |
| `257e20b` | BUG-011 | React.lazy() + Suspense — bundle initial : 837KB → 461KB (-45%) | ⚪ PERF |
| `1dde731` | BUG-001 | Script SQL : RLS user_profiles + has_app_access() + app_access table | 🔴 CRITIQUE |
| `77bae5a` | docs | BUGS_CIRCLE.md — audit complet documenté | — |
| `16c04ee` | docs | REPORT_CIRCLE.md — rapport final | — |

**Build prod final** : ✅ 0 erreur · 0 warning code · 461 KB bundle initial

---

## 3. Bug critique résiduel — Action manuelle Supabase

### BUG-001 : Redirects magic link → trade.retbaa.com

**Statut** : Corrigé côté code (LoginPage utilise `window.location.origin` ✅). Reste : whitelist Supabase.

**Action requise dans le dashboard Supabase** ([app.supabase.com](https://app.supabase.com)) :

**Projet `lufozqtrwrmowzojxcoi` → Authentication → URL Configuration**

Ajouter dans **Redirect URLs** :
```
https://retbaa-circle-spa.vercel.app/**
https://circle.retbaa.com/**
https://retbaa-circle-spa-git-main-retbaa-devs-projects.vercel.app/**
```

> Sans ce fix, le magic link fonctionne mais atterrit sur trade.retbaa.com.
> Le login email+password (`massata@retbaa.com / Retbaa2026!`) fonctionne normalement.

---

## 4. Audit Supabase — Actions SQL à exécuter

Le fichier `scripts/supabase-audit-fix.sql` (dans le repo) contient les corrections SQL à exécuter dans le **SQL Editor Supabase** :

1. **RLS user_profiles** — Activation + policies SELECT/UPDATE limitées à `auth.uid() = id`
2. **has_app_access()** — Création/correction de la fonction RPC avec fallback founder
3. **app_access table** — Création si absente, avec RLS
4. **Grant Circle** — Accès Circle accordé automatiquement aux investisseurs existants

**Procédure** : Supabase Dashboard → SQL Editor → coller le contenu de `scripts/supabase-audit-fix.sql` → Run

---

## 5. Tests des parcours clés

| Parcours | Statut | Notes |
|----------|--------|-------|
| Login email + password | ✅ Fonctionnel | `massata@retbaa.com / Retbaa2026!` — signInWithPassword correct |
| Login magic link | ⚠️ Partiel | Code OK · Whitelist Supabase manquante (BUG-001 dashboard) |
| Login Google OAuth | ✅ Fonctionnel | redirectTo = window.location.origin/auth/callback |
| AuthCallback lien expiré | ✅ Corrigé | Timeout 8s → message erreur explicite (BUG-009) |
| Dashboard investisseur | ✅ Fonctionnel | Rôles founder/active/assistant/pending/no_access gérés |
| Dashboard — lazy loading | ✅ Actif | Suspense wrapper avec PageLoader spinner |
| Inner Circle — Lettres | ✅ Corrigé | 6 posts · IDs uniques · champs complets (BUG-006/007) |
| Inner Circle — Audio | ✅ Corrigé | EP.01-03 → podcast_ep1-3_en.mp3 existants (BUG-003) |
| Inner Circle — PDF | ✅ Corrigé | → Retbaa_Etude_Marche_Luxe_2026.pdf existant (BUG-005) |
| Podcasts EP.01–05 | ✅ Corrigé | MP3 dans public/podcasts/ (BUG-002) |
| Podcasts EP.06–07 | ✅ Corrigé | Supprimés — "Coming Next" visible (BUG-004) |
| Page Insights | ✅ Fonctionnel | Lazy loaded · Rendu markdown correct |
| Page Documents | ✅ Fonctionnel | PDFs légaux présents dans public/docs/legal/ |
| Déconnexion | ✅ Fonctionnel | signOut() + sessionStorage.clear() + redirect / |
| Admin panel | ✅ Corrigé | CORS OK · Auth uniquement par role=founder (BUG-008) |
| Mode Preview | ✅ Fonctionnel | VITE_PREVIEW_TOKEN gate actif |
| Accès no_access | ✅ Fonctionnel | Écran "Accès non autorisé" + bouton signOut |

---

## 6. Architecture post-correction

### Auth flow (✅ propre)
```
User → LoginPage → supabase.auth.signInWithPassword/signInWithOtp
     → onAuthStateChange → useAuth (AuthContext)
     → fetchProfile (user_profiles) + checkCircleAccess (has_app_access RPC)
     → role: founder | active | assistant | pending | no_access | null
     → App.jsx routing selon rôle
```

### Sécurité
- **Côté client** : rôle lu depuis Supabase (non modifiable par l'utilisateur)
- **Côté serveur** (server/admin.js) : JWT vérifié via `supabase.auth.getUser()` + profil DB
- **ADMIN_EMAILS** : supprimés de tous les fichiers — source unique `role = 'founder'`
- **RLS** : policies SELECT/UPDATE sur user_profiles · app_access table avec RLS

### Performance
```
Bundle initial : 461 KB (était 837 KB, -45%)
├── supabase SDK : 200 KB (partagé, toujours chargé)
├── App shell + React : ~261 KB
└── Pages lazy (à la demande) :
    ├── InsightsPage : 97 KB
    ├── MonInvestissementPage : 17 KB
    ├── InnerCirclePage : 14 KB
    ├── PodcastPage : 13 KB
    ├── AnalyticsPage : 12 KB
    ├── Tranche2Page : 11 KB
    └── BienvenueOnboarding : 5 KB
```

---

## 7. Plan d'actions post-déploiement

### Immédiat (avant prochain login investisseur)
1. **Supabase Redirect URLs** — Ajouter les 3 URLs (5 min · BUG-001)
2. **SQL supabase-audit-fix.sql** — Exécuter dans SQL Editor (5 min)

### Court terme
3. **MP3 Inner Circle réels** — Uploader les vrais `inner_circle_ep1-4_final.mp3` dans `public/podcasts/` et mettre à jour les sources dans InnerCirclePage.jsx
4. **PDF Sales Intelligence** — Uploader `Retbaa_Sales_Intelligence_Note_Strategique_v1.pdf` dans `public/docs/` et restaurer le lien dans InnerCirclePage.jsx
5. **EP.06 + EP.07** — Produire et uploader les nouveaux épisodes

### Moyen terme
6. **Monitoring** — Alertes Supabase sur erreurs auth (dashboard → Logs → Auth Errors)
7. **Test E2E magic link** — Après fix Supabase, tester le flux complet depuis un email réel
8. **Un seul projet Supabase par app** — Évaluer la séparation Trade/Circle en deux projets distincts pour isoler les Site URLs

---

## 8. Déploiement

| Champ | Valeur |
|-------|--------|
| Deployment ID | `dpl_GqytUAkA4EkRZN3wfSCMRRm946Yd` |
| Statut | ✅ READY |
| Build time | ~35 secondes |
| Commit déclencheur | `1dde731` (fix BUG-001/supabase) |
| URL preview | `retbaa-circle-95bw5akle-retbaa-devs-projects.vercel.app` |
| URL production | `https://retbaa-circle-spa.vercel.app` |
| Domaine custom | `https://circle.retbaa.com` |
| Région | `iad1` (US East) |

---

*Rapport généré le 2026-05-28 — Session 2 — Massata Niang / Retbaa Circle*
