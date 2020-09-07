import { getRepository, Repository, Raw } from 'typeorm';
import { CompanyUpdateInput, CompanyInput } from '../inputs/CompanyInput';
import { Company } from '../entities/Company';
import { ICompanyIndex } from '../interfaces/Company';

export default class CompanyController {
  private ormRepository: Repository<Company>;

  constructor() {
    this.ormRepository = getRepository(Company);
  }

  public async create({ name }: CompanyInput): Promise<Company> {
    const company = await this.ormRepository.create({ name }).save();

    return company;
  }

  public async update(
    { name }: CompanyUpdateInput,
    id: number
  ): Promise<Company> {
    const company = await this.ormRepository.findOne(id);

    if (!company) {
      throw new Error('Empresa não existe');
    }
    Object.assign(company, { name });

    await company.save();
    return company;
  }

  public async delete(id: number): Promise<string> {
    const company = await this.ormRepository.findOne(id);

    if (!company) {
      throw new Error('Empresa não existe');
    }

    await company.remove();

    return 'Empresa não deletado';
  }

  public async index(
    page: number,
    limit: number,
    nameSearch: string
  ): Promise<ICompanyIndex> {
    const [companies, companyCount] = await this.ormRepository.findAndCount({
      relations: ['users'],

      skip: page,
      take: limit,
      order: {
        id: 'ASC',
      },
      where: {
        name: Raw(
          alias => `Lower(${alias}) like '%${nameSearch.toLowerCase()}%'`
        ),
      },
    });

    return {
      count: companyCount,
      companies,
    };
  }

  public async show(id: number): Promise<Company> {
    const company = await this.ormRepository.findOne(id);

    if (!company) {
      throw new Error('Empresa não existe');
    }

    return company;
  }
}
