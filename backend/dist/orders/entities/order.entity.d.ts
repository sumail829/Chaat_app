import { User } from 'src/users/user.entity';
import { RestaurantTable } from '../../restaurant-table/table.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '../order-status.enum';
import { Payment } from 'src/payments/entities/payment.entity';
export declare class Order {
    id: string;
    user: User;
    table: RestaurantTable;
    tableId: string;
    sessionToken?: string;
    payment: Payment;
    items: OrderItem[];
    status: OrderStatus;
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}
