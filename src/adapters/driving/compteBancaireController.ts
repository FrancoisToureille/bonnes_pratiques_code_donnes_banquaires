import { Application, Router, Request, Response, NextFunction } from 'express';
import { CompteBancaireService } from '../../services/compteBancaire.service';
import {
  CompteBancaireCreateSchema,
  CompteBancaireUpdateSchema,
} from '../../entities/types';
import { Errors } from '../../entities/errors';

export class CompteBancaireController {
  constructor(private service: CompteBancaireService) {}

  registerRoutes(app: Application) {
    const router = Router();

    router.get('/', (req: Request, res: Response, next: NextFunction) => {
      try {
        const entrepriseId = req.query.entrepriseId
          ? parseInt(req.query.entrepriseId as string, 10)
          : undefined;
        if (entrepriseId !== undefined && isNaN(entrepriseId)) {
          throw Errors.INVALID_INPUT([
            {
              field: 'entrepriseId',
              message: "L'ID d'entreprise doit être un nombre entier",
            },
          ]);
        }
        const comptes = this.service.getAll(entrepriseId);
        res.json(comptes);
      } catch (error) {
        next(error);
      }
    });

    router.post('/', (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = CompteBancaireCreateSchema.parse(req.body);
        const compte = this.service.create(data);
        res.status(201).json(compte);
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
        const compte = this.service.getById(id);
        res.json(compte);
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
        const data = CompteBancaireUpdateSchema.parse(req.body);
        const compte = this.service.update(id, data);
        res.json(compte);
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

    router.get(
      '/:id/bankAccounts',
      (req: Request, res: Response, next: NextFunction) => {
        try {
          const id = parseInt(req.params.id, 10);
          if (isNaN(id)) {
            throw Errors.INVALID_INPUT([
              { field: 'id', message: "L'ID doit être un nombre entier" },
            ]);
          }
          const comptes = this.service.getForEntreprise(id);
          res.json(comptes);
        } catch (error) {
          next(error);
        }
      }
    );

    app.use('/api/bankAccount', router);
  }
}
