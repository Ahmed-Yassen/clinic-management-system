import { Users } from "../models/users";

export default class UserController {
  constructor() {}

  private seperateData(requestBody: any, role: string) {
    const userTableData = {
      email: requestBody.email,
      password: requestBody.password,
      role,
    };

    const roleTableData = { ...requestBody };
    delete roleTableData.email;
    delete roleTableData.password;

    return [userTableData, roleTableData];
  }

  private async userEmailExists(userEmail: string) {
    const duplicateUser = await Users.findOne({ where: { email: userEmail } });
    return duplicateUser;
  }

  private createUser = async (userData: any) => {
    const user = await Users.create(userData);
    return user.toJSON();
  };
}
