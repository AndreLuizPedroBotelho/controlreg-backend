import {
  Resolver,
  Mutation,
  Arg,
  Int,
  Query,
  UseMiddleware,
} from 'type-graphql';
import { ICompanyIndex } from '../interfaces/Company';
import {
  CompanyInput,
  CompanyUpdateInput,
  CompanyReturnInput,
} from '../inputs/CompanyInput';

import { Company } from '../entities/Company';
import { isAuth } from '../../../shared/middleware/isAuth';
import CompanyController from '../controllers/CompanyController';
import { checkAdmin } from '../../../shared/middleware/checkAdmin';

@Resolver()
export class CompanyResolver {
  public companyController = new CompanyController();

  @Mutation(() => Company)
  @UseMiddleware(isAuth, checkAdmin)
  async createCompany(
    @Arg('data', () => CompanyInput) data: CompanyInput
  ): Promise<Company> {
    return this.companyController.create(data);
  }

  @Mutation(() => Company)
  @UseMiddleware(isAuth, checkAdmin)
  async updateCompany(
    @Arg('id', () => Int) id: number,
    @Arg('data', () => CompanyUpdateInput) data: CompanyUpdateInput
  ): Promise<Company> {
    return this.companyController.update(data, id);
  }

  @Mutation(() => String)
  @UseMiddleware(isAuth, checkAdmin)
  async deleteCompany(@Arg('id', () => Int) id: number): Promise<string> {
    return this.companyController.delete(id);
  }

  @Query(() => CompanyReturnInput)
  @UseMiddleware(isAuth, checkAdmin)
  listCompanies(
    @Arg('page', () => Int) page: number,
    @Arg('limit', () => Int, { nullable: true }) limit: number,
    @Arg('nameSearch', () => String, { nullable: true }) nameSearch: string
  ): Promise<ICompanyIndex> {
    return this.companyController.index(page, limit, nameSearch);
  }

  @Query(() => Company)
  @UseMiddleware(isAuth, checkAdmin)
  async listCompany(@Arg('id', () => Int) id: number): Promise<Company> {
    return this.companyController.show(id);
  }
}
