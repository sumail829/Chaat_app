import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "src/orders/entities/order.entity";
import { DataSource, Repository } from "typeorm";
import { CompletePaymentDto } from "./dto/complete-payment.dto";
import { PaymentStatus } from "./payment-enum/payment-status.enum";
import { OrderStatus } from "src/orders/order-status.enum";
import { Payment } from "./entities/payment.entity";
import { RestaurantTable } from "src/restaurant-table/table.entity";
import { TableStatus } from "src/restaurant-table/table-status.enum";

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,

    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    @InjectRepository(RestaurantTable)
    private tableRepo: Repository<RestaurantTable>,

    private dataSource: DataSource,
  ) { }

  async completePayment(orderId: string, dto: CompletePaymentDto) {
    return this.dataSource.transaction(async (manager) => {

     const order = await manager
  .getRepository(Order)
  .createQueryBuilder('order')
  .setLock('pessimistic_write')
  .where('order.id = :orderId', { orderId })
  .getOne();

      if (!order) throw new NotFoundException('Order not found');
      if (!order.payment)
        throw new BadRequestException('Payment record missing');

      if (order.payment.status === PaymentStatus.PAID)
        throw new BadRequestException('Payment already completed');

      if (order.payment.amount !== order.totalAmount)
        throw new BadRequestException('Payment amount mismatch');

      // ✅ Payment
      order.payment.status = PaymentStatus.PAID;
      order.payment.method = dto.method;
      order.payment.completedBy = dto.completedBy ?? null;

      // ✅ Order
      order.status = OrderStatus.SERVED;

      // ✅ Table
      if (order.table.status !== TableStatus.OCCUPIED) {
        throw new BadRequestException('Table is not occupied');
      }

      order.table.status = TableStatus.AVAILABLE;


      await manager.save(order.payment);
      await manager.save(order);
      await manager.save(order.table);

      return {
        message: 'Payment completed successfully',
        orderId: order.id,
        table: order.table.tableNumber,
      };
    });
  }
}