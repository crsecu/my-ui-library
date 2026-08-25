export class AppError extends Error {
  httpStatus?: number | string;
  errorCode?: string;
  details?: unknown;

  constructor(
    message: string,
    httpStatus?: number | string,
    errorCode?: string,
    details?: unknown,
  ) {
    super(message);

    this.httpStatus = httpStatus;
    this.errorCode = errorCode;
    this.details = details;
  }
}
