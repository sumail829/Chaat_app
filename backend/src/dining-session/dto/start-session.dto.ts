import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';

export class StartSessionDto {
  @IsString()
  tableId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  numberOfPeople?: number; // ← how many people are joining

  @IsOptional()
  @IsString()
  customerPhone?: string;
}