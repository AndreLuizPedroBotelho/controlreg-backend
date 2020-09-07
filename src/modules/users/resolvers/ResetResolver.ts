import { Resolver, Mutation, Arg, Int, UseMiddleware } from 'type-graphql';
import { checkAdmin } from '../../../shared/middleware/checkAdmin';
import { isAuth } from '../../../shared/middleware/isAuth';

import ResetController from '../controllers/ResetController';

@Resolver()
export class ResetResolver {
  public resetController = new ResetController();

  @Mutation(() => String)
  @UseMiddleware(isAuth, checkAdmin)
  async resetPassword(
    @Arg('userId', () => Int) userId: number
  ): Promise<string> {
    return this.resetController.update(userId);
  }
}
