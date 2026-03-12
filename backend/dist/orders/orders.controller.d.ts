import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(req: any, dto: CreateOrderDto): Promise<import("./entities/order.entity").Order>;
    getOrdersBySession(sessionToken: string): Promise<import("./entities/order.entity").Order[]>;
}
