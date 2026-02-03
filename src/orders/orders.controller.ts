import { Body, Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { AddOrderItemDto } from "./dto/add-order-item.dto";
import { AuthGuard } from "@nestjs/passport";

// src/orders/orders.controller.ts
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Assign table + create order
 @UseGuards(AuthGuard('jwt'))
@Post()
createOrder(@Req() req, @Body() dto: CreateOrderDto) {
  return this.ordersService.createOrder(req.user.userId, dto.tableId);
}

  // Add menu item
  @Post(':orderId/items')
  addItem(
    @Param('orderId') orderId: string,
    @Body() dto: AddOrderItemDto,
  ) {
    return this.ordersService.addItem(orderId, dto);
  }
}
