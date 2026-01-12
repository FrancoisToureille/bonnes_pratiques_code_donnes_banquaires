import { db } from '../database/connection';
import { CompteBancaire, CompteBancaireCreate, CompteBancaireUpdate } from '../entities/types';
import { Errors } from '../entities/errors';
import { EntrepriseService } from './entreprise.service';

export class CompteBancaireService {
  static getAll(entrepriseId?: number): CompteBancaire[] {
    try {
      let query = `
        SELECT id, numeroCompte, solde, devise, type, entrepriseId, dateOuverture 
        FROM comptes_bancaires
      `;
      let params: any[] = [];

      if (entrepriseId !== undefined) {
        query += ' WHERE entrepriseId = ?';
        params.push(entrepriseId);
      }

      query += ' ORDER BY id';
      const stmt = db.prepare(query);
      return stmt.all(...params) as CompteBancaire[];
    } catch (error) {
      throw Errors.DATABASE_ERROR('Erreur lors de la récupération des comptes bancaires');
    }
  }

  static getById(id: number): CompteBancaire {
    try {
      const stmt = db.prepare(`
        SELECT id, numeroCompte, solde, devise, type, entrepriseId, dateOuverture 
        FROM comptes_bancaires 
        WHERE id = ?
      `);
      const compte = stmt.get(id) as CompteBancaire | undefined;
      
      if (!compte) {
        throw Errors.COMPTE_NOT_FOUND(id);
      }
      
      return compte;
    } catch (error) {
      if (error instanceof Error && error.message.includes('introuvable')) {
        throw error;
      }
      throw Errors.DATABASE_ERROR('Erreur lors de la récupération du compte bancaire');
    }
  }

  static getForEntreprise(entrepriseId: number): CompteBancaire[] {
    try {
      // Verify entreprise exists
      EntrepriseService.getById(entrepriseId);

      const stmt = db.prepare(`
        SELECT id, numeroCompte, solde, devise, type, entrepriseId, dateOuverture 
        FROM comptes_bancaires 
        WHERE entrepriseId = ? 
        ORDER BY id
      `);
      
      return stmt.all(entrepriseId) as CompteBancaire[];
    } catch (error) {
      if (error instanceof Error && error.message.includes('introuvable')) {
        throw error;
      }
      throw Errors.DATABASE_ERROR('Erreur lors de la récupération des comptes de l\'entreprise');
    }
  }

  static create(data: CompteBancaireCreate): CompteBancaire {
    try {
      // Verify entreprise exists
      EntrepriseService.getById(data.entrepriseId);

      // Check if numero compte already exists
      const existing = db.prepare('SELECT id FROM comptes_bancaires WHERE numeroCompte = ?').get(data.numeroCompte);
      if (existing) {
        throw Errors.NUMERO_COMPTE_ALREADY_EXISTS(data.numeroCompte);
      }

      const stmt = db.prepare(`
        INSERT INTO comptes_bancaires (numeroCompte, solde, devise, type, entrepriseId, dateOuverture)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
      `);
      
      const result = stmt.run(
        data.numeroCompte,
        data.solde,
        data.devise,
        data.type,
        data.entrepriseId
      );
      
      return this.getById(result.lastInsertRowid as number);
    } catch (error) {
      if (error instanceof Error && (error.message.includes('existe déjà') || error.message.includes('introuvable') || error.message.includes('invalide'))) {
        throw error;
      }
      throw Errors.DATABASE_ERROR('Erreur lors de la création du compte bancaire');
    }
  }

  static update(id: number, data: CompteBancaireUpdate): CompteBancaire {
    try {
      // Verify compte exists
      this.getById(id);

      // Check if new numero compte is not already used by another compte
      if (data.numeroCompte !== undefined) {
        const existing = db.prepare('SELECT id FROM comptes_bancaires WHERE numeroCompte = ? AND id != ?').get(data.numeroCompte, id);
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
      const stmt = db.prepare(`UPDATE comptes_bancaires SET ${updates.join(', ')} WHERE id = ?`);
      stmt.run(...values);

      return this.getById(id);
    } catch (error) {
      if (error instanceof Error && (error.message.includes('introuvable') || error.message.includes('existe déjà'))) {
        throw error;
      }
      throw Errors.DATABASE_ERROR('Erreur lors de la mise à jour du compte bancaire');
    }
  }

  static delete(id: number): void {
    try {
      // Verify compte exists
      this.getById(id);

      const stmt = db.prepare('DELETE FROM comptes_bancaires WHERE id = ?');
      stmt.run(id);
    } catch (error) {
      if (error instanceof Error && error.message.includes('introuvable')) {
        throw error;
      }
      throw Errors.DATABASE_ERROR('Erreur lors de la suppression du compte bancaire');
    }
  }
}
