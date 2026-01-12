import { Router, Request, Response, NextFunction } from 'express';
import { EntrepriseService } from '../services/entreprise.service';
import { EntrepriseCreateSchema, EntrepriseUpdateSchema } from '../entities/types';
import { ApiError, Errors } from '../entities/errors';
import { validateRequest } from '../middleware/validation';

const router = Router();

// GET /api/entreprise - Get all enterprises
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const entreprises = EntrepriseService.getAll();
    res.json(entreprises);
  } catch (error) {
    next(error);
  }
});

// POST /api/entreprise - Create enterprise
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = EntrepriseCreateSchema.parse(req.body);
    const entreprise = EntrepriseService.create(data);
    res.status(201).json(entreprise);
  } catch (error) {
    next(error);
  }
});

// GET /api/entreprise/:id - Get enterprise by ID
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw Errors.INVALID_INPUT([{ field: 'id', message: 'L\'ID doit être un nombre entier' }]);
    }
    const entreprise = EntrepriseService.getById(id);
    res.json(entreprise);
  } catch (error) {
    next(error);
  }
});

// PUT /api/entreprise/:id - Update enterprise
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw Errors.INVALID_INPUT([{ field: 'id', message: 'L\'ID doit être un nombre entier' }]);
    }
    const data = EntrepriseUpdateSchema.parse(req.body);
    const entreprise = EntrepriseService.update(id, data);
    res.json(entreprise);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/entreprise/:id - Delete enterprise
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw Errors.INVALID_INPUT([{ field: 'id', message: 'L\'ID doit être un nombre entier' }]);
    }
    EntrepriseService.delete(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
