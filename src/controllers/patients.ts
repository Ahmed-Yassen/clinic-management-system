import { NextFunction, Request, Response } from "express";
import { Patients } from "../models/patients";
import { throwCustomError } from "../utils/helperFunctions";

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

  async updatePatient(req: any, res: Response, next: NextFunction) {
    try {
      const allowedFields = ["fullName", "phoneNumber"];
      const requestFields = Object.keys(req.body);
      const isValidUpdate = requestFields.every((field) =>
        allowedFields.includes(field)
      );
      if (!isValidUpdate)
        throwCustomError("You can only update fullName & phoneNumber", 400);

      let patient = await Patients.findByPk(req.params.id);
      if (!patient)
        throwCustomError("Couldnt find a patient with that id", 404);

      const updatedPatient = await patient?.update(req.body);
      res.json({ msg: "Updated Successfully!", updatedPatient });
    } catch (error) {
      next(error);
    }
  }
}
