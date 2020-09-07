import {
  Resolver,
  Mutation,
  Arg,
  Int,
  Query,
  UseMiddleware,
  Ctx,
} from 'type-graphql';
import {
  ClientInput,
  ClientUpdateInput,
  ClientReturnInput,
} from '../inputs/ClientInput';

import { Client } from '../entities/Client';
import { isAuth } from '../../../shared/middleware/isAuth';
import ClientController from '../controllers/ClientController';
import { IClientIndex } from '../interfaces/Client';
import { IContext } from '../../../shared/dtos/IContext';

@Resolver()
export class ClientResolver {
  public clientController = new ClientController();

  @Mutation(() => Client)
  @UseMiddleware(isAuth)
  async createClient(
    @Arg('data', () => ClientInput) data: ClientInput,
    @Ctx() { payload }: IContext
  ): Promise<Client> {
    if (!payload) {
      throw new Error("Payload doesn't exist");
    }

    const { user } = payload;

    return this.clientController.create(data, user.id);
  }

  @Mutation(() => Client)
  @UseMiddleware(isAuth)
  async updateClient(
    @Arg('id', () => Int) id: number,
    @Arg('data', () => ClientUpdateInput) data: ClientUpdateInput,
    @Ctx() { payload }: IContext
  ): Promise<Client> {
    if (!payload) {
      throw new Error("Payload doesn't exist");
    }

    return this.clientController.update(data, id, payload);
  }

  @Mutation(() => String)
  @UseMiddleware(isAuth)
  async deleteClient(
    @Arg('id', () => Int) id: number,
    @Ctx() { payload }: IContext
  ): Promise<string> {
    if (!payload) {
      throw new Error("Payload doesn't exist");
    }

    return this.clientController.delete(id, payload);
  }

  @Query(() => ClientReturnInput)
  @UseMiddleware(isAuth)
  listClients(
    @Arg('page', () => Int) page: number,
    @Arg('limit', () => Int, { nullable: true }) limit: number,
    @Arg('nameSearch', () => String, { nullable: true }) nameSearch: string,
    @Ctx() { payload }: IContext
  ): Promise<IClientIndex> {
    if (!payload) {
      throw new Error("Payload doesn't exist");
    }

    return this.clientController.index(page, limit, nameSearch, payload);
  }

  @Query(() => Client)
  @UseMiddleware(isAuth)
  async listClient(
    @Arg('id', () => Int) id: number,
    @Ctx() { payload }: IContext
  ): Promise<Client> {
    if (!payload) {
      throw new Error("Payload doesn't exist");
    }

    return this.clientController.show(id, payload);
  }
}
