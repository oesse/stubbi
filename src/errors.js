class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NoSuchStub extends CustomError {}
export class SchemaValidationFailed extends CustomError {
  constructor(errors) {
    super();
    this.errors = errors;
  }
}
