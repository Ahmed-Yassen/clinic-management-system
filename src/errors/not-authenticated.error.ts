import { CustomError } from "./custom-error";

export class NotAuthenticatedError extends CustomError {
  statusCode: number = 401;
  constructor() {
    super("Not authenticated");
    Object.setPrototypeOf(this, NotAuthenticatedError.prototype);
  }
  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [{ message: "Not authenticated" }];
  }
}
