import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/bad-request-error";
import { Specialty } from "../models/specialty";
import { throwCustomError } from "../utils/helperFunctions";

export default class SpecialtiesController {
  constructor() {}

  async createSpecialty(req: Request, res: Response) {
    const { name } = req.body;

    let specialty = await Specialty.findOne({
      where: { name },
    });
    if (specialty) throw new BadRequestError("This specialty already exists!");

    specialty = await Specialty.create({ name });

    res.status(201).json({ success: true, specialty });
  }

  async getAllSpecialties(req: Request, res: Response, next: NextFunction) {
    try {
      const specialties = await Specialty.findAll();
      res.json({ success: true, specialties });
    } catch (error) {
      next(error);
    }
  }

  async updateSpecialty(req: Request, res: Response, next: NextFunction) {
    try {
      let specialty = await Specialty.findByPk(req.params.id);
      if (!specialty)
        throwCustomError("Couldnt find a specialty with that id!", 404);

      await specialty?.update(req.body);
      res.json({ success: true, specialty });
    } catch (error) {
      next(error);
    }
  }

  async deleteSpecialty(req: Request, res: Response, next: NextFunction) {
    try {
      let specialty = await Specialty.findByPk(req.params.id);
      if (!specialty)
        throwCustomError("Couldnt find a specialty with that id!", 404);

      await specialty?.destroy();
      res.json({ success: true, specialty });
    } catch (error) {
      next(error);
    }
  }
}
