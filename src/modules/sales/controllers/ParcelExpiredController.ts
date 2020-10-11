import { Repository, getRepository, SelectQueryBuilder } from 'typeorm';
import { IParcelSalesIndex } from '../interfaces/ParcelSale';
import { TypeUser } from '../../../shared/enuns';
import { IContextPayload } from '../../../shared/dtos/IContext';
import { ParcelSale } from '../entities/ParcelSale';

export default class ParcelExpiredController {
  private ormParcelSaleRepository: Repository<ParcelSale>;

  constructor() {
    this.ormParcelSaleRepository = getRepository(ParcelSale);
  }

  public async parcelExpired(
    page: number,
    limit: number,
    { user }: IContextPayload
  ): Promise<IParcelSalesIndex> {
    const [
      parcelSales,
      parselExpiredCount,
    ] = await this.ormParcelSaleRepository.findAndCount({
      relations: ['sale', 'sale.client'],
      skip: page,
      take: limit,
      order: {
        maturityDate: 'ASC',
        id: 'DESC',
      },
      where: (qb: SelectQueryBuilder<any>) => {
        qb.where('parsel_sale.maturity_date< :maturityDate', {
            maturityDate: new Date(),
          })
          .andWhere('parsel_sale.paid = false')
          .andWhere(
            user.typeUser !== TypeUser.ADMIN ? 'sale.userId = :userId ' : '1=1',
            {
              userId: user.id,
            }
          );
      },
      join: {
        alias: 'parsel_sale',
        innerJoinAndSelect: {
          sale: 'parsel_sale.sale',
          client: 'sale.client',
        },
      },
    });

    return {
      count: parselExpiredCount,
      parcelSales,
    };
  }
}
