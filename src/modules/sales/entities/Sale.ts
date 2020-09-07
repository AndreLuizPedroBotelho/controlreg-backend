import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, Int, Float, ObjectType } from 'type-graphql';
import { Type } from 'class-transformer';
import { addMonths } from 'date-fns';
import { MethodPayment } from '../../../shared/enuns';
import { User } from '../../users/entities/User';
import { ParcelSale } from './ParcelSale';
import { Product } from './Product';
import { Client } from './Client';

@ObjectType()
@Entity('sale')
export class Sale extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Float)
  @Column('decimal', { precision: 15, scale: 2 })
  price: number;

  @Field(() => String)
  @Column('varchar')
  methodPayment: MethodPayment;

  @Field(() => Int)
  @Column()
  amount: number;

  @Field(() => String)
  @Column({ type: 'boolean', default: false })
  paid: boolean;

  @Field()
  @Column({ type: 'timestamptz', default: new Date() })
  dateSale: Date;

  @Field(() => Client)
  @ManyToOne(() => Client, client => client.sales, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Field(() => Int)
  @Column({ name: 'client_id' })
  clientId: number;

  @Field(() => Product)
  @ManyToOne(() => Product, product => product.sales, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Field(() => Int)
  @Column({ name: 'product_id' })
  productId: number;

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => [ParcelSale])
  @OneToMany(() => ParcelSale, parcelSale => parcelSale.sale)
  parcelSales: ParcelSale[];

  async createParcelSale(sale): Promise<void> {
    if (this.methodPayment !== MethodPayment.AVISTA) {
      const amountParcel: number[] = Array.from(
        Array(this.amount),
        (_, i) => i + 1
      );

      const maturityDate = new Date(this.dateSale);
      const priceSale = this.price / this.amount;
      for (const parcel of amountParcel) {
        const parcelSale = new ParcelSale();

        parcelSale.sale = sale;
        parcelSale.maturityDate = addMonths(maturityDate, parcel);
        parcelSale.parcelNumber = parcel;
        parcelSale.price = priceSale;
        await parcelSale.save();
      }
    }
  }
}
