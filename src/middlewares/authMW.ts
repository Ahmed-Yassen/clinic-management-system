import { NextFunction, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { NotAuthenticatedError } from "../errors/not-authenticated.error";
import { NotFoundError } from "../errors/not-found-error";
import { User } from "../models/user";
import { throwCustomError } from "../utils/helperFunctions";

interface UserPayload {
  id: string;
}
export default async (req: any, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) throw new NotAuthenticatedError();

  const decodedToken = jwt.verify(
    token,
    process.env.JWT_SECRET as Secret
  ) as UserPayload;

  const user = await User.findByPk(decodedToken.id);
  if (!user) throw new NotFoundError("user");

  req.user = user;
  next();
};
