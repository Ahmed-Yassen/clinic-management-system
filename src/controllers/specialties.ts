import { Request, Response } from "express";
import { BadRequestError } from "../errors/bad-request-error";
import { NotFoundError } from "../errors/not-found-error";
import { Specialty } from "../models/specialty";

export default class SpecialtiesController {
  async createSpecialty(req: Request, res: Response) {
    const { name } = req.body;

    let specialty = await Specialty.findOne({
      where: { name },
    });
    if (specialty) throw new BadRequestError("This specialty already exists!");

    specialty = await Specialty.create({ name });

    res.status(201).json({ success: true, specialty });
  }

  async getAllSpecialties(req: Request, res: Response) {
    const specialties = await Specialty.findAll();
    res.json({ success: true, specialties });
  }

  async updateSpecialty(req: Request, res: Response) {
    let specialty = await Specialty.findByPk(req.params.id);
    if (!specialty) throw new NotFoundError("specialty");

    await specialty?.update(req.body);
    res.json({ success: true, specialty });
  }

  async deleteSpecialty(req: Request, res: Response) {
    let specialty = await Specialty.findByPk(req.params.id);
    if (!specialty) throw new NotFoundError("specialty");

    await specialty?.destroy();
    res.json({ success: true, specialty });
  }
}
