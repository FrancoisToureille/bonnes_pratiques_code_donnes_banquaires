import { Entreprise } from '../domain/entreprise';
import { EntrepriseRepositoryPort } from '../ports/driven/repoPort';
import { EntreprisePort } from '../ports/driving/entreprisePort';
export class EntrepriseService implements EntreprisePort {
  constructor(private repo: EntrepriseRepositoryPort) {}

  async listEntreprises(): Promise<Entreprise[]> {
    return this.repo.findAll();
  }
  async getEntreprise(id: string): Promise<Entreprise | null> {
    return this.repo.findById(id);
  }
  async createEntreprise(input: Omit<Entreprise, 'id'>): Promise<Entreprise> {
    // Business rules could be applied here
    return this.repo.save(input);
  }
  async updateEntreprise(
    id: string,
    data: Entreprise
  ): Promise<Entreprise> {
    const existingEntreprise = await this.repo.findById(id);
    if (!existingEntreprise) {
      throw new Error('Entreprise introuvable');
    } else {
      return this.repo.update(id, data);
    }
  }

  async deleteEntreprise(id: string): Promise<void> {
    const existingEntreprise = await this.repo.findById(id);
    if (!existingEntreprise) {
      throw new Error('Entreprise introuvable');
    } else {
      return this.repo.delete(id);
    }
  }

  /*

  getById(id: number): Entreprise {
    try {
      const stmt = db.prepare(`
        SELECT id, nom, siret, adresse, dateCreation 
        FROM entreprises 
        WHERE id = ?
      `);
      const entreprise = stmt.get(id) as Entreprise | undefined;

      if (!entreprise) {
        throw Errors.ENTREPRISE_NOT_FOUND(id);
      }

      return entreprise;
    } catch (error) {
      if (error instanceof Error && error.message.includes('introuvable')) {
        throw error;
      }
      throw Errors.DATABASE_ERROR(
        "Erreur lors de la récupération de l'entreprise"
      );
    }
  }

  create(data: EntrepriseCreate): Entreprise {
    try {
      const existing = db
        .prepare('SELECT id FROM entreprises WHERE siret = ?')
        .get(data.siret);
      if (existing) {
        throw Errors.SIRET_ALREADY_EXISTS(data.siret);
      }

      const stmt = db.prepare(`
        INSERT INTO entreprises (nom, siret, adresse, dateCreation)
        VALUES (?, ?, ?, datetime('now'))
      `);

      const result = stmt.run(data.nom, data.siret, data.adresse);

      return this.getById(result.lastInsertRowid as number);
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes('existe déjà') ||
          error.message.includes('SIRET'))
      ) {
        throw error;
      }
      throw Errors.DATABASE_ERROR("Erreur lors de la création de l'entreprise");
    }
  }

  update(id: number, data: EntrepriseUpdate): Entreprise {
    try {
      this.getById(id);

      if (data.siret) {
        const existing = db
          .prepare('SELECT id FROM entreprises WHERE siret = ? AND id != ?')
          .get(data.siret, id);
        if (existing) {
          throw Errors.SIRET_ALREADY_EXISTS(data.siret);
        }
      }

      const updates: string[] = [];
      const values: any[] = [];

      if (data.nom !== undefined) {
        updates.push('nom = ?');
        values.push(data.nom);
      }
      if (data.siret !== undefined) {
        updates.push('siret = ?');
        values.push(data.siret);
      }
      if (data.adresse !== undefined) {
        updates.push('adresse = ?');
        values.push(data.adresse);
      }

      if (updates.length === 0) {
        return this.getById(id);
      }

      values.push(id);
      const stmt = db.prepare(
        `UPDATE entreprises SET ${updates.join(', ')} WHERE id = ?`
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
        "Erreur lors de la mise à jour de l'entreprise"
      );
    }
  }

  delete(id: number): void {
    try {
      this.getById(id);

      const hasComptes = db
        .prepare(
          'SELECT COUNT(*) as count FROM comptes_bancaires WHERE entrepriseId = ?'
        )
        .get(id) as { count: number };

      if (hasComptes.count > 0) {
        throw Errors.CANNOT_DELETE_ENTREPRISE_WITH_COMPTES();
      }

      const stmt = db.prepare('DELETE FROM entreprises WHERE id = ?');
      stmt.run(id);
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes('introuvable') ||
          error.message.includes('Impossible de supprimer'))
      ) {
        throw error;
      }
      throw Errors.DATABASE_ERROR(
        "Erreur lors de la suppression de l'entreprise"
      );
    }
  }

  getWithComptes(id: number) {
    try {
      const entreprise = this.getById(id);

      const stmt = db.prepare(`
        SELECT id, numeroCompte, solde, devise, type, entrepriseId, dateOuverture 
        FROM comptes_bancaires 
        WHERE entrepriseId = ?
        ORDER BY id
      `);
      const comptes = stmt.all(id) as CompteBancaire[];

      return {
        ...entreprise,
        comptes,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('introuvable')) {
        throw error;
      }
      throw Errors.DATABASE_ERROR(
        "Erreur lors de la récupération de l'entreprise avec ses comptes"
      );
    }
  }*/
}
