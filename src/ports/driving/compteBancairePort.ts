import { CompteBancaire } from "../../domain/compteBancaire";
export interface CompteBancairePort {
  listComptesBancaires(): Promise<CompteBancaire[]>;
  getCompteBancaire(id: string): Promise<CompteBancaire | null>;
  createCompteBancaire(input: Omit<CompteBancaire, 'id'>): Promise<CompteBancaire>;
}