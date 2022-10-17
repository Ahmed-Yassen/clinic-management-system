import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import { Optional } from "sequelize/types";
import { User } from "./user";

interface ReceptionistAttributes {
  id: number;
  fullName: string;
  dateOfBirth?: string;
  salary: number;
  phoneNumber: string;
  address?: string;
  userId: number;
}

interface ReceptionsCreationAttributes
  extends Optional<ReceptionistAttributes, "id"> {}

@Table({
  timestamps: false,
})
export class Receptionist extends Model<
  ReceptionistAttributes,
  ReceptionsCreationAttributes
> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullName!: string;

  @Column({
    type: DataType.DATE,
  })
  dateOfBirth!: Date;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  salary!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phoneNumber!: string;

  @Column({
    type: DataType.STRING,
  })
  address!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @BelongsTo(() => User)
  user?: User;
}
