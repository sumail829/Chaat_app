import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RestaurantTable } from 'src/restaurant-table/table.entity';

export enum SessionStatus {
  PENDING = 'pending',   // scanned QR, no order yet (15 min to order)
  ACTIVE = 'active',     // first order placed
  EXPIRED = 'expired',   // no order within 15 min → auto freed (future cron)
  CLOSED = 'closed',     // bill paid
}

@Entity('dining_sessions')
export class DiningSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RestaurantTable, { eager: true })
  @JoinColumn({ name: 'tableId' })
  table: RestaurantTable;

  @Column()
  tableId: string;

  @Column({ unique: true })
  sessionToken: string;

  @Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.PENDING,
  })
  status: SessionStatus;

  @Column({ nullable: true })
  customerPhone?: string;

  @CreateDateColumn()
  startTime: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  endTime?: Date;
}