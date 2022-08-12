import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "appointments",
})
export class Appointments extends Model {
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date!: Date;
}
