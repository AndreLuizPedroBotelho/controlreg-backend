import { MiddlewareFn } from 'type-graphql';
import { verify } from 'jsonwebtoken';
import { IContext, IContextPayload } from '../dtos/IContext';
import auth from '../config/auth';

export const isAuth: MiddlewareFn<IContext> = ({ context }, next) => {
  const { authorization } = context.req.headers;

  if (!authorization) throw new Error('Not authenticated');

  try {
    const [, token] = authorization.split(' ');
    const payload = verify(token, auth.secret);

    context.payload = payload as IContextPayload;
  } catch (err) {
    throw new Error('Not authenticated');
  }
  return next();
};
