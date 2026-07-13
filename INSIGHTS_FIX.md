# Fix : Page Insights affiche un article fallback au lieu des vrais articles Supabase

## Diagnostic

### Problème observé
La page Insights (circle.retbaa.com/insights) affichait un unique article **fallback statique** (`FALLBACK_ARTICLES`) au lieu de charger les vrais articles de la table Supabase `insights`.

### Causes racines identifiées

#### 1. **RLS (Row Level Security) trop restrictive** — BLOCAGE PRINCIPAL
- **Fichier :** `scripts/migrate-insights.sql`, lignes 35-40
- **Politique actuelle :** `"insights_read_authenticated"` autorise UNIQUEMENT les utilisateurs `authenticated` (connectés via session)
- **Problème :** La clé Supabase utilisée côté client est la clé **anon** (anonyme), qui n'a pas les permissions d'accès
- **Résultat :** Requête silencieusement rejetée → `data = null` → fallback déclenché après 2s de retry

#### 2. **Désynchronisation colonnes — BUG SECONDAIRE**
- **Fichier :** `src/pages/InsightsPage.jsx`, ligne 87
- **Bug :** Code utilise `article.content` au lieu de `article.content_md`
- **Impact :** Quand les vrais articles se chargent, le contenu markdown ne s'affiche pas correctement dans la modal

#### 3. **Absence de politique publique**
- La table `insights` a RLS activée mais aucune policy n'autorise l'accès public (`TO anon`)
- Les articles publiés devraient être accessibles sans authentification

---

## Solution appliquée

### Changement 1 : Fix du code (InsightsPage.jsx:87)
```diff
- {renderMarkdown(article.content)}
+ {renderMarkdown(article.content_md)}
```

**Commit :** Correction de la propriété `content_md` utilisée dans la modal article.

### Changement 2 : Corriger la RLS (à exécuter dans Supabase SQL Editor)

**Fichier :** `scripts/fix-insights-rls.sql`

**Actions :**
1. Supprimer la policy `"insights_read_authenticated"` (trop restrictive)
2. Créer une policy `"insights_read_anon"` qui autorise les `anon` à lire les articles `published = true`
3. Recréer la policy `"insights_read_authenticated"` pour cohérence

**Résultat :** Les deux cas d'usage sont maintenant supportés :
- Utilisateurs anonymes (site public) → accès aux articles publiés via clé `anon`
- Utilisateurs authentifiés (futur) → accès aux articles publiés via session

---

## Comment appliquer le fix

### Étape 1 : Deployer le fix code
```bash
git add src/pages/InsightsPage.jsx
git commit -m "Fix: Use article.content_md instead of article.content in modal

- Resolve undefined markdown content in article modals
- Align with actual schema column naming
- Co-Authored-By: Claude Sonnet <noreply@anthropic.com>"

git push origin main
```

### Étape 2 : Exécuter la migration RLS dans Supabase
1. Ouvrir [Supabase Dashboard](https://app.supabase.com) → Projet `lufozqtrwrmowzojxcoi`
2. Aller à **SQL Editor** → **New Query**
3. Copier le contenu de `scripts/fix-insights-rls.sql`
4. Exécuter la query
5. Vérifier que les policies sont créées (la query final affiche les 2 policies)

### Étape 3 : Tester
```bash
# Via console du navigateur sur circle.retbaa.com/insights
// Devrait voir dans les logs :
// [Insights] Résultat: 17 articles
// [Insights] Succès: mappé 17 articles

# Au lieu du log actuel :
// [Insights] Résultat: 0 articles
// [Insights] Utilisation du fallback après erreur
```

---

## Architecture du problème

```
┌─────────────────────────────────────────────────────────────┐
│ Client Browser (anonyme)                                    │
│  • supabase.js utilise VITE_SUPABASE_ANON_KEY              │
│  • InsightsPage.jsx appelle supabase.from('insights').select() │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP Request with anon key
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Supabase REST API                                           │
│ POST /rest/v1/insights?select=...&published=eq.true        │
│ Authorization: Bearer <anon_key>                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Supabase RLS Engine                                         │
│                                                              │
│ Policy check: user role = "anon"                            │
│ ├─ Policy "insights_read_authenticated"                     │
│ │   TO authenticated USING (published = true)               │
│ │   ❌ DENIES (user role ≠ authenticated)                  │
│ │                                                            │
│ └─ Policy "insights_read_anon" [MISSING]                   │
│     TO anon USING (published = true)                        │
│     ✓ WOULD ALLOW if present                               │
│                                                              │
│ Result: Access Denied → 401 Unauthorized or empty result   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Client Browser                                              │
│  • data = null, error = null (silent rejection)            │
│  • Code sees data.length = 0 → triggers FALLBACK           │
│  • User sees static article instead of 17 real articles    │
└─────────────────────────────────────────────────────────────┘
```

**Après le fix :**
- Policy `"insights_read_anon"` est créée
- Utilisateurs anon passent la vérification RLS
- 17 articles sont retournés
- Page affiche les vrais articles

---

## Vérification post-fix

1. **Logs console :**
   ```
   [Insights] Chargement articles (tentative 1)...
   [Insights] Résultat: 17 articles
   [Insights] Succès: mappé 17 articles
   ```

2. **Articles visibles :**
   - Featured article en haut (Hermès vs LVMH)
   - Grille 3 colonnes avec 16 autres articles
   - Filtres "Tout", "Vision", "Veille Marché", etc. remplis

3. **Modal article :**
   - Cliquer sur un article affiche sa modal
   - Contenu markdown s'affiche correctement (titres, listes, images)
   - Lien source original fonctionne

---

## Fichiers modifiés

- `src/pages/InsightsPage.jsx` — Bug fix ligne 87
- `scripts/fix-insights-rls.sql` — Migration RLS (nouveau)
- `INSIGHTS_FIX.md` — Ce document (nouveau)

---

**Status:** Prêt à déployer. Étapes :
1. Push du commit code
2. Exécution manuelle de `fix-insights-rls.sql` dans Supabase SQL Editor
3. Refresh de la page → Insights devrait charger les 17 articles réels
