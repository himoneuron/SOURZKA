// lib/errors/BadRequestError.ts
import { BaseError } from "./BaseError";

export class BadRequestError extends BaseError {
  constructor(message = "Bad request", details?: unknown) {
    super(message, 400, details);
  }
}

// lib/errors/UnauthorizedError.ts
export class UnauthorizedError extends BaseError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

// lib/errors/ForbiddenError.ts
export class ForbiddenError extends BaseError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

// lib/errors/NotFoundError.ts
export class NotFoundError extends BaseError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

// lib/errors/EntityConflict.ts
export class EntityConflict extends BaseError {
  constructor(message = "Conflict, entity already exists") {
    super(message, 409);
  }
}
