export interface AppError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

/**
 * Converts an unknown caught error into a standardized AppError object.
 *
 * @param error - The raw error value of unknown type caught in a try/catch or promise rejection.
 * @returns A structured {@link AppError} containing a descriptive message along with any available error metadata (status, code, details)
 */
export function normalizeError(error: unknown): AppError {
  if (error instanceof Error) {
    return {
      message: error.message,
      status: 'status' in error ? (error as { status: number }).status : undefined,
    };
  }

  if (typeof error === 'string') {
    return { message: error };
  }

  return { message: 'An unexpected error occurred' };
}
