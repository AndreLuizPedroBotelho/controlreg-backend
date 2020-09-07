import {
  Resolver,
  Mutation,
  Arg,
  Int,
  Query,
  Ctx,
  UseMiddleware,
} from 'type-graphql';
import { ISaleIndex } from '../interfaces/Sale';

import { Sale } from '../entities/Sale';

import {
  SaleInput,
  SaleUpdateInput,
  SaleReturnInput,
} from '../inputs/SaleInput';

import { isAuth } from '../../../shared/middleware/isAuth';
import { IContext } from '../../../shared/dtos/IContext';
import SaleController from '../controllers/SaleController';

@Resolver()
export class SaleResolver {
  public saleController = new SaleController();

  @Mutation(() => Sale)
  @UseMiddleware(isAuth)
  async createSale(
    @Arg('data', () => SaleInput) data: SaleInput,
    @Ctx() { payload }: IContext
  ): Promise<Sale> {
    if (!payload) {
      throw new Error("Payload doesn't exist");
    }

    const { user } = payload;
    return this.saleController.create(data, user.id);
  }

  @Mutation(() => Int)
  @UseMiddleware(isAuth)
  async updateSale(
    @Arg('id', () => Int) id: number,
    @Arg('data', () => SaleUpdateInput) data: SaleUpdateInput,
    @Ctx() { payload }: IContext
  ): Promise<Sale> {
    if (!payload) {
      throw new Error("Payload doesn't exist");
    }

    return this.saleController.update(data, id, payload);
  }

  @Mutation(() => String)
  @UseMiddleware(isAuth)
  async deleteSale(
    @Arg('id', () => Int) id: number,
    @Ctx() { payload }: IContext
  ): Promise<string> {
    if (!payload) {
      throw new Error("Payload doesn't exist");
    }

    return this.saleController.delete(id, payload);
  }

  @Query(() => SaleReturnInput)
  @UseMiddleware(isAuth)
  async listSales(
    @Arg('page', () => Int) page: number,
    @Arg('limit', () => Int, { nullable: true }) limit: number,
    @Arg('nameSearch', () => String, { nullable: true }) nameSearch: string,
    @Ctx() { payload }: IContext
  ): Promise<ISaleIndex> {
    if (!payload) {
      throw new Error("Payload doesn't exist");
    }

    return this.saleController.index(page, limit, nameSearch, payload);
  }

  @Query(() => Sale)
  @UseMiddleware(isAuth)
  async listSale(
    @Arg('id', () => Int) id: number,
    @Ctx() { payload }: IContext
  ): Promise<Sale> {
    if (!payload) {
      throw new Error("Payload doesn't exist");
    }

    return this.saleController.show(id, payload);
  }
}
