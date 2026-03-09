import { IsString, IsOptional } from 'class-validator';

export class StartSessionDto {
  @IsString()
  qrToken: string; // ← QR token from scanned URL, not raw tableId

  @IsOptional()
  @IsString()
  customerPhone?: string;
}