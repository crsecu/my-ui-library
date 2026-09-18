import { AppError } from './AppError.ts';

/**
 * Converts an unknown caught error into a standardized AppError object.
 *
 * @param error - The raw error value of unknown type caught in a try/catch or promise rejection.
 * @returns A structured {@link AppError} containing a descriptive message along with any available error metadata (status, code, details)
 */
export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    const status =
      'status' in error && (typeof error.status === 'number' || typeof error.status === 'string')
        ? error.status
        : undefined;

    return new AppError(error.message, status);
  }

  if (typeof error === 'string') {
    return new AppError(error);
  }

  return new AppError('An unexpected error occurred');
}
