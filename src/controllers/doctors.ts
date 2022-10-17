import { Request, Response } from "express";
import { BadRequestError } from "../errors/bad-request-error";
import { Doctor } from "../models/doctor";
import { throwCustomError } from "../utils/helperFunctions";

export default class DoctorsController {
  async updateProfile(req: Request, res: Response) {
    const { user } = req;
    const allowedFields = ["phoneNumber", "address", "fullName"];
    const requestFields = Object.keys(req.body);

    const isValidUpdate = requestFields.every((field) =>
      allowedFields.includes(field)
    );
    if (!isValidUpdate)
      throw new BadRequestError(
        "Doctors can only update phoneNumber, address, fullName"
      );

    const doctor = await user?.$get("doctor");
    await doctor?.update(req.body);
    res.json({ success: true, doctor });
  }
}
