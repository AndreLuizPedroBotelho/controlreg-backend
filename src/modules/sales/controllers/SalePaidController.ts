import { Repository, Not, getRepository } from 'typeorm';
import { TypeUser } from '../../../shared/enuns';
import { IContextPayload } from '../../../shared/dtos/IContext';

import { Sale } from '../entities/Sale';

export default class SalePaidController {
  private ormSaleRepository: Repository<Sale>;

  constructor() {
    this.ormSaleRepository = getRepository(Sale);
  }

  public async paidSale(
    saleId: number,
    paid: boolean,
    { user }: IContextPayload
  ): Promise<string> {
    const sale = await this.ormSaleRepository.findOne(saleId, {
      relations: ['parcelSales'],
      where: {
        userId: user.typeUser === TypeUser.ADMIN ? Not(0) : user.id,
      },
    });

    if (!sale) {
      throw new Error('Essa venda não existe');
    }

    sale.paid = paid;
    for (const parcel of sale.parcelSales) {
      parcel.paid = paid;

      await parcel.save();
    }

    await sale.save();

    return 'Pagamento da venda foi alterado';
  }
}
