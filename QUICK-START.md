# 🚀 Guide de Démarrage - stockFast

**Dernière mise à jour:** 23 novembre 2025

---

## ✅ État Actuel

**Sprint 1 TERMINÉ** - Infrastructure et Authentification complètes

### Ce qui fonctionne:
- ✅ PostgreSQL opérationnel (port 5234)
- ✅ Prisma configuré avec 8 modèles
- ✅ BetterAuth configuré (serveur + client)
- ✅ Formulaires d'authentification (français)
- ✅ Pages sign-in/sign-up
- ✅ Dashboard de base
- ✅ Protection des routes

---

## 🎯 Démarrage Rapide

### 1. Configuration Initiale

```bash
# Copier les variables d'environnement
cp env.example .env

# Éditer .env et générer un secret sécurisé pour BETTER_AUTH_SECRET
# Minimum 32 caractères recommandés
```

### 2. Base de Données

```bash
# Le conteneur PostgreSQL est déjà en cours d'exécution
# Vérifier le statut
docker ps | grep stockfast

# Si arrêté, démarrer
docker start stockfast_postgres

# Exécuter les migrations Prisma
pnpm prisma migrate dev --name init

# Générer le client Prisma (déjà fait)
pnpm prisma generate

# Tester la connexion
pnpm tsx prisma/test-connection.ts
```

### 3. Démarrer l'Application

```bash
# Installer les dépendances (si nécessaire)
pnpm install

# Démarrer en mode développement
pnpm dev
```

### 4. Accéder à l'Application

```
🌐 Application: http://localhost:3000
📊 Prisma Studio: pnpm prisma studio
🗄️  PostgreSQL: localhost:5234
```

---

## 📋 Première Utilisation

### 1. Créer un Compte

1. Ouvrir http://localhost:3000
2. Vous serez redirigé vers `/sign-in`
3. Cliquer sur "Créer un compte"
4. Remplir le formulaire:
   - Nom complet
   - Email
   - Mot de passe (min 8 caractères)
   - Confirmer le mot de passe
5. Cliquer sur "Créer un compte"
6. Vous serez redirigé vers `/dashboard`

### 2. Explorer le Dashboard

Le dashboard affiche:
- Total Produits (0 pour l'instant)
- Ventes du jour (0)
- CA du mois (0 FCFA)
- Alertes Stock (0)

### 3. Prochaines Fonctionnalités

Les liens suivants seront implémentés dans Sprint 2:
- `/products` - Liste des produits
- `/products/new` - Ajouter un produit
- `/sales` - Gestion des ventes
- `/stock` - Gestion du stock

---

## 🔧 Commandes Utiles

### Développement

```bash
# Démarrer le serveur de développement
pnpm dev

# Linter
pnpm lint

# Build de production
pnpm build

# Démarrer en production
pnpm start
```

### Base de Données

```bash
# Prisma Studio (interface graphique)
pnpm prisma studio

# Créer une nouvelle migration
pnpm prisma migrate dev --name nom_de_la_migration

# Réinitialiser la base de données (ATTENTION: supprime toutes les données)
pnpm prisma migrate reset

# Voir le statut des migrations
pnpm prisma migrate status

# Générer le client Prisma
pnpm prisma generate
```

### Docker

```bash
# Voir les conteneurs en cours
docker ps

# Démarrer PostgreSQL
docker start stockfast_postgres

# Arrêter PostgreSQL
docker stop stockfast_postgres

# Voir les logs
docker logs stockfast_postgres

# Accéder au shell PostgreSQL
docker exec -it stockfast_postgres psql -U stockfast_user -d stockfast_dev
```

---

## 🗂️ Structure des Fichiers Importants

```
stockFast/
├── .env                          # ⚠️ À créer (copier depuis env.example)
├── env.example                   # Template des variables d'environnement
│
├── app/
│   ├── (auth)/                   # Pages d'authentification
│   │   ├── sign-in/page.tsx     # Page de connexion
│   │   └── sign-up/page.tsx     # Page d'inscription
│   │
│   ├── api/auth/[...all]/        # API BetterAuth
│   │   └── route.ts
│   │
│   └── dashboard/                # Dashboard principal
│       ├── layout.tsx
│       └── page.tsx
│
├── lib/
│   ├── auth.ts                   # Configuration BetterAuth serveur
│   ├── auth-client.ts            # Configuration BetterAuth client
│   └── prisma.ts                 # Client Prisma singleton
│
├── middleware.ts                 # Protection des routes
│
├── prisma/
│   ├── schema.prisma             # Schéma de la base de données
│   └── test-connection.ts        # Script de test
│
└── Documentation/
    ├── CODEBASE-ANALYSIS.md      # Analyse complète du code
    ├── POSTGRES-SETUP.md         # Configuration PostgreSQL
    ├── AUTH-ADAPTATION.md        # Adaptation authentification
    ├── SPRINT-1-COMPLETE.md      # Rapport Sprint 1
    └── QUICK-START.md            # Ce fichier
```

---

## 🔐 Variables d'Environnement

### Obligatoires

```env
# Base de données
DATABASE_URL="postgresql://stockfast_user:stockfast_password_2025@localhost:5234/stockfast_dev"

# BetterAuth (générer un secret sécurisé)
BETTER_AUTH_SECRET="votre-secret-min-32-caracteres-ici"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
```

### Optionnelles

```env
# Google OAuth (pour connexion avec Google)
GOOGLE_CLIENT_ID="votre-google-client-id"
GOOGLE_CLIENT_SECRET="votre-google-client-secret"
```

---

## 🐛 Dépannage

### Problème: "Cannot connect to database"

```bash
# Vérifier que PostgreSQL est en cours d'exécution
docker ps | grep stockfast_postgres

# Si arrêté, démarrer
docker start stockfast_postgres

# Vérifier la connexion
docker exec stockfast_postgres pg_isready -U stockfast_user -d stockfast_dev
```

### Problème: "Prisma Client not generated"

```bash
# Générer le client Prisma
pnpm prisma generate
```

### Problème: "Module not found"

```bash
# Réinstaller les dépendances
rm -rf node_modules
pnpm install
```

### Problème: "Port 3000 already in use"

```bash
# Utiliser un autre port
PORT=3001 pnpm dev
```

---

## 📚 Documentation Complète

Pour plus de détails, consultez:

1. **CODEBASE-ANALYSIS.md** - Analyse complète de l'architecture
2. **POSTGRES-SETUP.md** - Configuration PostgreSQL détaillée
3. **AUTH-ADAPTATION.md** - Détails sur l'authentification
4. **SPRINT-1-COMPLETE.md** - Rapport complet du Sprint 1

---

## 🎯 Prochaines Étapes

### Sprint 2: Gestion des Produits

1. **Créer ProductService**
   - CRUD complet
   - Validation des données
   - Gestion des images

2. **Créer les API Routes**
   - `/api/products` - Liste et création
   - `/api/products/[id]` - Détails, mise à jour, suppression

3. **Créer les Pages**
   - `/products` - Liste des produits
   - `/products/new` - Ajouter un produit
   - `/products/[id]` - Détails du produit

4. **Implémenter QR-Code**
   - Génération automatique
   - Téléchargement PNG
   - Scan et lecture

---

## ✅ Checklist de Démarrage

- [ ] Copier `env.example` vers `.env`
- [ ] Générer un `BETTER_AUTH_SECRET` sécurisé
- [ ] Vérifier que PostgreSQL est en cours d'exécution
- [ ] Exécuter `pnpm prisma migrate dev --name init`
- [ ] Tester la connexion avec `pnpm tsx prisma/test-connection.ts`
- [ ] Démarrer l'application avec `pnpm dev`
- [ ] Créer un compte sur http://localhost:3000
- [ ] Explorer le dashboard

---

## 🆘 Support

En cas de problème:

1. Vérifier les logs de l'application
2. Vérifier les logs PostgreSQL: `docker logs stockfast_postgres`
3. Consulter la documentation dans les fichiers `.md`
4. Vérifier que toutes les variables d'environnement sont définies

---

**Bon développement avec stockFast!** 🚀

*Guide créé le 23/11/2025*
