export interface AppError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

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
