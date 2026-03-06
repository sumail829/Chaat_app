import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class OtpService {
  private otpStore = new Map<string, { code: string; expiresAt: Date }>();
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
    });
  }

  async sendOtpToPhone(phone: string): Promise<{ message: string }> {
    const code = this.generateCode();
    this.saveOtp(phone, code);

    const token = this.configService.get('SPARROW_TOKEN');
    const from = this.configService.get('SPARROW_FROM');
    const message = `Your Chaat House OTP is: ${code}. Valid for 5 minutes.`;
    const url = `http://api.sparrowsms.com/v2/sms/?token=${token}&from=${from}&to=${phone}&text=${encodeURIComponent(message)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.response_code !== 200) {
      throw new BadRequestException('Failed to send OTP via SMS');
    }

    return { message: 'OTP sent to phone' };
  }

  async sendOtpToEmail(email: string): Promise<{ message: string }> {
    const code = this.generateCode();
    this.saveOtp(email, code);

    await this.transporter.sendMail({
      from: `"Chaat House" <${this.configService.get('MAIL_USER')}>`,
      to: email,
      subject: 'Your Chaat House OTP',
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: auto;">
          <h2 style="color: #f97316;">🍛 Chaat House</h2>
          <p>Your OTP code is:</p>
          <h1 style="letter-spacing: 8px; color: #f97316;">${code}</h1>
          <p>Valid for <strong>5 minutes</strong>. Do not share this with anyone.</p>
        </div>
      `,
    });

    return { message: 'OTP sent to email' };
  }

  verifyOtp(key: string, code: string): boolean {
    const record = this.otpStore.get(key);

    if (!record) throw new BadRequestException('OTP not found. Please request again.');
    if (new Date() > record.expiresAt) {
      this.otpStore.delete(key);
      throw new BadRequestException('OTP expired. Please request again.');
    }
    if (record.code !== code) throw new BadRequestException('Invalid OTP.');

    this.otpStore.delete(key);
    return true;
  }

  private generateCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  private saveOtp(key: string, code: string) {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min
    this.otpStore.set(key, { code, expiresAt });
  }
}