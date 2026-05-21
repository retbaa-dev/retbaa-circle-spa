# Retbaa Circle — Agent Skill
*Stack, design system et patterns pour coder sur retbaa-dev/retbaa-circle-spa*

## Stack
- React 19 + Vite 8 + Tailwind 4
- Auth : Clerk (en cours de migration → Supabase magic link)
- Hosting : Vercel (SPA statique — pas de serveur Node en prod)
- i18n : react-i18next (FR/EN)
- Repo : retbaa-dev/retbaa-circle-spa

## Design System — NON-NÉGOCIABLE
```
Royal Blue    #1A3A6B  → titres, CTAs, sidebar, chiffres clés
Rose Trim     #EFC0D4  → accents, bordures-left, hover states
Rose Soft     #F7DDE7  → backgrounds secondaires
Cream         #FAF7F2  → fond principal (JAMAIS blanc pur #FFFFFF)
Ink           #1A1A1A  → texte (JAMAIS noir pur #000000)
Green         #1E6B4A  → statut validé
Orange        #C8650A  → statut en attente
Red           #ba1a1a  → statut erreur/upload requis

Font          Newsreader (serif, titres, italic) + Manrope (sans, body)
Radius        4px partout
Espacement    Multiple de 4px
```

### Anti-patterns → PR rejetée
- ❌ Blanc pur `#FFFFFF` comme fond principal
- ❌ Noir pur `#000000`
- ❌ Gradient violet/rose "tech startup"
- ❌ Emojis dans messages système
- ❌ Plus de 2 familles typographiques
- ❌ Librairies lourdes sans justification

## Architecture des pages
```
src/pages/
├── LoginPage (ClerkLoginPage) — auth, design 2 colonnes premium
├── Dashboard — KPIs investisseur
├── DocumentsPage — liste docs avec preview/signature/upload
├── InsightsPage — veille éditoriale
├── PodcastPage — Inner Circle (5 épisodes)
├── MonInvestissementPage — détail par investisseur
├── InnerCirclePage — espace exclusif
├── Tranche2Page — appel tranche 2
├── AdminPage — validation investisseurs (founder only)
├── AnalyticsPage — tracking pages/podcasts (Supabase page_views)
├── ObservateurDashboard — vue prospect
├── BienvenueOnboarding — onboarding nouvel investisseur
└── ProspectGatePage — formulaire observateur

src/components/
├── Sidebar (288px, fixe desktop, slide mobile)
├── Header (64px, fixe)
├── Footer
├── KPICard
├── DocumentCard
└── Timeline
```

## Rôles utilisateurs (Clerk publicMetadata → migration Supabase)
| Rôle | Accès |
|------|-------|
| founder / admin | Tout + AdminPage + AnalyticsPage |
| active | Dashboard, Documents, Insights, Inner Circle |
| assistant | Accès délégué lecture seule (linkedTo: investisseur) |
| pending | PendingPage uniquement |

## Patterns importants

### Mobile-first obligatoire
```jsx
const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
useEffect(() => {
  const h = () => setIsMobile(window.innerWidth < 768)
  window.addEventListener('resize', h)
  return () => window.removeEventListener('resize', h)
}, [])
```

### Mode preview (bypass auth en dev)
```
?preview=massata&token=retbaa-dev-2026
```
→ Bypass total Clerk, pas d'auth. Conserver dans toute migration.

### Statuts documents
```
sign      → À signer (id 1, 2 : Pacte V3 + Statuts)
upload    → À fournir (id 12, 13, 15, 16, 17 : KYC)
validated → Validé (docs corporate/finance)
pending   → En attente (après action utilisateur)
```

### localStorage persistence
```js
// Signatures
localStorage.setItem(`retbaa_signed_${userId}_${docId}`, JSON.stringify({...}))
// Uploads
localStorage.setItem(`retbaa_uploaded_${userId}_${docId}`, 'true')
// docStatuses chargé au mount depuis localStorage
```

## Vercel — Variables d'environnement
```
VITE_CLERK_PUBLISHABLE_KEY     (à supprimer après migration Supabase)
VITE_SUPABASE_URL              https://lufozqtrwrmowzojxcoi.supabase.co
VITE_SUPABASE_ANON_KEY         [depuis Supabase Settings → API]
```

## Commandes utiles
```bash
npm run dev       # dev local (port 5173)
npm run build     # build prod
npm run preview   # preview build
```

## Pièges connus
- Vercel est **static** — aucune API Node en prod (/api/track, /api/stats, /api/admin/* ne fonctionnent pas)
- Clerk instable hors crédits Genspark → migration Supabase en cours
- allDocs[] dans DocumentsPage.jsx est statique — ne pas connecter à Supabase sans ADR
