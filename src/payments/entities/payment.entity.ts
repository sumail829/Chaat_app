import { Order } from "src/orders/entities/order.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentStatus } from "../payment-enum/payment-status.enum";
import { PaymentMethod } from "../payment-enum/payment-method.enum";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Order, (order) => order.payment, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: Order;

  @Column('decimal')
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: true,
  })
  method: PaymentMethod;

   @Column({ type: 'varchar', nullable: true })
  completedBy: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
