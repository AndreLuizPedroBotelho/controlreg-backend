import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { classToClass } from 'class-transformer';
import { IContextPayload } from '../../../shared/dtos/IContext';
import { ISaleIndex } from '../interfaces/Sale';
import { SaleUpdateInput, SaleInput } from '../inputs/SaleInput';
import { Client } from '../entities/Client';
import { Product } from '../entities/Product';
import { Sale } from '../entities/Sale';
import { User } from '../../users/entities/User';

import { TypeUser, MethodPayment } from '../../../shared/enuns';

export default class SaleController {
  private ormRepository: Repository<Sale>;

  private ormProductRepository: Repository<Product>;

  private ormUserRepository: Repository<User>;

  private ormClientRepository: Repository<Client>;

  constructor() {
    this.ormRepository = getRepository(Sale);
    this.ormProductRepository = getRepository(Product);
    this.ormUserRepository = getRepository(User);
    this.ormClientRepository = getRepository(Client);
  }

  public async create(
    { price, amount, dateSale, clientId, methodPayment, productId }: SaleInput,
    userId: number
  ): Promise<Sale> {
    const user = await this.ormUserRepository.findOne(userId, {
      where: {
        user: userId,
      },
    });

    if (!user) {
      throw new Error('Usuário não existe');
    }

    const client = await this.ormClientRepository.findOne(clientId);

    if (!client || !clientId) {
      throw new Error('Cliente não existe');
    }

    const product = await this.ormProductRepository.findOne(productId);
    if (!product || !productId) {
      throw new Error('Produto não existe');
    }

    if (product.amount < 1) {
      throw new Error('Produto não disponível');
    }

    product.amount -= 1;
    await product.save();

    const sale = await this.ormRepository.create({
      price,
      methodPayment,
      amount,
      dateSale,
      product,
      client,
      user,
    });

    if (sale.methodPayment === MethodPayment.AVISTA) {
      sale.amount = 1;
    }

    await sale.save();

    await sale.createParcelSale(sale);
    return classToClass(sale);
  }

  public async update(
    {
      price,
      amount,
      dateSale,
      clientId,
      methodPayment,
      productId,
      paid,
    }: SaleUpdateInput,
    id: number,
    { user }: IContextPayload
  ): Promise<Sale> {
    let client;
    let product;

    if (clientId) {
      client = await this.ormClientRepository.findOne(clientId);
      if (!client) {
        throw new Error('Cliente não existe');
      }
    }

    if (productId) {
      product = await this.ormProductRepository.findOne(productId);
      if (!product) {
        throw new Error('Produto não existe');
      }
    }

    const sale = await this.ormRepository.findOne(id);

    if (!sale) {
      throw new Error('Venda não existe');
    }

    if (sale.userId !== user.id && user.typeUser !== TypeUser.ADMIN) {
      throw new Error('Ação não permitida');
    }

    if (sale.productId !== productId) {
      if (product.amount < 1) {
        throw new Error('Produto não disponível');
      }

      product.amount -= 1;
      product.save();
    }

    Object.assign(sale, {
      price,
      amount,
      dateSale,
      methodPayment,
      client,
      product,
      paid,
    });

    await sale.save();

    return classToClass(sale);
  }

  public async delete(id: number, { user }: IContextPayload): Promise<string> {
    const sale = await this.ormRepository.findOne(id);

    if (!sale) {
      throw new Error('Essa venda não foi cadastrada!');
    }

    if (sale.userId !== user.id && user.typeUser !== TypeUser.ADMIN) {
      throw new Error('Ação não permitida');
    }

    await sale.remove();

    return 'Venda foi deletada';
  }

  public async index(
    page: number,
    limit: number,
    nameSearch: string,
    { user }: IContextPayload
  ): Promise<ISaleIndex> {
    const [sales, saleCount] = await this.ormRepository.findAndCount({
      relations: ['client', 'product', 'user', 'parcelSales'],
      skip: page,
      take: limit,
      order: {
        id: 'DESC',
      },
      where: (qb: SelectQueryBuilder<any>) => {
        qb.where({
          type: 'sale',
        })
          .andWhere('Lower(client.name) like :name', {
            name: `%${nameSearch.toLowerCase()}%`,
          })
          .andWhere(
            user.typeUser !== TypeUser.ADMIN ? 'sale.userId = :userId ' : '1=1',
            {
              userId: user.id,
            }
          );
      },
      join: {
        alias: 'sale',
        innerJoinAndSelect: {
          client: 'sale.client',
        },
        leftJoinAndSelect: {
          parcelSales: 'sale.parcelSales',
        },
      },
    });

    return {
      count: saleCount,
      sales: classToClass(sales),
    };
  }

  public async show(id: number, { user }: IContextPayload): Promise<Sale> {
    if (user.typeUser === TypeUser.ADMIN) {
      const sale = await this.ormRepository.findOneOrFail(id, {
        relations: ['client', 'product', 'user', 'parcelSales'],
      });
      return classToClass(sale);
    }

    const sale = await this.ormRepository.findOneOrFail(id, {
      relations: ['client', 'product', 'user', 'parcelSales'],
      where: {
        userId: user.id,
      },
    });

    return classToClass(sale);
  }
}
