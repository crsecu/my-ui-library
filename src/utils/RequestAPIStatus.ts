class RequestStatus {
  constructor() {}

  static noRequest(): NoRequest {
    return new NoRequest();
  }

  static pendingRequest(): PendingRequest {
    return new PendingRequest();
  }

  static errorRequest(): ErrorRequest {
    return new ErrorRequest();
  }

  static completeRequest(): CompleteRequest {
    return new CompleteRequest();
  }
}

//factory methods
class NoRequest extends RequestStatus {
  constructor() {
    super();
  }
}

class PendingRequest extends RequestStatus {
  constructor() {
    super();
  }
}

class ErrorRequest extends RequestStatus {
  constructor() {
    super();
  }
}

class CompleteRequest extends RequestStatus {
  constructor() {
    super();
  }

  //instance type guard methods
}
