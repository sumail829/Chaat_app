import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DiningSession } from './dining-session.entity';
import { DiningSessionService } from './dining-session.service';
import { DiningSessionController } from './dining-session.controller';
import { RestaurantTable } from 'src/restaurant-table/table.entity';
import { QrService } from './qr.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([DiningSession, RestaurantTable]),
    ConfigModule,
  ],
  controllers: [DiningSessionController],
  providers: [DiningSessionService, QrService],
  exports: [DiningSessionService, QrService],
})
export class DiningSessionModule {}