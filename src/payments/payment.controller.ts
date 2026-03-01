import { Body, Controller, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { UserRole } from "src/users/dto/create-user.dto";
import { CompletePaymentDto } from "./dto/complete-payment.dto";
import { PaymentService } from "./payment.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post(':orderId/complete')
  async completePayment(
    @Param('orderId') orderId: string,
    @Body() dto: CompletePaymentDto,
  ) {
    return this.paymentService.completePayment(orderId, dto);
  }
}
