import { NextFunction, Request, Response } from "express";
import { Users } from "../models/users";
import { throwCustomError } from "../utils/helperFunctions";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await Users.findOne({ where: { email: req.body.email } });
    if (!user) throwCustomError("Invalid Email or Password!", 400);
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user?.password as string
    );

    if (!isValidPassword) throwCustomError("Invalid Email or Password!", 400);

    const token = jwt.sign({ id: user?.id }, process.env.JWT_SECRET as Secret, {
      expiresIn: "1 day",
    });
    res.json({ success: true, token });
  } catch (error) {
    next(error);
  }
};
