import { Client } from '../entities/Client';

export interface IClientIndex {
  count: number;
  clients: Client[];
}
