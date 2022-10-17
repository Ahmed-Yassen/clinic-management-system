import app from "./app";
import connection from "./db";
import { User } from "./models/user";

connection
  .sync({ force: process.env.NODE_ENV === "development" })
  .then(async () => {
    console.log("DB Synced Successfully!");
    //- Create Admin Only On First Connection
    const existingAdmin = await User.findByPk(1);
    if (!existingAdmin) {
      await User.create({
        email: process.env.ADMIN_EMAIL as string,
        password: process.env.ADMIN_PASSWORD as string,
        role: "admin",
      });
      console.log("Admin Created!");
    }
    app.listen(process.env.PORT, () => {
      console.log(`Server is UP on PORT: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(`An Error Happened: ${error}`);
  });
