import { Router } from "express";
import userController from "../controllers/users";
import { body, param } from "express-validator";
import validationMW from "../middlewares/validationMW";
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

router.get("/usersAll", authMW, isAdmin, controller.getAllUsers);
router.get("/users", authMW, controller.getMyProfile);

router
  .route("/users/doctors/:id")
  .get(
    authMW,
    isAdmin,
    [
      param("id")
        .isInt({ min: 1 })
        .withMessage("Receptionist id must be a valid number."),
    ],
    validationMW,
    controller.getSpecificDoctor
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
        .withMessage("Incorrect ExaminationPrice value."),
      body("SpecialtyId")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Incorrect SpecialtyId value."),
    ],
    validationMW,
    controller.updateDoctorAsAdmin
  );

router
  .route("/users/receptionists/:id")
  .get(
    authMW,
    isAdmin,
    [
      param("id")
        .isInt({ min: 1 })
        .withMessage("Receptionist id must be a valid number."),
    ],
    validationMW,
    controller.getSpecificReceptionist
  )
  .patch(
    authMW,
    isAdmin,
    [
      param("id")
        .isInt({ min: 1 })
        .withMessage("Receptionst id must be a valid number."),
      body("salary")
        .isFloat({ min: 2700 })
        .withMessage("Incorrect Salary value."),
    ],
    validationMW,
    controller.updateReceptionistSalary
  );

router.patch(
  "/users/changePassword",
  authMW,
  body("password")
    .isLength({ min: 8, max: 32 })
    .withMessage("Password should be between 8 & 32 characters"),
  validationMW,
  controller.updateUserPassword
);

router.delete(
  "/users/:id",
  authMW,
  isAdmin,
  [param("id").isInt({ min: 1 }).withMessage("Invalid user id value.")],
  validationMW,
  controller.deleteUser
);

export default router;
