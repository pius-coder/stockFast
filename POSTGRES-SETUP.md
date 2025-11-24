# 🐘 Configuration PostgreSQL - stockFast

## ✅ Conteneur Docker Créé

Le conteneur PostgreSQL a été créé et démarré avec succès:

```bash
Nom du conteneur: stockfast_postgres
Image: postgres:16-alpine
Port: 5234 (host) → 5432 (conteneur)
Status: ✅ Running
```

## 📋 Variables d'Environnement

**IMPORTANT:** Vous devez créer/mettre à jour votre fichier `.env` avec ces variables:

```bash
# Copiez ces lignes dans votre fichier .env
DATABASE_URL="postgresql://stockfast_user:stockfast_password_2025@localhost:5234/stockfast_dev"
BETTER_AUTH_SECRET="your-secret-key-here-change-in-production"
BETTER_AUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

## 🔧 Commandes Docker Utiles

### Vérifier le statut du conteneur
```bash
docker ps | grep stockfast
```

### Arrêter le conteneur
```bash
docker stop stockfast_postgres
```

### Démarrer le conteneur
```bash
docker start stockfast_postgres
```

### Voir les logs
```bash
docker logs stockfast_postgres
```

### Se connecter au conteneur
```bash
docker exec -it stockfast_postgres psql -U stockfast_user -d stockfast_dev
```

### Supprimer le conteneur (ATTENTION: supprime les données)
```bash
docker stop stockfast_postgres
docker rm stockfast_postgres
docker volume rm stockfast_postgres_data
```

## 🚀 Prochaines Étapes

### 1. Créer le fichier .env

```bash
# Copiez env.example vers .env
cp env.example .env

# OU créez manuellement le fichier .env avec le contenu ci-dessus
```

### 2. Exécuter les migrations Prisma

```bash
pnpm prisma migrate dev --name init
```

Cette commande va:
- Créer toutes les tables dans PostgreSQL
- Générer les fichiers de migration
- Appliquer les migrations

### 3. Tester la connexion

```bash
pnpm tsx prisma/test-connection.ts
```

### 4. (Optionnel) Seed la base de données

```bash
pnpm prisma db seed
```

## 📊 Informations de Connexion

| Paramètre | Valeur |
|-----------|--------|
| **Host** | localhost |
| **Port** | 5234 |
| **Database** | stockfast_dev |
| **User** | stockfast_user |
| **Password** | stockfast_password_2025 |
| **Connection String** | `postgresql://stockfast_user:stockfast_password_2025@localhost:5234/stockfast_dev` |

## ✅ Vérification de la Connexion

Pour vérifier que PostgreSQL fonctionne correctement:

```bash
# Test 1: Vérifier que le conteneur est en cours d'exécution
docker ps | grep stockfast_postgres

# Test 2: Vérifier que PostgreSQL accepte les connexions
docker exec stockfast_postgres pg_isready -U stockfast_user -d stockfast_dev

# Test 3: Se connecter à la base de données
docker exec -it stockfast_postgres psql -U stockfast_user -d stockfast_dev
```

## 🔐 Sécurité

**⚠️ IMPORTANT pour la production:**

1. Changez le mot de passe PostgreSQL
2. Générez un nouveau `BETTER_AUTH_SECRET` sécurisé
3. Ne commitez JAMAIS le fichier `.env` dans Git
4. Utilisez des variables d'environnement sécurisées en production

---

**Status:** ✅ PostgreSQL est prêt et en attente des migrations Prisma
