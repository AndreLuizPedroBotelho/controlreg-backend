import { getRepository, Repository, Raw, Not } from 'typeorm';
import { TypeUser } from '../../../shared/enuns';
import { IContextPayload } from '../../../shared/dtos/IContext';
import { ProductUpdateInput, ProductInput } from '../inputs/ProductInput';
import { Company } from '../entities/Company';

import { Product } from '../entities/Product';
import { IProductIndex } from '../interfaces/Product';

export default class ProductController {
  private ormRepository: Repository<Product>;

  private ormCompanyRepository: Repository<Company>;

  constructor() {
    this.ormRepository = getRepository(Product);
    this.ormCompanyRepository = getRepository(Company);
  }

  public async create(
    { amount, category, companyId, name, price }: ProductInput,
    userId: number
  ): Promise<Product> {
    const company = await this.ormCompanyRepository.findOne(companyId);

    if (!company) {
      throw new Error('Empresa não existe');
    }
    const product = await this.ormRepository.create({
      amount,
      category,
      company,
      name,
      price,
      userId,
    });

    await product.save();
    return product;
  }

  public async update(
    { amount, category, companyId, name, price }: ProductUpdateInput,
    id: number,
    { user }: IContextPayload
  ): Promise<Product> {
    let company;

    if (companyId) {
      company = await this.ormCompanyRepository.findOne(companyId);
      if (!company) {
        throw new Error('Empresa não existe');
      }
    }

    const product = await this.ormRepository.findOne(id);

    if (!product) {
      throw new Error('Produto não existe');
    }

    if (product.userId !== user.id && user.typeUser !== TypeUser.ADMIN) {
      throw new Error('Ação não permitida');
    }

    Object.assign(product, { name, price, category, amount, companyId });

    product.save();

    return product;
  }

  public async delete(id: number, { user }: IContextPayload): Promise<string> {
    const product = await this.ormRepository.findOne(id);

    if (!product) {
      throw new Error('Produto não existe');
    }

    if (product.userId !== user.id && user.typeUser !== TypeUser.ADMIN) {
      throw new Error('Ação não permitida');
    }

    await product.remove();

    return 'Produto foi deletado';
  }

  public async index(
    page: number,
    limit: number,
    nameSearch: string,
    { user }: IContextPayload
  ): Promise<IProductIndex> {
    const [products, productCount] = await this.ormRepository.findAndCount({
      relations: ['company'],
      skip: page,
      take: limit,
      order: {
        id: 'DESC',
      },
      where: {
        name: Raw(
          alias => `Lower(${alias}) like '%${nameSearch.toLowerCase()}%'`
        ),
        userId: user.typeUser === TypeUser.ADMIN ? Not(0) : user.id,
      },
    });

    return {
      count: productCount,
      products,
    };
  }

  public async show(id: number, { user }: IContextPayload): Promise<Product> {
    const product = await this.ormRepository.findOne(id, {
      relations: ['company'],
    });

    if (!product) {
      throw new Error('Produto não existe');
    }

    if (product.userId !== user.id && user.typeUser !== TypeUser.ADMIN) {
      throw new Error('Ação não permitida');
    }

    return product;
  }
}
