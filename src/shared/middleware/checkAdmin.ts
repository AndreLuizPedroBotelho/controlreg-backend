import { MiddlewareFn } from 'type-graphql';
import { TypeUser } from '../enuns';
import { IContext } from '../dtos/IContext';

export const checkAdmin: MiddlewareFn<Required<IContext>> = async (
  { context },
  next
) => {
  const { user } = context.payload;
  if (user.typeUser !== TypeUser.ADMIN) {
    throw new Error("User isn't admin");
  }

  return next();
};
