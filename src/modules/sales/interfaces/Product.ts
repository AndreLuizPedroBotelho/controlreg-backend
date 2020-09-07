import { Product } from '../entities/Product';

export interface IProductIndex {
  count: number;
  products: Product[];
}
