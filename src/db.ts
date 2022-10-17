import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize/types";
import { EnvMissingError } from "./errors/env-missing-error";
import { Doctor } from "./models/doctor";
import { Patient } from "./models/patient";
import { Receptionist } from "./models/receptionist";
import { Specialty } from "./models/specialty";
import { User } from "./models/user";

const dialect = process.env.DB_DIALECT as Dialect;
if (!dialect) throw new EnvMissingError("DB_DIALECT");

const database = process.env.DB_NAME;
if (!database) throw new EnvMissingError("DB_NAME");

const username = process.env.DB_USERNAME;
if (!username) throw new EnvMissingError("DB_USERNAME");

const password = process.env.DB_PASSWORD;
if (!password) throw new EnvMissingError("DB_PASSWORD");

const connection = new Sequelize({
  dialect,
  username,
  password,
  database,
  logging: false,
  models: [User, Doctor, Receptionist, Specialty, Patient],
});

// Patients.hasMany(Appointments, {
//   foreignKey: {
//     allowNull: false,
//   },
//   hooks: true,
// });
// Appointments.belongsTo(Patients);

// Doctors.hasMany(Appointments, {
//   foreignKey: {
//     allowNull: false,
//   },
//   hooks: true,
// });
// Appointments.belongsTo(Doctors);

export default connection;
