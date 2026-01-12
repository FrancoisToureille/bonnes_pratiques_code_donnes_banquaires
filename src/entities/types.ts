import { z } from 'zod';

// Entreprise schemas
export const EntrepriseSchema = z.object({
  id: z.number().int().positive(),
  nom: z.string().min(1).max(200),
  siret: z.string().regex(/^\d{14}$/),
  adresse: z.string().min(1).max(500),
  dateCreation: z.string().datetime(),
});

export const EntrepriseCreateSchema = z.object({
  nom: z.string().min(1).max(200),
  siret: z.string().regex(/^\d{14}$/),
  adresse: z.string().min(1).max(500),
});

export const EntrepriseUpdateSchema = z.object({
  nom: z.string().min(1).max(200).optional(),
  siret: z.string().regex(/^\d{14}$/).optional(),
  adresse: z.string().min(1).max(500).optional(),
});

export const EntrepriseAvecComptesSchema = EntrepriseSchema.extend({
  comptes: z.array(z.lazy(() => CompteBancaireSchema)),
});

// Compte Bancaire schemas
export const CompteBancaireSchema = z.object({
  id: z.number().int().positive(),
  numeroCompte: z.string().regex(/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/),
  solde: z.number(),
  devise: z.enum(['EUR', 'USD', 'GBP', 'CHF']),
  type: z.enum(['COURANT', 'EPARGNE', 'PROFESSIONNEL']),
  entrepriseId: z.number().int().positive(),
  dateOuverture: z.string().datetime(),
});

export const CompteBancaireCreateSchema = z.object({
  numeroCompte: z.string().regex(/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/),
  solde: z.number(),
  devise: z.enum(['EUR', 'USD', 'GBP', 'CHF']),
  type: z.enum(['COURANT', 'EPARGNE', 'PROFESSIONNEL']),
  entrepriseId: z.number().int().positive(),
});

export const CompteBancaireUpdateSchema = z.object({
  numeroCompte: z.string().regex(/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/).optional(),
  solde: z.number().optional(),
  devise: z.enum(['EUR', 'USD', 'GBP', 'CHF']).optional(),
  type: z.enum(['COURANT', 'EPARGNE', 'PROFESSIONNEL']).optional(),
});

export type Entreprise = z.infer<typeof EntrepriseSchema>;
export type EntrepriseCreate = z.infer<typeof EntrepriseCreateSchema>;
export type EntrepriseUpdate = z.infer<typeof EntrepriseUpdateSchema>;
export type EntrepriseAvecComptes = z.infer<typeof EntrepriseAvecComptesSchema>;

export type CompteBancaire = z.infer<typeof CompteBancaireSchema>;
export type CompteBancaireCreate = z.infer<typeof CompteBancaireCreateSchema>;
export type CompteBancaireUpdate = z.infer<typeof CompteBancaireUpdateSchema>;
