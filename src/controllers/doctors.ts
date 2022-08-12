import { NextFunction, Response } from "express";
import { Doctors } from "../models/doctors";
import { throwCustomError } from "../utils/helperFunctions";

export default class DoctorsController {
  constructor() {}

  async updateProfile(req: any, res: Response, next: NextFunction) {
    try {
      const allowedFields = ["phoneNumber", "address", "fullName"];
      const requestFields = Object.keys(req.body);
      const isValidUpdate = requestFields.every((field) =>
        allowedFields.includes(field)
      );
      if (!isValidUpdate)
        throwCustomError(
          "Doctors can only update phoneNumber, address, fullName",
          400
        );
      const doctor = await Doctors.findOne({
        where: { UserId: req.user.id },
      });
      await doctor?.update(req.body);
      res.json({ success: true, doctor });
    } catch (error) {
      next(error);
    }
  }
}
