import {
  Resolver,
  Mutation,
  Arg,
  Int,
  Query,
  UseMiddleware,
  Ctx,
} from 'type-graphql';
import { IContext } from '../../../shared/dtos/IContext';
import {
  ProductInput,
  ProductUpdateInput,
  ProductReturnInput,
} from '../inputs/ProductInput';

import { Product } from '../entities/Product';
import { isAuth } from '../../../shared/middleware/isAuth';
import ProductController from '../controllers/ProductController';
import { IProductIndex } from '../interfaces/Product';

@Resolver()
export class ProductResolver {
  public productController = new ProductController();

  @Mutation(() => Product)
  @UseMiddleware(isAuth)
  async createProduct(
    @Arg('data', () => ProductInput) data: ProductInput,
    @Ctx() { payload }: IContext
  ): Promise<Product> {
    if (!payload) {
      throw new Error("Payload doesn't exist");
    }

    const { user } = payload;
    return this.productController.create(data, user.id);
  }

  @Mutation(() => Product)
  @UseMiddleware(isAuth)
  async updateProduct(
    @Arg('id', () => Int) id: number,
    @Arg('data', () => ProductUpdateInput) data: ProductUpdateInput,
    @Ctx() { payload }: IContext
  ): Promise<Product> {
    if (!payload) {
      throw new Error("Payload doesn't exist");
    }

    return this.productController.update(data, id, payload);
  }

  @Mutation(() => String)
  @UseMiddleware(isAuth)
  async deleteProduct(
    @Arg('id', () => Int) id: number,
    @Ctx() { payload }: IContext
  ): Promise<string> {
    if (!payload) {
      throw new Error("Payload doesn't exist");
    }

    return this.productController.delete(id, payload);
  }

  @Query(() => ProductReturnInput)
  @UseMiddleware(isAuth)
  listProducts(
    @Arg('page', () => Int) page: number,
    @Arg('limit', () => Int, { nullable: true }) limit: number,
    @Arg('nameSearch', () => String, { nullable: true }) nameSearch: string,
    @Ctx() { payload }: IContext
  ): Promise<IProductIndex> {
    if (!payload) {
      throw new Error("Payload doesn't exist");
    }

    return this.productController.index(page, limit, nameSearch, payload);
  }

  @Query(() => Product)
  @UseMiddleware(isAuth)
  async listProduct(
    @Arg('id', () => Int) id: number,
    @Ctx() { payload }: IContext
  ): Promise<Product> {
    if (!payload) {
      throw new Error("Payload doesn't exist");
    }

    return this.productController.show(id, payload);
  }
}
