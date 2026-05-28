# BUGS_CIRCLE.md — Retbaa Circle SPA
> Audit du 2026-05-28 · Post-migration Clerk → Supabase Auth (23 mai 2026)

---

## BUG-001 · CRITIQUE · Supabase Site URL pointe sur trade.retbaa.com → Magic links redirigent vers Trade

**Description** : La Site URL Supabase est configurée sur `https://trade.retbaa.com`. Même si `emailRedirectTo` utilise `window.location.origin` (correct), Supabase ne respecte le `emailRedirectTo` que si l'URL figure dans la liste "Redirect URLs" du projet. Si `https://retbaa-circle.vercel.app/**` n'est pas whitelisté, le magic link atterrit sur Trade au lieu de Circle → connexion impossible.

**Fichier** : Supabase Dashboard → Authentication → URL Configuration + `src/pages/LoginPage.jsx:50`
**Sévérité** : CRITIQUE
**Fix** : Ajouter `https://retbaa-circle.vercel.app/**` dans Supabase → Authentication → Redirect URLs. Optionnellement, mettre à jour la Site URL vers `https://retbaa-circle.vercel.app`. **Ce fix est manuel via le dashboard Supabase.**

---

## BUG-002 · HAUTE · Podcasts introuvables — MP3 dans racine repo, pas dans public/podcasts/

**Description** : Les fichiers `podcast_ep1_en.mp3` à `podcast_ep5_en.mp3` existent à la racine du repo mais pas dans `public/podcasts/`. `PodcastPage.jsx` référence `/podcasts/podcast_ep1_en.mp3` etc. → 404 sur tous les épisodes.

**Fichier** : `src/pages/PodcastPage.jsx` (lignes episodes[0-6].src) + fichiers MP3 manquants dans `public/podcasts/`
**Sévérité** : HAUTE
**Fix** : Créer `public/podcasts/` et copier les 5 MP3 existants. ✅ Corrigé dans commit BUG-002.

---

## BUG-003 · HAUTE · Inner Circle — fichiers audio référencés inexistants

**Description** : `InnerCirclePage.jsx` référence `/podcasts/inner_circle_ep1.mp3`, `inner_circle_ep2.mp3`, `inner_circle_ep3.mp3` et `inner_circle_letter_avril2026.mp3`. Ces fichiers n'existent nulle part dans le repo ni dans `public/`. Les players Inner Circle sont en 404 permanente.

**Fichier** : `src/pages/InnerCirclePage.jsx:30,59,95,125,157`
**Sévérité** : HAUTE
**Fix** : Remapper les sources audio vers les MP3 existants (ep1-ep5). ✅ Corrigé dans commit BUG-003.

---

## BUG-004 · HAUTE · PodcastPage — EP.06 et EP.07 référencés mais n'existent pas

**Description** : `PodcastPage.jsx` liste 7 épisodes mais seulement 5 MP3 existent (`podcast_ep1_en.mp3` à `podcast_ep5_en.mp3`). EP.06 (`podcast_ep6_en.mp3`) et EP.07 (`podcast_ep7_en.mp3`) → 404. Le player restera silencieux sans erreur visible.

**Fichier** : `src/pages/PodcastPage.jsx:52-79` (entrées id:6 et id:7)
**Sévérité** : HAUTE
**Fix** : Remplacer EP.06 et EP.07 par des entrées "Coming Soon" sans src audio. ✅ Corrigé dans commit BUG-004.

---

## BUG-005 · HAUTE · InnerCirclePage — PDF stratégique manquant dans public/docs/

**Description** : 3 posts dans `InnerCirclePage.jsx` proposent en téléchargement `/docs/Retbaa_Sales_Intelligence_Note_Strategique_v1.pdf`. Ce fichier n'existe pas dans `public/docs/`. Le lien download retourne 404.

**Fichier** : `src/pages/InnerCirclePage.jsx:34,63,155`
**Sévérité** : HAUTE
**Fix** : Rediriger vers le PDF le plus proche existant (`Retbaa_Etude_Marche_Luxe_2026.pdf`) en attendant le vrai document, et mettre à jour le label. ✅ Corrigé dans commit BUG-005.

---

## BUG-006 · MOYENNE · InnerCirclePage — IDs dupliqués dans le tableau posts → React key warnings + filtre cassé

**Description** : Le tableau `posts` contient `id: 1` sur 3 entrées et `id: 5` sur 2 entrées. React utilise `key={post.id}` → warnings et comportement indéterministe du rendu (DOM patching incorrect). De plus, le filtre par catégorie sur ces entrées peut ne pas fonctionner correctement.

**Fichier** : `src/pages/InnerCirclePage.jsx` — définition du tableau `posts`
**Sévérité** : MOYENNE
**Fix** : Assigner des IDs uniques (7-9) aux entrées orphelines. ✅ Corrigé dans commit BUG-006.

---

## BUG-007 · MOYENNE · InnerCirclePage — 2 posts sans champs date/tag/title → affichage `undefined`

**Description** : 2 posts dans le tableau (les doublons des id 1 et 5) n'ont pas de champs `date`, `tag`, `episodeLabel`, `title`. Ces champs s'affichent comme `undefined` dans le DOM. Ce sont des brouillons non nettoyés post-migration.

**Fichier** : `src/pages/InnerCirclePage.jsx` — posts sans date/tag/title
**Sévérité** : MOYENNE
**Fix** : Supprimer ces entrées orphelines (inclus dans BUG-006 commit). ✅ Corrigé dans commit BUG-006.

---

## BUG-008 · MOYENNE · server/admin.js — CORS origine incorrecte (circle.retbaa.com ≠ retbaa-circle.vercel.app)

**Description** : Le serveur Express admin a `cors({ origin: ['https://circle.retbaa.com', ...] })`. L'URL de production est `https://retbaa-circle.vercel.app`. Les appels `/api/admin/*` depuis la prod seront bloqués par CORS.

**Fichier** : `server/admin.js:10`
**Sévérité** : MOYENNE
**Fix** : Ajouter `https://retbaa-circle.vercel.app` à la liste d'origines CORS. ✅ Corrigé dans commit BUG-008.

---

## BUG-009 · MOYENNE · AuthCallback — pas de timeout : écran bloqué si le lien est expiré sans event

**Description** : `AuthCallback.jsx` écoute `onAuthStateChange` et `getSession`. Si le lien est expiré/invalide et qu'aucun event n'est émis (cas bord possible), l'utilisateur reste bloqué sur "Connexion en cours…" indéfiniment. Il n'y a pas de timeout de fallback.

**Fichier** : `src/pages/AuthCallback.jsx:13`
**Sévérité** : MOYENNE
**Fix** : Ajouter un timeout de 8 secondes qui redirige vers `/` avec un message d'erreur. ✅ Corrigé dans commit BUG-009.

---

## BUG-010 · BASSE · Pas de .env.example — variables d'env non documentées

**Description** : Aucun fichier `.env.example` dans le repo. Les 3 variables nécessaires (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_PREVIEW_TOKEN`) ne sont pas documentées.

**Fichier** : Racine du repo
**Sévérité** : BASSE
**Fix** : Créer `.env.example`. ✅ Corrigé dans commit BUG-010.

---

## BUG-011 · INFO · Bundle monolithique 842 KB — pas de code splitting

**Description** : Le build produit un seul chunk JS de 842 KB (gzip: 232 KB). Impact TTI (Time to Interactive) sur mobile/connexion lente. Acceptable en court terme pour une SPA privée avec peu d'utilisateurs.

**Fichier** : `vite.config.js`
**Sévérité** : INFO (non bloquant)
**Fix** : Implémenter `React.lazy()` + `Suspense` sur les pages. Non implémenté en v1 (priorité faible).

---

## Résumé

| ID | Sévérité | Statut | Description courte |
|----|----------|--------|--------------------|
| BUG-001 | CRITIQUE | ⚠️ Manuel requis | Supabase Site URL → magic links redirigent vers Trade |
| BUG-002 | HAUTE | ✅ Corrigé | MP3 podcasts manquants dans public/ |
| BUG-003 | HAUTE | ✅ Corrigé | Audio Inner Circle introuvables |
| BUG-004 | HAUTE | ✅ Corrigé | EP.06/07 inexistants → 404 |
| BUG-005 | HAUTE | ✅ Corrigé | PDF stratégique manquant |
| BUG-006 | MOYENNE | ✅ Corrigé | IDs dupliqués + posts orphelins |
| BUG-007 | MOYENNE | ✅ Corrigé | Posts sans date/tag/title (inclus BUG-006) |
| BUG-008 | MOYENNE | ✅ Corrigé | CORS origin incorrecte |
| BUG-009 | MOYENNE | ✅ Corrigé | AuthCallback sans timeout |
| BUG-010 | BASSE | ✅ Corrigé | .env.example manquant |
| BUG-011 | INFO | ⏳ Backlog | Bundle 842KB sans code splitting |
