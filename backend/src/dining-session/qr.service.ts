import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class QrService {
  private readonly secret: string;
  private readonly QR_VALIDITY_HOURS = 24; // QR valid for 24 hours

  constructor(private configService: ConfigService) {
    this.secret = this.configService.get<string>('QR_SECRET') ?? 'fallback_secret';
  }

  // Generate QR token for a table
  // Returns: tableId|timestamp|signature
  generateQrToken(tableId: string): string {
    const timestamp = Date.now();
    const signature = this.sign(tableId, timestamp);
    const payload = `${tableId}|${timestamp}|${signature}`;
    return Buffer.from(payload).toString('base64url');
  }

  // Generate full QR URL
  generateQrUrl(tableId: string): string {
    // const token = this.generateQrToken(tableId);
    const baseUrl = this.configService.get('APP_URL') ?? 'https://chaathouse.app';
    return `${baseUrl}/scan?table=${tableId}`;
  }

  // Verify and decode QR token
  verifyQrToken(token: string): { tableId: string; timestamp: number } {
    try {
      const decoded = Buffer.from(token, 'base64url').toString('utf-8');
      const [tableId, timestampStr, signature] = decoded.split('|');

      if (!tableId || !timestampStr || !signature) {
        throw new BadRequestException('Invalid QR code');
      }

      const timestamp = parseInt(timestampStr);

      // Check signature (prevent tampering)
      const expectedSig = this.sign(tableId, timestamp);
      if (signature !== expectedSig) {
        throw new BadRequestException('QR code has been tampered with');
      }

      // Check expiry (24 hours)
      const ageInHours = (Date.now() - timestamp) / (1000 * 60 * 60);
      if (ageInHours > this.QR_VALIDITY_HOURS) {
        throw new BadRequestException(
          `QR code has expired. Please ask staff to regenerate it.`,
        );
      }

      return { tableId, timestamp };
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new BadRequestException('Invalid QR code format');
    }
  }

  private sign(tableId: string, timestamp: number): string {
    return crypto
      .createHmac('sha256', this.secret)
      .update(`${tableId}:${timestamp}`)
      .digest('hex')
      .substring(0, 16); // keep it short for URL friendliness
  }
}