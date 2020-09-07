import { Field, InputType, ObjectType, Int } from 'type-graphql';

import { TypeUser } from '../../../shared/enuns';
import { User } from '../entities/User';

@InputType()
export class UserInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => String)
  typeUser: TypeUser;

  @Field(() => [Int], { nullable: true })
  companies?: [number];
}

@ObjectType()
export class UserReturnInput {
  @Field(() => [User])
  users: User[];

  @Field(() => Int)
  count: number;
}

@InputType()
export class UserUpdateInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => String, { nullable: true })
  typeUser?: TypeUser;

  @Field(() => [Int], { nullable: true })
  companies?: [number];
}
