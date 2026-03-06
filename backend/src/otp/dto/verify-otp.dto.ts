import { IsNotEmpty } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  key: string; // phone or email

  @IsNotEmpty()
  code: string;
}