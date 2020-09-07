import faker from 'faker';
import CompanyController from '../../sales/controllers/CompanyController';
import { CompanyFactory } from '../../sales/factories/CompanyFactory';
import { TypeUser } from '../../../shared/enuns';

import UserController from '../controllers/UserController';
import { User } from '../entities/User';

export class UserFactory {
  public async create(
    userController: UserController,
    companyController: CompanyController,
    companyFactory: CompanyFactory,
    typeUser: TypeUser
  ): Promise<User> {
    const user = new User();

    user.name = faker.name.findName();
    user.email = faker.internet.email();
    user.password = faker.internet.password();
    user.typeUser = typeUser;

    user.companies = [];

    if (typeUser === TypeUser.SALESMAN) {
      const company = await companyFactory.create(companyController);
      user.companies.push(company);
    }

    const response = await userController.create(user);

    return response;
  }
}
