import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize/types";
import { EnvMissingError } from "./errors/env-missing-error";
import { Doctor } from "./models/doctor";
import { Receptionist } from "./models/receptionist";
import { User } from "./models/user";

const dialect = process.env.DB_DIALECT as Dialect;
if (!dialect) throw new EnvMissingError("DB_DIALECT");

const database = process.env.DB_NAME;
if (!database) throw new EnvMissingError("DB_NAME");

const username = process.env.DB_USERNAME;
if (!username) throw new EnvMissingError("DB_USERNAME");

const password = process.env.DB_PASSWORD;
if (!password) throw new EnvMissingError("DB_PASSWORD").serializeErrors();

const connection = new Sequelize({
  dialect,
  username,
  password,
  database,
  logging: false,
  // models: [__dirname + "/models/"],
  models: [User, Doctor, Receptionist],
});

/** One To One */
// Users.hasOne(Receptionists, {
//   foreignKey: {
//     allowNull: false,
//   },
//   onDelete: "CASCADE",
//   hooks: true,
// });
// Receptionists.belongsTo(Users);

// /** One To Many */
// Specialties.hasMany(Doctors, {
//   foreignKey: {
//     allowNull: false,
//   },
//   hooks: true,
// });
// Doctors.belongsTo(Specialties);

// Specialties.hasMany(Appointments, {
//   foreignKey: {
//     allowNull: false,
//   },
//   hooks: true,
// });
// Appointments.belongsTo(Specialties);

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
