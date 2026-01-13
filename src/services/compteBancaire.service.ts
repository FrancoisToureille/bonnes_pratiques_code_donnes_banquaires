import { CompteBancaire } from '../domain/compteBancaire';
import { CompteBancaireRepositoryPort } from '../ports/driven/repoPort';  
import { CompteBancairePort } from '../ports/driving/compteBancairePort'; 

export class CompteBancaireService implements CompteBancairePort {
  constructor(private repo: CompteBancaireRepositoryPort) {}

  async v(): Promise<CompteBancaire[]> {
    return this.repo.findAll();
  }
  async getCompteBancaire(id: string): Promise<CompteBancaire | null> {
    return this.repo.findById(id);
  }
  async createCompteBancaire(input: Omit<CompteBancaire, 'id'>): Promise<CompteBancaire> {
    // Business rules could be applied here
    return this.repo.save(input);
  }
  async getCompteBancaireByEntrepriseId(entrepriseId: string): Promise<CompteBancaire[]> {
    return this.repo.findByEntrepriseId(entrepriseId);
  }
  
  async updateCompteBancaire(id: string, data: Partial<Omit<CompteBancaire, 'id'>>): Promise<CompteBancaire> {
    const existingCompte = await this.repo.findById(id);
    if (!existingCompte) {
      throw new Error('Compte bancaire introuvable');
    } else {
      return this.repo.update(id, existingCompte);
    }
  }

  async deleteCompteBancaire(id: string): Promise<void> {
    const existingCompte = await this.repo.findById(id);
    if (!existingCompte) {
      throw new Error('Compte bancaire introuvable');
    } else {
      return this.repo.delete(id);
    } 
  }

  /*update(id: number, data: CompteBancaireUpdate): CompteBancaire {
    try {
      // Verify compte exists
      this.getById(id);

      // Check if new numero compte is not already used by another compte
      if (data.numeroCompte !== undefined) {
        const existing = db
          .prepare(
            'SELECT id FROM comptes_bancaires WHERE numeroCompte = ? AND id != ?'
          )
          .get(data.numeroCompte, id);
        if (existing) {
          throw Errors.NUMERO_COMPTE_ALREADY_EXISTS(data.numeroCompte);
        }
      }

      const updates: string[] = [];
      const values: any[] = [];

      if (data.numeroCompte !== undefined) {
        updates.push('numeroCompte = ?');
        values.push(data.numeroCompte);
      }
      if (data.solde !== undefined) {
        updates.push('solde = ?');
        values.push(data.solde);
      }
      if (data.devise !== undefined) {
        updates.push('devise = ?');
        values.push(data.devise);
      }
      if (data.type !== undefined) {
        updates.push('type = ?');
        values.push(data.type);
      }

      if (updates.length === 0) {
        return this.getById(id);
      }

      values.push(id);
      const stmt = db.prepare(
        `UPDATE comptes_bancaires SET ${updates.join(', ')} WHERE id = ?`
      );
      stmt.run(...values);

      return this.getById(id);
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes('introuvable') ||
          error.message.includes('existe déjà'))
      ) {
        throw error;
      }
      throw Errors.DATABASE_ERROR(
        'Erreur lors de la mise à jour du compte bancaire'
      );
    }
  }

  delete(id: number): void {
    try {
      // Verify compte exists
      this.getById(id);

      const stmt = db.prepare('DELETE FROM comptes_bancaires WHERE id = ?');
      stmt.run(id);
    } catch (error) {
      if (error instanceof Error && error.message.includes('introuvable')) {
        throw error;
      }
      throw Errors.DATABASE_ERROR(
        'Erreur lors de la suppression du compte bancaire'
      );
    }
  }*/
}
