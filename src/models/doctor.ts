import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Optional } from "sequelize/types";
import { Specialty } from "./specialty";
import { User } from "./user";

interface DoctorAttributes {
  id: number;
  fullName: string;
  address?: string;
  phoneNumber: string;
  examinationPrice: number;
  userId: number;
  specialtyId: number;
}

interface DoctorCreationAttributes extends Optional<DoctorAttributes, "id"> {}

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
}
