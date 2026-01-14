import { Express, Request, Response } from 'express';
import { CompteBancaireService } from '../../services/compteBancaire.service';

export class CompteBancaireController {
  constructor(private readonly service: CompteBancaireService) {}

  registerRoutes(app: Express) {
    app.get('/api/bankAccount', this.listComptes.bind(this));
    app.post('/api/bankAccount', this.createCompte.bind(this));
    app.get('/api/bankAccount/:id', this.getCompte.bind(this));
    app.put('/api/bankAccount/:id', this.updateCompte.bind(this));
    app.delete('/api/bankAccount/:id', this.deleteCompte.bind(this));
    app.get(
      '/api/bankAccount/:id/bankAccounts',
      this.getComptesForEntreprise.bind(this)
    );
  }

  async listComptes(req: Request, res: Response) {
    const list = await this.service.listComptesBancaires();
    res.json(list);
  }

  async createCompte(req: Request, res: Response) {
    const created = await this.service.createCompteBancaire(req.body);
    res.status(201).json(created);
  }

  async getCompte(req: Request, res: Response) {
    const id = req.params.id;
    const found = await this.service.getCompteBancaire(id);
    if (!found) {
      res.status(404).send('Compte bancaire non trouvé');
      return;
    }
    res.json(found);
  }

  async updateCompte(req: Request, res: Response) {
    const id = req.params.id;
    const updated = await this.service.updateCompteBancaire(id, req.body);
    res.json(updated);
  }

  async deleteCompte(req: Request, res: Response) {
    const id = req.params.id;
    await this.service.deleteCompteBancaire(id);
    res.status(204).send();
  }

  async getComptesForEntreprise(req: Request, res: Response) {
    const id = req.params.id;
    const comptes = await this.service.getCompteBancaireByEntrepriseId(id);
    res.json(comptes);
  }
}
