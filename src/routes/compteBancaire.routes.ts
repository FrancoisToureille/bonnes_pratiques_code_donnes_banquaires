import { Router, Request, Response, NextFunction } from 'express';
import { CompteBancaireService } from '../services/compteBancaire.service';
import { CompteBancaireCreateSchema, CompteBancaireUpdateSchema } from '../entities/types';
import { Errors } from '../entities/errors';
import { EntrepriseService } from '../services/entreprise.service';

const router = Router();

// GET /api/bankAccount - Get all bank accounts (with optional enterpriseId filter)
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const entrepriseId = req.query.entrepriseId ? parseInt(req.query.entrepriseId as string, 10) : undefined;
    
    if (entrepriseId !== undefined && isNaN(entrepriseId)) {
      throw Errors.INVALID_INPUT([{ field: 'entrepriseId', message: 'L\'ID d\'entreprise doit être un nombre entier' }]);
    }

    const comptes = CompteBancaireService.getAll(entrepriseId);
    res.json(comptes);
  } catch (error) {
    next(error);
  }
});

// POST /api/bankAccount - Create bank account
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = CompteBancaireCreateSchema.parse(req.body);
    const compte = CompteBancaireService.create(data);
    res.status(201).json(compte);
  } catch (error) {
    next(error);
  }
});

// GET /api/bankAccount/:id - Get bank account by ID
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw Errors.INVALID_INPUT([{ field: 'id', message: 'L\'ID doit être un nombre entier' }]);
    }
    const compte = CompteBancaireService.getById(id);
    res.json(compte);
  } catch (error) {
    next(error);
  }
});

// PUT /api/bankAccount/:id - Update bank account
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw Errors.INVALID_INPUT([{ field: 'id', message: 'L\'ID doit être un nombre entier' }]);
    }
    const data = CompteBancaireUpdateSchema.parse(req.body);
    const compte = CompteBancaireService.update(id, data);
    res.json(compte);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/bankAccount/:id - Delete bank account
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw Errors.INVALID_INPUT([{ field: 'id', message: 'L\'ID doit être un nombre entier' }]);
    }
    CompteBancaireService.delete(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// GET /api/bankAccount/:id/bankAccounts - Get bank accounts for enterprise
router.get('/:id/bankAccounts', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw Errors.INVALID_INPUT([{ field: 'id', message: 'L\'ID doit être un nombre entier' }]);
    }
    const comptes = CompteBancaireService.getForEntreprise(id);
    res.json(comptes);
  } catch (error) {
    next(error);
  }
});

export default router;
