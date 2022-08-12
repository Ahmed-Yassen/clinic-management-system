import { agent as request } from "supertest";
import app from "../app";
import { populateTestingDB, admin, adminToken } from "./fixtures/db";
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

test("Should create receptionist as admin", async () => {
  const response = await request(app)
    .post("/signup/receptionist")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      email: "receptionista@test.com",
      password: "somevalidpass",
      role: "receptionist",
      phoneNumber: "01125986761",
      address: "Alexandria Egypt",
      fullName: "Pam",
      salary: 2750,
    })
    .expect(201);
  expect(response.body.fullData.user).toMatchObject({
    email: "receptionista@test.com",
    role: "receptionist",
  });
  expect(response.body.fullData.receptionist).toMatchObject({
    phoneNumber: "01125986761",
    address: "Alexandria Egypt",
    fullName: "Pam",
    salary: 2750,
  });
});

test("Should create doctor as admin", async () => {
  const response = await request(app)
    .post("/signup/doctor")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      email: "doctorstrange@test.com",
      password: "somevalidpass",
      role: "doctor",
      phoneNumber: "01125986761",
      address: "Alexandria Egypt",
      fullName: "Stephan Strange",
      examinationPrice: 55,
      SpecialtyId: 1,
    })
    .expect(201);
  expect(response.body.fullData.user).toMatchObject({
    email: "doctorstrange@test.com",
    role: "doctor",
  });
  expect(response.body.fullData.doctor).toMatchObject({
    phoneNumber: "01125986761",
    address: "Alexandria Egypt",
    fullName: "Stephan Strange",
    examinationPrice: 55,
  });
});
