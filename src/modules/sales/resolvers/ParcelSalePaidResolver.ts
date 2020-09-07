import { Resolver, Mutation, Arg, Int, UseMiddleware, Ctx } from 'type-graphql';
import { IContext } from '../../../shared/dtos/IContext';
import { isAuth } from '../../../shared/middleware/isAuth';

import ParcelSalePaidController from '../controllers/ParcelSalePaidController';

@Resolver()
export class ParcelSalePaidResolver {
  public parcelSalePaidController = new ParcelSalePaidController();

  @Mutation(() => String)
  @UseMiddleware(isAuth)
  async paidParcelSale(
    @Arg('paid', () => Boolean) paid: boolean,
    @Arg('parcelSaleId', () => Int) parcelSaleId: number,
    @Ctx() { payload }: IContext
  ): Promise<string> {
    if (!payload) {
      throw new Error("Payload doesn't exist");
    }

    return this.parcelSalePaidController.paidParcelSale(
      parcelSaleId,
      paid,
      payload
    );
  }
}
