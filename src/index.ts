import app from "./app";
import connection from "./db";
import { Users } from "./models/users";

connection
  .sync()
  .then(async () => {
    console.log("DB Synced Successfully!");
    //- Create Admin Automatically Only On First Connection
    const existingAdmin = await Users.findByPk(1);
    if (!existingAdmin) {
      await Users.create({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
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
