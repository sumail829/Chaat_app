import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantTableService } from './table.service';
import { TableController } from './table.controller';
import { RestaurantTable } from './table.entity';

@Module({
    imports:[TypeOrmModule.forFeature([RestaurantTable])],
    providers:[RestaurantTableService],
    controllers:[TableController],
    exports:[RestaurantTableService],
})
export class TableModule {}