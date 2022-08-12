import { Router } from "express";
import userController from "../controllers/users";
import { body } from "express-validator";
import validationMW from "../middlewares/validationMW";
import authMW from "../middlewares/authMW";
import { isAdmin } from "../middlewares/rolesMW";

const router = Router();
const controller = new userController();

router.post(
  "/signup/receptionist",
  authMW,
  isAdmin,
  [
    body("email")
      .isEmail()
      .toLowerCase()
      .withMessage("Please provide a valid email"),
    body("password")
      .isString()
      .isLength({ min: 8, max: 32 })
      .withMessage("Password should be between 8 and 32 string characters"),
    body("phoneNumber")
      .matches(/^01[0125][0-9]{8}$/)
      .withMessage("Incorrect phoneNumber value."),
    body("address").isString().withMessage("Incorrect address value."),
    body("fullName").isString().withMessage("Incorrect fullName value."),
    body("salary")
      .isFloat({ min: 2700 })
      .withMessage("Incorrect Salary value."),
  ],
  validationMW,
  controller.createReceptionist
);

router.post(
  "/signup/doctor",
  authMW,
  isAdmin,
  [
    body("email")
      .isEmail()
      .toLowerCase()
      .withMessage("Please provide a valid email"),
    body("password")
      .isString()
      .isLength({ min: 8, max: 32 })
      .withMessage("Password should be between 8 and 32 string characters"),
    body("phoneNumber")
      .matches(/^01[0125][0-9]{8}$/)
      .withMessage("Incorrect phoneNumber value."),
    body("address").isString().withMessage("Incorrect address value."),
    body("fullName").isString().withMessage("Incorrect fullName value."),
    body("examinationPrice")
      .isFloat({ min: 50 })
      .withMessage("Incorrect ExaminationPrice value."),
    body("SpecialtyId")
      .isInt({ min: 1 })
      .withMessage("Incorrect SpecialtyId value."),
  ],
  validationMW,
  controller.createDoctor
);

export default router;