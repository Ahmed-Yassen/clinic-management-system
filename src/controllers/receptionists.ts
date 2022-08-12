import { NextFunction, Response } from "express";
import { Receptionists } from "../models/receptionists";
import { throwCustomError } from "../utils/helperFunctions";

export default class ReceptionistsController {
  constructor() {}

  async updateProfile(req: any, res: Response, next: NextFunction) {
    try {
      const allowedFields = [
        "phoneNumber",
        "address",
        "fullName",
        "dateOfBirth",
      ];
      const requestFields = Object.keys(req.body);
      const isValidUpdate = requestFields.every((field) =>
        allowedFields.includes(field)
      );
      if (!isValidUpdate)
        throwCustomError(
          "Receptionists may only update phoneNumber, fullName, address, dateOfBirth",
          400
        );

      const receptionist = await Receptionists.findOne({
        where: { UserId: req.user.id },
      });

      await receptionist?.update(req.body);
      res.json({ success: true, receptionist });
    } catch (error) {
      next(error);
    }
  }
}
