import { de, en, id } from "zod/v4/locales"
import { constructor } from "zod/v4/locales/yo.cjs"

export class Entreprise {
  id?: string;
  nom: string;
  siret: string;
  adresse: string;
  dateCreation: Date;
   constructor(nom: string, siret: string, adresse: string, id?: string) {
    this.id = id;
    this.nom = nom; 
    this.siret = siret;
    this.adresse = adresse;
    this.dateCreation = new Date();
  }
  getFullEntreprise(): string {
    return `Entreprise ${this.nom} - SIRET: ${this.siret} - Adresse: ${this.adresse} - Date de création: ${this.dateCreation.toDateString()}`;
  }
}
