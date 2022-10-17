import express from "express";
import "express-async-errors";
import { NotFoundError } from "./errors/not-found-error";
import { errorHandler } from "./middlewares/error-handler";
import { EnvMissingError } from "./errors/env-missing-error";

import usersRouter from "./routes/users";
import loginRouter from "./routes/login";
import specialtiesRouter from "./routes/specialties";
import receptionistsRouter from "./routes/receptionists";
import patientsRouter from "./routes/patients";
import doctorRouter from "./routes/doctors";
import appointmentsRouter from "./routes/appointments";

import dotenv from "dotenv";
dotenv.config({ path: __dirname + `/../config/dev.env` });

if (!process.env.JWT_SECRET) throw new EnvMissingError("JWT_SECRET");

let app = express();
app.use(express.json());

app.use([
  usersRouter,
  loginRouter,
  specialtiesRouter,
  receptionistsRouter,
  patientsRouter,
  doctorRouter,
  appointmentsRouter,
]);

//- URL not found
app.use((req, res, next) => {
  throw new NotFoundError("URL");
});

//- Catch all errors
app.use(errorHandler);

export default app;
