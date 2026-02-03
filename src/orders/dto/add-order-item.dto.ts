import { IsInt, IsUUID, Min } from 'class-validator';

export class AddOrderItemDto {
  @IsUUID()
  menuId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}