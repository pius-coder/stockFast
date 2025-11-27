# 🔐 Adaptation de l'Authentification pour stockFast

**Date:** 23 novembre 2025  
**Sprint:** Sprint 1 - Infrastructure et Authentification  
**User Story:** US01-002 - Gestion des utilisateurs

---

## ✅ Modifications Effectuées

### 1. **Création du Client BetterAuth**

**Fichier créé:** `lib/auth-client.ts`

```typescript
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
})
```

- Configuration centralisée pour BetterAuth
- Support des variables d'environnement
- Export nommé pour faciliter l'utilisation

---

### 2. **Adaptation des Formulaires d'Authentification**

#### **Sign-In Form** (`src/entities/auth/components/sign-in-form.tsx`)

**Modifications:**
- ✅ Textes traduits en français
- ✅ Titre: "Connexion"
- ✅ Description: "Entrez votre email pour accéder à votre compte stockFast"
- ✅ Bouton: "Se connecter" / "Connexion en cours..."
- ✅ Messages de succès: "Connexion réussie! Bienvenue sur stockFast"
- ✅ Messages d'erreur en français
- ✅ Redirection vers `/dashboard` (au lieu de `/`)

#### **Sign-Up Form** (`src/entities/auth/components/sign-up-form.tsx`)

**Modifications:**
- ✅ Textes traduits en français
- ✅ Titre: "Créer un compte"
- ✅ Description: "Entrez vos informations pour créer votre compte stockFast"
- ✅ Bouton: "Créer un compte" / "Création du compte..."
- ✅ Messages de succès: "Compte créé avec succès! Bienvenue sur stockFast"
- ✅ Messages d'erreur en français
- ✅ Redirection vers `/dashboard`

---

### 3. **Configuration des Formulaires**

#### **Sign-In Config** (`src/entities/auth/components/sign-in-config.ts`)

```typescript
export const SIGN_IN_FORM_CONFIG: FormFieldConfig[] = [
    {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "votre@email.com",
    },
    {
        name: "password",
        label: "Mot de passe",
        type: "password",
        placeholder: "••••••••",
    },
];
```

#### **Sign-Up Config** (`src/entities/auth/components/sign-up-config.ts`)

**Modifications:**
- ✅ Labels traduits en français
- ✅ Placeholders adaptés (Jean Dupont au lieu de John Doe)
- ✅ Messages de validation en français:
  - "Le nom doit contenir au moins 2 caractères."
  - "Veuillez entrer une adresse email valide."
  - "Le mot de passe doit contenir au moins 8 caractères."
  - "Les mots de passe ne correspondent pas"

**Champs:**
1. **Nom complet** - Jean Dupont
2. **Email** - votre@email.com
3. **Mot de passe** - ••••••••
4. **Confirmer le mot de passe** - ••••••••

---

### 4. **Dépendances Installées**

```bash
pnpm add react-hook-form @hookform/resolvers sonner react-icons
```

**Packages ajoutés:**
- `react-hook-form@7.66.1` - Gestion des formulaires
- `@hookform/resolvers@5.2.2` - Intégration Zod avec react-hook-form
- `sonner@2.0.7` - Notifications toast
- `react-icons@5.5.0` - Icônes (pour Google Sign-In)

---

## 📁 Structure des Fichiers Auth

```
src/entities/auth/
├── actions/                    # Actions serveur (à implémenter)
├── common/
│   └── form/
│       └── auth-form-field.tsx # Composant de champ de formulaire
├── components/
│   ├── google-signin-button.tsx # Bouton Google Sign-In
│   ├── sign-in-config.ts       # ✅ Configuration sign-in (FR)
│   ├── sign-in-form.tsx        # ✅ Formulaire sign-in (FR)
│   ├── sign-up-config.ts       # ✅ Configuration sign-up (FR)
│   └── sign-up-form.tsx        # ✅ Formulaire sign-up (FR)
├── hooks/                      # Hooks personnalisés (à implémenter)
├── types/                      # Types TypeScript (à implémenter)
└── validations/                # Schémas de validation (à implémenter)
```

---

## 🎯 Contexte stockFast

### Différences avec le Projet Original (DropInDrop)

| Aspect | DropInDrop | stockFast |
|--------|------------|-----------|
| **Langue** | Anglais | Français |
| **Domaine** | Social Network | Gestion de Stock |
| **Redirection** | `/` (feed) | `/dashboard` (tableau de bord) |
| **Utilisateurs** | Créateurs de contenu | Vendeurs, Gestionnaires |
| **Focus** | Interactions sociales | Gestion de produits/stock |

### Rôles Utilisateurs stockFast

Définis dans le schéma Prisma:

```typescript
enum UserRole {
  ADMIN        // Accès complet
  VENDOR       // Ventes et consultation
  STOCK_MANAGER // Gestion produits et inventaire
}
```

---

## 🚀 Prochaines Étapes

### 1. **Configurer BetterAuth Server**

Créer `lib/auth.ts` pour la configuration serveur:

```typescript
import { betterAuth } from "better-auth"
import { prisma } from "./prisma"

export const auth = betterAuth({
  database: prisma,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
})
```

### 2. **Créer les API Routes**

```
app/api/auth/
├── [...all]/route.ts    # Route catch-all pour BetterAuth
└── session/route.ts     # Vérification de session
```

### 3. **Créer les Pages d'Authentification**

```
app/(auth)/
├── sign-in/page.tsx     # Page de connexion
├── sign-up/page.tsx     # Page d'inscription
└── layout.tsx           # Layout auth (centré, sans sidebar)
```

### 4. **Implémenter le Middleware**

`middleware.ts` - Protection des routes:

```typescript
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Vérifier la session
  // Rediriger vers /sign-in si non authentifié
  // Rediriger vers /dashboard si authentifié et sur /
}

export const config = {
  matcher: ["/dashboard/:path*", "/products/:path*", "/sales/:path*"],
}
```

### 5. **Créer le Dashboard**

```
app/dashboard/
├── page.tsx             # Vue d'ensemble
├── layout.tsx           # Layout avec sidebar
└── components/
    ├── sidebar.tsx      # Navigation
    └── user-menu.tsx    # Menu utilisateur
```

---

## 🔐 Variables d'Environnement Requises

Ajouter à `.env`:

```env
# BetterAuth
BETTER_AUTH_SECRET="votre-secret-key-ici"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID="votre-google-client-id"
GOOGLE_CLIENT_SECRET="votre-google-client-secret"
```

---

## ✅ Checklist US01-002

- [x] ✅ Formulaires d'authentification adaptés à stockFast
- [x] ✅ Textes traduits en français
- [x] ✅ Redirections vers /dashboard
- [x] ✅ Messages contextualisés pour stockFast
- [x] ✅ Dépendances installées
- [x] ✅ Client BetterAuth configuré
- [ ] 🔴 Configuration serveur BetterAuth
- [ ] 🔴 API Routes d'authentification
- [ ] 🔴 Pages sign-in/sign-up
- [ ] 🔴 Middleware de protection
- [ ] 🔴 Dashboard de base

---

## 📊 Impact sur le Projet

### Fichiers Modifiés

- `src/entities/auth/components/sign-in-form.tsx` - Textes FR, redirect /dashboard
- `src/entities/auth/components/sign-up-form.tsx` - Textes FR, redirect /dashboard
- `src/entities/auth/components/sign-in-config.ts` - Labels FR
- `src/entities/auth/components/sign-up-config.ts` - Labels FR, validation FR

### Fichiers Créés

- `lib/auth-client.ts` - Client BetterAuth

### Dépendances Ajoutées

- `react-hook-form`, `@hookform/resolvers`, `sonner`, `react-icons`

---

**Status:** ✅ Formulaires d'authentification adaptés et prêts pour l'intégration avec BetterAuth serveur

**Prochaine étape:** Configurer BetterAuth côté serveur et créer les API routes
