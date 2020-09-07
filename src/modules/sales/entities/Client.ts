import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';
import { Type } from 'class-transformer';

import { User } from '../../users/entities/User';
import { Sale } from './Sale';

@ObjectType()
@Entity('client')
export class Client extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ type: 'varchar', length: 11 })
  cellphone: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => User)
  @ManyToOne(() => User, user => user.sales, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  @Type(() => User)
  user: User;

  @Field(() => Int)
  @Column({ name: 'user_id' })
  userId: number;

  @Field(() => [Sale])
  @OneToMany(() => Sale, sale => sale.client)
  sales: Sale[];
}
