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

/** One To One */
Users.hasOne(Receptionists, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: "CASCADE",
  hooks: true,
});
Receptionists.belongsTo(Users);

Users.hasOne(Doctors, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: "CASCADE",
  hooks: true,
});
Doctors.belongsTo(Users);

/** One To Many */
Specialties.hasMany(Doctors, {
  foreignKey: {
    allowNull: false,
  },
  hooks: true,
});
Doctors.belongsTo(Specialties);

Specialties.hasMany(Appointments, {
  foreignKey: {
    allowNull: false,
  },
  hooks: true,
});
Appointments.belongsTo(Specialties);

Patients.hasMany(Appointments, {
  foreignKey: {
    allowNull: false,
  },
  hooks: true,
});
Appointments.belongsTo(Patients);

Doctors.hasMany(Appointments, {
  foreignKey: {
    allowNull: false,
  },
  hooks: true,
});
Appointments.belongsTo(Doctors);

export default connection;
