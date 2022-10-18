import { Response, Request } from "express";
import { Receptionist } from "../models/receptionist";
import { User } from "../models/user";
import { Doctor } from "../models/doctor";
import { Specialty } from "../models/specialty";
import { BadRequestError } from "../errors/bad-request-error";
import { NotFoundError } from "../errors/not-found-error";

export default class UserController {
  private async userEmailExists(email: string) {
    const duplicateUser = await User.findOne({ where: { email } });
    return duplicateUser;
  }

  createReceptionist = async (req: Request, res: Response) => {
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

  createDoctor = async (req: Request, res: Response) => {
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

  async getAllUsers(req: Request, res: Response) {
    const doctors = await Doctor.findAll();
    const receptionists = await Receptionist.findAll();

    res.json({ success: true, doctors, receptionists });
  }

  async getMyProfile(req: Request, res: Response) {
    const { user } = req;
    if (user?.role === "admin")
      throw new BadRequestError("Admin doesnt have a profile!");

    let profileData: null | Doctor | Receptionist = null;
    switch (user?.role) {
      case "doctor":
        profileData = await Doctor.findOne({
          where: { userId: user.id },
        });
        break;
      case "receptionist":
        profileData = await Receptionist.findOne({
          where: { userId: user.id },
        });
        break;
    }

    res.json({ success: true, user: profileData });
  }

  async getDoctorById(req: Request, res: Response) {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) throw new NotFoundError("doctor");

    res.json({ success: true, doctor });
  }

  async getReceptionistById(req: Request, res: Response) {
    const receptionist = await Receptionist.findByPk(req.params.id);
    if (!receptionist) throw new NotFoundError("receptionist");

    res.json({ success: true, receptionist });
  }

  async updateReceptionistSalary(req: Request, res: Response) {
    const receptionist = await Receptionist.findByPk(req.params.id);
    if (!receptionist) throw new NotFoundError("receptionist");

    await receptionist?.update({ salary: req.body.salary });

    res.json({ success: true, receptionist });
  }

  async updateDoctorAsAdmin(req: Request, res: Response) {
    const allowedFields = ["examinationPrice", "specialtyId"];
    const requestFields = Object.keys(req.body);

    const isValidUpdate = requestFields.every((field) =>
      allowedFields.includes(field)
    );
    if (!isValidUpdate)
      throw new BadRequestError(
        "Admin can only update doctor's examinationPrice & specialtyId"
      );

    const { specialtyId } = req.body;
    if (specialtyId) {
      const specialty = await Specialty.findByPk(specialtyId);
      if (!specialty) throw new NotFoundError("specialty");
    }

    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) throw new NotFoundError("doctor");

    await doctor?.update(req.body);

    res.json({ success: true, doctor });
  }

  async updateUserPassword(req: Request, res: Response) {
    const { password } = req.body;
    if (!password) throw new BadRequestError("Only update password");

    await req.user?.update({ password });
    res.json({ success: true, msg: "Password Updated!" });
  }

  async deleteUser(req: Request, res: Response) {
    const user = await User.findByPk(req.params.id);
    if (!user) throw new NotFoundError("user");

    await user?.destroy();

    res.json({ success: true, user });
  }
}
