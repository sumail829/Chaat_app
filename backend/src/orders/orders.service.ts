import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { Repository } from "typeorm";
import { OrderItem } from "./entities/order-item.entity";
import { RestaurantTable } from "src/restaurant-table/table.entity";
import { Menu } from "src/menu/menu.entity";
import { User } from "src/users/user.entity";
import { AddOrderItemsDto } from "./dto/add-order-item.dto";
import { Payment } from "src/payments/entities/payment.entity";
import { PaymentStatus } from "src/payments/payment-enum/payment-status.enum";
import { OrderStatus } from "./order-status.enum";
import { DiningSession, SessionStatus } from "src/dining-session/dining-session.entity";

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

    @InjectRepository(DiningSession)
    private sessionRepo: Repository<DiningSession>, // ← inject session repo

     @InjectRepository(User)          // ← add this
    private userRepo: Repository<User>,
  ) {}

  async createOrder(userPayload: any, sessionToken: string): Promise<Order> {
     // Find full user from JWT payload
  const user = await this.userRepo.findOne({
    where: { id: userPayload.sub ?? userPayload.id },
  });

  if (!user) throw new NotFoundException('User not found');
    
    // Find active or pending session

    const session = await this.sessionRepo.findOne({
      where: [
        { sessionToken, status: SessionStatus.ACTIVE },
        { sessionToken, status: SessionStatus.PENDING },
      ],
      relations: ['table'],
    });

    if (!session) {
      throw new NotFoundException('Session not found or expired. Please scan QR again.');
    }

    const table = session.table;

    // Create order linked to session
    const order = this.orderRepo.create({
      user,
      table,
      tableId: table.id,
      sessionToken, // ← link order to session
      totalAmount: 0,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.orderRepo.save(order);

    // Activate session on first order
    if (session.status === SessionStatus.PENDING) {
      session.status = SessionStatus.ACTIVE;
      await this.sessionRepo.save(session);
    }

    return savedOrder;
  }

  async addItems(orderId: string, dto: AddOrderItemsDto) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['items', 'payment'],
    });

    if (!order) throw new NotFoundException('Order not found');

    let totalToAdd = 0;
    const orderItems: OrderItem[] = [];

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

    await this.orderItemRepo.save(orderItems);

    order.totalAmount = order.totalAmount + totalToAdd;
    await this.orderRepo.save(order);

    let payment = order.payment;

    if (!payment) {
      payment = this.paymentRepo.create({
        orderId: order.id,
        amount: order.totalAmount,
        status: PaymentStatus.PENDING,
      });
    } else {
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

  async findAllorders(): Promise<Order[]> {
    return this.orderRepo.find({
      relations: ['items', 'payment', 'table', 'user'],
    });
  }

  // Get all orders for a session
  async findOrdersBySession(sessionToken: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { sessionToken },
      relations: ['items', 'items.menu', 'payment'],
    });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
  const order = await this.orderRepo.findOne({
    where: { id: orderId },
    relations: ['table', 'items', 'items.menu'],
  });

  if (!order) throw new NotFoundException('Order not found');

  if (order.status === OrderStatus.CANCELLED) {
    throw new BadRequestException('Cannot update a cancelled order');
  }

  if (order.status === OrderStatus.SERVED) {
    throw new BadRequestException('Order already served');
  }

  // Enforce valid transitions
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]:    [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
    [OrderStatus.CONFIRMED]:  [OrderStatus.PREPARING, OrderStatus.CANCELLED],
    [OrderStatus.PREPARING]:  [OrderStatus.SERVED],
    [OrderStatus.SERVED]:     [],
    [OrderStatus.CANCELLED]:  [],
  };

  if (!validTransitions[order.status].includes(status)) {
    throw new BadRequestException(
      `Cannot transition from ${order.status} to ${status}`,
    );
  }

  order.status = status;
  return this.orderRepo.save(order);
}

// Get all active orders (kitchen view)
async getActiveOrders(): Promise<Order[]> {
  return this.orderRepo.find({
    where: [
      { status: OrderStatus.PENDING },
      { status: OrderStatus.CONFIRMED },
      { status: OrderStatus.PREPARING },
    ],
    relations: ['items', 'items.menu', 'table'],
    order: { createdAt: 'ASC' },
  });
}
}