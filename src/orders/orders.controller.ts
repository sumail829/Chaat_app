import { Body, Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { AddOrderItemsDto } from "./dto/add-order-item.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  
 @UseGuards(AuthGuard('jwt'))
@Post()
createOrder(@Req() req, @Body() dto: CreateOrderDto) {
  return this.ordersService.createOrder(req.user.userId, dto.tableId);
}

  @Post(':orderId/items')
  addItem(
    @Param('orderId') orderId: string,
    @Body() dto: AddOrderItemsDto,
  ) {
    return this.ordersService.addItems(orderId, dto);
  }
}
