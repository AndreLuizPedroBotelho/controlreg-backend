import { Repository, getRepository, Not } from 'typeorm';
import { TypeUser } from '../../../shared/enuns';
import { IContextPayload } from '../../../shared/dtos/IContext';
import { ParcelSale } from '../entities/ParcelSale';

export default class ParcelSalePaidController {
  private ormParcelSaleRepository: Repository<ParcelSale>;

  constructor() {
    this.ormParcelSaleRepository = getRepository(ParcelSale);
  }

  public async paidParcelSale(
    parcelSaleId: number,
    paid: boolean,
    { user }: IContextPayload
  ): Promise<string> {
    const parcelSale = await this.ormParcelSaleRepository.findOne(
      parcelSaleId,
      {
        relations: ['sale', 'sale.parcelSales'],

        where: {
          userId: user.typeUser === TypeUser.ADMIN ? Not(0) : user.id,
        },
      }
    );

    if (!parcelSale) {
      throw new Error('Parcela não existe');
    }

    const { sale } = parcelSale;

    const parselSalesEqualPaid = sale.parcelSales.filter(
      (parcelSaleFilter: ParcelSale) => parcelSaleFilter.paid === paid
    );

    if (parselSalesEqualPaid.length + 1 === sale.parcelSales.length) {
      sale.paid = paid;
      await sale.save();
    }

    parcelSale.paid = paid;
    await parcelSale.save();

    return 'Pagamento da Parcela da venda alterado';
  }
}
