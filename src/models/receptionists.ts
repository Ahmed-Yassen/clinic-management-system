import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "receptionists",
})
export class Receptionists extends Model {
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
}
