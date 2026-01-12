export interface ErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: ErrorDetail[];
  timestamp: string;
}

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
    public details?: ErrorDetail[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Error factory functions
export const Errors = {
  VALIDATION_ERROR: (details?: ErrorDetail[]) =>
    new ApiError('VALIDATION_ERROR', 'Erreur de validation des données', 400, details),

  INVALID_INPUT: (details?: ErrorDetail[]) =>
    new ApiError('INVALID_INPUT', 'Données d\'entrée invalides', 400, details),

  ENTREPRISE_NOT_FOUND: (id: number) =>
    new ApiError('ENTREPRISE_NOT_FOUND', `Entreprise avec l'ID ${id} introuvable`, 404),

  COMPTE_NOT_FOUND: (id: number) =>
    new ApiError('COMPTE_NOT_FOUND', `Compte bancaire avec l'ID ${id} introuvable`, 404),

  SIRET_ALREADY_EXISTS: (siret: string) =>
    new ApiError('SIRET_ALREADY_EXISTS', `Une entreprise avec le SIRET ${siret} existe déjà`, 409),

  NUMERO_COMPTE_ALREADY_EXISTS: (numero: string) =>
    new ApiError('NUMERO_COMPTE_ALREADY_EXISTS', `Un compte avec le numéro ${numero} existe déjà`, 409),

  CANNOT_DELETE_ENTREPRISE_WITH_COMPTES: () =>
    new ApiError(
      'CANNOT_DELETE_ENTREPRISE_WITH_COMPTES',
      'Impossible de supprimer l\'entreprise car elle possède des comptes bancaires',
      400
    ),

  ENTREPRISE_REFERENCE_INVALID: () =>
    new ApiError('ENTREPRISE_REFERENCE_INVALID', 'Référence entreprise invalide', 400),

  DATABASE_ERROR: (message?: string) =>
    new ApiError('DATABASE_ERROR', message || 'Erreur base de données', 500),

  INTERNAL_ERROR: (message?: string) =>
    new ApiError('INTERNAL_ERROR', message || 'Erreur interne du serveur', 500),
};
