import { Field, InputType, Int, ObjectType } from 'type-graphql';
import { Company } from '../entities/Company';

@InputType()
export class CompanyRelationInput {
  @Field({ nullable: true })
  id?: number;
}

@InputType()
export class CompanyInput {
  @Field()
  name: string;
}

@ObjectType()
export class CompanyReturnInput {
  @Field(() => [Company])
  companies: Company[];

  @Field(() => Int)
  count: number;
}

@InputType()
export class CompanyUpdateInput {
  @Field(() => String, { nullable: true })
  name?: string;
}
