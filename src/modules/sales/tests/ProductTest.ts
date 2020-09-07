import faker from 'faker';
import { createTypeormConn, deleteTypeormConn } from '../../../shared/typeorm';
import { Product } from '../entities/Product';
import ProductController from '../controllers/ProductController';
import CompanyController from '../controllers/CompanyController';
import { Company } from '../entities/Company';
import { ProductFactory } from '../factories/ProductFactory';
import { CompanyFactory } from '../factories/CompanyFactory';

let productController: ProductController;
let companyController: CompanyController;
let productFactory: ProductFactory;
let companyFactory: CompanyFactory;

describe('ProductTest', () => {
  beforeAll(async () => {
    await createTypeormConn();
  });

  afterAll(async () => {
    await deleteTypeormConn();
  });

  beforeEach(() => {
    productController = new ProductController();
    companyController = new CompanyController();

    productFactory = new ProductFactory();
    companyFactory = new CompanyFactory();
  });

  it('should be able to create product', async () => {
    const product = await productFactory.create(
      productController,
      companyController,
      companyFactory
    );

    expect(product).toHaveProperty('id');
  });

  it("shouldn't be able to create product", async () => {
    const product = new Product();
    product.name = faker.commerce.productName();
    product.amount = 2;
    product.category = 'Category';
    product.price = parseFloat(faker.finance.amount());
    product.companyId = 0;

    await expect(productController.create(product)).rejects.toBeInstanceOf(
      Error
    );
  });

  it('should be able to update product', async () => {
    const product = await productFactory.create(
      productController,
      companyController,
      companyFactory
    );

    const company2 = new Company();
    company2.name = faker.company.companyName();
    const newCompany2 = await companyController.create(company2);

    product.name = faker.commerce.productName();
    product.price = parseFloat(faker.finance.amount());
    product.companyId = newCompany2.id;

    const response = await productController.update(product, product.id);

    expect(response.name).toBe(product.name);
    expect(response.price).toBe(product.price);
    expect(response.id).toBe(product.id);
    expect(response.companyId).toBe(newCompany2.id);
  });

  it("shouldn't be able to update product,company doesn't exist", async () => {
    const product = await productFactory.create(
      productController,
      companyController,
      companyFactory
    );

    product.companyId = 9999;

    await expect(
      productController.update(product, product.id)
    ).rejects.toBeInstanceOf(Error);
  });

  it("shouldn't be able to update product,product doesn't exist", async () => {
    const product = await productFactory.create(
      productController,
      companyController,
      companyFactory
    );

    await expect(
      productController.update(product, 9999)
    ).rejects.toBeInstanceOf(Error);
  });

  it('should be able to delete product', async () => {
    const product = await productFactory.create(
      productController,
      companyController,
      companyFactory
    );

    const response = await productController.delete(product.id);

    expect(response).toEqual('Product was delete');
  });

  it("shouldn't be able to delete product", async () => {
    await expect(productController.delete(0)).rejects.toBeInstanceOf(Error);
  });

  it('should be able to list one product', async () => {
    const product = await productFactory.create(
      productController,
      companyController,
      companyFactory
    );

    const response = await productController.show(product.id);

    expect(response).toEqual(product);
  });

  it("shouldn't be able to list one product", async () => {
    await expect(productController.show(0)).rejects.toBeInstanceOf(Error);
  });

  it('should be able to list all product', async () => {
    const product1 = await productFactory.create(
      productController,
      companyController,
      companyFactory
    );

    const product2 = await productFactory.create(
      productController,
      companyController,
      companyFactory
    );

    const product3 = await productFactory.create(
      productController,
      companyController,
      companyFactory
    );

    const products = await productController.index();

    expect(products).toEqual(
      expect.arrayContaining([product1, product2, product3])
    );
  });
});
