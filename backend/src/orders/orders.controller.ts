import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { AddOrderItemsDto } from "./dto/add-order-item.dto";

import { AuthGuard } from "@nestjs/passport";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createOrder(@Req() req, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(req.user, dto.sessionToken);
  }

  @Post(':id/items')
  addItems(@Param('id') id: string, @Body() dto: AddOrderItemsDto) {
    return this.ordersService.addItems(id, dto);
  }

  // Kitchen — update order status
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(id, dto.status);
  }

  // Kitchen — get all active orders
  @Get('active')
  getActiveOrders() {
    return this.ordersService.getActiveOrders();
  }

  // Get orders by session
  @Get('session/:sessionToken')
  getOrdersBySession(@Param('sessionToken') sessionToken: string) {
    return this.ordersService.findOrdersBySession(sessionToken);
  }

  @Get()
  findAll() {
    return this.ordersService.findAllorders();
  }
}