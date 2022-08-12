import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "specialties",
})
export class Specialties extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name!: string;
}
