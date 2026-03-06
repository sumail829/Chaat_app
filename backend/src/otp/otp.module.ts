import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService], // export so other modules like AuthModule can use it
})
export class OtpModule {}