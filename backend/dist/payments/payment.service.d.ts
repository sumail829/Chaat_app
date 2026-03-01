import { Order } from "src/orders/entities/order.entity";
import { DataSource, Repository } from "typeorm";
import { CompletePaymentDto } from "./dto/complete-payment.dto";
import { Payment } from "./entities/payment.entity";
import { RestaurantTable } from "src/restaurant-table/table.entity";
export declare class PaymentService {
    private paymentRepo;
    private orderRepo;
    private tableRepo;
    private dataSource;
    constructor(paymentRepo: Repository<Payment>, orderRepo: Repository<Order>, tableRepo: Repository<RestaurantTable>, dataSource: DataSource);
    completePayment(orderId: string, dto: CompletePaymentDto): Promise<{
        message: string;
        orderId: string;
        table: string;
    }>;
}
