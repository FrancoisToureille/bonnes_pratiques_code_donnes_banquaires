import { Entreprise } from '../../domain/entreprise';
export interface EntreprisePort {
  listEntreprises(): Promise<Entreprise[]>;
  getEntreprise(id: string): Promise<Entreprise | null>;
  createEntreprise(input: Omit<Entreprise, 'id'>): Promise<Entreprise>;
}