### Thème : données bancaires et entreprise

# API Bancaire - TypeScript + SQLite

API REST complète pour la gestion des entreprises et comptes bancaires avec documentation OpenAPI.

## Fonctionnalités

- **CRUD Entreprises** : Création, lecture, mise à jour et suppression d'entreprises
- **CRUD Comptes Bancaires** : Gestion complète des comptes bancaires
- **Endpoint Agrégat** : Récupération d'une entreprise avec tous ses comptes bancaires
- **Codes d'erreur** : Listing exhaustif des codes d'erreur

## Documentation API

**http://localhost:3000/api-docs**


## Entités :
- Entreprise
- Banque
- Compte bancaire

## Endpoints

### Entreprises

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/entreprise` | Liste toutes les entreprises |
| `GET` | `/api/entreprise/:id` | Récupère une entreprise par ID |
| `GET` | `/api/bankAccount/:id/bankAccounts` | Récupère la liste des comptes bancaire pour une entreprise|
| `POST` | `/api/entreprise` | Crée une nouvelle entreprise |
| `PUT` | `/api/entreprise/:id` | Met à jour une entreprise |
| `DELETE` | `/api/entreprise/:id` | Supprime une entreprise |

### Comptes Bancaires

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/bankAccount` | Liste tous les comptes (filtre par `?entrepriseId=X` possible) |
| `GET` | `/api/bankAccount/:id` | Récupère un compte par ID |
| `POST` | `/api/bankAccount` | Crée un nouveau compte |
| `PUT` | `/api/bankAccount/:id` | Met à jour un compte |
| `DELETE` | `/api/bankAccount/:id` | Supprime un compte |


## 🛡️ Codes d'erreur

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Erreur de validation des données |
| `INVALID_INPUT` | 400 | Données d'entrée invalides |
| `ENTREPRISE_NOT_FOUND` | 404 | Entreprise introuvable |
| `COMPTE_NOT_FOUND` | 404 | Compte bancaire introuvable |
| `SIRET_ALREADY_EXISTS` | 409 | SIRET déjà utilisé |
| `CANNOT_DELETE_ENTREPRISE_WITH_COMPTES` | 400 | Impossible de supprimer (comptes associés) |
| `ENTREPRISE_REFERENCE_INVALID` | 400 | Référence entreprise invalide |
| `DATABASE_ERROR` | 500 | Erreur base de données |
| `INTERNAL_ERROR` | 500 | Erreur interne |

## 🗂️ Structure du projet

```
├── src/
│   ├── database/
│   │   └── connection.ts       # Configuration SQLite
│   ├── entities/
│   │   ├── types.ts           # Schémas Zod et types TypeScript
│   │   └── errors.ts          # Codes d'erreur et ApiError
│   ├── services/
│   │   ├── entreprise.service.ts
│   │   └── compteBancaire.service.ts
│   ├── routes/
│   │   ├── entreprise.routes.ts
│   │   └── compteBancaire.routes.ts
│   ├── middleware/
│   │   └── validation.ts      # Middleware validation & erreurs
│   └── index.ts               # Point d'entrée
├── openapi.yaml               # Spécification OpenAPI 3.0
├── package.json
├── tsconfig.json
└── database.db                # Base SQLite (créée automatiquement)
```

## 🔧 Technologies utilisées

- **TypeScript** : Langage fortement typé
- **Express** : Framework web
- **better-sqlite3** : Driver SQLite performant
- **Zod** : Validation et typage des schémas
- **Swagger UI** : Documentation interactive OpenAPI
- **Node.js** : Runtime JavaScript

## 📌 Règles métier

- Un **SIRET** doit être unique (14 chiffres)

- Un **numéro de compte** doit être au format IBAN et unique
- Les **types de comptes** : COURANT, EPARGNE, PROFESSIONNEL
- Une entreprise **ne peut être supprimée** si elle possède des comptes bancaires

- Une entreprise peut avoir plusieurs comptes bancaires
