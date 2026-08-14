export class RequestStatus<TResponseType = unknown, TErrorType = unknown> {
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

  static completeRequest<T>(payload: T): CompleteRequest<T> {
    return new CompleteRequest(payload);
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

  isCompleteRequest(): this is CompleteRequest<TResponseType> {
    return this instanceof CompleteRequest;
  }
}

//subclasses
class NoRequest extends RequestStatus<never, never> {
  constructor() {
    super();
  }
}

class PendingRequest extends RequestStatus<never, never> {
  constructor() {
    super();
  }
}

class ErrorRequest<TErrorType> extends RequestStatus<never, TErrorType> {
  error: TErrorType;

  constructor(error: TErrorType) {
    super();
    this.error = error;
  }
}

class CompleteRequest<TResponseType> extends RequestStatus<TResponseType, never> {
  payload: TResponseType;

  constructor(payload: TResponseType) {
    super();
    this.payload = payload;
  }
}
