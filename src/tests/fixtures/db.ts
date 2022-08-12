import { Users } from "../../models/users";
import jwt, { Secret } from "jsonwebtoken";
import { Specialties } from "../../models/specialties";

const adminToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET as Secret);
const admin = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  role: "admin",
};

const specialty = { name: "Eyes" };

const populateTestingDB = async () => {
  await Users.create({
    ...admin,
  });

  await Specialties.create({ ...specialty });
};

export { populateTestingDB, admin, adminToken };
