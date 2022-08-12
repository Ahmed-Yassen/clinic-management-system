import { Response, NextFunction, Request } from "express";
import { Receptionists } from "../models/receptionists";
import { throwCustomError } from "../utils/helperFunctions";
import { Users } from "../models/users";
import { Doctors } from "../models/doctors";
import { Specialties } from "../models/specialties";

export default class UserController {
  constructor() {}

  private seperateData(requestBody: any, role: string) {
    const userTableData = {
      email: requestBody.email,
      password: requestBody.password,
      role,
    };

    const roleTableData = { ...requestBody };
    delete roleTableData.email;
    delete roleTableData.password;

    return [userTableData, roleTableData];
  }

  private async userEmailExists(userEmail: string) {
    const duplicateUser = await Users.findOne({ where: { email: userEmail } });
    return duplicateUser;
  }

  private createUser = async (userData: any) => {
    const user = await Users.create(userData);
    return user.toJSON();
  };

  createReceptionist = async (req: any, res: Response, next: NextFunction) => {
    let user: Users | null = null;
    let receptionist: Receptionists | null = null;
    try {
      (await this.userEmailExists(req.body.email)) &&
        throwCustomError("Email already exists!", 400);

      const [userTableData, roleTableData] = this.seperateData(
        req.body,
        "receptionist"
      );

      user = await this.createUser(userTableData);
      roleTableData.UserId = user?.id; //- Attach Foreign Key from users
      receptionist = await Receptionists.create(roleTableData);
      res.status(201).json({
        success: true,
        fullData: { user, receptionist },
      });
    } catch (error) {
      //- if created row in user table, but an error happened during creating receptionist , remove the row that was created in the users table
      if (user && !receptionist)
        await Users.destroy({ where: { email: user.email } });
      next(error);
    }
  };

  createDoctor = async (req: any, res: Response, next: NextFunction) => {
    let user: Users | null = null;
    let doctor: Doctors | null = null;
    try {
      if (await this.userEmailExists(req.body.email))
        throwCustomError("Email already exists!", 400);

      const specialty = await Specialties.findByPk(req.body.SpecialtyId);
      if (!specialty)
        throwCustomError("There is no specialty with that id", 404);

      const [userTableData, roleTableData] = this.seperateData(
        req.body,
        "doctor"
      );
      user = await this.createUser(userTableData);
      roleTableData.UserId = user?.id; //- Attach Foreign Key from users
      doctor = await Doctors.create(roleTableData);
      res.status(201).json({
        success: true,
        fullData: { user, doctor },
      });
    } catch (error) {
      //- if created row in user table, but an error happened in during creating a doctor, remove the row that was created in the users table
      if (user && !doctor)
        await Users.destroy({ where: { email: user.email } });
      next(error);
    }
  };

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const doctors = await Doctors.findAll();
      const receptionists = await Receptionists.findAll();

      res.json({ success: true, doctors, receptionists });
    } catch (err) {
      next(err);
    }
  }

  async getMyProfile(req: any, res: Response, next: NextFunction) {
    try {
      if (req.role === "admin")
        throwCustomError("Admin doesnt have a profile!", 400);
      let user = null;
      switch (req.role) {
        case "doctor":
          user = await Doctors.findOne({
            where: { UserId: req.user.id },
          });
          break;
        case "receptionist":
          user = await Receptionists.findOne({
            where: { UserId: req.user.id },
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
      const doctor = await Doctors.findByPk(req.params.id);
      if (!doctor) throwCustomError("Couldnt find a doctor with that id", 404);
      res.json({ success: true, doctor });
    } catch (error) {
      next(error);
    }
  }

  async getSpecificReceptionist(req: any, res: Response, next: NextFunction) {
    try {
      const receptionist = await Receptionists.findByPk(req.params.id);
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
      const receptionist = await Receptionists.findByPk(req.params.id);
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
        const specialty = await Specialties.findByPk(req.body.SpecialtyId);
        if (!specialty)
          throwCustomError("Couldnt find a specialty with that id", 404);
      }

      const doctor = await Doctors.findByPk(req.params.id);
      if (!doctor) throwCustomError("Couldnt find a doctor with that id", 404);
      await doctor?.update(req.body);
      res.json({ success: true, doctor });
    } catch (error) {
      next(error);
    }
  }
}
