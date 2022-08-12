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
  async createPatient(req: any, res: Response, next: NextFunction) {
    try {
      const patient = await Patients.create({ ...req.body });
      res.status(201).json({ msg: "Patient Created!", patient });
    } catch (error) {
      next(error);
    }
  }
}
