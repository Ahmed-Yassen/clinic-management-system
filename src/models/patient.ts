import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({ timestamps: false })
export class Patient extends Model {
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
}
