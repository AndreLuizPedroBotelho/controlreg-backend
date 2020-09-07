import faker from 'faker';
import { Company } from '../../sales/entities/Company';

import { TypeUser } from '../../../shared/enuns';
import { createTypeormConn, deleteTypeormConn } from '../../../shared/typeorm';

import { User } from '../entities/User';

import UserController from '../controllers/UserController';
import CompanyController from '../../sales/controllers/CompanyController';

import { UserFactory } from '../factories/UserFactory';
import { CompanyFactory } from '../../sales/factories/CompanyFactory';

let userController: UserController;
let companyController: CompanyController;

let userFactory: UserFactory;
let companyFactory: CompanyFactory;

describe('UserTest', () => {
  beforeAll(async () => {
    await createTypeormConn();
  });

  afterAll(async () => {
    await deleteTypeormConn();
  });

  beforeEach(() => {
    userController = new UserController();
    companyController = new CompanyController();

    userFactory = new UserFactory();
    companyFactory = new CompanyFactory();
  });

  it('should be able to create user admin', async () => {
    const user = await userFactory.create(
      userController,
      companyController,
      companyFactory,
      TypeUser.ADMIN
    );

    expect(user).toHaveProperty('id');
    expect(user.password).toBeUndefined();

    expect(user.typeUser).toEqual(TypeUser.ADMIN);
  });

  it('should be able to create user salesman', async () => {
    const user = await userFactory.create(
      userController,
      companyController,
      companyFactory,
      TypeUser.SALESMAN
    );

    expect(user).toHaveProperty('id');
    expect(user.typeUser).toEqual(TypeUser.SALESMAN);
  });

  it("shouldn't be able to create user, email already exists", async () => {
    const user = await userFactory.create(
      userController,
      companyController,
      companyFactory,
      TypeUser.ADMIN
    );

    await expect(userController.create(user)).rejects.toBeInstanceOf(Error);
  });

  it("shouldn't be able to create user, salesman without company ", async () => {
    const user = new User();

    user.name = faker.name.findName();
    user.email = faker.internet.email();
    user.password = faker.internet.password();
    user.typeUser = TypeUser.SALESMAN;

    await expect(userController.create(user)).rejects.toBeInstanceOf(Error);
  });

  it("shouldn't be able to create user, salesman with company invalid ", async () => {
    const user = new User();

    user.name = faker.name.findName();
    user.email = faker.internet.email();
    user.password = faker.internet.password();
    user.typeUser = TypeUser.SALESMAN;
    user.companies = [];

    const company = new Company();
    company.id = 9999;
    user.companies.push(company);
    await expect(userController.create(user)).rejects.toBeInstanceOf(Error);
  });

  it('should be able to update user', async () => {
    const user = await userFactory.create(
      userController,
      companyController,
      companyFactory,
      TypeUser.ADMIN
    );

    user.name = faker.name.findName();

    const response = await userController.update(user, user.id);

    expect(response.name).toBe(user.name);
    expect(response.id).toBe(user.id);
  });

  it('should be able to update user salesman', async () => {
    const user = await userFactory.create(
      userController,
      companyController,
      companyFactory,
      TypeUser.SALESMAN
    );

    user.name = faker.name.findName();

    user.companies = [];
    const company = await companyFactory.create(companyController);
    user.companies.push(company);

    const response = await userController.update(user, user.id);

    expect(response.name).toBe(user.name);
    expect(response.id).toBe(user.id);
  });

  it('should not  be able to update user salesman with company invalid', async () => {
    const user = await userFactory.create(
      userController,
      companyController,
      companyFactory,
      TypeUser.SALESMAN
    );

    user.name = faker.name.findName();

    const company = new Company();
    company.id = 9999;
    user.companies.push(company);

    await expect(userController.update(user, user.id)).rejects.toBeInstanceOf(
      Error
    );
  });

  it("shouldn't be able to update user, email already exists", async () => {
    const user1 = await userFactory.create(
      userController,
      companyController,
      companyFactory,
      TypeUser.SALESMAN
    );
    const user2 = await userFactory.create(
      userController,
      companyController,
      companyFactory,
      TypeUser.SALESMAN
    );

    user2.email = user1.email;

    await expect(userController.update(user2, 0)).rejects.toBeInstanceOf(Error);
  });

  it("shouldn't be able to update user with, user doesn't exist", async () => {
    const user = new User();

    user.name = faker.name.findName();
    user.email = faker.internet.email();
    user.password = faker.internet.password();
    user.typeUser = TypeUser.SALESMAN;

    await expect(userController.update(user, 0)).rejects.toBeInstanceOf(Error);
  });

  it('should be able to delete user', async () => {
    const user = await userFactory.create(
      userController,
      companyController,
      companyFactory,
      TypeUser.SALESMAN
    );

    const response = await userController.delete(user.id);

    expect(response).toEqual('User was delete');
  });

  it("shouldn't be able to delete user", async () => {
    await expect(userController.delete(0)).rejects.toBeInstanceOf(Error);
  });

  it('should be able to list one user', async () => {
    const user = await userFactory.create(
      userController,
      companyController,
      companyFactory,
      TypeUser.ADMIN
    );

    const response = await userController.show(user.id);

    expect(response).toEqual(user);
  });

  it("shouldn't be able to list one user", async () => {
    await expect(userController.show(0)).rejects.toBeInstanceOf(Error);
  });

  it('should be able to list all user', async () => {
    const user1 = await userFactory.create(
      userController,
      companyController,
      companyFactory,
      TypeUser.ADMIN
    );

    const user2 = await userFactory.create(
      userController,
      companyController,
      companyFactory,
      TypeUser.ADMIN
    );

    const user3 = await userFactory.create(
      userController,
      companyController,
      companyFactory,
      TypeUser.ADMIN
    );
    const users = await userController.index();
    expect(users).toEqual(expect.arrayContaining([user1, user2, user3]));
  });
});
