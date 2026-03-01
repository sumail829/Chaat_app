import { Type } from 'class-transformer';
import { ValidateNested, IsArray, ArrayNotEmpty } from 'class-validator';
import { OrderItemInputDto } from './order-item-input.dto';

export class AddOrderItemsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  items: OrderItemInputDto[];
}
