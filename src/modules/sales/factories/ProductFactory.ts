import faker from 'faker';

import ProductController from '../controllers/ProductController';
import CompanyController from '../controllers/CompanyController';

import { Product } from '../entities/Product';

import { CompanyFactory } from './CompanyFactory';

export class ProductFactory {
  public async create(
    productController: ProductController,
    companyController: CompanyController,
    companyFactory: CompanyFactory
  ): Promise<Product> {
    const company = await companyFactory.create(companyController);

    const product = new Product();
    product.name = faker.commerce.productName();
    product.amount = 2;
    product.category = 'Category';
    product.price = parseFloat(faker.finance.amount());
    product.companyId = company.id;

    const response = await productController.create(product);

    return response;
  }
}
