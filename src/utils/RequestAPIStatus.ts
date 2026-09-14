export class RequestStatus<TErrorType = unknown> {
  constructor() {}

  //factory methods
  static noRequest(): NoRequest {
    return new NoRequest();
  }

  static pendingRequest(): PendingRequest {
    return new PendingRequest();
  }

  static errorRequest<T>(error: T): ErrorRequest<T> {
    return new ErrorRequest(error);
  }

  static completeRequest(): CompleteRequest {
    return new CompleteRequest();
  }

  //type guards
  isNoRequest(): this is NoRequest {
    return this instanceof NoRequest;
  }

  isPendingRequest(): this is PendingRequest {
    return this instanceof PendingRequest;
  }

  isErrorRequest(): this is ErrorRequest<TErrorType> {
    return this instanceof ErrorRequest;
  }

  isCompleteRequest(): this is CompleteRequest {
    return this instanceof CompleteRequest;
  }
}

//subclasses
export class NoRequest extends RequestStatus<never> {
  constructor() {
    super();
  }
}

export class PendingRequest extends RequestStatus<never> {
  constructor() {
    super();
  }
}

export class ErrorRequest<TErrorType> extends RequestStatus<TErrorType> {
  error: TErrorType;

  constructor(error: TErrorType) {
    super();
    this.error = error;
  }
}

export class CompleteRequest extends RequestStatus<never> {
  constructor() {
    super();
  }
}
