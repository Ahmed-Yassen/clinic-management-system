import { Table, Model, Column, DataType, HasMany } from "sequelize-typescript";
import { Optional } from "sequelize/types";
import { Appointment } from "./appointment";
import { Doctor } from "./doctor";

interface SpecialtyAttrs {
  id: number;
  name: string;
  doctors: Doctor[];
  appointments: Appointment[];
}

interface SpecialtyCreationAttrs
  extends Optional<SpecialtyAttrs, "id" | "doctors" | "appointments"> {}

@Table({ timestamps: false })
export class Specialty extends Model<SpecialtyAttrs, SpecialtyCreationAttrs> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name!: string;

  @HasMany(() => Doctor)
  doctors!: Doctor[];

  @HasMany(() => Appointment)
  appointments!: Appointment[];
}
