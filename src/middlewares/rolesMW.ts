import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/not-authorized-error";

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role === "admin") return next();
  throw new NotAuthorizedError();
};

const isDoctor = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role === "doctor") return next();
  throw new NotAuthorizedError();
};

const isReceptionist = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role === "receptionist") return next();
  throw new NotAuthorizedError();
};

export { isAdmin, isDoctor, isReceptionist };
