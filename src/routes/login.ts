import { Router } from "express";
import loginController from "../controllers/login";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validatate-request";
const router = Router();
router.post(
  "/api/auth/login",
  [
    body("email")
      .isEmail()
      .toLowerCase()
      .withMessage("Please provide a valid email"),
    body("password")
      .isAlphanumeric()
      .withMessage("Please provide a valid password"),
  ],
  validateRequest,
  loginController
);

export default router;
