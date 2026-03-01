import { PaymentMethod } from "../payment-enum/payment-method.enum";
export declare class CompletePaymentDto {
    method: PaymentMethod;
    completedBy?: string;
}
