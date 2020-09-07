import { Field, Int, Float, InputType, ObjectType } from 'type-graphql';
import { Sale } from '../entities/Sale';
import { MethodPayment } from '../../../shared/enuns';

@InputType()
export class SaleInput {
  @Field(() => Float)
  price: number;

  @Field(() => Int)
  amount: number;

  @Field(() => String)
  methodPayment: MethodPayment;

  @Field(() => Date)
  dateSale: Date;

  @Field(() => Int)
  clientId: number;

  @Field(() => Int)
  productId: number;
}

@ObjectType()
export class SaleReturnInput {
  @Field(() => [Sale])
  sales: Sale[];

  @Field(() => Int)
  count: number;
}

@InputType()
export class SaleUpdateInput {
  @Field(() => Float, { nullable: true })
  price?: number;

  @Field(() => Int, { nullable: true })
  amount: number;

  @Field(() => String, { nullable: true })
  methodPayment?: MethodPayment;

  @Field(() => Date, { nullable: true })
  dateSale: Date;

  @Field(() => Boolean, { nullable: true })
  paid?: boolean;

  @Field(() => Int, { nullable: true })
  clientId?: number;

  @Field(() => Int, { nullable: true })
  productId?: number;
}
