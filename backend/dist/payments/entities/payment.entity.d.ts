import { Order } from "src/orders/entities/order.entity";
import { PaymentStatus } from "../payment-enum/payment-status.enum";
import { PaymentMethod } from "../payment-enum/payment-method.enum";
export declare class Payment {
    id: string;
    order: Order;
    orderId: string;
    amount: number;
    status: PaymentStatus;
    method: PaymentMethod;
    completedBy: string | null;
    createdAt: Date;
}
