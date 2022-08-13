import { Router } from "express";
import AppointmentsController from "../controllers/appointments";
import authMW from "../middlewares/authMW";
import { isAdmin } from "../middlewares/rolesMW";

const router = Router();
const controller = new AppointmentsController();

router.get(
  "/appointments/on/:date",
  authMW,
  isAdmin,
  controller.getAllAppointmentsOnDay
);

export default router;
