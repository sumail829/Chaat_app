// payment.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from './entities/payment.entity';
import { Order } from 'src/orders/entities/order.entity';
import { RestaurantTable } from 'src/restaurant-table/table.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Order, RestaurantTable]),
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
