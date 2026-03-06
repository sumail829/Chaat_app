import { Controller, Post, Body } from '@nestjs/common';
import { OtpService } from './otp.service';
import { IsNotEmpty, IsEmail } from 'class-validator';

class SendOtpPhoneDto {
  @IsNotEmpty()
  phone: string;
}

class SendOtpEmailDto {
  @IsEmail()
  email: string;
}

class VerifyOtpDto {
  @IsNotEmpty()
  key: string; // phone or email

  @IsNotEmpty()
  code: string;
}

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('send/phone')
  sendOtpPhone(@Body() dto: SendOtpPhoneDto) {
    return this.otpService.sendOtpToPhone(dto.phone);
  }

  @Post('send/email')
  sendOtpEmail(@Body() dto: SendOtpEmailDto) {
    return this.otpService.sendOtpToEmail(dto.email);
  }

  @Post('verify')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.otpService.verifyOtp(dto.key, dto.code);
  }
}


// **API endpoints you now have:**
// ```
// POST /otp/send/phone  { phone: "9876543210" }
// POST /otp/send/email  { email: "user@gmail.com" }
// POST /otp/verify      { key: "user@gmail.com", code: "1234" }