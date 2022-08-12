import { NextFunction, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { Users } from "../models/users";
import { throwCustomError } from "../utils/helperFunctions";

export default async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throwCustomError("Unauthenticated!", 401);

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as Secret
    ) as JwtPayload;
    const user = await Users.findByPk(decodedToken.id);
    if (!user) throwCustomError("Couldnt find a user with that id", 404);

    req.role = user?.role;
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
