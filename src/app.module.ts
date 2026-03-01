import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { MenuModule } from './menu/menu.module';
import { TableModule } from './restaurant-table/table.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentModule } from './payments/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

   TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: () => {
    const pwd = process.env.DB_PASSWORD;

    return {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: pwd,  
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    };
  },
}),
    UsersModule,
    TableModule,
    CategoryModule,
    PaymentModule,
     OrdersModule,
    MenuModule,
    AuthModule,
  ],
})
export class AppModule {}
