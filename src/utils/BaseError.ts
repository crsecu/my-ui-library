export class BaseError extends Error {
  statusCode?: number | string;
  subCode?: number | string;
  errorType?: string;
  description?: string;

  constructor(
    message: string,
    statusCode?: number | string,
    subCode?: number | string,
    errorType?: string,
    description?: string,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.subCode = subCode;
    this.errorType = errorType;
    this.description = description;
  }
}
