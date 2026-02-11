// src/orders/entities/order-item.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Order } from './order.entity';
import { Menu } from '../../menu/menu.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @ManyToOne(() => Menu)
  menu: Menu;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  priceAtOrderTime: number;

  @Column({ default: 0 })
  subtotal:number;
}
