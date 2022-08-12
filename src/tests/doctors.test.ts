import { agent as request } from "supertest";
import app from "../app";
import { populateTestingDB, doctorToken } from "./fixtures/db";
import connection from "../db";

beforeEach(async () => {
  await connection.dropAllSchemas({ logging: false });
  await connection.sync();
  await populateTestingDB();
});

test("Should update doctor profile as doctor", async () => {
  const response = await request(app)
    .patch("/doctors")
    .set("Authorization", `Bearer ${doctorToken}`)
    .send({
      phoneNumber: "01234567890",
      fullName: "Doctor Stephan Strange",
      address: "USA",
    })
    .expect(200);
  expect(response.body.doctor).toMatchObject({
    phoneNumber: "01234567890",
    fullName: "Doctor Stephan Strange",
    address: "USA",
  });
});
