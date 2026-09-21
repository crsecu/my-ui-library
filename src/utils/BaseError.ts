type BaseErrorOptions = {
  statusCode?: number | string;
  subCode?: number | string;
  description?: string;
};

export class BaseError extends Error {
  errorType: string;
  statusCode?: number | string;
  subCode?: number | string;
  description?: string;

  constructor(message: string, errorType: string, options: BaseErrorOptions = {}) {
    super(message);
    this.errorType = errorType;
    this.statusCode = options.statusCode;
    this.subCode = options.subCode;
    this.description = options.description;
  }
}
