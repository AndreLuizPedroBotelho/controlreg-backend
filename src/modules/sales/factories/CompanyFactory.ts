import faker from 'faker';

import CompanyController from '../controllers/CompanyController';
import { Company } from '../entities/Company';

export class CompanyFactory {
  public async create(companyController: CompanyController): Promise<Company> {
    const company = new Company();

    company.name = faker.company.companyName();

    const response = await companyController.create(company);

    return response;
  }
}
