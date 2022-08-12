import { Response, NextFunction } from "express";
import { throwCustomError } from "../utils/helperFunctions";

const isAdmin = (req: any, res: Response, next: NextFunction) => {
  req.role === "admin"
    ? next()
    : throwCustomError("Forbidden Operation!, Only Admins can access", 403);
};

const isDoctor = (req: any, res: Response, next: NextFunction) => {
  req.role === "doctor"
    ? next()
    : throwCustomError("Forbidden Operation!, Only Doctors can access", 403);
};

const isReceptionist = (req: any, res: Response, next: NextFunction) => {
  req.role === "receptionist"
    ? next()
    : throwCustomError(
        "Forbidden Operation!, Only Receptionists can access",
        403
      );
};

export { isAdmin, isDoctor, isReceptionist };
