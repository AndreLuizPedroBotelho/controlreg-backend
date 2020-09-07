import { TypeUser } from '../../../shared/enuns';
import { createTypeormConn, deleteTypeormConn } from '../../../shared/typeorm';

import UserController from '../controllers/UserController';
import SessionController from '../controllers/SessionController';
import CompanyController from '../../sales/controllers/CompanyController';

import { SessionFactory } from '../factories/SessionFactory';
import { UserFactory } from '../factories/UserFactory';
import { CompanyFactory } from '../../sales/factories/CompanyFactory';

let userController: UserController;
let sessionController: SessionController;
let companyController: CompanyController;

let companyFactory: CompanyFactory;
let sessionFactory: SessionFactory;
let userFactory: UserFactory;

describe('UserTest', () => {
  beforeAll(async () => {
    await createTypeormConn();
  });

  afterAll(async () => {
    await deleteTypeormConn();
  });

  beforeEach(() => {
    userController = new UserController();
    sessionController = new SessionController();
    companyController = new CompanyController();

    sessionFactory = new SessionFactory();
    userFactory = new UserFactory();
    companyFactory = new CompanyFactory();
  });

  it('should be able to create session salesman', async () => {
    const session = await sessionFactory.create(
      userController,
      companyController,
      companyFactory,
      sessionController,
      TypeUser.SALESMAN
    );

    expect(session).toHaveProperty('accessToken');
  });

  it('should be able to create session admin', async () => {
    const session = await sessionFactory.create(
      userController,
      companyController,
      companyFactory,
      sessionController,
      TypeUser.ADMIN
    );

    expect(session).toHaveProperty('accessToken');
  });

  it("shouldn't be able to create session, it doesn't exist user with this email", async () => {
    await expect(
      sessionController.create('user-not-exist@gmail.com', 'password-invalid')
    ).rejects.toBeInstanceOf(Error);
  });

  it("shouldn't be able to create session, password invalid", async () => {
    const user = await userFactory.create(
      userController,
      companyController,
      companyFactory,
      TypeUser.ADMIN
    );

    await expect(
      sessionController.create(user.email, 'password-invalid')
    ).rejects.toBeInstanceOf(Error);
  });
});
