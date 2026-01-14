import { Address } from '../../domain/address';
import { CompteBancaire } from '../../domain/compteBancaire';
import { Entreprise } from '../../domain/entreprise';

export interface AddressRepositoryPort {
  findAll(): Promise<Address[]>;
  findById(id: string): Promise<Address | null>;
  save(address: Omit<Address, 'id'>): Promise<Address>;
}
export interface CompteBancaireRepositoryPort {
  findAll(): Promise<CompteBancaire[]>;
  findById(id: string): Promise<CompteBancaire | null>;
  save(compteBancaire: Omit<CompteBancaire, 'id'>): Promise<CompteBancaire>;
  findByEntrepriseId(entrepriseId: string): Promise<CompteBancaire[]>;
  update(id: string, compteBancaire: CompteBancaire): Promise<CompteBancaire>;
  delete(id: string): Promise<void>;
}
export interface EntrepriseRepositoryPort {
  findAll(): Promise<Entreprise[]>;
  findById(id: string): Promise<Entreprise | null>;
  save(entreprise: Omit<Entreprise, 'id'>): Promise<Entreprise>;
  update(id: string, entreprise: Entreprise): Promise<Entreprise>;
  delete(id: string): Promise<void>;
}
