import { Field, Float, Int, InputType, ObjectType } from 'type-graphql';
import { Product } from '../entities/Product';

@InputType()
export class ProductInput {
  @Field()
  name: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  amount: number;

  @Field()
  category: string;

  @Field(() => Int)
  companyId: number;
}

@ObjectType()
export class ProductReturnInput {
  @Field(() => [Product])
  products: Product[];

  @Field(() => Int)
  count: number;
}

@InputType()
export class ProductUpdateInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field(() => Int, { nullable: true })
  amount?: number;

  @Field(() => String, { nullable: true })
  category?: string;

  @Field(() => Int, { nullable: true })
  companyId: number;
}
