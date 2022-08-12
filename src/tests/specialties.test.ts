import { agent as request } from "supertest";
import app from "../app";
import { populateTestingDB, adminToken, specialty } from "./fixtures/db";
import connection from "../db";

beforeEach(async () => {
  await connection.dropAllSchemas({ logging: false });
  await connection.sync();
  await populateTestingDB();
});

test("Should create specialty as admin", async () => {
  const response = await request(app)
    .post("/specialties")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ name: "Skin Care" })
    .expect(201);
  expect(response.body.specialty).toMatchObject({ name: "skin care" });
});

test("Should get all specialties", async () => {
  const response = await request(app)
    .get("/specialties")
    .set("Authorization", `Bearer ${adminToken}`)
    .expect(200);
  expect(response.body.specialties[0]).toMatchObject(specialty);
});

test("Should update specialty as admin", async () => {
  const response = await request(app)
    .patch("/specialties/1")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ name: "Nose, Ear & Throat (NET)" })
    .expect(200);
  expect(response.body.specialty).toMatchObject({
    name: "Nose, Ear & Throat (NET)",
  });
});

test("Should delete specialty as admin", async () => {
  await request(app)
    .delete("/specialties/1")
    .set("Authorization", `Bearer ${adminToken}`)
    .expect(200);
});
