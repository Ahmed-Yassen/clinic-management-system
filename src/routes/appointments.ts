import { Router } from "express";
import AppointmentsController from "../controllers/appointments";
import authMW from "../middlewares/authMW";
import { isAdmin, isReceptionist } from "../middlewares/rolesMW";
import { param, body } from "express-validator";
import validationMW from "../middlewares/validationMW";

const router = Router();
const controller = new AppointmentsController();

router.get(
  "/appointments/on/:date",
  authMW,
  isAdmin,
  controller.getAllAppointmentsOnDay
);

router.post(
  "/appointments/doctor/:id",
  authMW,
  isReceptionist,
  [
    param("id")
      .isInt({ min: 1 })
      .withMessage("DoctorId should be a positive int."),
    body("PatientId")
      .isInt({ min: 1 })
      .withMessage("PatientId should be a positive int."),
  ],
  validationMW,
  controller.createAppointmentWithSpecificDoctor
);

router.post(
  "/appointments/specialty/:id",
  authMW,
  isReceptionist,
  [
    param("id")
      .isInt({ min: 1 })
      .withMessage("SpecialtyId should be a positive int."),
    body("PatientId")
      .isInt({ min: 1 })
      .withMessage("PatientId should be a positive int."),
  ],
  validationMW,
  controller.createAppointmentWithSpecificDoctor
);

router.get(
  "/appointments/doctor/:id/on/:date",
  authMW,
  isAdmin,
  [
    param("id")
      .isInt({ min: 1 })
      .withMessage("DoctorId should be a positive int."),
  ],
  validationMW,
  controller.getDoctorAppointments
);

export default router;
