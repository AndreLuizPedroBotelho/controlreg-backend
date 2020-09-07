import faker from 'faker';
import { UserFactory } from '../../users/factories/UserFactory';
import { MethodPayment, TypeUser } from '../../../shared/enuns';

import { Sale } from '../entities/Sale';

import ClientController from '../controllers/ClientController';
import SaleController from '../controllers/SaleController';
import ProductController from '../controllers/ProductController';
import CompanyController from '../controllers/CompanyController';
import UserController from '../../users/controllers/UserController';

import { CompanyFactory } from './CompanyFactory';
import { ProductFactory } from './ProductFactory';
import { ClientFactory } from './ClientFactory';

export class SaleFactory {
  public async create(
    saleController: SaleController,
    userController: UserController,
    productController: ProductController,
    companyController: CompanyController,
    clientController: ClientController,
    companyFactory: CompanyFactory,
    userFactory: UserFactory | null = null,
    productFactory: ProductFactory | null = null,
    clientFactory: ClientFactory | null = null
  ): Promise<Sale> {
    let userId = 9999;

    if (userFactory) {
      const user = await userFactory.create(
        userController,
        companyController,
        companyFactory,
        TypeUser.SALESMAN
      );
      userId = user.id;
    }

    const sale = new Sale();

    sale.methodPayment = MethodPayment.AVISTA;
    sale.price = parseFloat(faker.finance.amount());
    sale.amount = parseInt(faker.finance.amount(), 10);

    if (clientFactory) {
      const client = await clientFactory.create(clientController);
      sale.clientId = client.id;
    }

    if (productFactory) {
      const product = await productFactory.create(
        productController,
        companyController,
        companyFactory
      );
      sale.productId = product.id;
    }
    const response = await saleController.create(sale, userId);

    return response;
  }
}
