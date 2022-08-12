import { NextFunction, Request, Response } from "express";
import { Patients } from "../models/patients";

export default class PatientsController {
  constructor() {}

  async getAllPatients(req: Request, res: Response, next: NextFunction) {
    try {
      const patients = await Patients.findAll();
      res.json(patients);
    } catch (error) {
      next(error);
    }
  }
}
