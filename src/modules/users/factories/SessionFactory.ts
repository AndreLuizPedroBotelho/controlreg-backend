import faker from 'faker';
import { TypeUser } from '../../../shared/enuns';
import { CompanyFactory } from '../../sales/factories/CompanyFactory';

import UserController from '../controllers/UserController';
import SessionController from '../controllers/SessionController';
import CompanyController from '../../sales/controllers/CompanyController';

import { User } from '../entities/User';
import ILoginDTO from '../dtos/IUserDTO';

export class SessionFactory {
  public async create(
    userController: UserController,
    companyController: CompanyController,
    companyFactory: CompanyFactory,
    sessionController: SessionController,
    typeUser: TypeUser
  ): Promise<ILoginDTO> {
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

    await userController.create(user);
    const response = await sessionController.create(user.email, user.password);

    return response;
  }
}
