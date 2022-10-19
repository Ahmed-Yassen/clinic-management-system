import { agent as request } from "supertest";
import app from "../app";
import {
  populateTestingDB,
  admin,
  adminToken,
  doctor,
  receptionist,
  doctorToken,
  receptionistToken,
} from "./fixtures/db";
import connection from "../db";

beforeEach(async () => {
  await connection.dropAllSchemas({ logging: false });
  await connection.sync();
  await populateTestingDB();
});

test("Should login user", async () => {
  await request(app)
    .post("/api/auth/login")
    .send({
      email: admin.email,
      password: admin.password,
    })
    .expect(200);
});

test("Should create receptionist as admin", async () => {
  const response = await request(app)
    .post("/api/auth/signup/receptionist")
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
    .post("/api/auth/signup/doctor")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      email: "doctorstrange@test.com",
      password: "somevalidpass",
      role: "doctor",
      phoneNumber: "01125986761",
      address: "Alexandria Egypt",
      fullName: "Stephan Strange",
      examinationPrice: 55,
      specialtyId: 1,
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

test("Should get all users for admin only", async () => {
  const response = await request(app)
    .get("/api/users")
    .set("Authorization", `Bearer ${adminToken}`)
    .expect(200);
  expect(response.body.doctors[0]).toMatchObject(doctor);
  expect(response.body.receptionists[0]).toMatchObject(receptionist);
});

test("Should get current user profile", async () => {
  let response = await request(app)
    .get("/api/users/profile")
    .set("Authorization", `Bearer ${doctorToken}`)
    .expect(200);
  expect(response.body.user).toMatchObject(doctor);

  response = await request(app)
    .get("/api/users/profile")
    .set("Authorization", `Bearer ${receptionistToken}`)
    .expect(200);
  expect(response.body.user).toMatchObject(receptionist);
});

test("Should get specific doctor profile as admin", async () => {
  const response = await request(app)
    .get("/api/users/doctors/1")
    .set("Authorization", `Bearer ${adminToken}`)
    .expect(200);
  expect(response.body.doctor).toMatchObject(doctor);
});

test("Should get specific receptionist", async () => {
  const response = await request(app)
    .get("/api/users/receptionists/1")
    .set("Authorization", `Bearer ${adminToken}`)
    .expect(200);
  expect(response.body.receptionist).toMatchObject(receptionist);
});

test("Should update receptionist salary as admin", async () => {
  const response = await request(app)
    .patch("/api/users/receptionists/1")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ salary: 3000 })
    .expect(200);
  expect(response.body.receptionist).toMatchObject({ salary: 3000 });
});

test("Should update doctor as admin", async () => {
  const response = await request(app)
    .patch("/api/users/doctors/1")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ examinationPrice: 80 })
    .expect(200);
  expect(response.body.doctor).toMatchObject({ examinationPrice: 80 });
});

test("Should change user password", async () => {
  const newPassword = "MySuperStrongPassword";
  await request(app)
    .patch("/api/auth/changepassword")
    .set("Authorization", `Bearer ${doctorToken}`)
    .send({ password: newPassword })
    .expect(200);

  await request(app)
    .post("/api/auth/login")
    .send({ email: "doctor@test.com", password: newPassword })
    .expect(200);
});

test("Should delete user as admin", async () => {
  await request(app)
    .delete("/api/users/2")
    .set("Authorization", `Bearer ${adminToken}`)
    .expect(200);
});
