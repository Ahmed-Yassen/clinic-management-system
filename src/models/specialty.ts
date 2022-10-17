import { Table, Model, Column, DataType, HasMany } from "sequelize-typescript";
import { Optional } from "sequelize/types";
import { Doctor } from "./doctor";

interface SpecialtyAttrs {
  id: number;
  name: string;
}

interface SpecialtyCreationAttrs extends Optional<SpecialtyAttrs, "id"> {}

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
}
