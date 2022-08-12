import {
  Table,
  Model,
  Column,
  DataType,
  IsEmail,
  BeforeSave,
} from "sequelize-typescript";

import bcrypt from "bcrypt";

@Table({
  tableName: "users",
})
export class Users extends Model {
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
  static async hashPassword(instance: Users) {
    if (instance.changed("password"))
      instance.password = await bcrypt.hash(instance.password, 8);
  }
}
Users.prototype.toJSON = function () {
  const user = this;
  if (user.role === "admin") return {};
  const jsonUser = {
    id: user.getDataValue("id"),
    email: user.getDataValue("email"),
    role: user.getDataValue("role"),
  };
  return jsonUser;
};
