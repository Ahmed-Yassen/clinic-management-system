import { Router } from "express";
import AppointmentsController from "../controllers/appointments";
import authMW from "../middlewares/authMW";
import { isAdmin, isDoctor, isReceptionist } from "../middlewares/rolesMW";
import { param, body } from "express-validator";
import { validateRequest } from "../middlewares/validatate-request";

const router = Router();
const controller = new AppointmentsController();

router.get(
  "/api/appointments/on/:day",
  authMW,
  isAdmin,
  controller.getAllAppointmentsOnDay
);

router.get(
  "/api/doctors/appointments/on/:day",
  authMW,
  isDoctor,
  controller.getMyAppointments
);

router.post(
  "/api/appointments/doctor/:id",
  authMW,
  isReceptionist,
  [
    param("id")
      .isInt({ min: 1 })
      .withMessage("doctorId should be a positive int."),
    body("patientId")
      .isInt({ min: 1 })
      .withMessage("patientId should be a positive int."),
  ],
  validateRequest,
  controller.createAppointmentWithSpecificDoctor
);

router.post(
  "/api/appointments/specialty/:id",
  authMW,
  isReceptionist,
  [
    param("id")
      .isInt({ min: 1 })
      .withMessage("specialtyId should be a positive int."),
    body("patientId")
      .isInt({ min: 1 })
      .withMessage("patientId should be a positive int."),
  ],
  validateRequest,
  controller.createAppointmentInSpecialty
);

router.get(
  "/api/appointments/doctor/:id/on/:day",
  authMW,
  isAdmin,
  [
    param("id")
      .isInt({ min: 1 })
      .withMessage("doctorId should be a positive int."),
  ],
  validateRequest,
  controller.getDoctorAppointments
);

router.get(
  "/api/appointments/specialty/:id/on/:day",
  authMW,
  isAdmin,
  [
    param("id")
      .isInt({ min: 1 })
      .withMessage("SpecialtyId should be a positive int."),
  ],
  validateRequest,
  controller.getSpecialtyAppointments
);

router.get(
  "/api/appointments/nearest/doctor/:id/on/:day",
  authMW,
  isReceptionist,
  [
    param("id")
      .isInt({ min: 1 })
      .withMessage("doctorId should be a positive int."),
  ],
  validateRequest,
  controller.getDoctorNearestAppointment
);

router.get(
  "/api/appointments/nearest/specialty/:id/on/:day",
  authMW,
  isReceptionist,
  [
    param("id")
      .isInt({ min: 1 })
      .withMessage("specialtyId should be a positive int."),
  ],
  validateRequest,
  controller.getSpecialtyNearestAppointment
);

router
  .route("/api/appointments/:id")
  .patch(
    authMW,
    isReceptionist,
    [
      param("id")
        .isInt({ min: 1 })
        .withMessage("appointmentId should be a positive int."),
    ],
    validateRequest,
    controller.editAppointment
  )
  .delete(
    authMW,
    isReceptionist,
    [
      param("id")
        .isInt({ min: 1 })
        .withMessage("appointmentId should be a positive int."),
    ],
    validateRequest,
    controller.cancelAppointment
  );

export default router;
