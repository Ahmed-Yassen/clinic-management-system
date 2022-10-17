import { Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import { throwCustomError } from "../utils/helperFunctions";

const isAdmin = (req: any, res: Response, next: NextFunction) => {
  if (req.user.role === "admin") return next();
  throw new NotAuthorizedError();
};

const isDoctor = (req: any, res: Response, next: NextFunction) => {
  if (req.user.role === "doctor") return next();
  throw new NotAuthorizedError();
};

const isReceptionist = (req: any, res: Response, next: NextFunction) => {
  if (req.user.role === "receptionist") return next();
  throw new NotAuthorizedError();
};

export { isAdmin, isDoctor, isReceptionist };
