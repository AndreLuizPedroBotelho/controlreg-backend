import { Request, Response } from 'express';
import { TypeUser } from '../enuns';

export interface IContext {
  req: Request;
  res: Response;
  payload?: IContextPayload;
}

interface IUser {
  id: number;
  typeUser: TypeUser;
}
export interface IContextPayload {
  userId: number;
  user: IUser;
}
