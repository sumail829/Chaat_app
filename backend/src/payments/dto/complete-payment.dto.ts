import { IsEnum, IsOptional, IsString } from "class-validator";
import { PaymentMethod } from "../payment-enum/payment-method.enum";

export class CompletePaymentDto {
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsOptional()
  @IsString()
  completedBy?: string; // staff who completes payment
}
