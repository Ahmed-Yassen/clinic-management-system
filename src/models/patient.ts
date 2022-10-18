import { Table, Model, Column, DataType, HasMany } from "sequelize-typescript";
import { Optional } from "sequelize/types";
import { Appointment } from "./appointment";

interface PatientAttributes {
  id: number;
  fullName: string;
  phoneNumber: string;
  appointments: Appointment[];
}

interface PatientCreationAttributes
  extends Optional<PatientAttributes, "id" | "appointments"> {}

@Table({ timestamps: false })
export class Patient extends Model<
  PatientAttributes,
  PatientCreationAttributes
> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phoneNumber!: string;

  @HasMany(() => Appointment)
  appointments!: Appointment[];
}
