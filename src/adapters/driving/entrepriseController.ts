import { Application, Router, Request, Response, NextFunction } from 'express';
import { EntrepriseService } from '../../services/entreprise.service';
import {
  EntrepriseCreateSchema,
  EntrepriseUpdateSchema,
} from '../../entities/types';
import { Errors } from '../../entities/errors';

export class EntrepriseController {
  constructor(private service: EntrepriseService) {}

  registerRoutes(app: Application) {
    const router = Router();

    router.get('/', (req: Request, res: Response, next: NextFunction) => {
      try {
        const entreprises = this.service.getAll();
        res.json(entreprises);
      } catch (error) {
        next(error);
      }
    });

    router.post('/', (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = EntrepriseCreateSchema.parse(req.body);
        const entreprise = this.service.create(data);
        res.status(201).json(entreprise);
      } catch (error) {
        next(error);
      }
    });

    router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
          throw Errors.INVALID_INPUT([
            { field: 'id', message: "L'ID doit être un nombre entier" },
          ]);
        }
        const entreprise = this.service.getById(id);
        res.json(entreprise);
      } catch (error) {
        next(error);
      }
    });

    router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
          throw Errors.INVALID_INPUT([
            { field: 'id', message: "L'ID doit être un nombre entier" },
          ]);
        }
        const data = EntrepriseUpdateSchema.parse(req.body);
        const entreprise = this.service.update(id, data);
        res.json(entreprise);
      } catch (error) {
        next(error);
      }
    });

    router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
          throw Errors.INVALID_INPUT([
            { field: 'id', message: "L'ID doit être un nombre entier" },
          ]);
        }
        this.service.delete(id);
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    });

    app.use('/api/entreprise', router);
  }
}
