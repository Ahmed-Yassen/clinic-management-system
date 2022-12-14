import { Request, Response } from "express";
import { BadRequestError } from "../errors/bad-request-error";

export default class ReceptionistsController {
  async updateProfile(req: Request, res: Response) {
    const allowedFields = ["phoneNumber", "address", "fullName", "dateOfBirth"];
    const requestFields = Object.keys(req.body);

    const isValidUpdate = requestFields.every((field) =>
      allowedFields.includes(field)
    );
    if (!isValidUpdate)
      throw new BadRequestError(
        "Receptionists may only update phoneNumber, fullName, address, dateOfBirth"
      );

    const receptionist = await req.user?.$get("receptionist");
    await receptionist?.update(req.body);

    res.json({ success: true, receptionist });
  }
}
