import { Resolver, UseMiddleware, Ctx, Query, Arg, Int } from 'type-graphql';
import { IProductIndex } from '../interfaces/Product';
import { ParcelSaleReturnInput } from '../inputs/ParcelSaleInput';
import { IParcelSalesIndex } from '../interfaces/ParcelSale';

import { IContext } from '../../../shared/dtos/IContext';
import { isAuth } from '../../../shared/middleware/isAuth';

import ParcelExpiredController from '../controllers/ParcelExpiredController';
import ProductEndedController from '../controllers/ProductEndedController';
import { ProductReturnInput } from '../inputs/ProductInput';

@Resolver()
export class ReportResolver {
  public parcelExpiredController = new ParcelExpiredController();

  public productEndedController = new ProductEndedController();

  @Query(() => ParcelSaleReturnInput)
  @UseMiddleware(isAuth)
  async parcelExpired(
    @Arg('page', () => Int) page: number,
    @Arg('limit', () => Int, { nullable: true }) limit: number,
    @Ctx() { payload }: IContext
  ): Promise<IParcelSalesIndex> {
    if (!payload) {
      throw new Error("Payload doesn't exist");
    }

    return this.parcelExpiredController.parcelExpired(page, limit, payload);
  }

  @Query(() => ProductReturnInput)
  @UseMiddleware(isAuth)
  async productEnded(
    @Arg('page', () => Int) page: number,
    @Arg('limit', () => Int, { nullable: true }) limit: number,
    @Ctx() { payload }: IContext
  ): Promise<IProductIndex> {
    if (!payload) {
      throw new Error("Payload doesn't exist");
    }

    return this.productEndedController.productEnded(page, limit, payload);
  }
}
