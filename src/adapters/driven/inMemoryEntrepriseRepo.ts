import { Entreprise } from '../../domain/entreprise';
import { EntrepriseRepositoryPort } from '../../ports/driven/repoPort';
import { v4 as uuidv4 } from 'uuid';

const store: Entreprise[] = [];

export class InMemoryEntrepriseRepo implements EntrepriseRepositoryPort {
  async findAll(): Promise<Entreprise[]> {
    return store.slice();
  }

  async findById(id: string): Promise<Entreprise | null> {
    const found = store.find((s) => s.id === id);
    return found ?? null;
  }

  async save(entreprise: Omit<Entreprise, 'id'>): Promise<Entreprise> {
    const newEntreprise: Entreprise = { id: uuidv4(), ...entreprise };
    store.push(newEntreprise);
    return newEntreprise;
  }

  async update(id: string, entreprise: Entreprise): Promise<Entreprise> {
    const index = store.findIndex((s) => s.id === id);  
    if (index === -1) {
      throw new Error('Entreprise introuvable');
    }
    store[index] = entreprise;
    return store[index];
  }
  async delete(id: string): Promise<void> {
    const index = store.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error('Entreprise introuvable');
    }
    store.splice(index, 1);
  }
}
