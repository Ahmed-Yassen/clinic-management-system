import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
  statusCode: number = 403;
  constructor() {
    super("Not authorized");
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }
  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [{ message: "Not authorized" }];
  }
}
