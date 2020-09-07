import faker from 'faker';
import { CompanyFactory } from '../factories/CompanyFactory';
import { createTypeormConn, deleteTypeormConn } from '../../../shared/typeorm';
import { Company } from '../entities/Company';
import CompanyController from '../controllers/CompanyController';

let companyController: CompanyController;
let companyFactory: CompanyFactory;

describe('CompanyTest', () => {
  beforeAll(async () => {
    await createTypeormConn();
  });

  afterAll(async () => {
    await deleteTypeormConn();
  });

  beforeEach(() => {
    companyController = new CompanyController();
    companyFactory = new CompanyFactory();
  });

  it('should be able to create company', async () => {
    const company = await companyFactory.create(companyController);
    expect(company).toHaveProperty('id');
  });

  it('should be able to update company', async () => {
    const company = await companyFactory.create(companyController);

    company.name = faker.company.companyName();

    const response = await companyController.update(company, company.id);

    expect(response.name).toBe(company.name);
    expect(response.id).toBe(company.id);
  });

  it("shouldn't be able to update company", async () => {
    const company = new Company();

    company.name = faker.company.companyName();

    await expect(companyController.update(company, 0)).rejects.toBeInstanceOf(
      Error
    );
  });

  it('should be able to delete company', async () => {
    const company = await companyFactory.create(companyController);

    const response = await companyController.delete(company.id);

    expect(response).toEqual('Company was delete');
  });

  it("shouldn't be able to delete company", async () => {
    await expect(companyController.delete(0)).rejects.toBeInstanceOf(Error);
  });

  it('should be able to list one company', async () => {
    const company = await companyFactory.create(companyController);

    const response = await companyController.show(company.id);

    expect(response).toEqual(company);
  });

  it("shouldn't be able to list one company", async () => {
    await expect(companyController.show(0)).rejects.toBeInstanceOf(Error);
  });

  it('should be able to list all company', async () => {
    const company1 = await companyFactory.create(companyController);
    const company2 = await companyFactory.create(companyController);
    const company3 = await companyFactory.create(companyController);

    const companies = await companyController.index();

    expect(companies).toEqual(
      expect.arrayContaining([company1, company2, company3])
    );
  });
});
