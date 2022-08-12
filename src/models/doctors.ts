import { Table, Column, Model, DataType } from "sequelize-typescript";
@Table({
  tableName: "doctors",
})
export class Doctors extends Model {
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
}
