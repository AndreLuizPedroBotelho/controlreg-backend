import { Sale } from '../entities/Sale';

export interface ISaleIndex {
  count: number;
  sales: Sale[];
}
