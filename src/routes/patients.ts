import { Router } from "express";
import PatientsController from "../controllers/patients";
import authMW from "../middlewares/authMW";
import { isReceptionist } from "../middlewares/rolesMW";
import { body, param } from "express-validator";
import { validateRequest } from "../middlewares/validatate-request";

const router = Router();
const controller = new PatientsController();

router
  .route("/api/patients")
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
    validateRequest,
    controller.createPatient
  );

router
  .route("/api/patients/:id")
  .patch(
    authMW,
    isReceptionist,
    [
      param("id").isInt({ min: 1 }).withMessage("Invalid patient id value."),
      body("phoneNumber")
        .optional()
        .matches(/^01[0125][0-9]{8}$/)
        .withMessage("Invalid phoneNumber value."),
      body("fullName")
        .optional()
        .isString()
        .withMessage("Invalid fullName value."),
    ],
    validateRequest,
    controller.updatePatient
  )
  .delete(
    authMW,
    isReceptionist,
    [param("id").isInt({ min: 1 }).withMessage("Invalid patient id value.")],
    validateRequest,
    controller.deletePatient
  );
export default router;
