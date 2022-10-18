import { agent as request } from "supertest";
import app from "../app";
import {
  populateTestingDB,
  adminToken,
  doctorToken,
  receptionistToken,
  patient,
} from "./fixtures/db";
import connection from "../db";

beforeEach(async () => {
  await connection.dropAllSchemas({ logging: false });
  await connection.sync();
  await populateTestingDB();
});

test("Should create patient as receptionist", async () => {
  const response = await request(app)
    .post("/api/patients")
    .set("Authorization", `Bearer ${receptionistToken}`)
    .send({
      fullName: "Sick Patient",
      phoneNumber: "01234567890",
    })
    .expect(201);
  expect(response.body.patient).toMatchObject({
    fullName: "Sick Patient",
    phoneNumber: "01234567890",
  });
});

test("Should get all patients for any user", async () => {
  const response = await request(app)
    .get("/api/patients")
    .set("Authorization", `Bearer ${adminToken}`)
    .expect(200);
  await request(app)
    .get("/api/patients")
    .set("Authorization", `Bearer ${receptionistToken}`)
    .expect(200);
  await request(app)
    .get("/api/patients")
    .set("Authorization", `Bearer ${doctorToken}`)
    .expect(200);
  expect(response.body.patients[0]).toMatchObject(patient);
});

test("Should update patient as receptionist", async () => {
  const response = await request(app)
    .patch("/api/patients/1")
    .set("Authorization", `Bearer ${receptionistToken}`)
    .send({
      fullName: "Dexter Morgan",
    })
    .expect(200);
  expect(response.body.patient).toMatchObject({
    fullName: "Dexter Morgan",
  });
});

test("Should delete patient as receptionist", async () => {
  const response = await request(app)
    .delete("/api/patients/1")
    .set("Authorization", `Bearer ${receptionistToken}`)
    .expect(200);
  expect(response.body.patient).toMatchObject({
    ...patient,
  });
});
