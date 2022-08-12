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

  async getAllSpecialties(req: Request, res: Response, next: NextFunction) {
    try {
      const specialties = await Specialties.findAll();
      res.json({ success: true, specialties });
    } catch (error) {
      next(error);
    }
  }

  async updateSpecialty(req: Request, res: Response, next: NextFunction) {
    try {
      let specialty = await Specialties.findByPk(req.params.id);
      if (!specialty)
        throwCustomError("Couldnt find a specialty with that id!", 404);

      await specialty?.update(req.body);
      res.json({ success: true, specialty });
    } catch (error) {
      next(error);
    }
  }
}
