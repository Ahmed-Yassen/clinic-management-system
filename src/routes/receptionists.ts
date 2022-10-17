import { Router } from "express";
import ReceptionistsController from "../controllers/receptionists";
import authMW from "../middlewares/authMW";
import { isReceptionist } from "../middlewares/rolesMW";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validatate-request";

const router = Router();
const controller = new ReceptionistsController();

router.patch(
  "/api/users/receptionists",
  authMW,
  isReceptionist,
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
