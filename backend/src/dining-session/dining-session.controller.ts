import { Controller, Post, Get, Patch, Body, Param } from '@nestjs/common';
import { DiningSessionService } from './dining-session.service';
import { StartSessionDto } from './dto/start-session.dto';
import { EndSessionDto } from './dto/end-session.dto';

@Controller('session')
export class DiningSessionController {
  constructor(private readonly sessionService: DiningSessionService) {}

  // Admin: generate QR for a table
  @Post('qr/:tableId')
  generateQr(@Param('tableId') tableId: string) {
    return this.sessionService.generateTableQr(tableId);
  }

  // Customer scans QR → start session
  @Post('start')
  startSession(@Body() dto: StartSessionDto) {
    return this.sessionService.startSession(dto);
  }

  // Get session by token
  @Get(':token')
  getSession(@Param('token') token: string) {
    return this.sessionService.getSession(token);
  }

  // All active sessions (kitchen/admin)
  @Get()
  getActiveSessions() {
    return this.sessionService.getActiveSessions();
  }

  // Bill paid → end session
  @Patch('end')
  endSession(@Body() dto: EndSessionDto) {
    return this.sessionService.endSession(dto.sessionToken);
  }
}