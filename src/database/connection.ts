import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../database.db');
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

export function initializeDatabase() {
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS entreprises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      siret TEXT NOT NULL UNIQUE,
      adresse TEXT NOT NULL,
      dateCreation DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS comptes_bancaires (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numeroCompte TEXT NOT NULL UNIQUE,
      solde REAL NOT NULL,
      devise TEXT NOT NULL CHECK (devise IN ('EUR', 'USD', 'GBP', 'CHF')),
      type TEXT NOT NULL CHECK (type IN ('COURANT', 'EPARGNE', 'PROFESSIONNEL')),
      entrepriseId INTEGER NOT NULL,
      dateOuverture DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (entrepriseId) REFERENCES entreprises(id)
    );

    CREATE INDEX IF NOT EXISTS idx_comptes_entrepriseId ON comptes_bancaires(entrepriseId);
  `);
}
