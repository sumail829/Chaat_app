import { Entity, Column, UpdateDateColumn, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { TableStatus } from "./table-status.enum";

@Entity('restaurant_tables')
export class RestaurantTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  tableNumber: string;

  @Column({
    type: 'enum',
    enum: TableStatus,
    default: TableStatus.AVAILABLE,
  })
  status: TableStatus;

  @Column('int')
  capacity: number;

  @Column({ default: 0 })
  currentOccupancy: number;

  @Column({ default: true })
  isActive: boolean;

  // QR code stores the URL: https://chaathouse.app/scan?table=<id>
  @Column({ nullable: true })
  qrCode?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}