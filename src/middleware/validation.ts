import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError, ApiErrorResponse } from '../entities/errors';

export function validateRequest(req: Request, res: Response, next: NextFunction) {
  next();
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const timestamp = new Date().toISOString();

  if (err instanceof ZodError) {
    const details = err.errors.map((error) => ({
      field: error.path.join('.'),
      message: error.message,
    }));
    
    const response: ApiErrorResponse = {
      code: 'VALIDATION_ERROR',
      message: 'Erreur de validation des données',
      details,
      timestamp,
    };
    
    return res.status(400).json(response);
  }

  if (err instanceof ApiError) {
    const response: ApiErrorResponse = {
      code: err.code,
      message: err.message,
      details: err.details,
      timestamp,
    };
    
    return res.status(err.statusCode).json(response);
  }

  // Default error
  const response: ApiErrorResponse = {
    code: 'INTERNAL_ERROR',
    message: 'Erreur interne du serveur',
    timestamp,
  };

  res.status(500).json(response);
}
