
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { UsersModule } from 'src/users/users.module';
import { RestaurantTable } from 'src/restaurant-table/table.entity';
import { Menu } from 'src/menu/menu.entity';

// src/orders/orders.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, RestaurantTable,   Menu,]),
     forwardRef(() => UsersModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [TypeOrmModule],
})
export class OrdersModule {}
