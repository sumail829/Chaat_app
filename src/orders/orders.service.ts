import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { Repository } from "typeorm";
import { OrderItem } from "./entities/order-item.entity";
import { RestaurantTable } from "src/restaurant-table/table.entity";
import { Menu } from "src/menu/menu.entity";
import { User } from "src/users/user.entity";
import { TableStatus } from "src/restaurant-table/table-status.enum";
import {  AddOrderItemsDto } from "./dto/add-order-item.dto";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemRepo: Repository<OrderItem>,

    @InjectRepository(RestaurantTable)
    private tableRepo: Repository<RestaurantTable>,

    @InjectRepository(Menu)
    private menuRepo: Repository<Menu>,
  ) {}

  // 1️⃣ Create order + assign table
  async createOrder(user: User, tableId: string) {
    const table = await this.tableRepo.findOne({
      where: { id: tableId, status: TableStatus.AVAILABLE },
    });

    if (!table) {
      throw new BadRequestException('Table not available');
    }

    table.status = TableStatus.OCCUPIED;
    await this.tableRepo.save(table);

    const order = this.orderRepo.create({
      user,
      table,
    });

    return this.orderRepo.save(order);
  }

  // 2️⃣ Add menu item to order
  async addItems(orderId: string, dto: AddOrderItemsDto) {
  const order = await this.orderRepo.findOne({
    where: { id: orderId },
    relations: ['items'],
  });

  if (!order) {
    throw new NotFoundException('Order not found');
  }

  let totalToAdd = 0;
  const orderItems: OrderItem[] = [];

  for (const entry of dto.items) {
    const menu = await this.menuRepo.findOne({
      where: { id: entry.menuId, isAvailable: true },
    });

    if (!menu) {
      throw new NotFoundException(
        `Menu item ${entry.menuId} not available`,
      );
    }

    const subtotal = menu.price * entry.quantity;

    const item = this.orderItemRepo.create({
      order,
      menu,
      quantity: entry.quantity,
      priceAtOrderTime: menu.price,
      subtotal,
    });

    totalToAdd += subtotal;
    orderItems.push(item);
  }

  // Save all items first
  await this.orderItemRepo.save(orderItems);

  // Then update order total
  order.totalAmount += totalToAdd;
  await this.orderRepo.save(order);

  return {
    message: 'Items added successfully',
    addedItems: orderItems,
    newTotalAmount: order.totalAmount,
  };
}

  async findAllorders(){
    return this.orderRepo.find();
  }
}

