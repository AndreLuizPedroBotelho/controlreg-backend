import faker from 'faker';
import { createTypeormConn, deleteTypeormConn } from '../../../shared/typeorm';

import SaleController from '../controllers/SaleController';
import ClientController from '../controllers/ClientController';
import ProductController from '../controllers/ProductController';
import CompanyController from '../controllers/CompanyController';
import UserController from '../../users/controllers/UserController';

import { ProductFactory } from '../factories/ProductFactory';
import { CompanyFactory } from '../factories/CompanyFactory';
import { ClientFactory } from '../factories/ClientFactory';
import { SaleFactory } from '../factories/SaleFactory';
import { UserFactory } from '../../users/factories/UserFactory';
import { MethodPayment, TypeUser } from '../../../shared/enuns';

import { Sale } from '../entities/Sale';

let saleController: SaleController;
let clientController: ClientController;
let productController: ProductController;
let companyController: CompanyController;
let userController: UserController;

let productFactory: ProductFactory;
let saleFactory: SaleFactory;
let companyFactory: CompanyFactory;
let clientFactory: ClientFactory;
let userFactory: UserFactory;

describe('SaleTest', () => {
  beforeAll(async () => {
    await createTypeormConn();
  });

  afterAll(async () => {
    await deleteTypeormConn();
  });

  beforeEach(() => {
    saleController = new SaleController();
    clientController = new ClientController();
    productController = new ProductController();
    companyController = new CompanyController();
    userController = new UserController();

    productFactory = new ProductFactory();
    saleFactory = new SaleFactory();
    companyFactory = new CompanyFactory();
    clientFactory = new ClientFactory();
    userFactory = new UserFactory();
  });

  it('should be able to create sale in cash', async () => {
    const sale = await saleFactory.create(
      saleController,
      userController,
      productController,
      companyController,
      clientController,
      companyFactory,
      userFactory,
      productFactory,
      clientFactory
    );
    expect(sale).toHaveProperty('id');
  });

  it('should not be able to create sale in cash,not client', async () => {
    await expect(
      saleFactory.create(
        saleController,
        userController,
        productController,
        companyController,
        clientController,
        companyFactory,
        userFactory,
        productFactory
      )
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to create sale in cash,not user', async () => {
    await expect(
      saleFactory.create(
        saleController,
        userController,
        productController,
        companyController,
        clientController,
        companyFactory,
        null,
        productFactory,
        clientFactory
      )
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to create sale in cash,not product', async () => {
    await expect(
      saleFactory.create(
        saleController,
        userController,
        productController,
        companyController,
        clientController,
        companyFactory,
        userFactory,
        null,
        clientFactory
      )
    ).rejects.toBeInstanceOf(Error);
  });

  it('should be able to update sale', async () => {
    const sale = await saleFactory.create(
      saleController,
      userController,
      productController,
      companyController,
      clientController,
      companyFactory,
      userFactory,
      productFactory,
      clientFactory
    );

    sale.methodPayment = MethodPayment.CARTAO;

    const response = await saleController.update(sale, sale.id);

    expect(response.methodPayment).toBe(sale.methodPayment);
    expect(response.id).toBe(sale.id);
  });

  it('should not be able to update sale,client not exist ', async () => {
    const sale = await saleFactory.create(
      saleController,
      userController,
      productController,
      companyController,
      clientController,
      companyFactory,
      userFactory,
      productFactory,
      clientFactory
    );

    sale.methodPayment = MethodPayment.CARTAO;
    sale.clientId = 99999;
    await expect(saleController.update(sale, sale.id)).rejects.toBeInstanceOf(
      Error
    );
  });

  it('should not be able to update sale,product not exist ', async () => {
    const sale = await saleFactory.create(
      saleController,
      userController,
      productController,
      companyController,
      clientController,
      companyFactory,
      userFactory,
      productFactory,
      clientFactory
    );

    sale.methodPayment = MethodPayment.CARTAO;
    sale.productId = 99999;
    await expect(saleController.update(sale, sale.id)).rejects.toBeInstanceOf(
      Error
    );
  });

  it('should not be able to update sale,sale not exist ', async () => {
    const sale = await saleFactory.create(
      saleController,
      userController,
      productController,
      companyController,
      clientController,
      companyFactory,
      userFactory,
      productFactory,
      clientFactory
    );

    sale.methodPayment = MethodPayment.CARTAO;
    await expect(saleController.update(sale, 9999)).rejects.toBeInstanceOf(
      Error
    );
  });

  it("shouldn't be able to update sale", async () => {
    const sale = new Sale();

    sale.methodPayment = MethodPayment.AVISTA;
    sale.price = parseFloat(faker.finance.amount());

    await expect(saleController.update(sale, 0)).rejects.toBeInstanceOf(Error);
  });

  it('should be able to delete sale', async () => {
    const sale = await saleFactory.create(
      saleController,
      userController,
      productController,
      companyController,
      clientController,
      companyFactory,
      userFactory,
      productFactory,
      clientFactory
    );

    const response = await saleController.delete(sale.id);

    expect(response).toEqual('Sale was delete');
  });

  it("shouldn't be able to delete sale", async () => {
    await expect(saleController.delete(0)).rejects.toBeInstanceOf(Error);
  });

  it('should be able to list one sale using user admin', async () => {
    const sale = await saleFactory.create(
      saleController,
      userController,
      productController,
      companyController,
      clientController,
      companyFactory,
      userFactory,
      productFactory,
      clientFactory
    );

    const user = await userFactory.create(
      userController,
      companyController,
      companyFactory,
      TypeUser.ADMIN
    );
    const response = await saleController.show(sale.id, user.id);

    expect(response).toEqual(sale);
  });

  it('should be able to list one sale using user salesman', async () => {
    const sale = await saleFactory.create(
      saleController,
      userController,
      productController,
      companyController,
      clientController,
      companyFactory,
      userFactory,
      productFactory,
      clientFactory
    );
    const response = await saleController.show(sale.id, sale.user.id);

    expect(response).toEqual(sale);
  });

  it("shouldn't be able to list one sale", async () => {
    const user = await userFactory.create(
      userController,
      companyController,
      companyFactory,
      TypeUser.SALESMAN
    );

    await expect(saleController.show(0, user.id)).rejects.toBeInstanceOf(Error);
  });

  it("shouldn't be able to list one sale,user not exists", async () => {
    const sale = await saleFactory.create(
      saleController,
      userController,
      productController,
      companyController,
      clientController,
      companyFactory,
      userFactory,
      productFactory,
      clientFactory
    );

    await expect(saleController.show(sale.id, 0)).rejects.toBeInstanceOf(Error);
  });

  it('should be able to list all sale,with admin', async () => {
    const sale1 = await saleFactory.create(
      saleController,
      userController,
      productController,
      companyController,
      clientController,
      companyFactory,
      userFactory,
      productFactory,
      clientFactory
    );

    const sale2 = await saleFactory.create(
      saleController,
      userController,
      productController,
      companyController,
      clientController,
      companyFactory,
      userFactory,
      productFactory,
      clientFactory
    );

    const sale3 = await saleFactory.create(
      saleController,
      userController,
      productController,
      companyController,
      clientController,
      companyFactory,
      userFactory,
      productFactory,
      clientFactory
    );

    const user = await userFactory.create(
      userController,
      companyController,
      companyFactory,
      TypeUser.ADMIN
    );

    const sales = await saleController.index(user.id);

    expect(sales).toEqual(expect.arrayContaining([sale1, sale2, sale3]));
  });

  it('should be able to list all sale,with salesman', async () => {
    const sale1 = await saleFactory.create(
      saleController,
      userController,
      productController,
      companyController,
      clientController,
      companyFactory,
      userFactory,
      productFactory,
      clientFactory
    );

    const sales = await saleController.index(sale1.user.id);

    expect(sales).toEqual(expect.arrayContaining([sale1]));
  });

  it('should not be able to list all sale', async () => {
    await expect(saleController.index(0)).rejects.toBeInstanceOf(Error);
  });
});
