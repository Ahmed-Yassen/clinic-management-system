import { agent as request } from "supertest";
import app from "../app";
import { populateTestingDB, receptionistToken } from "./fixtures/db";
import connection from "../db";

beforeEach(async () => {
  await connection.dropAllSchemas({ logging: false });
  await connection.sync();
  await populateTestingDB();
});

test("Should update receptionist profile as receptionist", async () => {
  const response = await request(app)
    .patch("/api/users/receptionists")
    .set("Authorization", `Bearer ${receptionistToken}`)
    .send({
      phoneNumber: "01234567890",
      fullName: "Receptionist Pam",
      address: "USA",
    })
    .expect(200);
  expect(response.body.receptionist).toMatchObject({
    phoneNumber: "01234567890",
    fullName: "Receptionist Pam",
    address: "USA",
  });
});
