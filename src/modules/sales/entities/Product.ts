import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  BaseEntity,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, Float, Int, ObjectType } from 'type-graphql';

import { Type } from 'class-transformer';
import { User } from '../../users/entities/User';

import { Company } from './Company';
import { Sale } from './Sale';

@ObjectType()
@Entity('product')
export class Product extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => Float)
  @Column('decimal', { precision: 15, scale: 2 })
  price: number;

  @Field(() => Int)
  @Column()
  amount: number;

  @Field()
  @Column()
  category: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => Company)
  @ManyToOne(() => Company, company => company.products, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Field(() => Int)
  @Column({ name: 'company_id' })
  companyId: number;

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
  @OneToMany(() => Sale, sale => sale.product)
  sales: Sale[];
}
