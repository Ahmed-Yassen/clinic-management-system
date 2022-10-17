import { Router } from "express";
import { body, param } from "express-validator";
import authMW from "../middlewares/authMW";
import { isAdmin } from "../middlewares/rolesMW";
import validationMW from "../middlewares/validationMW";
import SpecialtyController from "../controllers/specialties";
import { validateRequest } from "../middlewares/validatate-request";

const router = Router();
const controller = new SpecialtyController();

router
  .route("/api/specialties")
  .post(
    authMW,
    isAdmin,
    [
      body("name")
        .isString()
        .withMessage("Specialty name should be text!")
        .toLowerCase(),
    ],
    validateRequest,
    controller.createSpecialty
  )
  .get(authMW, controller.getAllSpecialties);

router
  .route("/specialties/:id")
  .patch(
    authMW,
    isAdmin,
    [
      param("id")
        .isInt({ min: 1 })
        .withMessage("Specialty id should be number!"),
      body("name").isString().withMessage("Specialty name should be text!"),
    ],
    validationMW,
    controller.updateSpecialty
  )
  .delete(
    authMW,
    isAdmin,
    [
      param("id")
        .isInt({ min: 1 })
        .withMessage("Specialty id should be number!"),
    ],
    validationMW,
    controller.deleteSpecialty
  );
export default router;
