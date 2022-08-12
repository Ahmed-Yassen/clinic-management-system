import { agent as request } from "supertest";
import app from "../app";
import { populateTestingDB, admin } from "./fixtures/db";
import connection from "../db";

beforeEach(async () => {
  await connection.dropAllSchemas({ logging: false });
  await connection.sync();
  await populateTestingDB();
});

test("Should login user", async () => {
  await request(app)
    .post("/login")
    .send({
      email: admin.email,
      password: admin.password,
    })
    .expect(200);
});
