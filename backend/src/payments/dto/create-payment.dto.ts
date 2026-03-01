import { IsNumber, IsUUID } from "class-validator";

// payments/dto/create-payment.dto.ts
export class CreatePaymentDto {
  @IsUUID()
  orderId: string;

  @IsNumber()
  amount: number;
}
