import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import { throwCustomError } from "../utils/helperFunctions";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import { BadRequestError } from "../errors/bad-request-error";

export default async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) throw new BadRequestError("Invalid Email or Password!");

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) throw new BadRequestError("Invalid Email or Password!");

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as Secret, {
    expiresIn: "1 day",
  });

  res.json({ success: true, token });
};
