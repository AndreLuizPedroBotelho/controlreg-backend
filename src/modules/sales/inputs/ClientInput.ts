import { Field, InputType, ObjectType, Int } from 'type-graphql';
import { Client } from '../entities/Client';

@InputType()
export class ClientInput {
  @Field()
  name: string;

  @Field()
  cellphone: string;
}

@ObjectType()
export class ClientReturnInput {
  @Field(() => [Client])
  clients: Client[];

  @Field(() => Int)
  count: number;
}
@InputType()
export class ClientUpdateInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  cellphone?: string;
}
