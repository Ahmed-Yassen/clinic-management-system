import { Request, Response } from "express";
import { BadRequestError } from "../errors/bad-request-error";
import { NotFoundError } from "../errors/not-found-error";
import { Patient } from "../models/patient";
import { throwCustomError } from "../utils/helperFunctions";

export default class PatientsController {
  constructor() {}

  async getAllPatients(req: Request, res: Response) {
    const patients = await Patient.findAll();
    res.json(patients);
  }

  async createPatient(req: any, res: Response) {
    const patient = await Patient.create({ ...req.body });
    res.status(201).json({ success: true, patient });
  }

  async updatePatient(req: Request, res: Response) {
    const allowedFields = ["fullName", "phoneNumber"];
    const requestFields = Object.keys(req.body);
    const isValidUpdate = requestFields.every((field) =>
      allowedFields.includes(field)
    );
    if (!isValidUpdate)
      throw new BadRequestError("You can only update fullName & phoneNumber");

    let patient = await Patient.findByPk(req.params.id);
    if (!patient) throw new NotFoundError("patient");

    await patient?.update(req.body);
    res.json({ success: true, patient });
  }

  async deletePatient(req: Request, res: Response) {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) throw new NotFoundError("patient");
    await patient?.destroy();
    res.json({ success: true, patient });
  }
}
