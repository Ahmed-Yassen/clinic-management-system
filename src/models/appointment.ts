import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Index,
} from "sequelize-typescript";
import { Optional } from "sequelize/types";
import { Doctor } from "./doctor";
import { Patient } from "./patient";
import { Specialty } from "./specialty";

export interface AppointmentAttributes {
  id: number;
  date: Date;
  patientId: number;
  patient: Patient;
  doctorId: number;
  doctor: Doctor;
  specialtyId: number;
  specialty: Specialty;
}

interface AppointmentCreationAttributes
  extends Optional<
    AppointmentAttributes,
    "id" | "specialty" | "doctor" | "patient"
  > {}

@Table({ timestamps: false })
export class Appointment extends Model<
  AppointmentAttributes,
  AppointmentCreationAttributes
> {
  @Index
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date!: Date;

  @ForeignKey(() => Patient)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  patientId!: number;

  @BelongsTo(() => Patient)
  patient!: Patient;

  @ForeignKey(() => Doctor)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  doctorId!: number;

  @BelongsTo(() => Doctor)
  doctor!: Doctor;

  @ForeignKey(() => Specialty)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  specialtyId!: number;

  @BelongsTo(() => Specialty)
  specialty!: Specialty;
}
