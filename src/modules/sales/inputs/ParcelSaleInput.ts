import { ObjectType, Field, Int } from 'type-graphql';
import { ParcelSale } from '../entities/ParcelSale';

@ObjectType()
export class ParcelSaleReturnInput {
  @Field(() => [ParcelSale])
  parcelSales: ParcelSale[];

  @Field(() => Int)
  count: number;
}
