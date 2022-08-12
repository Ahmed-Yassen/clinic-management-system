import { Users } from "../../models/users";
import jwt, { Secret } from "jsonwebtoken";
import { Specialties } from "../../models/specialties";
import { Receptionists } from "../../models/receptionists";
import { Doctors } from "../../models/doctors";

const adminToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET as Secret);
const admin = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  role: "admin",
};

const specialty = { name: "Eyes" };

const receptionist = {
  fullName: "Pam",
  address: "Moharam Beek",
  phoneNumber: "01125986761",
  salary: 2850,
  UserId: 2,
};

const doctor = {
  fullName: "Sheldon Cooper",
  address: "Smouha",
  phoneNumber: "01225986761",
  examinationPrice: 65,
  UserId: 3,
  SpecialtyId: 1,
};

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
};

export { populateTestingDB, admin, adminToken, doctor, receptionist };
