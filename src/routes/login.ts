import { Router } from "express";
import validationMW from "../middlewares/validationMW";
import loginController from "../controllers/login";
import { body } from "express-validator";
const router = Router();
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .toLowerCase()
      .withMessage("Please provide a valid email"),
    body("password")
      .isString()
      .isLength({ min: 8, max: 32 })
      .withMessage("Password should be between 8 and 32 string characters"),
  ],
  validationMW,
  loginController
);

export default router;
