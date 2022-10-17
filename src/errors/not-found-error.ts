import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  statusCode: number = 404;
  constructor(public resource: string) {
    super(`Resource not found: ${resource}`);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: `${this.resource} Not found` }];
  }
}
