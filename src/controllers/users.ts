import { Response, NextFunction } from "express";
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
}
