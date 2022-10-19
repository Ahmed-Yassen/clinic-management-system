import { Request, Response } from "express";
import moment from "moment";
import { Op, Order, WhereOptions } from "sequelize";
import { Appointment, AppointmentAttributes } from "../models/appointment";
import { Doctor } from "../models/doctor";
import { Patient } from "../models/patient";
import { Specialty } from "../models/specialty";
import { BadRequestError } from "../errors/bad-request-error";
import { NotFoundError } from "../errors/not-found-error";
import { User } from "../models/user";

export default class AppointmentsController {
  private sessionDuration = 20; //- 20 Minutes Per Session
  private openingHour = 17; //- Clinic Opens at 5PM
  private closingHour = 23; //- Clinic Closes at 11PM
  private sessionsPerHour = 60 / this.sessionDuration;
  private workingHours = this.closingHour - this.openingHour;
  private maxSessionsPerDay = this.workingHours * this.sessionsPerHour;

  private getNearestAvailableAppointment(
    day: Date,
    doctorAppointments: Date[]
  ) {
    //-First Case: if nearst appointment is at 17 or 5 PM
    const firstAppointmentDate = moment(day).hours(this.openingHour).minutes(0);
    if (
      doctorAppointments.length === 0 ||
      !moment(doctorAppointments[0])
        .subtract(2, "hours")
        .isSame(firstAppointmentDate)
    )
      return firstAppointmentDate.toDate();

    //-Second Case: if neasrt appointment is at 22:40 or 10.40 PM
    const lastAppointmentDate = moment(day)
      .hours(this.closingHour - 1)
      .minutes(this.sessionDuration * (this.sessionsPerHour - 1));
    if (
      doctorAppointments.length === this.maxSessionsPerDay - 1 &&
      !moment(doctorAppointments[doctorAppointments.length - 1])
        .subtract(2, "hours")
        .isSame(lastAppointmentDate)
    )
      return lastAppointmentDate.toDate();

    //- Third Case: an appointment is free in the middle of the day
    //- Since the array is sorted, we can use binary search
    let startIndex = 0;
    let endIndex = doctorAppointments.length - 1;
    while (startIndex <= endIndex) {
      const middleIndex = Math.floor((startIndex + endIndex) / 2);
      /* Formula to make sure that the Correct Date is in The Correct Index .. index[0] must be at 17 or 5PM and index[lenght-1] must be 22:40 or at 10.40PM
      Hours = index + openingHours , then subtract minutes
      Minutes = sessionDuration * index * (sessionsPerHour -1)
      examlpe:  fifth appointment (index= 4) must be at 6.20PM
      {Hours: 4 + 17 = 21 or 9PM} - {Minutes: 20 * 4 * (3-1) = 160Mins or 2hrs:40Mins }, 
      subtract hours from minutes then fifth appointment is : 9pm - 2hrs:40Mins =  6:20PM
      */
      const correctDateInCurrentIndex = moment(day)
        .hours(middleIndex + this.openingHour)
        .subtract(
          this.sessionDuration * middleIndex * (this.sessionsPerHour - 1),
          "minutes"
        );

      const currentDate = moment(doctorAppointments[middleIndex]).subtract(
        2,
        "hours"
      );
      if (moment(currentDate).isSame(correctDateInCurrentIndex)) {
        // Go right
        startIndex = middleIndex + 1;
      } else {
        // Go left
        endIndex = middleIndex - 1;
      }
    }
    const nearstDate = moment(day)
      .hours(this.openingHour + startIndex)
      .subtract(
        this.sessionDuration * startIndex * (this.sessionsPerHour - 1),
        "minutes"
      );

    if (nearstDate.isAfter(lastAppointmentDate)) return null;

    return nearstDate.toDate();
  }

  private getAppointments = async (
    day: Date,
    {
      specialtyId = 0,
      doctorId = 0,
    }: { specialtyId?: number; doctorId?: number }
  ) => {
    const startOfDay = this.toGMT2(
      moment(day).hours(this.openingHour).toDate()
    );
    const endOfDay = this.toGMT2(moment(day).hours(this.closingHour).toDate());

    let where: WhereOptions<AppointmentAttributes>,
      order: Order = [["date", "ASC"]];

    if (specialtyId) {
      where = {
        [Op.and]: [
          { date: { [Op.between]: [startOfDay, endOfDay] } },
          { specialtyId },
        ],
      };
      order = [];
    } else if (doctorId) {
      where = {
        [Op.and]: [
          { date: { [Op.between]: [startOfDay, endOfDay] } },
          { doctorId },
        ],
      };
    } else {
      where = {
        date: { [Op.between]: [startOfDay, endOfDay] },
      };
    }
    return await Appointment.findAll({ where, order });
  };

  //{doctorId: Date[]} to group each doctor with their appointments
  private groupDoctorWithAppointments = (
    specialtyAppointments: Appointment[]
  ) => {
    const doctorsAppointmentsMap = new Map<number, Date[]>();
    specialtyAppointments.forEach((appointment) => {
      const { doctorId, date } = appointment;

      if (!doctorsAppointmentsMap.get(doctorId))
        doctorsAppointmentsMap.set(doctorId, []);

      const doctorAppointments = doctorsAppointmentsMap.get(doctorId);
      doctorAppointments?.push(date);

      doctorsAppointmentsMap.set(doctorId, doctorAppointments as Date[]);
    });

    return doctorsAppointmentsMap;
  };

  private findSpecialtyNearestDate = async (
    day: Date,
    specialtyId: number,
    excludeDoctorId = 0
  ) => {
    const specialtyAppointments = await this.getAppointments(day, {
      specialtyId,
    });

    const doctorsAppointmentsMap = this.groupDoctorWithAppointments(
      specialtyAppointments
    );

    const specialtyDoctors = await Doctor.findAll({
      where: {
        [Op.and]: [{ specialtyId }, { id: { [Op.not]: excludeDoctorId } }],
      },
      attributes: ["id"],
    });
    let tempNearestAppointment = moment().add(100, "years").toDate(); //-The latest possible date
    let nearestAppointment: Date | null = null;
    let nearestDoctorId;

    for (let doctor of specialtyDoctors) {
      const { id: doctorId } = doctor;

      const doctorAppointments = doctorsAppointmentsMap.get(doctorId);
      if (!doctorAppointments) {
        nearestAppointment = this.toGMT2(
          moment(day).hours(this.openingHour).minutes(0).toDate()
        );
        nearestDoctorId = doctorId;
        return [nearestAppointment, nearestDoctorId];
      }

      let doctorNearestAppointment = this.getNearestAvailableAppointment(
        day,
        doctorAppointments
      );
      if (!doctorNearestAppointment) continue;

      doctorNearestAppointment = this.toGMT2(doctorNearestAppointment as Date);

      if (moment(doctorNearestAppointment).isBefore(tempNearestAppointment)) {
        tempNearestAppointment = doctorNearestAppointment;
        nearestAppointment = doctorNearestAppointment;
        nearestDoctorId = doctorId;
      }
    }

    return [nearestAppointment, nearestDoctorId];
  };

  private isOldDay(day: Date): Boolean {
    return moment(day).isBefore(moment());
  }
  private isOffDay(date: Date): Boolean {
    return date.toDateString().match(/^(fri|sat)/i) !== null;
  }
  private toGMT2(date: Date): Date {
    return moment(new Date(date)).add(2, "hours").toDate();
  }
  private validateDay = (day: Date) => {
    if (this.isOldDay(day)) throw new BadRequestError("This is an old date!");
    if (this.isOffDay(day)) throw new BadRequestError("This is an off day!");
  };

  getAllAppointmentsOnDay = async (req: Request, res: Response) => {
    const day = this.toGMT2(new Date(req.params.day));
    const appointments = await this.getAppointments(day, {});
    res.json({ success: true, appointments });
  };

  createAppointmentWithSpecificDoctor = async (req: Request, res: Response) => {
    const day = this.toGMT2(new Date(req.body.day));
    this.validateDay(day);

    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) throw new NotFoundError("doctor");

    const patient = await Patient.findByPk(req.body.patientId);
    if (!patient) throw new NotFoundError("patient");

    const doctorAppointments = (
      await this.getAppointments(day, { doctorId: doctor.id })
    ).map((appointment) => appointment.date);

    const nearestAppointment = this.getNearestAvailableAppointment(
      day,
      doctorAppointments
    );
    if (!nearestAppointment)
      throw new BadRequestError("This day is full, try another day!");

    const appointment = await patient.$create("appointment", {
      date: this.toGMT2(nearestAppointment),
      doctorId: doctor.id,
      specialtyId: doctor.specialtyId,
    });

    res.status(201).json({ success: true, appointment });
  };

  createAppointmentInSpecialty = async (req: Request, res: Response) => {
    const day = this.toGMT2(new Date(req.body.day));
    this.validateDay(day);

    const patient = await Patient.findByPk(req.body.patientId);
    if (!patient) throw new NotFoundError("patient");

    const specialty = await Specialty.findByPk(req.params.id);
    if (!specialty) throw new NotFoundError("specialty");

    const [nearestAppointment, nearestDoctorId] =
      await this.findSpecialtyNearestDate(day, specialty.id);

    if (!nearestAppointment) throw new BadRequestError("This day is full!");

    const appointment = await patient.$create("appointment", {
      date: nearestAppointment,
      doctorId: nearestDoctorId,
      specialtyId: specialty?.id,
    });

    res.status(201).json({ success: true, appointment });
  };

  getDoctorAppointments = async (req: Request, res: Response) => {
    const day = this.toGMT2(new Date(req.params.day));
    if (this.isOffDay(day)) throw new BadRequestError("This is an off day!");

    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) throw new NotFoundError("doctor");

    const doctorAppointments = await this.getAppointments(day, {
      doctorId: doctor.id,
    });

    res.json({ success: true, doctorAppointments });
  };

  getMyAppointments = async (req: Request, res: Response) => {
    const user = req.user as User;
    const doctorId = (await user.$get("doctor"))?.id;
    const day = this.toGMT2(new Date(req.params.day));
    const doctorAppointments = await this.getAppointments(day, { doctorId });
    res.json({ success: true, doctorAppointments });
  };

  getSpecialtyAppointments = async (req: Request, res: Response) => {
    const day = this.toGMT2(new Date(req.params.day));
    if (this.isOffDay(day)) throw new BadRequestError("This is an off day!");

    const specialtyId = parseInt(req.params.id);
    const specialty = await Specialty.findByPk(specialtyId);
    if (!specialty) throw new NotFoundError("specialty");

    const appointments = await this.getAppointments(day, { specialtyId });
    res.json({ success: true, appointments });
  };

  getDoctorNearestAppointment = async (req: Request, res: Response) => {
    const day = this.toGMT2(new Date(req.params.day));
    this.validateDay(day);

    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) throw new NotFoundError("doctor");

    const doctorAppointments = (
      await this.getAppointments(day, { doctorId: doctor?.id })
    ).map((appointment) => appointment.date);

    const nearestAppointment = this.getNearestAvailableAppointment(
      day,
      doctorAppointments
    );
    if (!nearestAppointment)
      throw new BadRequestError("This day is full, try another day!");

    res.json({
      success: true,
      nearestAppointment: this.toGMT2(nearestAppointment),
    });
  };

  getSpecialtyNearestAppointment = async (req: Request, res: Response) => {
    const day = this.toGMT2(new Date(req.params.day));
    this.validateDay(day);

    const specialty = await Specialty.findByPk(req.params.id);
    if (!specialty) throw new NotFoundError("specialty");

    const [nearestAppointment, nearestDoctorId] =
      await this.findSpecialtyNearestDate(day, specialty.id);

    if (!nearestAppointment) throw new BadRequestError("This day is full!");

    res.json({ success: true, nearestAppointment, doctorId: nearestDoctorId });
  };

  editAppointment = async (req: Request, res: Response) => {
    const day = this.toGMT2(new Date(req.body.day));
    this.validateDay(day);
    const editWithSameDoctor = req.body.withSameDoctor;

    let appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) throw new NotFoundError("appointment");

    let nearestDate: Date | null = null;
    let doctorId: number;

    if (editWithSameDoctor) {
      doctorId = appointment.doctorId;

      const doctorAppointments = (
        await this.getAppointments(day, { doctorId })
      ).map((appointment) => appointment.date);

      nearestDate = this.toGMT2(
        this.getNearestAvailableAppointment(day, doctorAppointments) as Date
      );
    } else {
      [nearestDate, doctorId] = await this.findSpecialtyNearestDate(
        day,
        appointment.specialtyId,
        appointment.doctorId
      );
    }

    if (!nearestDate)
      throw new BadRequestError("This day is full, try another day!");
    appointment = await appointment.update({
      date: nearestDate,
      doctorId,
    });

    res.json({ success: true, appointment });
  };

  async cancelAppointment(req: Request, res: Response) {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) throw new NotFoundError("appointment");

    await appointment?.destroy();
    res.json({ success: true, appointment });
  }
}
