import { Router } from "express";
import PatientsController from "../controllers/patients";
import authMW from "../middlewares/authMW";
import validationMW from "../middlewares/validationMW";
import { isReceptionist } from "../middlewares/rolesMW";
import { body } from "express-validator";
const router = Router();
const controller = new PatientsController();

router
  .route("/patients")
  .get(authMW, controller.getAllPatients)
  .post(
    authMW,
    isReceptionist,
    [
      body("phoneNumber")
        .matches(/^01[0125][0-9]{8}$/)
        .withMessage("Invalid phoneNumber value."),
      body("fullName").isString().withMessage("Invalid fullName value."),
    ],
    validationMW,
    controller.createPatient
  );

export default router;
