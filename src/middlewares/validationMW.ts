const { validationResult } = require("express-validator");
import { Request, Response, NextFunction } from "express";
import { throwCustomError } from "../utils/helperFunctions";

export default (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    let message = result.errors.reduce(
      (accumlated: any, current: any) => accumlated + current.msg + " & ",
      ""
    );
    message = message.slice(0, message.length - 3);
    throwCustomError(message, 400);
  }
  next();
};
