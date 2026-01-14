export class CompteBancaire {
  id?: string;
  numeroCompte: string;
  solde: string;
  devise: string;
  type: string;
  entrepriseId: string;
  dateOuverture: Date;
  constructor(
    solde: string,
    numeroCompte: string,
    devise: string,
    type: string,
    entrepriseId: string,
    id?: string
  ) {
    this.id = id;
    this.solde = solde;
    this.devise = devise;
    this.type = type;
    this.entrepriseId = entrepriseId;
    this.numeroCompte = numeroCompte;
    this.dateOuverture = new Date();
  }

  getFullCompteBancaire(): string {
    return `Compte ${this.numeroCompte} - Solde: ${this.solde} ${
      this.devise
    } - Type: ${this.type} - Entreprise ID: ${
      this.entrepriseId
    } - Date d'ouverture: ${this.dateOuverture.toDateString()}`;
  }
}
