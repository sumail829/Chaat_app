import { CompletePaymentDto } from "./dto/complete-payment.dto";
import { PaymentService } from "./payment.service";
export declare class PaymentController {
    private paymentService;
    constructor(paymentService: PaymentService);
    completePayment(orderId: string, dto: CompletePaymentDto): Promise<{
        message: string;
        orderId: string;
        table: string;
    }>;
}
