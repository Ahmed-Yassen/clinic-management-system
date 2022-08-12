import { Users } from "../../models/users";
import jwt, { Secret } from "jsonwebtoken";
import { Specialties } from "../../models/specialties";
import { Receptionists } from "../../models/receptionists";
import { Doctors } from "../../models/doctors";
import { Patients } from "../../models/patients";

const adminToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET as Secret);
const admin = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  role: "admin",
};

const specialty = { name: "Eyes" };
const receptionistToken = jwt.sign({ id: 2 }, process.env.JWT_SECRET as Secret);
const receptionist = {
  fullName: "Pam",
  address: "Moharam Beek",
  phoneNumber: "01125986761",
  salary: 2850,
  UserId: 2,
};

const doctorToken = jwt.sign({ id: 3 }, process.env.JWT_SECRET as Secret);
const doctor = {
  fullName: "Sheldon Cooper",
  address: "Smouha",
  phoneNumber: "01225986761",
  examinationPrice: 65,
  UserId: 3,
  SpecialtyId: 1,
};

const patient = { fullName: "Ahmed Yassen", phoneNumber: "01125986761" };

const populateTestingDB = async () => {
  await Users.create({
    ...admin,
  });

  await Specialties.create({ ...specialty });

  await Users.create({
    email: "receptioninst@test.com",
    password: "receptioninstPass",
    role: "receptionist",
  });

  await Receptionists.create({
    ...receptionist,
  });

  await Users.create({
    email: "doctor@test.com",
    password: "doctorPass",
    role: "doctor",
  });

  await Doctors.create({
    ...doctor,
  });

  await Patients.create({
    ...patient,
  });
};

export {
  populateTestingDB,
  admin,
  adminToken,
  doctor,
  receptionist,
  doctorToken,
  receptionistToken,
  specialty,
  patient,
};
