import {
  Table,
  Model,
  Column,
  DataType,
  IsEmail,
  BeforeSave,
  HasOne,
} from "sequelize-typescript";
import { Optional } from "sequelize/types";
import bcrypt from "bcrypt";
import { Doctor } from "./doctor";
import { Receptionist } from "./receptionist";

interface UserAttributes {
  id: number;
  email: string;
  password: string;
  role: string;
  doctor: Doctor;
  receptionist: Receptionist;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "doctor" | "receptionist"> {}
interface UserOutputAttributes extends Optional<UserAttributes, "password"> {}

@Table({ timestamps: false })
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @IsEmail
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.ENUM("admin", "doctor", "receptionist"),
    allowNull: false,
  })
  role!: string;

  @BeforeSave
  static async hashPassword(instance: User) {
    if (instance.changed("password"))
      instance.password = await bcrypt.hash(instance.password, 8);
  }

  @HasOne(() => Doctor)
  doctor!: Doctor;

  @HasOne(() => Receptionist)
  receptionist!: Receptionist;
}

User.prototype.toJSON = function () {
  if (this.role === "admin") return {};
  const jsonUser = this.get() as UserOutputAttributes;
  delete jsonUser.password;
  return jsonUser;
};
