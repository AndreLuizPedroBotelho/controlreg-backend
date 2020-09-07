import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Product } from '../../sales/entities/Product';
import { Client } from '../../sales/entities/Client';
import { Sale } from '../../sales/entities/Sale';
import { Company } from '../../sales/entities/Company';

import { TypeUser } from '../../../shared/enuns';

@ObjectType()
@Entity('user')
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Field(() => String)
  @Column({ type: 'varchar', default: TypeUser.ADMIN })
  typeUser: TypeUser;

  @Field(() => [Company])
  @ManyToMany(() => Company, company => company.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'company_user',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'company_id',
      referencedColumnName: 'id',
    },
  })
  companies: Company[];

  @Field(() => [Sale])
  @OneToMany(() => Sale, sale => sale.user)
  sales: Sale[];

  @Field(() => [Product])
  @OneToMany(() => Product, product => product.user)
  products: Product[];

  @Field(() => [Client])
  @OneToMany(() => Client, client => client.user)
  clients: Client[];

  @BeforeInsert()
  async updatePassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 8);
  }

  async checkpassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
