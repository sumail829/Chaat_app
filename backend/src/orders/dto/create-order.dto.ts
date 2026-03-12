import { IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  sessionToken: string; // ← changed from tableId to sessionToken
}