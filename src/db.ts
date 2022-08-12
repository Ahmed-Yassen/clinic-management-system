import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../config/dev.env" });

import { Sequelize } from "sequelize-typescript";
import { Users } from "./models/users";
import { Appointments } from "./models/appointments";
import { Doctors } from "./models/doctors";
import { Patients } from "./models/patients";
import { Receptionists } from "./models/receptionists";
import { Specialties } from "./models/specialties";

const connection = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
  models: [Users, Appointments, Doctors, Patients, Receptionists, Specialties],
});

export default connection;
