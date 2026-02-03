import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { Repository } from "typeorm";
import { OrderItem } from "./entities/order-item.entity";
import { RestaurantTable } from "src/restaurant-table/table.entity";
import { Menu } from "src/menu/menu.entity";
import { User } from "src/users/user.entity";
import { TableStatus } from "src/restaurant-table/table-status.enum";
import { AddOrderItemDto } from "./dto/add-order-item.dto";

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
  async addItem(orderId: string, dto: AddOrderItemDto) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['items'],
    });

    if (!order) throw new NotFoundException('Order not found');

    const menu = await this.menuRepo.findOne({
      where: { id: dto.menuId, isAvailable: true },
    });

    if (!menu) throw new NotFoundException('Menu not available');

    const item = this.orderItemRepo.create({
      order,
      menu,
      quantity: dto.quantity,
      priceAtOrderTime: menu.price,
    });

    order.totalAmount += menu.price * dto.quantity;

    await this.orderRepo.save(order);
    return this.orderItemRepo.save(item);
  }
}