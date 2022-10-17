import { User } from "../../models/user";
import jwt, { Secret } from "jsonwebtoken";
import { Specialty } from "../../models/specialty";
import { Receptionist } from "../../models/receptionist";
import { Doctor } from "../../models/doctor";
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
  userId: 2,
};

const doctorToken = jwt.sign({ id: 3 }, process.env.JWT_SECRET as Secret);
const doctor = {
  fullName: "Sheldon Cooper",
  address: "Smouha",
  phoneNumber: "01225986761",
  examinationPrice: 65,
  userId: 3,
  specialtyId: 1,
};

const patient = { fullName: "Ahmed Yassen", phoneNumber: "01125986761" };

const populateTestingDB = async () => {
  await User.create({
    ...(admin as User),
  });

  await Specialty.create({ ...specialty });

  await User.create({
    email: "receptioninst@test.com",
    password: "receptioninstPass",
    role: "receptionist",
  });

  await Receptionist.create({
    ...receptionist,
  });

  await User.create({
    email: "doctor@test.com",
    password: "doctorPass",
    role: "doctor",
  });

  await Doctor.create({
    ...doctor,
  });

  // await Patients.create({
  //   ...patient,
  // });
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
  // patient,
};
