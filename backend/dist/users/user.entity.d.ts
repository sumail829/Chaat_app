import { UserRole } from './dto/create-user.dto';
import { Order } from 'src/orders/entities/order.entity';
export declare class User {
    id: number;
    email: string;
    name: string;
    password: string;
    phone?: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    orders: Order[];
}
