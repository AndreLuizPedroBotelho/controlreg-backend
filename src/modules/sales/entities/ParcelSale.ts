import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, Int, ObjectType, Float } from 'type-graphql';
import { Sale } from './Sale';

@ObjectType()
@Entity('parcel_sale')
export class ParcelSale extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Float)
  @Column('decimal', { precision: 15, scale: 2 })
  price: number;

  @Field(() => Int)
  @Column()
  parcelNumber: number;

  @Field(() => String)
  @Column({ type: 'boolean', default: false })
  paid: boolean;

  @Field(() => Date)
  @Column({ name: 'maturity_date' })
  maturityDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => Sale)
  @ManyToOne(() => Sale, sale => sale.parcelSales, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @Field(() => Int)
  @Column({ name: 'sale_id' })
  saleId: number;
}
