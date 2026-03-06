import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class SendOtpEmailDto {
  @IsEmail()
  email: string;
}

export class SendOtpPhoneDto {
  @IsNotEmpty()
  phone: string;
}