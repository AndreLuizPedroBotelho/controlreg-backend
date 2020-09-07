import { Resolver, Mutation, Arg, Int, UseMiddleware, Ctx } from 'type-graphql';
import { IContext } from '../../../shared/dtos/IContext';
import { isAuth } from '../../../shared/middleware/isAuth';

import SalePaidController from '../controllers/SalePaidController';

@Resolver()
export class SalePaidResolver {
  public salePaidController = new SalePaidController();

  @Mutation(() => String)
  @UseMiddleware(isAuth)
  async paidSale(
    @Arg('paid', () => Boolean) paid: boolean,
    @Arg('saleId', () => Int) saleId: number,
    @Ctx() { payload }: IContext
  ): Promise<string> {
    if (!payload) {
      throw new Error("Payload doesn't exist");
    }

    return this.salePaidController.paidSale(saleId, paid, payload);
  }
}
