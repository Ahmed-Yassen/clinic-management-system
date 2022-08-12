import { NextFunction, Request, Response } from "express";
import { Specialties } from "../models/specialties";
import { throwCustomError } from "../utils/helperFunctions";

export default class SpecialtiesController {
  constructor() {}

  async createSpecialty(req: Request, res: Response, next: NextFunction) {
    try {
      let specialty = await Specialties.findOne({
        where: { name: req.body.name },
      });
      if (specialty) throwCustomError("This specialty already exists!", 400);

      specialty = await Specialties.create({ ...req.body });
      res.status(201).json({ sucess: true, specialty });
    } catch (error) {
      next(error);
    }
  }
}
