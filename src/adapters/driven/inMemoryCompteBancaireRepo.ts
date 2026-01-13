import { CompteBancaire } from '../../domain/compteBancaire';
import { CompteBancaireRepositoryPort } from '../../ports/driven/repoPort';
import { v4 as uuidv4 } from 'uuid';

const store: CompteBancaire[] = [];

export class InMemoryCompteBancaireRepo implements CompteBancaireRepositoryPort {
  async findAll(): Promise<CompteBancaire[]> {
    return store.slice();
  }

  async findById(id: string): Promise<CompteBancaire | null> {
    const found = store.find((s) => s.id === id);
    return found ?? null;
  }

  async save(compteBancaire: Omit<CompteBancaire, 'id'>): Promise<CompteBancaire> {
    const newCompteBancaire: CompteBancaire = { id: uuidv4(), ...compteBancaire };
    store.push(newCompteBancaire);
    return newCompteBancaire;
  }
  async findByEntrepriseId(entrepriseId: string): Promise<CompteBancaire[]> {
    return store.filter((s) => s.entrepriseId === entrepriseId);
  }
  async update(id: string, compteBancaire: CompteBancaire): Promise<CompteBancaire> {
    const index = store.findIndex((s) => s.id === id);  
    if (index === -1) {
      throw new Error('Compte bancaire introuvable');
    }
    store[index] = compteBancaire;
    return store[index];
  }
  async delete(id: string): Promise<void> {
    const index = store.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error('Compte bancaire introuvable');
    }
    store.splice(index, 1);
  }
}
