
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { RestaurantTable } from '../../restaurant-table/table.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '../order-status.enum';
import { Payment } from 'src/payments/entities/payment.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @ManyToOne(() => User, (user) => user.orders)
  // user: User;
 
  @ManyToOne(() => User, (user) => user.orders, { nullable: false })
user: User;

  @ManyToOne(() => RestaurantTable)
  table: RestaurantTable;

  @OneToOne(() => Payment, (payment) => payment.order, { cascade: true })
  payment: Payment;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
  })
  items: OrderItem[];

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column('decimal', { default: 0 })
  totalAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
