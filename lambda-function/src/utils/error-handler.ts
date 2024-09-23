import { APIGatewayProxyResult } from 'aws-lambda';
import { logger } from './logger';
import { ErrorWithCode } from '../models/error-with-code';



export function handleError(error: ErrorWithCode): APIGatewayProxyResult {
  logger.error('Error occurred', { error: error.message, stack: error.stack });

  let statusCode = 500;
  let errorMessage = 'Se produjo un error interno del servidor';

  // Manejar tipos de errores específicos
  switch (error.code) {
    case 'ValidationError':
      statusCode = 400;
      errorMessage = 'Error de validación: ' + error.message;
      break;
    case 'NotFoundError':
      statusCode = 404;
      errorMessage = 'Recurso no encontrado: ' + error.message;
      break;
    case 'UnauthorizedError':
      statusCode = 401;
      errorMessage = 'No autorizado: ' + error.message;
      break;
    case 'ForbiddenError':
      statusCode = 403;
      errorMessage = 'Acceso prohibido: ' + error.message;
      break;
    // Puedes agregar más casos según sea necesario
  }

  return {
    statusCode,
    body: JSON.stringify({
      error: errorMessage,
      stack: error.stack
    }),
    headers: {
      'Content-Type': 'application/json',
      'X-Error-Code': error.code || 'InternalServerError',
    },
  };
}

// Errores personalizados
export class ValidationError extends Error {
  code = 'ValidationError';
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  code = 'NotFoundError';
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends Error {
  code = 'UnauthorizedError';
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  code = 'ForbiddenError';
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
  }
}