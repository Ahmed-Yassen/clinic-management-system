import { Router } from "express";
import userController from "../controllers/users";
import { body, param } from "express-validator";
import authMW from "../middlewares/authMW";
import { isAdmin } from "../middlewares/rolesMW";
import { validateRequest } from "../middlewares/validatate-request";

const router = Router();
const controller = new userController();

router.post(
  "/api/auth/signup/receptionist",
  authMW,
  isAdmin,
  [
    body("email")
      .isEmail()
      .toLowerCase()
      .withMessage("Please provide a valid email"),
    body("password")
      .isString()
      .isLength({ min: 8, max: 32 })
      .withMessage("Password should be between 8 and 32 string characters"),
    body("phoneNumber")
      .matches(/^01[0125][0-9]{8}$/)
      .withMessage("Incorrect phoneNumber value."),
    body("address")
      .optional()
      .isString()
      .withMessage("Incorrect address value."),
    body("fullName").isString().withMessage("Incorrect fullName value."),
    body("salary")
      .isFloat({ min: 2500 })
      .withMessage("Salary should be atleast 2500."),
  ],
  validateRequest,
  controller.createReceptionist
);

router.post(
  "/api/auth/signup/doctor",
  authMW,
  isAdmin,
  [
    body("email")
      .isEmail()
      .toLowerCase()
      .withMessage("Please provide a valid email"),
    body("password")
      .isString()
      .isLength({ min: 8, max: 32 })
      .withMessage("Password should be between 8 and 32 string characters"),
    body("phoneNumber")
      .matches(/^01[0125][0-9]{8}$/)
      .withMessage("Incorrect phoneNumber value."),
    body("address")
      .optional()
      .isString()
      .withMessage("Incorrect address value."),
    body("fullName").isString().withMessage("Incorrect fullName value."),
    body("examinationPrice")
      .isFloat({ min: 50 })
      .withMessage("Incorrect ExaminationPrice value, should be atleast 50."),
    body("specialtyId")
      .isInt({ min: 1 })
      .withMessage("Incorrect specialtyId value."),
  ],
  validateRequest,
  controller.createDoctor
);

router.get("/api/users", authMW, isAdmin, controller.getAllUsers);
router.get("/api/users/profile", authMW, controller.getMyProfile);

router
  .route("/api/users/doctors/:id")
  .get(
    authMW,
    isAdmin,
    [
      param("id")
        .isInt({ min: 1 })
        .withMessage("Receptionist id must be a valid number."),
    ],
    validateRequest,
    controller.getDoctorById
  )
  .patch(
    authMW,
    isAdmin,
    [
      param("id")
        .isInt({ min: 1 })
        .withMessage("Doctor id must be a valid number."),
      body("examinationPrice")
        .optional()
        .isFloat({ min: 50 })
        .withMessage("Incorrect examinationPrice value."),
      body("specialtyId")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Incorrect specialtyId value."),
    ],
    validateRequest,
    controller.updateDoctorAsAdmin
  );

router
  .route("/api/users/receptionists/:id")
  .get(
    authMW,
    isAdmin,
    [
      param("id")
        .isInt({ min: 1 })
        .withMessage("Receptionist id must be a valid number."),
    ],
    validateRequest,
    controller.getReceptionistById
  )
  .patch(
    authMW,
    isAdmin,
    [
      param("id")
        .isInt({ min: 1 })
        .withMessage("Receptionst id must be a valid number."),
      body("salary")
        .isFloat({ min: 2500 })
        .withMessage("Incorrect Salary value."),
    ],
    validateRequest,
    controller.updateReceptionistSalary
  );

router.patch(
  "/api/auth/changepassword",
  authMW,
  body("password")
    .isAlphanumeric()
    .isLength({ min: 8, max: 32 })
    .withMessage("Password should be between 8 & 32 characters"),
  validateRequest,
  controller.updateUserPassword
);

router.delete(
  "/api/users/:id",
  authMW,
  isAdmin,
  [param("id").isInt({ min: 1 }).withMessage("Invalid user id value.")],
  validateRequest,
  controller.deleteUser
);

export default router;
