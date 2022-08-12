import { Router } from "express";
import { body, param } from "express-validator";
import authMW from "../middlewares/authMW";
import { isAdmin } from "../middlewares/rolesMW";
import validationMW from "../middlewares/validationMW";
import SpecialtyController from "../controllers/specialties";

const router = Router();
const controller = new SpecialtyController();

router
  .route("/specialties")
  .post(
    authMW,
    isAdmin,
    [
      body("name")
        .isString()
        .withMessage("Specialty name should be text!")
        .toLowerCase(),
    ],
    validationMW,
    controller.createSpecialty
  )
  .get(authMW, controller.getAllSpecialties);

export default router;
