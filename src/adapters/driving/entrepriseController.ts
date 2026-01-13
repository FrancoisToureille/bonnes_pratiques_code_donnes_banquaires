import { Express, Request, Response } from 'express';
import { EntrepriseService } from '../../services/entreprise.service';

export class EntrepriseController {
  constructor(private readonly service: EntrepriseService) {}

  registerRoutes(app: Express) {
    app.get('/api/entreprise', this.listEntreprises.bind(this));
    app.post('/api/entreprise', this.createEntreprise.bind(this));
    app.get('/api/entreprise/:id', this.getEntreprise.bind(this));
    app.put('/api/entreprise/:id', this.updateEntreprise.bind(this));
    app.delete('/api/entreprise/:id', this.deleteEntreprise.bind(this));
    app.get('/api/entreprise/:id/withComptes', this.getEntrepriseWithComptes.bind(this));
  }

  async listEntreprises(req: Request, res: Response) {
    const list = await this.service.listEntreprises();
    res.json(list);
  }

  async createEntreprise(req: Request, res: Response) {
    const created = await this.service.createEntreprise(req.body);
    res.status(201).json(created);
  }

  async getEntreprise(req: Request, res: Response) {
    const id = req.params.id;
    const found = await this.service.getEntreprise(id);
    if (!found) return res.status(404).json({ message: 'Not found' });
    res.json(found);
  }

  async updateEntreprise(req: Request, res: Response) {
    const id = req.params.id;
    const updated = await this.service.updateEntreprise(id, req.body);
    res.json(updated);
  }

  async deleteEntreprise(req: Request, res: Response) {
    const id = req.params.id;
    await this.service.deleteEntreprise(id);
    res.status(204).send();
  }

  async getEntrepriseWithComptes(req: Request, res: Response) {
    const id = req.params.id;
    // Optionally delegate to service method if available
    // @ts-ignore
    if (typeof this.service.getWithComptes === 'function') {
      // @ts-ignore
      const result = await this.service.getWithComptes(id);
      res.json(result);
      return;
    }
    const found = await this.service.getEntreprise(id);
    if (!found) return res.status(404).json({ message: 'Not found' });
    res.json(found);
  }
}