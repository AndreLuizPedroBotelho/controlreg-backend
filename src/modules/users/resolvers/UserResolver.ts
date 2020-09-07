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
  UserReturnInput,
  UserInput,
  UserUpdateInput,
} from '../inputs/UserInput';
import { IContext } from '../../../shared/dtos/IContext';

import { User } from '../entities/User';

import { isAuth } from '../../../shared/middleware/isAuth';
import { checkAdmin } from '../../../shared/middleware/checkAdmin';

import UserController from '../controllers/UserController';

import { IUserIndex } from '../interfaces/User';

@Resolver()
export class UserResolver {
  public userController = new UserController();

  @Mutation(() => User)
  @UseMiddleware(isAuth, checkAdmin)
  async createUser(
    @Arg('data', () => UserInput) data: UserInput
  ): Promise<User> {
    return this.userController.create(data);
  }

  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async updateUser(
    @Arg('id', () => Int) id: number,
    @Arg('data', () => UserUpdateInput) data: UserUpdateInput
  ): Promise<User> {
    return this.userController.update(data, id);
  }

  @Mutation(() => String)
  @UseMiddleware(isAuth, checkAdmin)
  async deleteUser(@Arg('id', () => Int) id: number): Promise<string> {
    return this.userController.delete(id);
  }

  @Query(() => UserReturnInput)
  @UseMiddleware(isAuth, checkAdmin)
  listUsers(
    @Arg('page', () => Int) page: number,
    @Arg('limit', () => Int, { nullable: true }) limit: number,
    @Arg('nameSearch', () => String, { nullable: true }) nameSearch: string,
    @Ctx() { payload }: IContext
  ): Promise<IUserIndex> {
    if (!payload) {
      throw new Error("Payload doesn't exist");
    }

    return this.userController.index(page, limit, nameSearch, payload);
  }

  @Query(() => User)
  @UseMiddleware(isAuth, checkAdmin)
  async listUser(@Arg('id', () => Int) id: number): Promise<User> {
    return this.userController.show(id);
  }
}
