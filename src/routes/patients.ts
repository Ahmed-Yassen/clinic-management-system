import { Router } from "express";
import PatientsController from "../controllers/patients";
import authMW from "../middlewares/authMW";

const router = Router();
const controller = new PatientsController();

router.route("/patients").get(authMW, controller.getAllPatients);

export default router;
