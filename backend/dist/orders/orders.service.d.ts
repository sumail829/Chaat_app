import { Order } from "./entities/order.entity";
import { Repository } from "typeorm";
import { OrderItem } from "./entities/order-item.entity";
import { RestaurantTable } from "src/restaurant-table/table.entity";
import { Menu } from "src/menu/menu.entity";
import { User } from "src/users/user.entity";
import { AddOrderItemsDto } from "./dto/add-order-item.dto";
import { Payment } from "src/payments/entities/payment.entity";
import { PaymentStatus } from "src/payments/payment-enum/payment-status.enum";
import { DiningSession } from "src/dining-session/dining-session.entity";
export declare class OrdersService {
    private orderRepo;
    private orderItemRepo;
    private tableRepo;
    private menuRepo;
    private paymentRepo;
    private sessionRepo;
    private userRepo;
    constructor(orderRepo: Repository<Order>, orderItemRepo: Repository<OrderItem>, tableRepo: Repository<RestaurantTable>, menuRepo: Repository<Menu>, paymentRepo: Repository<Payment>, sessionRepo: Repository<DiningSession>, userRepo: Repository<User>);
    createOrder(userPayload: any, sessionToken: string): Promise<Order>;
    addItems(orderId: string, dto: AddOrderItemsDto): Promise<{
        message: string;
        addedItems: OrderItem[];
        newTotalAmount: number;
        paymentId: string;
        paymentStatus: PaymentStatus;
    }>;
    findAllorders(): Promise<Order[]>;
    findOrdersBySession(sessionToken: string): Promise<Order[]>;
}
