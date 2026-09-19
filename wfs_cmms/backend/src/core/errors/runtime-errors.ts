export class NotAuthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotAuthorizedError";
  }
}

export class InvalidTenantError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidTenantError";
  }
}

export class MissingContextError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MissingContextError";
  }
}
