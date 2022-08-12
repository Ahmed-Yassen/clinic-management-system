import { Users } from "../../models/users";

const admin = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  role: "admin",
};

const populateTestingDB = async () => {
  await Users.create({
    ...admin,
  });
};

export { populateTestingDB, admin };
