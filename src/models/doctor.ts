import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { Optional } from "sequelize/types";
import { Appointment } from "./appointment";
import { Specialty } from "./specialty";
import { User } from "./user";

interface DoctorAttributes {
  id: number;
  fullName: string;
  address?: string;
  phoneNumber: string;
  examinationPrice: number;
  userId: number;
  user: User;
  specialtyId: number;
  specialty: Specialty;
  appointments: Appointment[];
}

interface DoctorCreationAttributes
  extends Optional<
    DoctorAttributes,
    "id" | "user" | "specialty" | "appointments"
  > {}

@Table({ timestamps: false })
export class Doctor extends Model<DoctorAttributes, DoctorCreationAttributes> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullName!: string;

  @Column({
    type: DataType.STRING,
  })
  address!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phoneNumber!: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  examinationPrice!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => Specialty)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: "CASCADE",
  })
  specialtyId!: number;

  @BelongsTo(() => Specialty)
  specialty!: Specialty;

  @HasMany(() => Appointment)
  appointments!: Appointment[];
}
