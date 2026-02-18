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
import { Payment } from "src/payments/entities/payment.entity";
import { PaymentStatus } from "src/payments/payment-enum/payment-status.enum";
import { OrderStatus } from "./order-status.enum";
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

    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
  ) {}

  // ----------------------------
  // 1️⃣ Create order + assign table (no payment yet)
  // ----------------------------
  async createOrder(user: User, tableId: string): Promise<Order> {
    // Find table and check availability
    const table = await this.tableRepo.findOne({
      where: { id: tableId, status: TableStatus.AVAILABLE },
    });

    if (!table) {
      throw new BadRequestException('Table not available');
    }

    // Mark table as occupied
    table.status = TableStatus.OCCUPIED;
    await this.tableRepo.save(table);

    // Create order
    const order = this.orderRepo.create({
      user,
      table,
      totalAmount: 0,
      status: OrderStatus.PENDING, // ✅ Use enum
    });

    const savedOrder = await this.orderRepo.save(order);

    return savedOrder;
  }

  // ----------------------------
  // 2️⃣ Add items to order + create/update payment
  // ----------------------------
  async addItems(orderId: string, dto: AddOrderItemsDto) {
    // Fetch order with items and payment
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['items', 'payment'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    let totalToAdd = 0;
    const orderItems: OrderItem[] = [];

    // Add each menu item
    for (const entry of dto.items) {
      const menu = await this.menuRepo.findOne({
        where: { id: entry.menuId, isAvailable: true },
      });

      if (!menu) {
        throw new NotFoundException(`Menu item ${entry.menuId} not available`);
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

    // Save items
    await this.orderItemRepo.save(orderItems);

    // Update order total
    order.totalAmount += totalToAdd;
    await this.orderRepo.save(order);

    // ✅ Create or update payment
    let payment = order.payment;

    if (!payment) {
      // Create new payment
      payment = this.paymentRepo.create({
        order,
        amount: order.totalAmount,
        status: PaymentStatus.PENDING,
      });
    } else {
      // Update existing payment
      payment.amount = order.totalAmount;
    }

    await this.paymentRepo.save(payment);

    return {
      message: 'Items added successfully',
      addedItems: orderItems,
      newTotalAmount: order.totalAmount,
      paymentId: payment.id,
      paymentStatus: payment.status,
    };
  }

  // Optional: fetch all orders
  async findAllorders(): Promise<Order[]> {
    return this.orderRepo.find({ relations: ['items', 'payment', 'table', 'user'] });
  }
}