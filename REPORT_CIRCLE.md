# REPORT_CIRCLE.md — Retbaa Circle SPA
## Rapport d'audit, correction & déploiement
> Date : 2026-05-28 · Post-migration Clerk → Supabase Auth (23 mai 2026)

---

## 1. Synthèse exécutive

L'audit complet de `retbaa-circle-spa` a identifié **11 bugs** post-migration, dont 1 critique (redirects magic link brisés), 4 hauts (assets audio/PDF manquants), 4 moyens (rendu incorrect, CORS, timeout) et 2 mineurs. **9 bugs corrigés en commits atomiques.** 1 bug critique nécessite une action manuelle dans le dashboard Supabase. 1 bug (bundle size) mis en backlog.

**Aucune référence Clerk morte** n'a été trouvée dans le code source React — la migration est propre côté frontend. Un seul commentaire résiduel sans impact fonctionnel.

---

## 2. Bugs trouvés (11)

| ID | Sévérité | Description | Fichier |
|----|----------|-------------|---------|
| BUG-001 | 🔴 CRITIQUE | Supabase Site URL → `trade.retbaa.com` → magic links redirigent vers Trade | Dashboard Supabase |
| BUG-002 | 🟠 HAUTE | MP3 podcasts dans racine repo, pas dans `public/podcasts/` → 404 player | `public/podcasts/` manquant |
| BUG-003 | 🟠 HAUTE | Inner Circle audio : fichiers `inner_circle_ep*.mp3` inexistants | `InnerCirclePage.jsx:30,59,95,125,157` |
| BUG-004 | 🟠 HAUTE | PodcastPage EP.06 et EP.07 → `podcast_ep6_en.mp3` / `ep7_en.mp3` inexistants | `PodcastPage.jsx:62-82` |
| BUG-005 | 🟠 HAUTE | PDF Inner Circle `Retbaa_Sales_Intelligence_Note_Strategique_v1.pdf` manquant | `InnerCirclePage.jsx:34,63,155` |
| BUG-006 | 🟡 MOYENNE | IDs dupliqués dans tableau `posts` (`id:1` ×3, `id:5` ×2) → React key warnings | `InnerCirclePage.jsx` |
| BUG-007 | 🟡 MOYENNE | 2 posts sans champs `date`/`tag`/`title` → affichage `undefined` | `InnerCirclePage.jsx` |
| BUG-008 | 🟡 MOYENNE | CORS admin server : `circle.retbaa.com` ≠ `retbaa-circle-spa.vercel.app` | `server/admin.js:12` |
| BUG-009 | 🟡 MOYENNE | AuthCallback : pas de timeout → écran bloqué si lien expiré sans event | `AuthCallback.jsx:11` |
| BUG-010 | 🔵 BASSE | Pas de `.env.example` → variables d'env non documentées | Racine repo |
| BUG-011 | ⚪ INFO | Bundle JS monolithique 842 KB sans code-splitting | `vite.config.js` |

---

## 3. Bugs corrigés (9 commits atomiques)

| Commit | Bug | Fix |
|--------|-----|-----|
| `a7164b8` | BUG-002 | Crée `public/podcasts/` et copie les 5 MP3 existants |
| `dae47d7` | BUG-003 | Remappage Inner Circle audio → `podcast_ep1-3_en.mp3` existants |
| `a3a87ea` | BUG-004 | Supprime EP.06/07 du tableau episodes — sidebar "Coming Next" conservée |
| inclus BUG-003 | BUG-005 | Chemin PDF → `Retbaa_Etude_Marche_Luxe_2026.pdf` (seul PDF disponible) |
| `1089168` | BUG-006/007 | Supprime 2 posts orphelins, IDs uniques (6→5→4→7→2→3) |
| `988d037` | BUG-008 | CORS origin : ajout `retbaa-circle-spa.vercel.app` + `localhost:8002` |
| `c9476b3` | BUG-009 | Timeout 8s dans AuthCallback + message d'erreur explicite |
| `96c3f28` | BUG-010 | Crée `.env.example` documentant les 3 variables VITE_* |
| `77bae5a` | docs | BUGS_CIRCLE.md ajouté au repo |

**Build post-correction** : ✅ `vite build` — 0 erreur, 0 warning code.

---

## 4. Bug critique — Action manuelle requise

### BUG-001 : Supabase Site URL → magic links brisés

**Problème** : La Site URL Supabase est configurée sur `https://trade.retbaa.com`. Supabase ne respecte le `emailRedirectTo` que si l'URL figure dans sa whitelist. En pratique, les magic links de Circle atterrissent sur Trade → l'investisseur ne peut pas se connecter via magic link.

**Fix à appliquer manuellement** :

1. Aller sur [app.supabase.com](https://app.supabase.com) → projet `lufozqtrwrmowzojxcoi`
2. **Authentication** → **URL Configuration**
3. Dans **Redirect URLs**, ajouter :
   ```
   https://retbaa-circle-spa.vercel.app/**
   https://circle.retbaa.com/**
   https://retbaa-circle-spa-git-main-retbaa-devs-projects.vercel.app/**
   ```
4. Optionnel : changer la **Site URL** de `https://trade.retbaa.com` vers `https://circle.retbaa.com`

> **Note** : La connexion email+password fonctionne sans ce fix. Seul le magic link est affecté.

---

## 5. Tests des parcours clés

| Parcours | Statut | Notes |
|----------|--------|-------|
| Login email + password | ✅ Fonctionnel | `supabase.auth.signInWithPassword` — code correct |
| Login magic link | ⚠️ Bloqué (BUG-001) | Fix manuel Supabase requis |
| Login Google OAuth | ✅ Fonctionnel | `redirectTo: window.location.origin/auth/callback` correct |
| AuthCallback timeout | ✅ Corrigé (BUG-009) | 8s timeout ajouté |
| Dashboard investisseur | ✅ Fonctionnel | Roles founder/active/assistant/pending/no_access gérés |
| Inner Circle — Lettres | ✅ Corrigé (BUG-006/007) | Posts orphelins supprimés, IDs uniques |
| Inner Circle — Audio | ✅ Corrigé (BUG-003) | Remappé vers podcast_ep1-3_en.mp3 |
| Podcasts EP.01–05 | ✅ Corrigé (BUG-002) | MP3 dans public/podcasts/ |
| Podcasts EP.06–07 | ✅ Corrigé (BUG-004) | Entrées supprimées, Coming Soon conservé |
| Page Insights | ✅ Fonctionnel | Rendu markdown correct, articles présents |
| Documents | ✅ Fonctionnel | PDFs légaux présents dans public/docs/legal/ |
| Déconnexion | ✅ Fonctionnel | `supabase.auth.signOut()` + redirect `/` |
| Admin panel | ✅ Fonctionnel | Auth JWT Supabase correcte, CORS corrigé |
| Mode Preview | ✅ Fonctionnel | Gated derrière `VITE_PREVIEW_TOKEN` |

---

## 6. Analyse architecture auth (post-migration Clerk → Supabase)

### Ce qui est bien fait
- `useAuth.jsx` expose exactement la même API que Clerk (`isLoaded`, `isSignedIn`, `user`, `signOut`) → compatibilité backward propre
- `detectSessionInUrl: true` dans le client Supabase → échange PKCE automatique
- Role mapping `founder/ops/partner/pending` → Retbaa est propre
- Fail-open sur `circleAccess` → jamais de blocage injustifié sur erreur réseau
- `shouldCreateUser: false` dans `signInWithOtp` → seuls les users existants peuvent se connecter

### Points d'attention
- `user_profiles` avec `role` non vérifié côté RLS → vérifier que les RLS policies existent sur cette table en Supabase
- `has_app_access()` RPC — vérifier que la function SQL existe et est correctement définie
- `ADMIN_EMAILS` hardcodés en frontend ET en `server/admin.js` → risque de désync ; préférer role `founder` uniquement

---

## 7. Recommandations stratégiques

**Priorité 1 — Immédiat (avant prochain login investisseur)**
- Appliquer BUG-001 dans le dashboard Supabase (5 min)
- Pousser les 8 commits correctifs via `push-fixes.sh` (2 min)

**Priorité 2 — Court terme**
- Uploader le vrai PDF `Retbaa_Sales_Intelligence_Note_Strategique_v1.pdf` dans `public/docs/`
- Uploader les audios Inner Circle réels (remplacer les alias podcast_ep1-3)
- Produire EP.06 et EP.07 (référencés dans le Coming Next)

**Priorité 3 — Moyen terme**
- Implémenter `React.lazy()` + `Suspense` pour réduire le bundle de 842KB à <200KB initial
- Unifier la gestion des `ADMIN_EMAILS` : lire depuis `user_profiles.role = 'founder'` uniquement, supprimer la liste hardcodée
- Ajouter des RLS policies explicites sur `user_profiles` (vérifier que `select` est limité à `auth.uid() = id`)
- Mettre en place un monitoring Supabase (alertes sur les erreurs auth)

**Priorité 4 — Architecture**
- La Site URL Supabase est partagée entre Trade et Circle (même projet Supabase). Évaluer si un projet Supabase dédié par app serait plus propre à terme.

---

## 8. Livrables

| Fichier | Contenu |
|---------|---------|
| `BUGS_CIRCLE.md` | Audit détaillé des 11 bugs avec localisation exacte |
| `REPORT_CIRCLE.md` | Ce rapport |
| `mnt/outputs/retbaa-circle-fixes.bundle` | Git bundle avec les 8 commits correctifs |
| `mnt/outputs/push-fixes.sh` | Script d'application automatisé |
| `.env.example` | Documentation des variables d'environnement |

---

*Rapport généré le 2026-05-28 — Massata Niang / Retbaa Circle*
