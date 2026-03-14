import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { AddOrderItemsDto } from "./dto/add-order-item.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(req: any, dto: CreateOrderDto): Promise<import("./entities/order.entity").Order>;
    addItems(id: string, dto: AddOrderItemsDto): Promise<{
        message: string;
        addedItems: import("./entities/order-item.entity").OrderItem[];
        newTotalAmount: number;
        paymentId: string;
        paymentStatus: import("../payments/payment-enum/payment-status.enum").PaymentStatus;
    }>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<import("./entities/order.entity").Order>;
    getActiveOrders(): Promise<import("./entities/order.entity").Order[]>;
    getOrdersBySession(sessionToken: string): Promise<import("./entities/order.entity").Order[]>;
    findAll(): Promise<import("./entities/order.entity").Order[]>;
}
