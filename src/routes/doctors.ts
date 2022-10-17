import { Router } from "express";
import { body } from "express-validator";
import DoctorsController from "../controllers/doctors";
import authMW from "../middlewares/authMW";
import { isDoctor } from "../middlewares/rolesMW";
import { validateRequest } from "../middlewares/validatate-request";

const router = Router();
const controller = new DoctorsController();

router.patch(
  "/api/users/doctors",
  authMW,
  isDoctor,
  [
    body("fullName")
      .optional()
      .isString()
      .withMessage("Invalid fullName value."),
    body("address").optional().isString().withMessage("Invalid address value."),
    body("phoneNumber")
      .optional()
      .matches(/^01[0125][0-9]{8}$/)
      .withMessage("Invalid phoneNumber value."),
  ],
  validateRequest,
  controller.updateProfile
);

export default router;
