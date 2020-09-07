import { ParcelSale } from '../entities/ParcelSale';

export interface IParcelSalesIndex {
  count: number;
  parcelSales: ParcelSale[];
}
