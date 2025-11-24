# Plan de Sprint - stockFast

## Application de Gestion de Stock avec QR-Code

---

## **Sprint 1 : Infrastructure et Authentification (1 semaine)** ✅ COMPLÉTÉ

### **User Story US01-001** - Configuration de l'environnement ✅

**En tant que** développeur
**Je veux** configurer l'environnement de développement
**Afin de** avoir une base technique solide

**Critères d'acceptation :**

- [x] Prisma configuré avec PostgreSQL
- [x] BetterAuth intégré
- [x] Variables d'environnement définies
- [x] Structure de dossiers créée
- [x] Tests de connexion à la base de données fonctionnels
- [x] Docker PostgreSQL configuré (port 5234)
- [x] Schéma Prisma avec modèles Auth (User, Session, Account, Verification)
- [x] Schéma Prisma avec modèles métier (Product, Sale, StockMovement, StockAlert, etc.)

**Livrable :** Environnement de développement fonctionnel ✅
**Diagrammes UML associés :** [06-component-diagram.puml](uml/06-component-diagram.puml), [07-deployment-diagram.puml](uml/07-deployment-diagram.puml), [09-package-diagram.puml](uml/09-package-diagram.puml)

### **User Story US01-002** - Gestion des utilisateurs ✅

**En tant que** administrateur
**Je veux** créer et gérer les comptes utilisateurs
**Afin de** contrôler l'accès à l'application

**Critères d'acceptation :**

- [x] Inscription des utilisateurs avec rôles (Admin, Vendeur, Stock Manager)
- [x] Authentification avec BetterAuth (email/password)
- [x] Gestion des sessions
- [x] Interface de connexion/déconnexion
- [x] Formulaires d'inscription et connexion en français
- [x] Client BetterAuth configuré (`src/lib/auth-client.ts`)
- [x] Serveur BetterAuth configuré (`src/lib/auth.ts`)
- [x] Routes API d'authentification (`/api/auth/[...all]`)
- [x] Composant LogoutButton
- [x] Autorisations par rôle (enum UserRole dans Prisma)

**Livrable :** Système d'authentification complet ✅
**Diagrammes UML associés :** [02-class-diagram.puml](uml/02-class-diagram.puml), [08-object-diagram.puml](uml/08-object-diagram.puml)

### **User Story US01-003** - Dashboard et Interface ✅ (BONUS)

**En tant que** utilisateur authentifié
**Je veux** accéder à un tableau de bord moderne
**Afin de** visualiser les indicateurs clés de l'application

**Critères d'acceptation :**

- [x] Layout dashboard avec sidebar collapsible
- [x] Header avec recherche et toggle theme
- [x] Sidebar avec navigation (Vue d'ensemble, Produits, Ventes, Stock, Clients, Rapports, Paramètres)
- [x] Cartes statistiques (4 KPIs)
- [x] Graphique d'évolution (AreaChart avec Recharts)
- [x] Graphique de répartition (BarChart)
- [x] Section "Dernières Ventes"
- [x] Section "Équipe"
- [x] Onglets de navigation (Overview, Analytics, Reports, Notifications)
- [x] API route pour statistiques (`/api/dashboard/stats`)
- [x] Composants réutilisables (Card, Button, Tabs)
- [x] Design moderne inspiré de Shadcn/UI

**Livrable :** Dashboard fonctionnel et esthétique ✅
**Diagrammes UML associés :** [01-use-case-diagram.puml](uml/01-use-case-diagram.puml), [06-component-diagram.puml](uml/06-component-diagram.puml)

---

## **Sprint 2 : Gestion des Produits (1 semaine)**

### **User Story US02-001** - Création de produits

**En tant que** gestionnaire de stock
**Je veux** ajouter de nouveaux produits
**Afin de** enrichir le catalogue de la boutique

**Critères d'acceptation :**

- [ ] Formulaire d'ajout de produit (nom, marque, modèle, prix, IMEI)
- [ ] Upload d'images multiples
- [ ] Validation des données (IMEI unique, prix cohérents)
- [ ] Sauvegarde en base de données
- [ ] Génération automatique de QR-Code

**Livrable :** Interface CRUD produits
**Diagrammes UML associés :** [01-use-case-diagram.puml](uml/01-use-case-diagram.puml), [02-class-diagram.puml](uml/02-class-diagram.puml)

### **User Story US02-002** - Recherche et filtrage de produits

**En tant que** vendeur
**Je veux** rechercher des produits rapidement
**Afin de** servir les clients efficacement

**Critères d'acceptation :**

- [ ] Recherche par nom, marque, IMEI
- [ ] Filtrage par catégorie, prix, état du stock
- [ ] Résultats en temps réel
- [ ] Pagination des résultats
- [ ] Interface intuitive

**Livrable :** Système de recherche avancée
**Diagrammes UML associés :** [03-sequence-diagram.puml](uml/03-sequence-diagram.puml), [05-activity-diagram.puml](uml/05-activity-diagram.puml)

---

## **Sprint 3 : Système QR-Code (1 semaine)**

### **User Story US03-001** - Génération de QR-Codes

**En tant que** système
**Je veux** générer automatiquement un QR-Code pour chaque produit
**Afin de** permettre une identification rapide

**Critères d'acceptation :**

- [ ] Génération automatique lors de l'ajout de produit
- [ ] Contenu : ID produit + IMEI + lien fiche
- [ ] Format PNG haute qualité
- [ ] Stockage Base64 en base de données
- [ ] API pour récupération du QR-Code

**Livrable :** Système QR-Code complet
**Diagrammes UML associés :** [02-class-diagram.puml](uml/02-class-diagram.puml), [03-sequence-diagram.puml](uml/03-sequence-diagram.puml)

### **User Story US03-002** - Scan et lecture de QR-Codes

**En tant que** vendeur
**Je veux** scanner un QR-Code pour identifier un produit
**Afin de** simplifier le processus de vente

**Critères d'acceptation :**

- [ ] Interface de scan avec caméra
- [ ] Décodage automatique du QR-Code
- [ ] Redirection vers la fiche produit
- [ ] Gestion des erreurs (QR invalide)
- [ ] Support multi-appareils

**Livrable :** Scanner QR-Code fonctionnel
**Diagrammes UML associés :** [03-sequence-diagram.puml](uml/03-sequence-diagram.puml), [05-activity-diagram.puml](uml/05-activity-diagram.puml)

---

## **Sprint 4 : Processus de Vente (1 semaine)**

### **User Story US04-001** - Effectuer une vente

**En tant que** vendeur
**Je veux** enregistrer une vente via scan QR-Code
**Afin de** mettre à jour le stock automatiquement

**Critères d'acceptation :**

- [ ] Scan QR-Code du produit
- [ ] Sélection de quantité
- [ ] Choix du moyen de paiement
- [ ] Génération de mouvement de stock
- [ ] Mise à jour automatique du stock
- [ ] Création d'alertes si stock faible

**Livrable :** Processus de vente automatisé
**Diagrammes UML associés :** [03-sequence-diagram.puml](uml/03-sequence-diagram.puml), [04-state-transition-diagram.puml](uml/04-state-transition-diagram.puml)

### **User Story US04-002** - Génération de reçu PDF

**En tant que** vendeur
**Je veux** générer un reçu PDF pour chaque vente
**Afin de** fournir une preuve d'achat au client

**Critères d'acceptation :**

- [ ] Génération automatique PDF
- [ ] Contenu : détails produit, prix, quantité, vendeur
- [ ] Numéro de reçu unique
- [ ] Format professionnel
- [ ] Téléchargement/Impression

**Livrable :** Système de reçus PDF
**Diagrammes UML associés :** [03-sequence-diagram.puml](uml/03-sequence-diagram.puml), [08-object-diagram.puml](uml/08-object-diagram.puml)

---

## **Sprint 5 : Gestion de Stock Avancée (1 semaine)**

### **User Story US05-001** - Alertes de stock faible

**En tant que** gestionnaire de stock
**Je veux** recevoir des alertes pour les stocks faibles
**Afin de** éviter les ruptures de stock

**Critères d'acceptation :**

- [ ] Détection automatique du stock faible
- [ ] Création d'alertes en base
- [ ] Notifications email/SMS
- [ ] Dashboard avec alertes actives
- [ ] Historique des alertes

**Livrable :** Système d'alertes intelligent
**Diagrammes UML associés :** [04-state-transition-diagram.puml](uml/04-state-transition-diagram.puml), [05-activity-diagram.puml](uml/05-activity-diagram.puml)

### **User Story US05-002** - Historique des mouvements

**En tant que** responsable
**Je veux** consulter l'historique complet des mouvements de stock
**Afin de** tracer toutes les opérations

**Critères d'acceptation :**

- [ ] Journal de tous les mouvements (entrée, sortie, ajustement)
- [ ] Filtres par période, produit, type de mouvement
- [ ] Détails : qui, quand, pourquoi
- [ ] Export des données
- [ ] Interface de consultation

**Livrable :** Traçabilité complète du stock
**Diagrammes UML associés :** [02-class-diagram.puml](uml/02-class-diagram.puml), [05-activity-diagram.puml](uml/05-activity-diagram.puml)

---

## **Sprint 6 : Tableau de Bord et Rapports (1 semaine)**

### **User Story US06-001** - Dashboard avec KPIs

**En tant que** gestionnaire
**Je veux** voir un tableau de bord avec les indicateurs clés
**Afin de** piloter l'activité de la boutique

**Critères d'acceptation :**

- [ ] Total ventes journalière/mensuelle
- [ ] Meilleures ventes
- [ ] Bénéfices
- [ ] Produits en rupture
- [ ] QR-Codes générés
- [ ] Graphiques interactifs

**Livrable :** Dashboard analytique
**Diagrammes UML associés :** [01-use-case-diagram.puml](uml/01-use-case-diagram.puml), [06-component-diagram.puml](uml/06-component-diagram.puml)

### **User Story US06-002** - Export des données

**En tant que** administrateur
**Je veux** exporter les données en CSV/Excel
**Afin de** faire des analyses externes

**Critères d'acceptation :**

- [ ] Export produits (nom, stock, prix)
- [ ] Export ventes (période, montants)
- [ ] Export mouvements de stock
- [ ] Formats CSV et Excel
- [ ] Filtres d'export

**Livrable :** Système d'export complet
**Diagrammes UML associés :** [06-component-diagram.puml](uml/06-component-diagram.puml), [05-activity-diagram.puml](uml/05-activity-diagram.puml)

---

## **Sprint 7 : Sécurité et Optimisation (1 semaine)**

### **User Story US07-001** - Chiffrement des données sensibles

**En tant que** administrateur
**Je veux** chiffrer les données sensibles (IMEI, prix d'achat)
**Afin de** respecter la sécurité des données

**Critères d'acceptation :**

- [ ] Chiffrement automatique des IMEI
- [ ] Chiffrement des prix d'achat
- [ ] Clés de chiffrement sécurisées
- [ ] Performance maintenue
- [ ] Audit trail des accès

**Livrable :** Données sécurisées
**Diagrammes UML associés :** [06-component-diagram.puml](uml/06-component-diagram.puml), [07-deployment-diagram.puml](uml/07-deployment-diagram.puml)

### **User Story US07-002** - Sauvegarde automatique

**En tant que** administrateur
**Je veux** une sauvegarde automatique de la base de données
**Afin de** protéger contre la perte de données

**Critères d'acceptation :**

- [ ] Sauvegarde quotidienne automatique
- [ ] Points de restauration
- [ ] Test de récupération
- [ ] Stockage sécurisé
- [ ] Plan de reprise d'activité

**Livrable :** Système de sauvegarde
**Diagrammes UML associés :** [07-deployment-diagram.puml](uml/07-deployment-diagram.puml), [09-package-diagram.puml](uml/09-package-diagram.puml)

---

## **Métriques de Succès**

### **Performance**

- Temps de réponse < 2 secondes
- Disponibilité > 98%
- Support 10 000+ produits

### **Qualité**

- Couverture de tests > 80%
- Code coverage ESLint 100%
- Zéro bug critique en production

### **Business**

- Réduction erreurs humaines > 80%
- Temps d'inventaire réduit de 60%
- Satisfaction utilisateur > 90%

---

## **Ressources et Planning**

### **Équipe**

- **Développeur Fullstack** : 7 sprints
- **Designer UI/UX** : 2 sprints
- **Testeur** : 1 sprint
- **DevOps** : 1 sprint

### **Technologies**

- Next.js 16 + React 19
- Prisma + PostgreSQL
- BetterAuth + JWT
- TailwindCSS + TypeScript

### **Budget Estimatif**

- **Phase Dévelopment** : 300 000 - 600 000 FCFA
- **ROI prévu** : 6 mois

---

_Plan créé le 23/11/2025 - Version 1.0_
