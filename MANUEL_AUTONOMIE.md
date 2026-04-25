# Manuel d'autonomie — Retbaa Circle
## Guide pas à pas pour gérer le portail sans Kemia

**Pour qui :** Massata Niang, sans bagage technique
**Dernière mise à jour :** 25 avril 2026
**Objectif :** Être totalement autonome sur le portail via Claude Max / Claude Code

---

## 1. VUE D'ENSEMBLE — Ce que tu gères

```
Ton Mac
  └── SSH ou VNC → VM Genspark (20.214.160.202)
                      ├── Code source  → /home/work/.openclaw/workspace/retbaa-circle/
                      ├── Site live    → /var/www/retbaa-circle/
                      ├── GitHub       → github.com/retbaa-dev/retbaa-circle-spa
                      └── Docuseal     → http://20.214.160.202:8080
```

**Le principe :** tu modifies le code source → tu déploies → le site est mis à jour en 30 secondes.

---

## 2. ACCÈS À LA VM

### Option A — Via le navigateur (VNC, sans installation)
1. Ouvre : `https://massata-657851de-2031-vm.koreacentral.cloudapp.azure.com:8443`
2. Tu vois un bureau Linux avec un terminal
3. Ouvre le terminal (clic droit sur le bureau → Terminal)

### Option B — Via SSH depuis ton Mac (plus confortable)
```bash
# Dans le terminal de ton Mac :
ssh work@20.214.160.202
```
> Si ça dit "Permission denied" → utilise l'option VNC

---

## 3. ACCÉDER AU CODE AVEC CLAUDE CODE

Claude Code est un assistant IA directement dans le terminal qui peut lire, modifier et déployer le code pour toi.

### Lancer Claude Code
```bash
# Dans le terminal de la VM :
cd /home/work/.openclaw/workspace/retbaa-circle
claude
```

### Ce que tu peux lui dire (en français, en langage naturel)
- "Change la couleur du bouton Connexion en bleu marine"
- "Ajoute un nouveau document PDF dans la liste"
- "Le bouton X ne fonctionne pas, corrige-le"
- "Déploie les changements"

Claude Code lit les fichiers, fait les modifications, et tu valides avant qu'il déploie.

### Quitter Claude Code
```
/exit
```

---

## 4. DÉPLOYER DES CHANGEMENTS

Après toute modification, une seule commande :

```bash
cd /home/work/.openclaw/workspace/retbaa-circle
./deploy.sh
```

C'est tout. Le script :
1. Compile le code (30 secondes)
2. Nettoie l'ancien site
3. Copie le nouveau
4. Le site est live immédiatement

> ⚠️ **Toujours déployer après une modification** — sinon les changements ne sont pas visibles.

---

## 5. SAUVEGARDER SUR GITHUB

Après chaque modification importante :

```bash
cd /home/work/.openclaw/workspace/retbaa-circle
git add -A
git commit -m "Description de ce que tu as changé"
git push origin main
```

**Exemple :**
```bash
git commit -m "Ajout document KYC dans la page Documents"
```

> GitHub = ton backup. Si la VM plante, le code est toujours là.

---

## 6. ENVOYER UNE INVITATION À UN INVESTISSEUR

```bash
curl -s -X POST "http://localhost:3002/admin/invite" \
  -H "Content-Type: application/json" \
  -d '{"investorKey": "barthelemy", "adminSecret": "retbaa-admin-2026"}'
```

**Remplace `barthelemy` par :**
- `barthelemy` → Barthélemy Faye
- `pape` → Pape Amadou Ngom
- `cathy` → Cathy Muiza
- `raphael` → Raphaël Perdrix

**Le résultat :**
```json
{
  "link": "https://circle.retbaa.com/invite/XXXX...",
  "investor": { "name": "Barthélemy Faye", ... }
}
```

Tu copies le lien et tu l'envoies manuellement à l'investisseur par email ou SMS.

> ⚠️ L'envoi automatique par email nécessite que Gmail soit reconnecté sur genspark.ai

---

## 7. VÉRIFIER QUE TOUT FONCTIONNE

```bash
# État des services
pm2 status

# Résultat attendu :
# retbaa-upload  → online (port 3001)
# retbaa-admin   → online (port 3002)
# retbaa-webhook → online (port 3003)
# Docuseal       → voir plus bas
```

```bash
# Vérifier Docuseal
sudo docker ps | grep docuseal
# Doit afficher : Up X hours
```

```bash
# Redémarrer un service si nécessaire
pm2 restart retbaa-admin
pm2 restart retbaa-upload
```

---

## 8. MODIFIER UN DOCUMENT DANS LA LISTE

Le fichier à modifier : `src/pages/DocumentsPage.jsx`

### Ajouter un nouveau PDF
1. Copie ton PDF dans : `public/docs/legal/mon-document.pdf`
2. Ouvre `DocumentsPage.jsx` avec Claude Code et dis-lui :
   > "Ajoute un document appelé 'Mon Titre', type 'Juridique', date 'Mai 2026', status 'signed', fichier '/docs/legal/mon-document.pdf'"
3. Déploie : `./deploy.sh`

### Changer le statut d'un document (ex: "à signer" → "signé")
Dans `DocumentsPage.jsx`, cherche le document et change :
```
status: 'sign'    →   status: 'signed'
```

---

## 9. ERREURS FRÉQUENTES ET SOLUTIONS

### ❌ Page blanche sur circle.retbaa.com
**Cause :** Anciens fichiers JS qui traînent dans /var/www/
**Solution :**
```bash
cd /home/work/.openclaw/workspace/retbaa-circle && ./deploy.sh
```
Le script `deploy.sh` nettoie automatiquement — ce problème ne devrait plus arriver.

---

### ❌ "Cannot find module" au build
**Cause :** Une dépendance manquante
**Solution :**
```bash
cd /home/work/.openclaw/workspace/retbaa-circle
npm install
./deploy.sh
```

---

### ❌ PM2 — un service est "errored" ou "stopped"
**Solution :**
```bash
pm2 logs retbaa-admin --lines 20   # voir l'erreur
pm2 restart retbaa-admin           # redémarrer
```

---

### ❌ Docuseal inaccessible (http://20.214.160.202:8080)
**Solution :**
```bash
sudo docker ps | grep docuseal
# Si absent :
sudo docker start docuseal
# Si ça ne suffit pas :
sudo docker run -d --name docuseal -p 3004:3000 \
  -v /home/work/.docuseal:/data docuseal/docuseal:latest
```

---

### ❌ Email d'invitation non envoyé — "invalid_grant"
**Cause :** Token Gmail expiré
**Solution :**
1. Va sur genspark.ai → Settings → Connected Accounts
2. Reconnecte massata@retbaa.com (Google)
3. Reteste l'envoi

---

### ❌ Erreur SSH "Permission denied (publickey)"
**Solution :** Utilise le VNC à la place :
`https://massata-657851de-2031-vm.koreacentral.cloudapp.azure.com:8443`

---

### ❌ "Build failed" après une modification
**Cause :** Erreur de syntaxe dans le code
**Solution :**
```bash
# Voir l'erreur exacte
cd /home/work/.openclaw/workspace/retbaa-circle && npm run build
```
Claude Code peut corriger automatiquement si tu lui montres l'erreur.

---

### ❌ Un investisseur ne voit pas son dashboard
**Cause :** Son compte n'a pas été validé (status: pending)
**Solution :** Dans le terminal :
```bash
# Lister les comptes en attente
curl -s "http://localhost:3002/admin/users/pending?adminSecret=retbaa-admin-2026"

# Valider un compte (remplace USER_ID par l'id Clerk)
curl -s -X POST "http://localhost:3002/admin/users/USER_ID/approve" \
  -H "Content-Type: application/json" \
  -d '{"adminSecret": "retbaa-admin-2026"}'
```

---

## 10. UTILISER CLAUDE PROJECTS (sans la VM)

Si tu n'as plus accès à la VM mais que tu as Claude Max :

### Préparer le contexte
1. Clone le repo sur ton Mac :
   ```bash
   git clone https://github.com/retbaa-dev/retbaa-circle-spa.git
   ```
2. Dans Claude Projects, crée un projet "Retbaa Circle"
3. Upload les fichiers clés : `src/pages/*.jsx`, `server/admin.js`

### Ce que tu peux faire sans VM
- Modifier les textes, couleurs, données
- Ajouter des documents à la liste
- Corriger des bugs visuels
- Préparer des changements à déployer plus tard

### Ce qui nécessite la VM
- Déploiement live
- Envoi d'emails
- Gestion des comptes investisseurs

---

## 11. UTILISER CLAUDE CODE EN LOCAL (Mac)

Si tu veux travailler directement depuis ton Mac :

### Installation
```bash
# Dans le terminal de ton Mac :
npm install -g @anthropic-ai/claude-code
```

### Utilisation
```bash
cd retbaa-circle-spa
claude
```

Pareil qu'en mode VM — tu lui parles en français, il modifie le code.

---

## 12. FICHIERS IMPORTANTS À CONNAÎTRE

| Fichier | Rôle |
|---------|------|
| `src/pages/Dashboard.jsx` | Page d'accueil investisseur |
| `src/pages/DocumentsPage.jsx` | Liste des documents |
| `src/pages/MonInvestissementPage.jsx` | Détail de l'investissement |
| `src/pages/InvitePage.jsx` | Page de création de compte |
| `server/admin.js` | Serveur : invitations, emails, Docuseal |
| `public/docs/legal/` | Dossier des PDFs |
| `.env.server` | Mots de passe (NE PAS PARTAGER) |
| `deploy.sh` | Script de déploiement |
| `MANUEL_AUTONOMIE.md` | Ce fichier |

---

## 13. CONTACTS ET ACCÈS

| Élément | Valeur |
|---------|--------|
| VM IP | 20.214.160.202 |
| VM user | work |
| VNC | https://massata-657851de-2031-vm.koreacentral.cloudapp.azure.com:8443 |
| Site live | https://circle.retbaa.com |
| GitHub | https://github.com/retbaa-dev/retbaa-circle-spa |
| Docuseal | http://20.214.160.202:8080 |
| Admin secret | retbaa-admin-2026 |
| Clerk dashboard | https://dashboard.clerk.com |

---

## 14. CHECKLIST MENSUELLE (maintenance)

- [ ] `git pull` pour synchroniser si tu as travaillé depuis plusieurs endroits
- [ ] `pm2 status` — tous les services sont online
- [ ] `sudo docker ps` — Docuseal tourne
- [ ] Vérifier que circle.retbaa.com charge normalement
- [ ] GitHub à jour avec les derniers changements
- [ ] Trello mis à jour avec les évolutions

---

## 15. EN CAS D'URGENCE — Repartir de zéro

Si tout est cassé et que tu veux repartir du backup GitHub :

```bash
# Sur la VM :
cd /home/work/.openclaw/workspace
git clone https://github.com/retbaa-dev/retbaa-circle-spa.git retbaa-circle-new
cd retbaa-circle-new
npm install
./deploy.sh
```

Le site est restauré en 2 minutes depuis GitHub.

---

*Ce manuel est maintenu dans le repo GitHub. Toute mise à jour du code doit s'accompagner d'une mise à jour de ce manuel si nécessaire.*

---

## 16. CLAUDE COWORK ET DISPATCH — Guide pour Massata

> **Résumé :** Cowork = Claude Code avec une interface visuelle, sans terminal. Dispatch = déclencher Cowork depuis ton téléphone. Les deux sont inclus dans ton abonnement Claude Max.

---

### 16.1 C'est quoi exactement ?

| Outil | Ce que c'est | Pour quoi |
|-------|-------------|-----------|
| **Claude Code** | Claude dans le terminal | Modifier le code, déployer |
| **Claude Cowork** | Claude Code avec interface visuelle | Même chose, sans terminal |
| **Dispatch** | Déclencheur mobile pour Cowork | Lancer des tâches depuis ton téléphone |
| **Claude Projects** | Contexte persistant par projet | Retbaa Circle = un projet avec tout son contexte |

---

### 16.2 Installation — Claude Desktop (Mac)

1. Télécharge **Claude Desktop** : https://claude.ai/download
2. Connecte-toi avec ton compte Claude Max (massata@retbaa.com)
3. Dans l'app, clique sur **"Cowork"** dans la barre latérale

C'est tout. Cowork est inclus dans Max. Pas d'installation supplémentaire.

---

### 16.3 Configurer le projet Retbaa Circle dans Cowork

1. Ouvre Claude Desktop → Cowork
2. Clique **"New Project"**
3. Pointe vers le dossier du repo cloné sur ton Mac :
   ```
   /Users/massata/retbaa-circle-spa  (ou là où tu as cloné)
   ```
4. Dans les instructions du projet, colle ceci :
   ```
   Tu travailles sur le portail investisseurs Retbaa Circle.
   Stack : React 19 + Vite + Clerk auth + Express PM2 + Caddy + Docuseal.
   Site live : https://circle.retbaa.com
   VM : work@20.214.160.202
   Deploy : ./deploy.sh
   Ne jamais modifier MEMORY.md, SOUL.md, AGENTS.md, TOOLS.md.
   Demander validation avant tout changement d'architecture ou d'auth.
   ```

Désormais chaque session dans ce projet a tout le contexte sans te répéter.

---

### 16.4 Ce que tu peux faire avec Cowork (en langage naturel)

**Modifications visuelles :**
> "Change la couleur du titre de la page Documents en rouge bordeaux"

**Ajout de contenu :**
> "Ajoute Raphaël Perdrix dans la liste des investisseurs avec 1250 actions"

**Corrections de bugs :**
> "Le bouton Ouvrir sur mobile ne fonctionne pas, corrige-le"

**Déploiement :**
> "Déploie les changements sur la VM en SSH"

---

### 16.5 Dispatch — Travailler depuis ton téléphone

Dispatch te permet de déclencher Cowork depuis ton iPhone sans ouvrir ton Mac.

#### Setup (1 minute)
1. Installe l'app **Claude** sur ton iPhone
2. Va dans la section **Cowork** → **Dispatch**
3. Appaire avec ton Mac (QR code, 60 secondes)

⚠️ **Condition :** ton Mac doit être allumé et Claude Desktop ouvert.

#### Exemples d'utilisation
Depuis ton téléphone, tu envoies :
- "Envoie le lien d'invitation à Barthélemy" → Cowork exécute sur ton Mac
- "Vérifie que le portail fonctionne" → prend un screenshot, te répond
- "Déploie les derniers changements" → lance ./deploy.sh

---

### 16.6 Scheduled Tasks — Automatiser sans y penser

Dans Cowork → **Scheduled** → **+ New Task**

**Exemple de tâche utile pour Retbaa Circle :**
```
Tous les lundis à 9h :
- Vérifie que circle.retbaa.com charge correctement
- Vérifie que pm2 status montre tous les services online
- Vérifie que Docuseal est accessible sur le port 8080
- Envoie-moi un résumé par email
```

---

### 16.7 Canaux Telegram (optionnel mais puissant)

Claude Code peut envoyer ses résultats directement dans Telegram plutôt que d'attendre que tu consultes le terminal.

**Setup :**
1. Crée un bot Telegram via @BotFather
2. Dans Claude Code, tape : `/channel telegram`
3. Donne le token du bot

**Usage :** Lance une tâche longue (ex: analyse de logs), va boire un café, reçois le résultat sur Telegram.

---

### 16.8 Ce qui ne change PAS avec Cowork

Cowork ne remplace pas la VM. Pour déployer sur le site live, tu as toujours besoin d'un accès à la VM (via SSH depuis ton Mac ou depuis Cowork directement si tu configures une connexion SSH).

**Workflow recommandé :**
1. Modifie le code avec Cowork sur ton Mac (en local)
2. Teste en local : `npm run dev`
3. Commit et push sur GitHub
4. Connecte-toi à la VM (SSH ou VNC)
5. `git pull && ./deploy.sh`

Ou si tu configures Cowork avec accès SSH à la VM, il peut déployer directement.

---

### 16.9 Comparatif — Comment travailler selon les cas

| Situation | Outil recommandé |
|-----------|-----------------|
| Petite correction visuelle | Cowork sur ton Mac |
| Modification de données (investisseurs) | Cowork sur ton Mac |
| Déploiement live | SSH vers VM + ./deploy.sh |
| Tâche urgente depuis le téléphone | Dispatch |
| Analyse de problème complexe | Claude Projects (contexte complet) |
| Plus d'accès à la VM | Cowork en local + GitHub |
| Urgence totale | Restauration depuis GitHub (section 15) |

---

### 16.10 Pour être 100% autonome — Checklist finale

- [ ] Claude Desktop installé sur Mac
- [ ] Projet "Retbaa Circle" créé dans Cowork avec les instructions
- [ ] Repo cloné sur ton Mac : `git clone https://github.com/retbaa-dev/retbaa-circle-spa.git`
- [ ] SSH configuré vers la VM (ou utilise VNC)
- [ ] Dispatch appairé avec ton iPhone
- [ ] Gmail reconnecté sur genspark.ai (pour les emails d'invitation)
- [ ] Tu as lu les sections 3, 4, 5 de ce manuel

**Temps estimé pour tout configurer : 30 minutes.**

