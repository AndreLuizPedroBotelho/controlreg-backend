import { Resolver, Mutation, Arg } from 'type-graphql';
import { LoginResponse } from '../inputs/SessionInput';

import SessionController from '../controllers/SessionController';
import ILoginDTO from '../dtos/IUserDTO';

@Resolver()
export class SessionResolver {
  public sessionController = new SessionController();

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email', () => String) email: string,
    @Arg('password', () => String) password: string
  ): Promise<ILoginDTO> {
    return this.sessionController.create(email, password);
  }
}
