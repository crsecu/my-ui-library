import { BaseError } from './BaseError.ts';

/**
 * Converts an unknown caught error into a standardized BaseError object.
 *
 * @param error - The raw error value of unknown type caught in a try/catch or promise rejection.
 * @returns A structured {@link BaseError} containing a descriptive message along with any available error metadata (statusCode, subCode, description)
 */
export function normalizeError(error: unknown): BaseError {
  if (error instanceof BaseError) {
    return error;
  }

  if (error instanceof Error) {
    const status =
      'status' in error && (typeof error.status === 'number' || typeof error.status === 'string')
        ? error.status
        : undefined;

    return new BaseError(error.message, 'unknown', { statusCode: status });
  }

  if (typeof error === 'string') {
    return new BaseError(error, 'unknown');
  }

  return new BaseError('An unexpected error occurred', 'unknown');
}
