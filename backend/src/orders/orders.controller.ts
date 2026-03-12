import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
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
  return this.ordersService.createOrder(req.user, dto.sessionToken);
}

// Add new endpoint to get orders by session
@Get('session/:sessionToken')
getOrdersBySession(@Param('sessionToken') sessionToken: string) {
  return this.ordersService.findOrdersBySession(sessionToken);
}
}
