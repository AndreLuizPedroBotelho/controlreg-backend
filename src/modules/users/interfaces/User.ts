import { User } from '../entities/User';

export interface IUserIndex {
  count: number;
  users: User[];
}
