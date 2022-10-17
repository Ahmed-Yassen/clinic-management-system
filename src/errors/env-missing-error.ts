import { CustomError } from "./custom-error";

export class EnvMissingError extends CustomError {
  statusCode = 500;
  constructor(public envName: string) {
    super(`Env ${envName} is Missing!`);

    Object.setPrototypeOf(this, EnvMissingError.prototype);
  }

  serializeErrors() {
    return [
      { message: `Environment Variable is Missing!`, field: this.envName },
    ];
  }
}
