import { Router } from "express";
import ReceptionistsController from "../controllers/receptionists";
import authMW from "../middlewares/authMW";
import { isReceptionist } from "../middlewares/rolesMW";
import validationMW from "../middlewares/validationMW";
import { body } from "express-validator";
const router = Router();
const controller = new ReceptionistsController();

router.route("/receptionists").patch(
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
  validationMW,
  controller.updateProfile
);
export default router;
