import { Response, NextFunction, Request } from "express";
import { Receptionist } from "../models/receptionist";
import { throwCustomError } from "../utils/helperFunctions";
import { User } from "../models/user";
import { Doctor } from "../models/doctor";
import { Specialty } from "../models/specialty";
import { BadRequestError } from "../errors/bad-request-error";
import { NotFoundError } from "../errors/not-found-error";

export default class UserController {
  constructor() {}

  private seperateData(requestBody: any, role: string) {
    const userTable = {
      email: requestBody.email,
      password: requestBody.password,
      role,
    };
    delete requestBody.email;
    delete requestBody.password;

    return { userTable, roleTableData: { ...requestBody } };
  }

  private async userEmailExists(email: string) {
    const duplicateUser = await User.findOne({ where: { email } });
    return duplicateUser;
  }

  private createUser = async (userData: any): Promise<User> => {
    const user = await User.create(userData);
    return user.toJSON() as User;
  };

  createReceptionist = async (req: any, res: Response) => {
    const role = "receptionist";
    const { email, password, ...receptionistAttrs } = req.body;

    if (await this.userEmailExists(email))
      throw new BadRequestError("Email already registered!");

    const user = await User.create({ email, password, role });
    const receptionist = await user.$create(role, receptionistAttrs);

    res.status(201).json({
      success: true,
      fullData: { user, receptionist },
    });
  };

  createDoctor = async (req: any, res: Response) => {
    const role = "doctor";
    const { email, password, ...doctorAttrs } = req.body;

    if (await this.userEmailExists(email))
      throw new BadRequestError("Email already registered!");

    const specialty = await Specialty.findByPk(doctorAttrs.specialtyId);
    if (!specialty) throw new NotFoundError("specialty");

    const user = await User.create({ email, password, role });
    const doctor = await user.$create(role, doctorAttrs);

    res.status(201).json({
      success: true,
      fullData: { user, doctor },
    });
  };

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const doctors = await Doctor.findAll();
      const receptionists = await Receptionist.findAll();

      res.json({ success: true, doctors, receptionists });
    } catch (err) {
      next(err);
    }
  }

  async getMyProfile(req: any, res: Response, next: NextFunction) {
    try {
      if (req.role === "admin")
        throwCustomError("Admin doesnt have a profile!", 400);
      let user: null | Doctor | Receptionist = null;
      switch (req.role) {
        case "doctor":
          user = await Doctor.findOne({
            where: { userId: req.user.id },
          });
          break;
        case "receptionist":
          user = await Receptionist.findOne({
            where: { userId: req.user.id },
          });
          break;
      }
      res.json({ success: true, user });
    } catch (error) {
      next(error);
    }
  }

  async getSpecificDoctor(req: any, res: Response, next: NextFunction) {
    try {
      const doctor = await Doctor.findByPk(req.params.id);
      if (!doctor) throwCustomError("Couldnt find a doctor with that id", 404);
      res.json({ success: true, doctor });
    } catch (error) {
      next(error);
    }
  }

  async getSpecificReceptionist(req: any, res: Response, next: NextFunction) {
    try {
      const receptionist = await Receptionist.findByPk(req.params.id);
      if (!receptionist)
        throwCustomError("Couldnt find a receptionist with that id", 404);
      res.json({ success: true, receptionist });
    } catch (error) {
      next(error);
    }
  }

  async updateReceptionistSalary(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const receptionist = await Receptionist.findByPk(req.params.id);
      if (!receptionist)
        throwCustomError("Couldnt find a receptionist with that id", 404);

      await receptionist?.update({ salary: req.body.salary });
      res.json({ success: true, receptionist });
    } catch (error) {
      next(error);
    }
  }

  async updateDoctorAsAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const allowedFields = ["examinationPrice", "SpecialtyId"];
      const requestFields = Object.keys(req.body);
      const isValidUpdate = requestFields.every((field) =>
        allowedFields.includes(field)
      );
      if (!isValidUpdate)
        throwCustomError(
          "Admins can only update doctor's examinationPrice & SpecialtyId",
          400
        );

      if (req.body.SpecialtyId) {
        const specialty = await Specialty.findByPk(req.body.SpecialtyId);
        if (!specialty)
          throwCustomError("Couldnt find a specialty with that id", 404);
      }

      const doctor = await Doctor.findByPk(req.params.id);
      if (!doctor) throwCustomError("Couldnt find a doctor with that id", 404);
      await doctor?.update(req.body);
      res.json({ success: true, doctor });
    } catch (error) {
      next(error);
    }
  }

  async updateUserPassword(req: any, res: Response, next: NextFunction) {
    try {
      const requestFields = Object.keys(req.body);
      if (requestFields.length > 1 || requestFields[0] !== "password")
        throwCustomError("Only update password", 400);

      await req.user.update({ password: req.body.password });
      return res.json({ success: true, msg: "Password Updated!" });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedUser: User | null = await User.findByPk(req.params.id);
      if (!deletedUser)
        throwCustomError("Couldnt find a user with that id", 404);

      await deletedUser?.destroy();
      return res.json({
        success: true,
        user: deletedUser?.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }
}
